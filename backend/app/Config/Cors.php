<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Cors extends BaseConfig
{
    public array $default = [
        'allowedOrigins' => ['http://localhost:5173'], // <-- Change this to match your frontend's actual port
        'allowedOriginsPatterns' => [],
        'supportsCredentials' => true,
        'allowedHeaders' => [
            'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'
        ],
        'exposedHeaders' => [],
        'allowedMethods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        'maxAge' => 7200,
    ];
}
