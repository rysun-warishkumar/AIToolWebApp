<?php

namespace App\Utils;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtHelper
{
    private static $algorithm = 'HS256';

    public static function encode($payload)
    {
        $issuedAt = time();
        $expire = $issuedAt + intval($_ENV['JWT_EXPIRY'] ?? 86400);

        $payload['iat'] = $issuedAt;
        $payload['exp'] = $expire;

        return JWT::encode(
            $payload,
            $_ENV['JWT_SECRET'],
            self::$algorithm
        );
    }

    public static function decode($token)
    {
        try {
            return JWT::decode(
                $token,
                new Key($_ENV['JWT_SECRET'], self::$algorithm)
            );
        } catch (\Exception $e) {
            return null;
        }
    }

    public static function getTokenFromHeader()
    {
        $headers = apache_request_headers();
        if (!isset($headers['Authorization'])) {
            return null;
        }

        $parts = explode(' ', $headers['Authorization']);
        if (count($parts) !== 2 || $parts[0] !== 'Bearer') {
            return null;
        }

        return $parts[1];
    }

    public static function verifyToken()
    {
        $token = self::getTokenFromHeader();
        if (!$token) {
            return null;
        }

        return self::decode($token);
    }
}
