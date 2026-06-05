<?php

namespace App\Controllers;

use App\Config\Database;
use App\Utils\Response;

class FeaturedController
{
    public function list()
    {
        $collection = $_GET['collection'] ?? null;
        $type = $_GET['type'] ?? null;

        $db = Database::getInstance();

        $query = "SELECT fi.*, 
                  CASE 
                    WHEN fi.entity_type = 'tool' THEN (SELECT name FROM tools WHERE id = fi.entity_id)
                    WHEN fi.entity_type = 'prompt' THEN (SELECT title FROM prompts WHERE id = fi.entity_id)
                  END as title
                  FROM featured_items fi
                  WHERE fi.is_active = 1";
        
        $params = [];

        if ($collection) {
            $query .= " AND fi.collection_slug = ?";
            $params[] = $collection;
        }

        if ($type) {
            $query .= " AND fi.entity_type = ?";
            $params[] = $type;
        }

        $query .= " ORDER BY fi.display_order ASC";

        $stmt = $db->execute($query, $params);
        $items = $stmt->fetchAll();

        Response::success($items, 'Featured items retrieved');
    }

    public function collections()
    {
        $db = Database::getInstance();
        $stmt = $db->execute(
            "SELECT DISTINCT collection_name, collection_slug FROM featured_items WHERE is_active = 1 ORDER BY collection_slug"
        );
        $collections = $stmt->fetchAll();

        Response::success($collections, 'Collections retrieved');
    }
}
