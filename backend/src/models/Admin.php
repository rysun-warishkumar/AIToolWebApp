<?php

namespace App\Models;

use App\Config\Database;

class Admin
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function getByEmail($email)
    {
        $stmt = $this->db->execute(
            "SELECT * FROM admins WHERE email = ?",
            [$email]
        );
        return $stmt->fetch();
    }

    public function getById($id)
    {
        $stmt = $this->db->execute(
            "SELECT id, email, name, role, is_active, last_login, created_at 
             FROM admins WHERE id = ?",
            [$id]
        );
        return $stmt->fetch();
    }

    public function create($data)
    {
        $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);

        return $this->db->execute(
            "INSERT INTO admins (email, password_hash, name, role, is_active) 
             VALUES (?, ?, ?, ?, ?)",
            [
                $data['email'],
                $hashedPassword,
                $data['name'],
                $data['role'] ?? 'admin',
                1,
            ]
        );
    }

    public function verifyPassword($email, $password)
    {
        $admin = $this->getByEmail($email);

        if (!$admin) {
            return false;
        }

        if (!password_verify($password, $admin['password_hash'])) {
            return false;
        }

        if (!$admin['is_active']) {
            return false;
        }

        return $admin;
    }

    public function updateLastLogin($id)
    {
        return $this->db->execute(
            "UPDATE admins SET last_login = NOW() WHERE id = ?",
            [$id]
        );
    }

    public function getAll()
    {
        $stmt = $this->db->execute(
            "SELECT id, email, name, role, is_active, last_login, created_at FROM admins"
        );
        return $stmt->fetchAll();
    }

    public function update($id, $data)
    {
        $fields = [];
        $params = [];

        $allowedFields = ['name', 'role', 'is_active'];

        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $params[] = $data[$field];
            }
        }

        if (empty($fields)) return false;

        $params[] = $id;
        $query = "UPDATE admins SET " . implode(', ', $fields) . " WHERE id = ?";
        return $this->db->execute($query, $params);
    }
}
