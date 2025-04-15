<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use App\Models\UserModel;
use App\Models\VerificationCodeModel;
use CodeIgniter\Email\Email;
use CodeIgniter\I18n\Time;

class Auth extends Controller
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
        // Get JSON data
        $data = $this->request->getJSON(true); // true ensures it returns an associative array
        log_message('debug', 'POST data: ' . print_r($data, true));
    
        // Check if email is provided
        $email = $data['email'] ?? null;
        if (empty($email)) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Email is required']);
        }
    
        $username = $data['username'] ?? null;
        if (empty($username)) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Username is required']);
        }
    
        $password = $data['password'] ?? null;
        if (empty($password)) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Password is required']);
        }
    
        // Hash password and proceed with the logic
        $password = password_hash($password, PASSWORD_DEFAULT);
    
        // Check if email or username already exists
        if ($this->userModel->where('email', $email)->first()) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Email already registered']);
        }
        if ($this->userModel->where('username', $username)->first()) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Username already taken']);
        }
    
        // Insert new user
        $this->userModel->insert([
            'email' => $email,
            'username' => $username,
            'password' => $password,
            'is_verified' => 0
        ]); 
        
        log_message('debug', 'Last Query: ' . $this->userModel->getLastQuery());
        
        $user = $this->userModel->where('email', $email)->first();
    
        // Generate verification code and send email
        $code = random_int(100000, 999999);
        $this->sendVerificationEmail($email, $code);
    
        // Insert verification code
        $this->verificationModel->insert([
            'user_id' => $user['id'],
            'code' => $code
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
    
        // Get verification entry by user ID
        $verification = $this->verificationModel->where('user_id', $user['id'])->first();
    
        if (!$verification || $verification['code'] !== $code) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Invalid or expired verification code']);
        }
    
        // Mark user as verified
        $this->userModel->update($user['id'], ['is_verified' => 1]);
    
        // Delete verification record
        $this->verificationModel->delete($verification['id']);
    
        return $this->response->setJSON(['message' => 'Email verified successfully']);
    }
    
    
    

    public function login()
    {
        // Get JSON data
        $data = $this->request->getJSON(true); // true ensures it returns an associative array
    
        // Log the incoming data for debugging
        log_message('debug', 'Login data: ' . print_r($data, true));
    
        $emailOrUsername = $data['email'] ?? null;
        $password = $data['password'] ?? null;
    
        // Log individual fields to ensure they're correctly parsed
        log_message('debug', 'Email: ' . $emailOrUsername);
        log_message('debug', 'Password: ' . $password);
    
        // Check if email and password are provided
        if (!$emailOrUsername || !$password) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Email and password are required']);
        }
    
        // Check if the email exists in the database
        $user = $this->userModel->where('email', $emailOrUsername)->first();
    
        // Check if the user exists and if the password matches
        if (!$user || !password_verify($password, $user['password'])) {
            return $this->response->setStatusCode(401)->setJSON(['message' => 'Invalid email or password']);
        }
    
        // Check if email is verified
        if ($user['is_verified'] == 0) {
            return $this->response->setStatusCode(403)->setJSON(['message' => 'Email not verified']);
        }
    
        // Return success response
        return $this->response->setJSON([
            'message' => 'Login successful',
            'email' => $user['email'],
            'username' => $user['username']
        ]);
        
    }
    
    

    public function sendResetCode()
    {
        // Get JSON data
        $data = $this->request->getJSON(true);
        log_message('debug', 'Reset code request data: ' . print_r($data, true)); // Log the incoming data for debugging
    
        // Check if email is provided in the payload
        $email = $data['username'] ?? null; // This should match your frontend parameter name
        if (!$email) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Email (username) is required']);
        }
    
        // Check if the user exists by email (username in this case)
        $user = $this->userModel->where('email', $email)->first();
        if (!$user) {
            return $this->response->setStatusCode(404)->setJSON(['message' => 'Email not found']);
        }
    
        // Generate a random reset code
        $code = random_int(100000, 999999);
        $this->sendVerificationEmail($email, $code);
    
        // Insert reset code into the verification table
        $this->verificationModel->insert([
            'email' => $email,
            'code' => $code
        ]);
    
        return $this->response->setJSON(['message' => 'Password reset code sent']);
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
        log_message('debug', 'SearchAccount data: ' . print_r($data, true));  // 👈 Add this
    
        $searchTerm = $data['username_or_email'] ?? null;
        log_message('debug', 'Search term: ' . $searchTerm);  // 👈 Add this
    
        if (empty($searchTerm)) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Email or username is required']);
        }
    
        $user = $this->userModel
                    ->groupStart()
                    ->where('email', $searchTerm)
                    ->orWhere('username', $searchTerm)
                    ->groupEnd()
                    ->first();
    
        log_message('debug', 'User found: ' . print_r($user, true));  // 👈 Add this
    
        if (!$user) {
            return $this->response->setStatusCode(404)->setJSON(['message' => 'Account not found']);
        }
    
        return $this->response->setJSON([
            'username' => $user['username'],
            'email' => $user['email'],
        ]);
    }    

    public function updateName()
{
    $data = $this->request->getJSON(true);
    log_message('debug', 'Update Name data: ' . print_r($data, true)); // Log the incoming data for debugging

    $email = $data['email'] ?? null;
    $newName = $data['name'] ?? null;

    if (empty($email) || empty($newName)) {
        return $this->response->setStatusCode(400)->setJSON(['message' => 'Email and new name are required']);
    }

    // Find the user by email
    $user = $this->userModel->where('email', $email)->first();

    if (!$user) {
        return $this->response->setStatusCode(404)->setJSON(['message' => 'User not found']);
    }

    // Update the user's name
    $this->userModel->update($user['id'], ['username' => $newName]);

    // Return success response
    return $this->response->setJSON(['message' => 'Name updated successfully']);
}


}    