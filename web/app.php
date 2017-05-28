<?php

use Symfony\Component\HttpFoundation\Request;

/** @var \Composer\Autoload\ClassLoader $loader */
$loader = require __DIR__.'/../app/autoload.php';
include_once __DIR__.'/../app/bootstrap.php.cache';

function dump($object){
    return;
}


$kernel = new AppKernel('prod', false);
$kernel->loadClassCache();
//$kernel = new AppCache($kernel);

/*
 * メンテナンスFlg
 * $service = false サービス停止中
 * $service = true  サービス稼働中
 */
$service = true;

/*
 * 停止中でも参照可能なクライアントIP
 *
 * 124.33.172.106 : _musen
 *
 */
$service_client = array('127.0.0.1','124.33.172.106','172.17.0.1');

if(!$service and in_array(@$_SERVER['REMOTE_ADDR'], $service_client)){
    $service = 1;
}

if (!$service){
    header('HTTP/1.0 403 Forbidden');
    include('maintenance.html');
    exit();
}
// When using the HttpCache, you need to call the method in your front controller instead of relying on the configuration parameter
//Request::enableHttpMethodParameterOverride();
$request = Request::createFromGlobals();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
