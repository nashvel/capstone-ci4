<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use App\Models\UserModel;
use App\Models\VerificationCodeModel;
use CodeIgniter\Email\Email;
use CodeIgniter\I18n\Time;
use CodeIgniter\RESTful\ResourceController;


class Auth extends ResourceController
{
    protected $userModel;
    protected $verificationModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
        $this->verificationModel = new VerificationCodeModel();
    }

    public function signup()
    {
        $data = $this->request->getJSON(true);

        $email = $data['email'] ?? null;
        $firstName = $data['first_name'] ?? null;
        $lastName = $data['last_name'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$firstName || !$lastName || !$password) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'All fields are required']);
        }

        $existingUser = $this->userModel->where('email', $email)->first();

        if ($existingUser) {
            if ($existingUser['is_verified']) {
                return $this->response->setStatusCode(400)->setJSON(['message' => 'Email already registered']);
            } else {
                // Check last code sent time
                $lastCode = $this->verificationModel
                    ->where('user_id', $existingUser['id'])
                    ->orderBy('created_at', 'desc')
                    ->first();
        
                    $timezone = 'Asia/Manila'; // actual timezone
                    $now = Time::now($timezone);
                    
                    if ($lastCode) {
                        $lastSent = Time::parse($lastCode['created_at'], $timezone);
                        $nextAllowed = $lastSent->addSeconds(30);
                    
                        if ($nextAllowed->isAfter($now)) {
                            $wait = $nextAllowed->getTimestamp() - $now->getTimestamp();
                            return $this->response->setStatusCode(429)->setJSON([
                                'message' => "Please wait {$wait} seconds before requesting a new code"
                            ]);
                        }
                    }                    
        
                $code = random_int(100000, 999999);
                $this->sendVerificationEmail($email, $code);
        
                $this->verificationModel->insert([
                    'user_id' => $existingUser['id'],
                    'code' => $code,
                    'created_at' => Time::now('Asia/Manila')->toDateTimeString()
                ]);
                
        
                return $this->response->setJSON(['message' => 'New verification code sent to email']);
            }
        }
        

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $this->userModel->insert([
            'email' => $email,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'password' => $hashedPassword,
            'is_verified' => 0
        ]);
        
        $user = $this->userModel->where('email', $email)->first();
        $code = random_int(100000, 999999);
        
        $this->sendVerificationEmail($email, $code);
        
        $this->verificationModel->insert([
            'user_id' => $user['id'],
            'code' => $code,
            'created_at' => Time::now('Asia/Manila')->toDateTimeString()
        ]);        
        
        return $this->response->setJSON(['message' => 'Verification code sent to email']);
    }        

    public function sendVerificationEmail($toEmail, $code)
    {
        $email = \Config\Services::email();
        $email->setFrom('nacht.system@gmail.com', 'Multi Cuisine Food Delivery');
        $email->setTo($toEmail);
        $email->setSubject('Email Verification');
        $email->setMessage("Your verification code is: $code");

        if (!$email->send()) {
            return $this->response->setStatusCode(500)->setJSON(['message' => 'Failed to send verification email']);
        }
    }

    public function verifyEmail()
    {
        $data = $this->request->getJSON(true);
        $email = $data['email'] ?? null;
        $code = $data['code'] ?? null;
    
        if (empty($email) || empty($code)) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Email and code are required']);
        }
    
        // Get user
        $user = $this->userModel->where('email', $email)->first();
        if (!$user) {
            return $this->response->setStatusCode(404)->setJSON(['message' => 'User not found']);
        }
    
        // Get the latest verification code
        $verification = $this->verificationModel
            ->where('user_id', $user['id'])
            ->orderBy('created_at', 'desc')
            ->first();
    
        if (!$verification || $verification['code'] !== $code) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Invalid or expired verification code']);
        }
    
        // Check if the code is expired (e.g., valid for 10 minutes)
        $timezone = 'Asia/Manila';
        $createdAt = Time::parse($verification['created_at'], $timezone);
        $expiresAt = $createdAt->addMinutes(10);
        $now = Time::now($timezone);

        log_message('debug', 'Now: ' . $now);
        log_message('debug', 'Code Created At: ' . $createdAt);
        log_message('debug', 'Expires At: ' . $expiresAt);

    
        if ($now->isAfter($expiresAt)) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Verification code has expired']);
        }
    
        // Mark user as verified
        $this->userModel->update($user['id'], ['is_verified' => 1]);
    
        // Delete all verification codes for this user
        $this->verificationModel->where('user_id', $user['id'])->delete();
    
        return $this->response->setJSON(['message' => 'Email verified successfully']);
    }  
    
    public function verifyPassword()
{
    $data = $this->request->getJSON(true);
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    $user = $this->userModel->where('email', $email)->first();

    if (!$user || !password_verify($password, $user['password'])) {
        return $this->response->setStatusCode(401)->setJSON(['success' => false, 'message' => 'Incorrect password.']);
    }

    return $this->response->setJSON(['success' => true]);
}

    
    public function login()
    {
        $data = $this->request->getJSON(true);
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Email and password are required']);
        }

        $user = $this->userModel->where('email', $email)->first();

        if (!$user || !password_verify($password, $user['password'])) {
            return $this->response->setStatusCode(401)->setJSON(['message' => 'Invalid email or password']);
        }

        if ($user['is_verified'] == 0) {
            return $this->response->setStatusCode(403)->setJSON(['message' => 'Email not verified']);
        }

        return $this->response->setJSON([
            'message' => 'Login successful',
            'email' => $user['email'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name']
        ]);
    }


    public function sendResetCode()
    {
        $email = $this->request->getJSON()->email ?? null;
        $user = $this->userModel->where('email', $email)->first();
    
        if (!$user) {
            return $this->response->setStatusCode(404)->setJSON(['message' => 'User not found']);
        }
    
        $code = rand(100000, 999999);
    
        // Use insert() instead of save()
        $this->verificationModel->insert([
            'user_id'    => $user['id'],
            'email'      => $email,
            'code'       => $code,
            'type'       => 'password_reset', // optional if you're using type
            'expires_at' => Time::now('Asia/Manila')->addMinutes(5)->toDateTimeString(),
        ]);
    
        $this->sendVerificationEmail($email, $code);
    
        return $this->respond(['message' => 'Reset code sent']);
    }
    
    
    public function resetPassword()
    {
        $data = $this->request->getJSON(true); // Use getJSON(true) to get the data as an associative array
        log_message('debug', 'Reset Password data: ' . print_r($data, true)); // Debug log to check incoming data
        
        $email = $data['email'] ?? null;
        $code = $data['code'] ?? null;
        $newPassword = $data['new_password'] ?? null;
        
        // Check if email, code, and new password are provided
        if (!$email || !$code || !$newPassword) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'All fields (email, code, new password) are required']);
        }
    
        // Check if verification code is valid
        $verification = $this->verificationModel->where('email', $email)->where('code', $code)->first();
        if (!$verification) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Invalid or expired reset code']);
        }
    
        // Hash the new password
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    
        // Get the user by email
        $user = $this->userModel->where('email', $email)->first();
        if (!$user) {
            return $this->response->setStatusCode(404)->setJSON(['message' => 'User not found']);
        }
    
        // Update the user's password
        $this->userModel->update($user['id'], ['password' => $hashedPassword]);
    
        // Remove the verification code from the table
        $this->verificationModel->delete($verification['id']);
    
        return $this->response->setJSON(['message' => 'Password reset successful']);
    }

    public function searchAccount()
    {
        $data = $this->request->getJSON(true);
        $query = $data['query'] ?? null;
    
        if (!$query) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Query is required']);
        }
    
        // Check if the query is an email
        if (filter_var($query, FILTER_VALIDATE_EMAIL)) {
            $users = $this->userModel
                ->select('first_name, last_name, email')
                ->where('email', $query)
                ->findAll();
        } else {
            // Search by first name (partial match)
            $users = $this->userModel
                ->select('first_name, last_name, email')
                ->like('first_name', $query)
                ->findAll();
        }
    
        if (empty($users)) {
            return $this->response->setStatusCode(404)->setJSON(['message' => 'No matching account found']);
        }
    
        return $this->response->setJSON(['accounts' => $users]);
    }
    
    

    public function updateName()
    {
        $data = $this->request->getJSON(true);
        $email = $data['email'] ?? null;
        $firstName = $data['first_name'] ?? null;
        $lastName = $data['last_name'] ?? null;

        if (!$email || !$firstName || !$lastName) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Email, first name, and last name are required']);
        }

        $user = $this->userModel->where('email', $email)->first();

        if (!$user) {
            return $this->response->setStatusCode(404)->setJSON(['message' => 'User not found']);
        }

        $this->userModel->update($user['id'], [
            'first_name' => $firstName,
            'last_name' => $lastName
        ]);

        return $this->response->setJSON(['message' => 'Name updated successfully']);
    }

    public function skipLogin()
    {
        $request = $this->request;
        $input = $request->getJSON(true);
    
        $email = isset($input['email']) ? trim($input['email']) : null;
    
        if (!$email) {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Email is required'
            ]);
        }
    
        $user = $this->userModel->where('email', $email)->first();
    
        if (!$user) {
            return $this->response->setStatusCode(404)->setJSON([
                'success' => false,
                'message' => 'User not found'
            ]);
        }
    
        // Simulate login success
        return $this->response->setStatusCode(200)->setJSON([
            'success' => true,
            'message' => 'Logged in via skip',
            'user' => $user
        ]);
    }
    
    

    public function updatePasswordDirectly()
    {
        $data = $this->request->getJSON(true);
    
        $email = $data['email'] ?? null;
        $newPassword = $data['new_password'] ?? null;
    
        if (!$email || !$newPassword) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Email and new password are required']);
        }
    
        $user = $this->userModel->where('email', $email)->first();
    
        if (!$user) {
            return $this->response->setStatusCode(404)->setJSON(['message' => 'User not found']);
        }
    
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        $this->userModel->update($user['id'], ['password' => $hashedPassword]);
    
        return $this->response->setJSON(['message' => 'Password updated successfully']);
    }


    public function verifyResetCode()
    {
        $data = $this->request->getJSON();
        $email = $data->email ?? null;
        $code = $data->code ?? null;
    
        if (!$email || !$code) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Missing email or code']);
        }
    
        $user = $this->userModel->where('email', $email)->first();
    
        if (!$user) {
            return $this->response->setStatusCode(404)->setJSON(['message' => 'User not found']);
        }
    
        $verification = $this->verificationModel
            ->where('user_id', $user['id'])
            ->where('code', $code)
            ->orderBy('id', 'desc') // just in case multiple codes exist
            ->first();
    
        if (!$verification) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Invalid code']);
        }
    
        if (!$verification['expires_at']) {
            return $this->response->setStatusCode(500)->setJSON(['message' => 'Missing expiration time for the code']);
        }        
        
        $expiresAt = Time::parse($verification['expires_at'], 'Asia/Manila');        
        $now = Time::now('Asia/Manila');

        if ($now->isAfter($expiresAt)) {
           return $this->response->setStatusCode(400)->setJSON(['message' => 'Code expired']);
        } 

    }    

}    