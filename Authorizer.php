<?php
require_once 'google-api-php-client/autoload.php';
require_once "credentials.php";
require_once "SL_DBHandler.php";

class Authorizer {

	public function __construct(){
	//	$this->setupMySQLConnection();
	}

	public function __destruct(){
	//	$this->teardownMySQLConnection();
	}

	public function authorize($authCode){
		//redirect out of oauth2 page after finish

		$client = new Google_Client();
		$client->setClientId($clientId);
		$client->setClientSecret($clientSecret);
		$client->setRedirectUri($localhostRedirectUri);
		$client->setApprovalPrompt("force");
		$client->setAccessType("offline");
		$client->setLoginHint("ark73@georgetown.edu"); //for development only
		$client->addScope("https://www.googleapis.com/auth/calendar");

		$authUrl = $client->createAuthUrl();

		if ($authCode == null){
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
	}

}
 
	require_once "footer.php";
?>
