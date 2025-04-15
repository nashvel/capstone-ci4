<?php

namespace App\Models;

use CodeIgniter\Model;

class OrderModel extends Model
{
    protected $table      = 'orders';
    protected $primaryKey = 'id';
    protected $allowedFields = ['name', 'email', 'phone', 'address', 'order_type', 'items', 'total_price', 'payment_method'];
}
