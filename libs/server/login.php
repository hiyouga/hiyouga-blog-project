<?php
error_reporting(0);
define('CLIENTID', '');
define('CLIENTSECRET', '');
$ch = curl_init();
$url = "https://github.com/login/oauth/access_token";
$headers = array('Accept: application/json');
$post = array(
	'client_id' => CLIENTID,
	'client_secret' => CLIENTSECRET,
	'code' => $_GET['code']
);
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_TIMEOUT_MS, 10000);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));
$result = curl_exec($ch);
$error = curl_errno($ch);
curl_close($ch);
if($error){
	echo false;
} else {
	echo $result;
}