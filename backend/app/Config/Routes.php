<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->options('place-order', function() {
    return $this->response->setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
                          ->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
                          ->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
                          ->setStatusCode(200);
});

// CORS for updateName route
$routes->options('updateName', function() {
    return $this->response->setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
                          ->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
                          ->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
                          ->setStatusCode(200);
});


//cors enable
$routes->options('(:any)', function() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    exit(0);
});


//Auth routes
$routes->post('signup', 'Auth::signup');
$routes->post('verify-email', 'Auth::verifyEmail');
$routes->post('updatePasswordDirectly', 'Auth::updatePasswordDirectly');
$routes->post('/skipLogin', 'Auth::skipLogin');
$routes->post('verify-reset-code', 'Auth::verifyResetCode');
$routes->post('verify-password', 'Auth::verifyPassword');
$routes->post('login', 'Auth::login');
$routes->post('send-reset-code', 'Auth::sendResetCode');
$routes->post('reset-password', 'Auth::resetPassword');
$routes->post('search-account', 'Auth::searchAccount');
$routes->post('updateName', 'Auth::updateName');


//Order routes
$routes->post('place-order', 'PlaceOrderController::store');
