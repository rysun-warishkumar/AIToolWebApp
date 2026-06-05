<?php

namespace App\Models;

use App\Config\Database;

class Category
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function getAllToolCategories()
    {
        $stmt = $this->db->execute(
            "SELECT * FROM tool_categories WHERE is_active = 1 ORDER BY display_order ASC"
        );
        return $stmt->fetchAll();
    }

    public function getAllPromptCategories()
    {
        $stmt = $this->db->execute(
            "SELECT * FROM prompt_categories WHERE is_active = 1 ORDER BY display_order ASC"
        );
        return $stmt->fetchAll();
    }

    public function getToolCategoryById($id)
    {
        $stmt = $this->db->execute(
            "SELECT * FROM tool_categories WHERE id = ?",
            [$id]
        );
        return $stmt->fetch();
    }

    public function getPromptCategoryById($id)
    {
        $stmt = $this->db->execute(
            "SELECT * FROM prompt_categories WHERE id = ?",
            [$id]
        );
        return $stmt->fetch();
    }

    public function createToolCategory($data)
    {
        return $this->db->execute(
            "INSERT INTO tool_categories (name, slug, description, color, display_order) 
             VALUES (?, ?, ?, ?, ?)",
            [
                $data['name'],
                $data['slug'],
                $data['description'] ?? null,
                $data['color'] ?? '#3B82F6',
                $data['display_order'] ?? 0,
            ]
        );
    }

    public function createPromptCategory($data)
    {
        return $this->db->execute(
            "INSERT INTO prompt_categories (name, slug, description, display_order)
             VALUES (?, ?, ?, ?)",
            [
                $data['name'],
                $data['slug'],
                $data['description'] ?? null,
                $data['display_order'] ?? 0,
            ]
        );
    }

    public function updateToolCategory($id, $data)
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
        if (isset($data['color'])) {
            $fields[] = "color = ?";
            $params[] = $data['color'];
        }
        if (isset($data['display_order'])) {
            $fields[] = "display_order = ?";
            $params[] = $data['display_order'];
        }

        if (empty($fields)) return false;

        $params[] = $id;
        $query = "UPDATE tool_categories SET " . implode(', ', $fields) . " WHERE id = ?";
        return $this->db->execute($query, $params);
    }
}
