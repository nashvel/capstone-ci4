<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table      = 'users';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'email', 'password', 'is_verified',
        'first_name', 'last_name'
    ];
    
    protected $useTimestamps = true;
}
