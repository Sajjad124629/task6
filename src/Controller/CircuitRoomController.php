<?php

namespace App\Controller;

use App\Service\CircuitSessionService;
use App\Service\InertiaService;
use App\Service\TruthTableService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Routing\Attribute\Route;

class CircuitRoomController extends AbstractController
{
    public function __construct(
        private CircuitSessionService $sessionService,
        private TruthTableService $truthTableService,
        private InertiaService $inertia,
        private HubInterface $hub
    ) {}

    private function getMercurePublicUrl(): string
    {
        $url = $_SERVER['MERCURE_PUBLIC_URL'] ?? $_ENV['MERCURE_PUBLIC_URL'] ?? getenv('MERCURE_PUBLIC_URL');
        if (is_array($url)) {
            $url = reset($url);
        }
        return (is_string($url) && !empty($url)) ? $url : 'https://mercure-hl26.onrender.com/.well-known/mercure';
    }

    #[Route('/', name: 'app_home', methods: ['GET'])]
    public function landing(Request $request): Response
    {
        $rooms = $this->sessionService->listRooms();

        return $this->inertia->render('Landing', [
            'rooms' => $rooms,
            'defaultUserName' => $request->query->get('name', 'Engineer'),
            'mercureUrl' => $this->getMercurePublicUrl()
        ]);
    }

    #[Route('/room/create', name: 'app_room_create', methods: ['POST'])]
    public function createRoom(Request $request): Response
    {
        $payload = json_decode($request->getContent(), true) ?? $request->request->all();
        $userName = $payload['userName'] ?? 'John';
        $token = $payload['token'] ?? null;

        $room = $this->sessionService->createRoom($payload);
        $assignedName = $this->sessionService->registerUser($room['id'], $userName, $token);

        $this->publishRoomsListUpdate();

        return $this->redirectToRoute('app_room_workspace', [
            'roomId' => $room['id'],
            'userName' => $assignedName,
            'token' => $token
        ]);
    }

    #[Route('/room/{roomId}', name: 'app_room_workspace', methods: ['GET'])]
    public function workspace(string $roomId, Request $request): Response
    {
        $room = $this->sessionService->getRoom($roomId);
        if (!$room) {
            return $this->redirectToRoute('app_home');
        }

        $rawName = $request->query->get('userName', 'Engineer');
        $token = $request->query->get('token', null);
        $assignedName = $this->sessionService->registerUser($roomId, $rawName, $token);

        $updatedRoom = $this->sessionService->getRoom($roomId);
        if ($updatedRoom) {
            $this->publishRoomUpdate($roomId, $updatedRoom);
            $this->publishRoomsListUpdate();
        }

        return $this->inertia->render('Workspace', [
            'room' => $updatedRoom,
            'mercureUrl' => $this->getMercurePublicUrl(),
            'currentUser' => [
                'name' => $assignedName,
                'rawInputName' => $rawName,
                'token' => $token
            ]
        ]);
    }

    #[Route('/room/{roomId}', name: 'app_room_delete', methods: ['DELETE'])]
    public function deleteRoom(string $roomId): JsonResponse
    {
        $success = $this->sessionService->deleteRoom($roomId);
        if ($success) {
            $this->publishRoomsListUpdate();

            $update = new Update(
                'room/' . $roomId,
                json_encode(['deleted' => true])
            );
            $this->hub->publish($update);
        }
        return $this->json(['success' => $success]);
    }

    #[Route('/room/{roomId}/leave', name: 'app_room_leave', methods: ['POST'])]
    public function leaveRoom(string $roomId, Request $request): JsonResponse
    {
        $userName = $request->query->get('userName') ?? json_decode($request->getContent(), true)['userName'] ?? '';
        if ($userName) {
            $this->sessionService->leaveUser($roomId, $userName);

            // Publish leave update
            $room = $this->sessionService->getRoom($roomId);
            if ($room) {
                $this->publishRoomUpdate($roomId, $room);
            }
            $this->publishRoomsListUpdate();
        }
        return $this->json(['success' => true]);
    }

    #[Route('/room/{roomId}/sync', name: 'app_room_sync', methods: ['POST'])]
    public function sync(string $roomId, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $graph = $data['graph'] ?? ['nodes' => [], 'edges' => []];
        $options = $data['options'] ?? null;
        $userName = $data['userName'] ?? null;

        try {
            $updatedRoom = $this->sessionService->syncState($roomId, $graph, $options, $userName);

            $this->publishRoomUpdate($roomId, $updatedRoom);

            return $this->json([
                'success' => true,
                'version' => $updatedRoom['version'],
                'users' => array_values($updatedRoom['users'] ?? [])
            ]);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['error' => $e->getMessage()], 404);
        }
    }

    #[Route('/room/{roomId}/truth-table', name: 'app_room_truth_table', methods: ['POST'])]
    public function truthTable(string $roomId, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $nodes = $data['nodes'] ?? [];
        $edges = $data['edges'] ?? [];

        $table = $this->truthTableService->generateTruthTable($nodes, $edges);
        return $this->json($table);
    }

    #[Route('/room/{roomId}/heartbeat', name: 'app_room_heartbeat', methods: ['POST'])]
    public function heartbeat(string $roomId, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $userName = $data['userName'] ?? null;
        if ($userName) {
            $this->sessionService->updateHeartbeat($roomId, $userName);
        }
        return $this->json(['success' => true]);
    }

    private function publishRoomUpdate(string $roomId, array $room): void
    {
        $payload = [
            'version' => $room['version'] ?? 1,
            'graph' => $room['graph'],
            'gridSize' => $room['gridSize'] ?? 20,
            'users' => array_values($room['users'] ?? [])
        ];

        $update = new Update(
            'room/' . $roomId,
            json_encode($payload)
        );

        $this->hub->publish($update);
    }

    private function publishRoomsListUpdate(): void
    {
        $rooms = $this->sessionService->listRooms();
        $update = new Update(
            'room/rooms_list',
            json_encode(['rooms' => $rooms])
        );
        $this->hub->publish($update);
    }
}
