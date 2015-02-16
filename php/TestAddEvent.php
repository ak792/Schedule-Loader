<?php

require_once "Calendar.php";
require_once "Client.php";


	//doubles as sample auth flow
	//to use, just create a client and call authorize
	$client = new Client();
	$client->authorize();

	$calendar = new Calendar($client);
	$calendar->createEvent();


?>