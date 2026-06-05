<?php

namespace App\Middleware;

use App\Utils\JwtHelper;
use App\Utils\Response;

class AuthMiddleware
{
    public static function authenticate()
    {
        $token = JwtHelper::verifyToken();

        if (!$token) {
            Response::unauthorized('Invalid or expired token');
        }

        return $token;
    }

    public static function checkRole($requiredRole)
    {
        $token = self::authenticate();

        if ($token->role !== $requiredRole && $token->role !== 'super_admin') {
            Response::forbidden('Insufficient permissions');
        }

        return $token;
    }
}
