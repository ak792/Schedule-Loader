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

	if (isset($_GET['state'])){
		$callerUri = $_GET['state'];
	}
	else {
		echo "error: no caller URL";
		die();
	}



	$client = new Google_Client();
	$client->setClientId($clientId);
	$client->setClientSecret($clientSecret);
	$client->setRedirectUri($localhostRedirectUri);
	$client->setApprovalPrompt("force");
	$client->setAccessType("offline");
	$client->setLoginHint("ark73@georgetown.edu"); //DEV ONLY
	$client->setState(urlencode($callerUri));
	$client->addScope("https://www.googleapis.com/auth/calendar");

	$authUrl = $client->createAuthUrl();



	if (!isset($authCode)){
		header('Location: ' . $authUrl);
		die();
	}

	$accessTokenJson = $client->authenticate($authCode);
	$accessToken = json_decode($accessTokenJson);

	if ($accessToken){
//		echo "<br>retrieved access token<br>";
		$dbHandler = new SL_DBHandler();
		$dbHandler->setToken($accessToken);

		$data = array("authorization" => "success");
		header('Location: ' . $callerUri . "?" . http_build_query($data));
		die();
	}
	else {
		$data = array("authorization" => "failure");
		header('Location: ' . $callerUri . "?" . http_build_query($data));
		die();
	}
?>
