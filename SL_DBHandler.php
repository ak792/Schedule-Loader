<?php

require_once 'DBHandler.php';

class SL_DBHandler extends DBHandler {

	private $accessTokenArr = array (
			"refresh_token" => null,
			"access_token" => null,
			"token_type" => null,
			"created" => null,
			"expires_in" => null,
			"id_token" => null);

	//in future, set id to the sha-1 of the rest
	//note: must already be a token in db
	public function setAccessToken($accessTokenObj){
		$tokenSetStmt = 
			"UPDATE $this->dbName.{$this->dbTables['access_token']}
			SET ";

		$this->accessTokenArr['refresh_token'] = SL_DBHandler::sanitizeString($accessTokenObj->refresh_token);
		$this->accessTokenArr['access_token'] = SL_DBHandler::sanitizeString($accessTokenObj->access_token);
		$this->accessTokenArr['token_type'] = SL_DBHandler::sanitizeString($accessTokenObj->token_type);
		$this->accessTokenArr['created'] = date("Y-m-d H:i:s", SL_DBHandler::sanitizeInt($accessTokenObj->created));
		$this->accessTokenArr['expires_in'] = SL_DBHandler::sanitizeInt($accessTokenObj->expires_in);


		//build SET portion of query
		$anyKeySet = false;
		foreach ($this->accessTokenArr as $key => $value){
			if (isset($this->accessTokenArr[$key])){
				$anyKeySet = true;
				$tokenSetStmt = $tokenSetStmt . "$key = '{$this->accessTokenArr[$key]}', "; 
			}
		}

		if (!$anyKeySet){
			return false;
		}

		//remove trailing comma
		$tokenSetStmt = substr($tokenSetStmt, 0, strlen($tokenSetStmt) - 2);

		echo $tokenSetStmt;

		$res = $this->executeQuery($tokenSetStmt);

		return $res;
	}


//	{"access_token":"TOKEN", "refresh_token":"TOKEN", "token_type":"Bearer",
  // *  "expires_in":3600, "id_token":"TOKEN", "created":1320790426}

	public function getAccessToken(){
		if ($this->accessToken != null){
			return json_encode($this->accessTokenArr);
		}

		$stmt = 
			"SELECT * 
			FROM access_token";

		if (!$res = $this->executeQuery($stmt)){
			return null;
		}

		if ($res->num_rows == 0){
			return null;
		}

		$row = $res->fetch_assoc();
		$this->accessToken = $row["access_token"];

		$this->accessTokenArr['refresh_token'] = $row['refresh_token'];
		$this->accessTokenArr['access_token'] = $row['access_token'];
		$this->accessTokenArr['token_type'] = $row['token_type'];
		$this->accessTokenArr['created'] = strtotime($row['created']);
		$this->accessTokenArr['expires_in'] = strtotime($row['expires_in']);
		$this->accessTokenArr['id_token'] = $row['id'];

		return json_encode($this->accessTokenArr);
	}
}


?>
