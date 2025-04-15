<?php

namespace App\Models;

use CodeIgniter\Model;

class VerificationCodeModel extends Model
{
    protected $table      = 'verification_codes';
    protected $primaryKey = 'id';

    protected $allowedFields = ['user_id', 'code'];
}
