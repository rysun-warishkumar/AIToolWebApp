<?php

namespace App\Models;

use App\Config\Database;

class Tag
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function getAll($page = 1, $perPage = 50)
    {
        $offset = ($page - 1) * $perPage;

        // Get total count
        $countStmt = $this->db->execute("SELECT COUNT(*) as total FROM tags");
        $total = $countStmt->fetch()['total'];

        $stmt = $this->db->execute(
            "SELECT * FROM tags ORDER BY usage_count DESC LIMIT ? OFFSET ?",
            [$perPage, $offset]
        );

        return [
            'data' => $stmt->fetchAll(),
            'total' => $total,
        ];
    }

    public function getById($id)
    {
        $stmt = $this->db->execute(
            "SELECT * FROM tags WHERE id = ?",
            [$id]
        );
        return $stmt->fetch();
    }

    public function getBySlug($slug)
    {
        $stmt = $this->db->execute(
            "SELECT * FROM tags WHERE slug = ?",
            [$slug]
        );
        return $stmt->fetch();
    }

    public function getPopular($limit = 20)
    {
        $stmt = $this->db->execute(
            "SELECT * FROM tags ORDER BY usage_count DESC LIMIT ?",
            [$limit]
        );
        return $stmt->fetchAll();
    }

    public function create($data)
    {
        $stmt = $this->db->execute(
            "INSERT INTO tags (name, slug, description) VALUES (?, ?, ?)",
            [
                $data['name'],
                $data['slug'],
                $data['description'] ?? null,
            ]
        );

        return $this->db->lastInsertId();
    }

    public function update($id, $data)
    {
        $fields = [];
        $params = [];

        if (isset($data['name'])) {
            $fields[] = "name = ?";
            $params[] = $data['name'];
        }
        if (isset($data['description'])) {
            $fields[] = "description = ?";
            $params[] = $data['description'];
        }

        if (empty($fields)) return false;

        $params[] = $id;
        $query = "UPDATE tags SET " . implode(', ', $fields) . " WHERE id = ?";
        return $this->db->execute($query, $params);
    }

    public function delete($id)
    {
        return $this->db->execute(
            "DELETE FROM tags WHERE id = ?",
            [$id]
        );
    }

    public function incrementUsage($id)
    {
        return $this->db->execute(
            "UPDATE tags SET usage_count = usage_count + 1 WHERE id = ?",
            [$id]
        );
    }
}
