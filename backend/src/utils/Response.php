<?php

namespace App\Utils;

class Response
{
    public static function success($data = null, $message = 'Success', $statusCode = 200)
    {
        return self::json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    public static function error($message = 'Error', $errors = null, $statusCode = 400)
    {
        return self::json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $statusCode);
    }

    public static function paginated($data, $total, $page, $perPage, $message = 'Success')
    {
        return self::json([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'perPage' => $perPage,
                'totalPages' => ceil($total / $perPage),
            ],
        ], 200);
    }

    public static function json($data, $statusCode = 200)
    {
        header('Content-Type: application/json');
        http_response_code($statusCode);
        echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function created($data, $message = 'Created successfully')
    {
        return self::success($data, $message, 201);
    }

    public static function notFound($message = 'Resource not found')
    {
        return self::error($message, null, 404);
    }

    public static function unauthorized($message = 'Unauthorized')
    {
        return self::error($message, null, 401);
    }

    public static function forbidden($message = 'Forbidden')
    {
        return self::error($message, null, 403);
    }

    public static function validation($errors)
    {
        return self::error('Validation failed', $errors, 422);
    }
}
