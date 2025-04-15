<?php

namespace App\Controllers;

use App\Models\OrderModel;
use CodeIgniter\RESTful\ResourceController;

class PlaceOrderController extends ResourceController
{
    public function store()
    {
        $orderModel = new OrderModel();
        $request = $this->request->getJSON(true);

        // ✅ Get logged-in user from session
        $loggedInUser = session()->get('user');

        if (!$loggedInUser) {
            return $this->failUnauthorized("User not logged in");
        }

        // Validate required fields
        if (!isset($request['items'], $request['total_price'], $request['order_type'])) {
            return $this->fail("Missing required fields", 400);
        }

        if ($request['order_type'] === 'deliver' && (!isset($request['phone']) || !isset($request['address']))) {
            return $this->fail("Phone and address are required for delivery orders", 400);
        }

        // Default pickup location
        if ($request['order_type'] === 'pickup') {
            $request['address'] = "Tagoloan";
        }

        // ✅ Insert order with first_name & last_name
        $orderModel->insert([
            'user_id'        => $loggedInUser['id'],
            'first_name'     => $loggedInUser['first_name'],
            'last_name'      => $loggedInUser['last_name'],
            'email'          => $loggedInUser['email'],
            'phone'          => $request['phone'] ?? null,
            'address'        => $request['address'],
            'order_type'     => $request['order_type'],
            'items'          => json_encode($request['items']),
            'total_price'    => $request['total_price'],
            'payment_method' => $request['payment_method'] ?? 'cod',
        ]);

        $orderId = $orderModel->insertID();

        if (!$orderId) {
            return $this->fail("Failed to place order", 500);
        }

        // Send confirmation email
        $this->sendEmail([
            'first_name' => $loggedInUser['first_name'],
            'last_name' => $loggedInUser['last_name'],
            'email' => $loggedInUser['email'],
            'order_type' => $request['order_type'],
            'items' => $request['items'],
            'total_price' => $request['total_price'],
            'address' => $request['address'],
            'phone' => $request['phone'] ?? null,
        ]);

        return $this->respond(['message' => 'Order placed successfully!', 'order_id' => $orderId], 201);
    }

    private function sendEmail($order)
    {
        $emailConfig = config('Email');
        $email = \Config\Services::email();

        $email->setFrom($emailConfig->fromEmail, $emailConfig->fromName);
        $email->setTo($order['email']);
        $email->setSubject('Order Confirmation');

        // Format order items
        $orderItems = "";
        foreach ($order['items'] as $item => $quantity) {
            $orderItems .= strtoupper($item) . " x" . $quantity . "<br>";
        }

        $fullName = "{$order['first_name']} {$order['last_name']}";
        $message = "
            <p>Hi <strong>{$fullName}</strong>,</p>
            <p>Your <strong>{$order['order_type']}</strong> order has been placed successfully.</p>
            <h3>Order Details:</h3>
            <p>{$orderItems}</p>
            <h3>Total: ₱{$order['total_price']}</h3>";

        if ($order['order_type'] === "deliver") {
            $message .= "<p>📍 <strong>Delivery Address:</strong> {$order['address']}</p>
                         <p>📞 <strong>Contact Number:</strong> {$order['phone']}</p>";
        } else {
            $message .= "<p>📍 <strong>Pick-up Location:</strong> Tagoloan</p>";
        }

        $email->setMessage(nl2br($message));
        $email->setMailType($emailConfig->mailType ?? 'html');

        if (!$email->send()) {
            log_message('error', 'Email sending failed: ' . $email->printDebugger(['headers']));
        }
    }
}
