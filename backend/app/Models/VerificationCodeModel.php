<?php

namespace App\Models;

use CodeIgniter\Model;

class VerificationCodeModel extends Model
{
    protected $table      = 'verification_codes';
    protected $primaryKey = 'id';

    protected $allowedFields = ['user_id', 'email', 'code', 'created_at', 'expires_at'];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = ''; // Not needed unless you want to track updates
}
