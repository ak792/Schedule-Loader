<?php

require_once 'google-api-php-client/autoload.php';
require_once "Credentials.php";
require_once "SL_DBHandler.php";


//Wrapper class for Google_Client
//Note: need to implement all functions used externally intended to act on a Google_Client

//TODO: BACKEND NOT SET UP FOR MORE THAN ONE PERSON
class Client{

	//need to remember to use the $google_client when interacting with Google API
	private $google_client;
	private $credentials;
	private $authorizer;

	private $redirectUri = "http://ec2-54-186-73-85.us-west-2.compute.amazonaws.com";
	private $devRedirectUri = "http://localhost/oauth2.php";

	public function __construct(){
		$this->buildClient();
	}

	public function getClient(){
		return $this->google_client;
	}

	public function buildClient(){
		$this->google_client = new Google_Client();
		$this->credentials = new Credentials();

		//only do this if have no auth code?
		$this->google_client->setClientId($this->credentials->getClientId());
		$this->google_client->setClientSecret($this->credentials->getClientSecret());
		$this->google_client->setRedirectUri($this->devRedirectUri);
		$this->google_client->setApprovalPrompt("force");
		$this->google_client->setAccessType("offline");
		$this->google_client->setLoginHint("ark73@georgetown.edu"); //DEV ONLY
		$this->google_client->setState(urlencode($callerUri));
		$this->google_client->addScope("https://www.googleapis.com/auth/calendar");

	}

	//sets access token for the client
	public function authorize(){
		//if we already have a valid token, use it
		//TODO: need to ensure it works for refresh tokens
		if ($this->getAccessTokenDB()){
			echo $this->google_client->getAccessToken();
			return true;
		}

		//if not, start the OAuth2 flow
		$this->getAuthCode();
	}

	public function getAccessTokenDB(){
		$dbHandler = new SL_DBHandler();
		$accessToken = $dbHandler->getAccessToken();
		$accessTokenArr = json_decode($accessToken);

		if ($accessTokenArr != null && $accessTokenArr->created != false){
			$this->google_client->setAccessToken($accessToken);
			return true;
		}

		return false;
	}

	public function getAuthCode(){
		$authUrl = $this->google_client->createAuthUrl();

		//redirects to ./oauth2.php, which will create another client
		//and call getAccessToken (part 2 of OAuth2)
		header('Location: ' . $authUrl);
		die();
	}

	public function getAccessToken($authCode){
		$accessTokenJson = $this->google_client->authenticate($authCode);
		
		$accessToken = json_decode($accessTokenJson);

		if (!$accessToken){
			return false;
		}

		$dbHandler = new SL_DBHandler();
		$dbHandler->setAccessToken($accessToken);

		return true;
	}


}


?>