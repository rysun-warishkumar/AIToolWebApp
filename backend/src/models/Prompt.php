<?php

namespace App\Models;

use App\Config\Database;

class Prompt
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function getAll($page = 1, $perPage = 12, $filters = [])
    {
        $offset = ($page - 1) * $perPage;
        $query = "SELECT p.*, pc.name as category_name FROM prompts p 
                  JOIN prompt_categories pc ON p.category_id = pc.id 
                  WHERE p.status = 'published'";
        $params = [];

        if (!empty($filters['search'])) {
            $query .= " AND MATCH(p.title, p.content) AGAINST(? IN BOOLEAN MODE)";
            $params[] = $filters['search'];
        }

        if (!empty($filters['category_id'])) {
            $query .= " AND p.category_id = ?";
            $params[] = $filters['category_id'];
        }

        if (!empty($filters['complexity'])) {
            $query .= " AND p.complexity = ?";
            $params[] = $filters['complexity'];
        }

        if (!empty($filters['tag_id'])) {
            $query .= " AND p.id IN (SELECT prompt_id FROM prompt_tags WHERE tag_id = ?)";
            $params[] = $filters['tag_id'];
        }

        // Sorting
        $sortBy = $filters['sortBy'] ?? 'created_at';
        $sortOrder = $filters['sortOrder'] === 'asc' ? 'ASC' : 'DESC';
        $query .= " ORDER BY p.$sortBy $sortOrder";

        // Get total count
        $countStmt = $this->db->execute(
            "SELECT COUNT(*) as total FROM ($query) as counted",
            $params
        );
        $total = $countStmt->fetch()['total'] ?? 0;

        // Add pagination
        $query .= " LIMIT ? OFFSET ?";
        $params[] = $perPage;
        $params[] = $offset;

        $stmt = $this->db->execute($query, $params);
        $prompts = $stmt->fetchAll();

        // Load tags for each prompt
        foreach ($prompts as &$prompt) {
            $prompt['tags'] = $this->getTags($prompt['id']);
        }

        return [
            'data' => $prompts,
            'total' => $total,
        ];
    }

    public function getById($id)
    {
        $stmt = $this->db->execute(
            "SELECT p.*, pc.name as category_name FROM prompts p 
             JOIN prompt_categories pc ON p.category_id = pc.id 
             WHERE p.id = ? AND p.status = 'published'",
            [$id]
        );

        $prompt = $stmt->fetch();

        if ($prompt) {
            $prompt['tags'] = $this->getTags($id);
            // Increment view count
            $this->db->execute(
                "UPDATE prompts SET view_count = view_count + 1 WHERE id = ?",
                [$id]
            );
        }

        return $prompt;
    }

    public function getTrending($limit = 6)
    {
        $stmt = $this->db->execute(
            "SELECT p.*, pc.name as category_name FROM prompts p 
             JOIN prompt_categories pc ON p.category_id = pc.id 
             WHERE p.is_featured = 1 AND p.status = 'published'
             ORDER BY p.copy_count DESC, p.view_count DESC, p.created_at DESC
             LIMIT ?",
            [$limit]
        );

        $prompts = $stmt->fetchAll();

        foreach ($prompts as &$prompt) {
            $prompt['tags'] = $this->getTags($prompt['id']);
        }

        return $prompts;
    }

    public function incrementCopyCount($id)
    {
        return $this->db->execute(
            "UPDATE prompts SET copy_count = copy_count + 1 WHERE id = ?",
            [$id]
        );
    }

    public function create($data)
    {
        $stmt = $this->db->execute(
            "INSERT INTO prompts (title, slug, short_description, content, preview_text,
             category_id, prompt_type, industry, complexity, status, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $data['title'],
                $data['slug'],
                $data['short_description'],
                $data['content'],
                $data['preview_text'] ?? null,
                $data['category_id'],
                $data['prompt_type'] ?? 'template',
                $data['industry'] ?? null,
                $data['complexity'] ?? 'intermediate',
                $data['status'] ?? 'published',
                $data['created_by'],
            ]
        );

        $promptId = $this->db->lastInsertId();

        // Add tags
        if (!empty($data['tags'])) {
            foreach ($data['tags'] as $tagId) {
                $this->db->execute(
                    "INSERT INTO prompt_tags (prompt_id, tag_id) VALUES (?, ?)",
                    [$promptId, $tagId]
                );
            }
        }

        return $promptId;
    }

    public function update($id, $data)
    {
        $fields = [];
        $params = [];

        $allowedFields = ['title', 'slug', 'short_description', 'content', 'preview_text',
                         'category_id', 'prompt_type', 'industry', 'complexity', 'status', 'is_featured'];

        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $params[] = $data[$field];
            }
        }

        if (empty($fields)) {
            return false;
        }

        $params[] = $id;
        $query = "UPDATE prompts SET " . implode(', ', $fields) . " WHERE id = ?";
        $this->db->execute($query, $params);

        // Update tags if provided
        if (isset($data['tags'])) {
            $this->db->execute("DELETE FROM prompt_tags WHERE prompt_id = ?", [$id]);
            foreach ($data['tags'] as $tagId) {
                $this->db->execute(
                    "INSERT INTO prompt_tags (prompt_id, tag_id) VALUES (?, ?)",
                    [$id, $tagId]
                );
            }
        }

        return true;
    }

    public function delete($id)
    {
        return $this->db->execute(
            "UPDATE prompts SET deleted_at = NOW() WHERE id = ?",
            [$id]
        );
    }

    public function getTags($promptId)
    {
        $stmt = $this->db->execute(
            "SELECT t.* FROM tags t 
             JOIN prompt_tags pt ON t.id = pt.tag_id 
             WHERE pt.prompt_id = ?",
            [$promptId]
        );

        return $stmt->fetchAll();
    }

    public function search($query, $page = 1, $perPage = 12)
    {
        return $this->getAll($page, $perPage, ['search' => $query]);
    }
}
