<?php

namespace App\Service;

use App\Entity\CircuitRoom;
use App\Repository\CircuitRoomRepository;
use Doctrine\ORM\EntityManagerInterface;

class CircuitSessionService
{
    public function __construct(
        private EntityManagerInterface $em,
        private CircuitRoomRepository $roomRepository
    ) {}

    public function listRooms(): array
    {
        $rooms = $this->roomRepository->findAll();
        $result = [];
        $now = time();
        foreach ($rooms as $room) {
            $users = $room->getUsers() ?? [];
            $activeUsers = array_values(array_filter($users, function ($u) use ($now) {
                return ($now - ($u['last_seen'] ?? 0)) <= 20;
            }));

            $result[] = [
                'id' => $room->getId(),
                'title' => $room->getTitle(),
                'description' => $room->getDescription() ?? '',
                'gridSize' => $room->getGridSize() ?? 20,
                'userCount' => count($activeUsers),
                'activeUsers' => array_column($activeUsers, 'name'),
                'version' => $room->getVersion() ?? 1
            ];
        }
        return $result;
    }

    public function createRoom(array $data): array
    {
        $room = CircuitRoom::fromArray($data);

        $this->em->persist($room);
        $this->em->flush();

        return $this->roomToArray($room);
    }

    public function deleteRoom(string $roomId): bool
    {
        $room = $this->roomRepository->find($roomId);
        if ($room) {
            $this->em->remove($room);
            $this->em->flush();
            return true;
        }
        return false;
    }

    public function getRoom(string $roomId): ?array
    {
        $room = $this->roomRepository->find($roomId);
        if (!$room) return null;

        $now = time();
        $users = $room->getUsers() ?? [];
        $activeUsers = array_filter($users, function ($u) use ($now) {
            return ($now - ($u['last_seen'] ?? 0)) <= 20;
        });

        if (count($activeUsers) !== count($users)) {
            $room->setUsers($activeUsers);
            $this->em->flush();
        }

        return $this->roomToArray($room);
    }

    public function registerUser(string $roomId, string $requestedName, ?string $clientToken = null): string
    {
        $room = $this->roomRepository->find($roomId);
        if (!$room) {
            return $requestedName;
        }

        $baseName = trim($requestedName) ?: 'Engineer';
        $now = time();

        $users = $room->getUsers() ?? [];
        $activeUsers = [];
        foreach ($users as $uid => $u) {
            if (($now - ($u['last_seen'] ?? 0)) <= 20) {
                $activeUsers[$uid] = $u;
            }
        }

        if ($clientToken) {
            foreach ($activeUsers as $uid => $u) {
                if (isset($u['token']) && $u['token'] === $clientToken) {
                    $activeUsers[$uid]['last_seen'] = $now;
                    $room->setUsers($activeUsers);
                    $this->em->flush();
                    return $u['name'];
                }
            }
        }

        $existingNames = array_map(fn($u) => $u['name'], $activeUsers);

        if (!in_array($baseName, $existingNames, true)) {
            $assignedName = $baseName;
        } else {
            $counter = 2;
            while (in_array($baseName . ' ' . $counter, $existingNames, true)) {
                $counter++;
            }
            $assignedName = $baseName . ' ' . $counter;
        }

        $colors = ['#4361ee', '#00ab55', '#e2a03f', '#e7515a', '#805dca', '#2196f3', '#e91e63'];
        $userColor = $colors[abs(crc32($assignedName)) % count($colors)];

        $userId = md5($assignedName . '-' . ($clientToken ?: uniqid()));
        $activeUsers[$userId] = [
            'id' => $userId,
            'name' => $assignedName,
            'color' => $userColor,
            'token' => $clientToken,
            'last_seen' => $now
        ];

        $room->setUsers($activeUsers);
        $this->em->flush();
        return $assignedName;
    }

    public function leaveUser(string $roomId, string $userName): void
    {
        $room = $this->roomRepository->find($roomId);
        if (!$room) return;

        $users = $room->getUsers() ?? [];
        foreach ($users as $uid => $u) {
            if ($u['name'] === $userName) {
                unset($users[$uid]);
            }
        }

        $room->setUsers($users);
        $room->setVersion(($room->getVersion() ?? 1) + 1);
        $this->em->flush();
    }

    public function updateHeartbeat(string $roomId, string $userName): void
    {
        $room = $this->roomRepository->find($roomId);
        if (!$room) return;

        $users = $room->getUsers() ?? [];
        $changed = false;
        foreach ($users as &$u) {
            if ($u['name'] === $userName) {
                $u['last_seen'] = time();
                $changed = true;
            }
        }

        if ($changed) {
            $room->setUsers($users);
            $this->em->flush();
        }
    }

    public function syncState(string $roomId, array $graph, ?array $options = null, ?string $userName = null): array
    {
        $room = $this->roomRepository->find($roomId);
        if (!$room) {
            throw new \InvalidArgumentException('Room not found');
        }

        $room->setGraph($graph);

        if ($options !== null) {
            if (isset($options['gridSize'])) $room->setGridSize((int) $options['gridSize']);
            if (isset($options['snapToGrid'])) $room->setSnapToGrid((bool) $options['snapToGrid']);
        }

        $room->setVersion(($room->getVersion() ?? 1) + 1);

        if ($userName) {
            $users = $room->getUsers() ?? [];
            foreach ($users as &$u) {
                if ($u['name'] === $userName) {
                    $u['last_seen'] = time();
                }
            }
            $room->setUsers($users);
        }

        $this->em->flush();
        return $this->roomToArray($room);
    }

    private function roomToArray(CircuitRoom $room): array
    {
        return [
            'id' => $room->getId(),
            'title' => $room->getTitle(),
            'description' => $room->getDescription(),
            'gridSize' => $room->getGridSize(),
            'snapToGrid' => $room->isSnapToGrid(),
            'version' => $room->getVersion(),
            'created_at' => $room->getCreatedAt()?->format('Y-m-d H:i:s'),
            'users' => $room->getUsers() ?? [],
            'graph' => $room->getGraph()
        ];
    }
}
