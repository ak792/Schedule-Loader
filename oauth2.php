<?php
// require_once 'google-api-php-client/autoload.php';
require_once 'credentials.php';
require_once 'Authorizer.php';

if (isset($_GET['code'])){
	$authCode = $_GET['code'];
}
else if (isset($_GET['error'])){
	echo "error: " . $_GET['error'];
	die();
}

$authorizer = new Authorizer();
$authorizer->authorize($authCode);

header("Location " . $indexUri);
die()
?>