<?php

namespace App\Models;

use App\Config\Database;

class Tool
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function getAll($page = 1, $perPage = 12, $filters = [])
    {
        $offset = ($page - 1) * $perPage;
        $query = "SELECT t.*, tc.name as category_name FROM tools t 
                  JOIN tool_categories tc ON t.category_id = tc.id 
                  WHERE t.status = 'published'";
        $params = [];

        if (!empty($filters['search'])) {
            $query .= " AND MATCH(t.name, t.description) AGAINST(? IN BOOLEAN MODE)";
            $params[] = $filters['search'];
        }

        if (!empty($filters['category_id'])) {
            $query .= " AND t.category_id = ?";
            $params[] = $filters['category_id'];
        }

        if (!empty($filters['pricing_model'])) {
            $query .= " AND t.pricing_model = ?";
            $params[] = $filters['pricing_model'];
        }

        if (!empty($filters['tag_id'])) {
            $query .= " AND t.id IN (SELECT tool_id FROM tool_tags WHERE tag_id = ?)";
            $params[] = $filters['tag_id'];
        }

        // Sorting
        $sortBy = $filters['sortBy'] ?? 'created_at';
        $sortOrder = $filters['sortOrder'] === 'asc' ? 'ASC' : 'DESC';
        $query .= " ORDER BY t.$sortBy $sortOrder";

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
        $tools = $stmt->fetchAll();

        // Load tags for each tool
        foreach ($tools as &$tool) {
            $tool['tags'] = $this->getTags($tool['id']);
        }

        return [
            'data' => $tools,
            'total' => $total,
        ];
    }

    public function getById($id)
    {
        $stmt = $this->db->execute(
            "SELECT t.*, tc.name as category_name FROM tools t 
             JOIN tool_categories tc ON t.category_id = tc.id 
             WHERE t.id = ? AND t.status = 'published'",
            [$id]
        );

        $tool = $stmt->fetch();

        if ($tool) {
            $tool['tags'] = $this->getTags($id);
            // Increment view count
            $this->db->execute(
                "UPDATE tools SET view_count = view_count + 1 WHERE id = ?",
                [$id]
            );
        }

        return $tool;
    }

    public function getFeatured($limit = 6)
    {
        $stmt = $this->db->execute(
            "SELECT t.*, tc.name as category_name FROM tools t 
             JOIN tool_categories tc ON t.category_id = tc.id 
             WHERE t.is_featured = 1 AND t.status = 'published'
             ORDER BY t.popularity_score DESC, t.created_at DESC
             LIMIT ?",
            [$limit]
        );

        $tools = $stmt->fetchAll();

        foreach ($tools as &$tool) {
            $tool['tags'] = $this->getTags($tool['id']);
        }

        return $tools;
    }

    public function create($data)
    {
        $stmt = $this->db->execute(
            "INSERT INTO tools (name, slug, short_description, description, logo_url, 
             website_url, category_id, pricing_model, status, created_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $data['name'],
                $data['slug'],
                $data['short_description'],
                $data['description'],
                $data['logo_url'] ?? null,
                $data['website_url'],
                $data['category_id'],
                $data['pricing_model'] ?? 'free',
                $data['status'] ?? 'published',
                $data['created_by'],
            ]
        );

        $toolId = $this->db->lastInsertId();

        // Add tags
        if (!empty($data['tags'])) {
            foreach ($data['tags'] as $tagId) {
                $this->db->execute(
                    "INSERT INTO tool_tags (tool_id, tag_id) VALUES (?, ?)",
                    [$toolId, $tagId]
                );
            }
        }

        return $toolId;
    }

    public function update($id, $data)
    {
        $fields = [];
        $params = [];

        $allowedFields = ['name', 'slug', 'short_description', 'description', 'logo_url', 
                         'website_url', 'category_id', 'pricing_model', 'status', 'is_featured'];

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
        $query = "UPDATE tools SET " . implode(', ', $fields) . " WHERE id = ?";
        $this->db->execute($query, $params);

        // Update tags if provided
        if (isset($data['tags'])) {
            $this->db->execute("DELETE FROM tool_tags WHERE tool_id = ?", [$id]);
            foreach ($data['tags'] as $tagId) {
                $this->db->execute(
                    "INSERT INTO tool_tags (tool_id, tag_id) VALUES (?, ?)",
                    [$id, $tagId]
                );
            }
        }

        return true;
    }

    public function delete($id)
    {
        return $this->db->execute(
            "UPDATE tools SET deleted_at = NOW() WHERE id = ?",
            [$id]
        );
    }

    public function getTags($toolId)
    {
        $stmt = $this->db->execute(
            "SELECT t.* FROM tags t 
             JOIN tool_tags tt ON t.id = tt.tag_id 
             WHERE tt.tool_id = ?",
            [$toolId]
        );

        return $stmt->fetchAll();
    }

    public function search($query, $page = 1, $perPage = 12)
    {
        return $this->getAll($page, $perPage, ['search' => $query]);
    }
}
