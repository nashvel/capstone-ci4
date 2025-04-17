<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;

class AdminController extends ResourceController
{
    protected $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    // Admin Registration (stores to DB)
    public function register()
    {
        $data = $this->request->getJSON(true);
        $firstName = $data['first_name'] ?? null;
        $lastName  = $data['last_name'] ?? null;
        $email     = $data['email'] ?? null;
        $password  = $data['password'] ?? null;

        if (!$firstName || !$lastName || !$email || !$password) {
            return $this->fail("All fields are required", 400);
        }

        if ($this->userModel->where('email', $email)->first()) {
            return $this->fail("Email already registered", 409);
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $this->userModel->save([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'password' => password_hash($data['password'], PASSWORD_DEFAULT),
            'role' => 'admin',
            'is_verified' => 1
        ]);
        

        return $this->respondCreated(['message' => 'Admin registered successfully']);
    }

    // Admin Login (reads from DB)
    public function login()
    {
        $data = $this->request->getJSON(true);
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            return $this->fail("Email and password required", 400);
        }

        $admin = $this->userModel->where('email', $email)->first();

        if (!$admin || !password_verify($password, $admin['password'])) {
            return $this->fail("Invalid credentials", 401);
        }

        if ($admin['role'] !== 'admin') {
            return $this->fail("Unauthorized: Not an admin", 403);
        }

        return $this->respond([
            'message' => 'Admin login successful',
            'email' => $admin['email'],
            'first_name' => $admin['first_name'],
            'last_name' => $admin['last_name'],
            'role' => $admin['role']
        ]);
    }
}
