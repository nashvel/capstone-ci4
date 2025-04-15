<?php

namespace App\Models;

use CodeIgniter\Model;

class OrderModel extends Model
{
    protected $table      = 'orders';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'address',
        'order_type',
        'items',
        'total_price',
        'payment_method',
        'order_date',
        'order_time'
    ];
}
