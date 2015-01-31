<?php

require_once 'DBHandler.php';

class SL_DBHandler extends DBHandler {

	//in future, also take the id?
	public function setToken($accessTokenObj){

		$accessTokenArr = array (
			"refresh_token" => null,
			"access_token" => null,
			"token_type" => null,
			"created" => null,
			"expires_in" => null);

		$tokenSetStmt = 
			"UPDATE $this->dbName.{$this->dbTables['access_token']}
			SET ";

		$accessTokenArr['refresh_token'] = SL_DBHandler::sanitizeString($accessTokenObj->refresh_token);
		$accessTokenArr['access_token'] = SL_DBHandler::sanitizeString($accessTokenObj->access_token);
		$accessTokenArr['token_type'] = SL_DBHandler::sanitizeString($accessTokenObj->token_type);
		$accessTokenArr['created'] = date("Y-m-d H:i:s", SL_DBHandler::sanitizeInt($accessTokenObj->created));
		$accessTokenArr['expires_in'] = SL_DBHandler::sanitizeInt($accessTokenObj->expires_in);

		//build SET portion of query
		$anyKeySet = false;
		foreach ($accessTokenArr as $key => $value){
			if (isset($accessTokenArr[$key])){
				$anyKeySet = true;
				$tokenSetStmt = $tokenSetStmt . "$key = '$accessTokenArr[$key]', "; 
			}
		}

		if (!$anyKeySet){
			return false;
		}

		//remove trailing comma
		$tokenSetStmt	 = substr($tokenSetStmt, 0, strlen($tokenSetStmt) - 2);

		$this->executeQuery($tokenSetStmt);

		// echo "<br>executed set token query<br>";
	}
}


?>
