<?php
require_once 'google-api-php-client/autoload.php';
require_once "credentials.php";
require_once "SL_DBHandler.php";

	if (isset($_GET['code'])){
		$authCode = $_GET['code'];
	}
	else if (isset($_GET['error'])){
		echo "error: " . $_GET['error'];
		die();
	}
//redirect to oauth2callback.php with no params if not part of flow (check sent data?)

	$client = new Google_Client();
	$client->setClientId($clientId);
	$client->setClientSecret($clientSecret);
	$client->setRedirectUri($localhostRedirectUri);
	$client->setApprovalPrompt("force");
	$client->setAccessType("offline");
	$client->setLoginHint();
	$client->addScope("https://www.googleapis.com/auth/calendar");

	$authUrl = $client->createAuthUrl();

	if (!isset($authCode)){
		header('Location: ' . $authUrl);
		die();
	}

	$accessTokenJson = $client->authenticate($authCode);
	$accessToken = json_decode($accessTokenJson);

	require_once "header.php";

	if ($accessToken){
		echo "<br>retrieved access token<br>";
	}
	
	$dbHandler = new SL_DBHandler();
	$dbHandler->setToken($accessToken);
 
	require_once "footer.php";
?>
