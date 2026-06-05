<?php

namespace App\Utils;

class Validator
{
    private $errors = [];

    public function validate($data, $rules)
    {
        foreach ($rules as $field => $fieldRules) {
            $value = $data[$field] ?? null;
            $this->validateField($field, $value, $fieldRules);
        }

        return empty($this->errors);
    }

    private function validateField($field, $value, $rules)
    {
        $rules = explode('|', $rules);

        foreach ($rules as $rule) {
            $this->validateRule($field, $value, trim($rule));
        }
    }

    private function validateRule($field, $value, $rule)
    {
        if (strpos($rule, ':') !== false) {
            [$rule, $param] = explode(':', $rule, 2);
        }

        switch ($rule) {
            case 'required':
                if (empty($value)) {
                    $this->errors[$field] = ucfirst($field) . ' is required';
                }
                break;

            case 'email':
                if (!empty($value) && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    $this->errors[$field] = 'Invalid email format';
                }
                break;

            case 'min':
                if (!empty($value) && strlen($value) < $param) {
                    $this->errors[$field] = ucfirst($field) . ' must be at least ' . $param . ' characters';
                }
                break;

            case 'max':
                if (!empty($value) && strlen($value) > $param) {
                    $this->errors[$field] = ucfirst($field) . ' must not exceed ' . $param . ' characters';
                }
                break;

            case 'url':
                if (!empty($value) && !filter_var($value, FILTER_VALIDATE_URL)) {
                    $this->errors[$field] = 'Invalid URL format';
                }
                break;

            case 'unique':
                if (!empty($value)) {
                    [$table, $column] = explode(',', $param);
                    if ($this->recordExists($table, $column, $value)) {
                        $this->errors[$field] = ucfirst($field) . ' already exists';
                    }
                }
                break;

            case 'in':
                $allowed = explode(',', $param);
                if (!empty($value) && !in_array($value, $allowed)) {
                    $this->errors[$field] = 'Invalid ' . $field;
                }
                break;
        }
    }

    private function recordExists($table, $column, $value)
    {
        $db = \App\Config\Database::getInstance();
        $stmt = $db->execute(
            "SELECT COUNT(*) as count FROM $table WHERE $column = ?",
            [$value]
        );
        $result = $stmt->fetch();
        return $result['count'] > 0;
    }

    public function errors()
    {
        return $this->errors;
    }
}
