<?php

require_once 'google-api-php-client/autoload.php';


class Calendar {

	private $service;
	private $calendarId = "georgetown.edu_bgsam1dpqtrvv4tgd644a4dcec@group.calendar.google.com";

	public function __construct($client){
		$this->createCalendar($client);
	}

	public function createCalendar($client){
		$this->service = new Google_Service_Calendar($client->getClient());
	}

	public function createEvent($summary = "Appointment", $location = "Somewhere", 
								$startTime = "2015-01-29T10:00:00.000-05:00", $endTime = "2015-01-29T11:00:00.000-05:00"){
		
		$event = new Google_Service_Calendar_Event();
		$event->setSummary($summary);
		$event->setLocation($location);

		$start = new Google_Service_Calendar_EventDateTime();
		$start->setDateTime($startTime);
		$event->setStart($start);

		$end = new Google_Service_Calendar_EventDateTime();
		$end->setDateTime($endTime);
		$event->setEnd($end);

		$createdEvent = $this->service->events->insert($this->calendarId, $event);
		return $createdEvent->getId();
	}

}

?>