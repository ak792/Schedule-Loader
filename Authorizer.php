<?php
require_once 'google-api-php-client/autoload.php';
require_once "credentials.php";
require_once "SL_DBHandler.php";

class Authorizer {

	private $client;

	public function authorize($redirectUri){
		$data = array("state" => $redirectUri);
		header('Location: ./oauth2.php?' . http_build_query($data));
		die();
	}

	public function __construct(){
		$this->buildClient();
	}

	public function buildClient(){
		$clientId = "736158154921-6f3soot9lodua2dqr00degdajh3qo8jc.apps.googleusercontent.com";
		$clientSecret = "DUql47f5Eys1QX_Ry3o2VoiE";
		$this->client = new Google_Client();

		$this->client->setClientId($clientId);
		$this->client->setClientSecret($clientSecret);
		$this->client->setRedirectUri('http://localhost/oauth2_pt2.php');
		$this->client->setApprovalPrompt("force");
		$this->client->setAccessType("offline");
		$this->client->setLoginHint("ark73@georgetown.edu"); //DEV ONLY
		$this->client->setState(urlencode($callerUri));
		$this->client->addScope("https://www.googleapis.com/auth/calendar");
	}

	public function getAuthCode(){
		$authUrl = $this->client->createAuthUrl();

		header('Location: ' . $authUrl);
		die();
	}

	public function getAccessToken($authCode){
		$accessTokenJson = $this->client->authenticate($authCode);
		$accessToken = json_decode($accessTokenJson);

		if (!$accessToken){
			return false;
		}

		$dbHandler = new SL_DBHandler();
		$dbHandler->setToken($accessToken);

		return true;
	}
}
 
	
?>
