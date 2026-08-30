<?php

namespace App\Entity;

use App\Repository\CircuitRoomRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CircuitRoomRepository::class)]
class CircuitRoom
{
    #[ORM\Id]
    #[ORM\Column(length: 255)]
    private ?string $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column]
    private ?int $gridSize = null;

    #[ORM\Column]
    private ?bool $snapToGrid = null;

    #[ORM\Column]
    private ?int $version = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $users = null;

    #[ORM\Column(type: Types::JSON)]
    private array $graph = [];

    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->snapToGrid = true;
        $this->version = 1;
        $this->users = [];
        $this->graph = ['nodes' => [], 'edges' => []];
    }

    public static function fromArray(array $data): self
    {
        $room = new self();
        $room->setId($data['id'] ?? ('room-' . substr(md5(uniqid('', true)), 0, 8)));
        $room->setTitle(trim($data['title'] ?? '') ?: 'Logic Lab #' . rand(100, 999));
        $room->setDescription(trim($data['description'] ?? '') ?: 'Real-time collaborative room.');
        $room->setGridSize((int) ($data['gridSize'] ?? 20));
        if (isset($data['graph']) && is_array($data['graph'])) {
            $room->setGraph($data['graph']);
        }
        return $room;
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function setId(string $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getGridSize(): ?int
    {
        return $this->gridSize;
    }

    public function setGridSize(int $gridSize): static
    {
        $this->gridSize = $gridSize;

        return $this;
    }

    public function isSnapToGrid(): ?bool
    {
        return $this->snapToGrid;
    }

    public function setSnapToGrid(bool $snapToGrid): static
    {
        $this->snapToGrid = $snapToGrid;

        return $this;
    }

    public function getVersion(): ?int
    {
        return $this->version;
    }

    public function setVersion(int $version): static
    {
        $this->version = $version;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUsers(): ?array
    {
        return $this->users;
    }

    public function setUsers(?array $users): static
    {
        $this->users = $users;

        return $this;
    }

    public function getGraph(): array
    {
        return $this->graph;
    }

    public function setGraph(array $graph): static
    {
        $this->graph = $graph;

        return $this;
    }
}
