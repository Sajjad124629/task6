<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Twig\Environment;

class InertiaService
{
    private string $version = '1.0';

    public function __construct(
        private Environment $twig,
        private RequestStack $requestStack
    ) {
    }

    public function render(string $component, array $props = []): Response
    {
        $request = $this->requestStack->getCurrentRequest();
        $url = $request ? $request->getRequestUri() : '/';

        $page = [
            'component' => $component,
            'props' => $props,
            'url' => $url,
            'version' => $this->version,
        ];

        if ($request && $request->headers->get('X-Inertia')) {
            $response = new JsonResponse($page);
            $response->headers->set('X-Inertia', 'true');
            $response->headers->set('Vary', 'Accept');
            return $response;
        }

        $content = $this->twig->render('app.html.twig', [
            'page' => $page,
        ]);

        return new Response($content);
    }
}
