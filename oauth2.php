<?php
	require_once 'Client.php';
	require_once 'SL_DBHandler.php';

	$client = new Client();

	if (isset($_GET['code'])){
		$authCode = $_GET['code'];
	    $client->getAccessToken($authCode);


	   // $dbHandler = new SL_DBHandler();
	  //  echo $dbHandler->getAccessToken();
	}
	else if (isset($_GET['error'])){
		echo "error: " . $_GET['error'];
		die();
	}
	else {
		$client->getAuthCode();
	}

?>