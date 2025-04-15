<?php

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;

class Cors implements FilterInterface {
    public function before(RequestInterface $request, $arguments = null)
    {
        header("Access-Control-Allow-Origin: http://localhost:5173");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    
        // Handle the OPTIONS preflight request
        if ($request->getMethod() === "OPTIONS") {
            http_response_code(200);
            exit;
        }
    }
    
    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        
        $response->setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        $response->setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        $response->setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    
        return $response;
    }
}
