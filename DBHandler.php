<?php

class DBHandler {

	protected $conn = null;
	protected $dbName = null; 
	protected $dbTables = array(
		"access_token" => "access_token"
	);

	public function __construct(){
		$this->setupMySQLConnection();
	}

	public function __destruct(){
		$this->teardownMySQLConnection();
	}

	public function setupMySQLConnection(){

		//refactor this business out
		$hostname = "localhost";
		$username = "root";
		$password = "root";
		$dbName = "schedule_loader";

		$this->dbName = $dbName;

		//if was already set up, just return
		if ($this->conn instanceof MySQLi){
			return;
		}
		
		//build connection
		$this->conn = new mysqli($hostname, $username, $password, $this->dbName);
		if ($this->conn->connect_error) {
				die("Connection failed: " . $this->conn->connect_error);
		} 
	}
	
	public function teardownMySQLConnection(){
		//only close the connection if it exists
		if ($this->conn instanceof MySQLi){
			$this->conn->close();
		}
	}

	public function getDBName(){
		return $this->dbName;
	}

	public function getDBTables(){
		return $this->dbTables;
	}	

	public function executeQuery($query){
		if (!$res = $this->conn->query($query)){
			echo "<br>Error: " . $query . "<br>" . $this->conn->error;
			return;
		}

		return $res;
	}

	public static function sanitizeString($strRaw){
		$strTrimmed = trim($strRaw);
		$strFiltered = filter_var($strTrimmed, FILTER_SANITIZE_STRING);
		$strTrunc = substr($strFiltered, 0, 255);
		$strSanitized = $strTrunc;

		return $strSanitized;
	}

	public static function sanitizeInt($intRaw){
		$intSanitized = filter_var($intRaw, FILTER_SANITIZE_NUMBER_INT);
		return $intSanitized;
	}

}

?>
