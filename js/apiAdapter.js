function loadClient(){
	apiAdapter.handleClientLoad();
}

var apiAdapter = {};
apiAdapter.apiKey = "AIzaSyCeKGMtbJLsVrdJX9gJ3fs3_c6GEn_1Gdk";
apiAdapter.clientId = "736158154921-0kh3ksre0i2s8banbektai9vkqo99oql.apps.googleusercontent.com";
apiAdapter.scopes = "https://www.googleapis.com/auth/calendar";

apiAdapter.printError = function(reason){
	console.log("Error: " + reason.result.error.message);
}

// only add courses after gapi loads
apiAdapter.addAllCourses = function(){
	scraper.scrape();
	apiAdapter.insertCalendar();
	for (var i = 0; i < scraper.courses.length; i++){
		apiAdapter.insertClassEvent(courseDataParser, scraper.courses[i]);
	}
}

//called when JS client library loads --> need to load this script beforehand
apiAdapter.handleClientLoad = function(){
	this.gapi = gapi;
	this.gapi.client.setApiKey(this.apiKey);
	window.setTimeout(apiAdapter.checkAuth, 1);
}

//callback of handleClientLoad
apiAdapter.checkAuth = function(){
	apiAdapter.gapi.auth.authorize(
			{client_id: apiAdapter.clientId,
				scope: apiAdapter.scopes,
				immediate: false},
			apiAdapter.handleAuthResult);
}

//callback of checkAuth
apiAdapter.handleAuthResult = function(authResult){
	if (authResult && !authResult.error){
		//if authResult is valid, load the api then addAllCourses
		apiAdapter.gapi.client.load('calendar', 'v3')
			.then(apiAdapter.addAllCourses, apiAdapter.printError);
	}
}

apiAdapter.insertCalendar = function(){
	apiAdapter.gapi.client.calendar.calendars.insert({
		summary: "Class Schedule",
		timeZone: "America/New_York",
		desription: "Auto-generated class schedule from Schedule Loader"
	}).then(
		function(resp){
			apiAdapter.calendarId = resp.id;
		},
		apiAdapter.printError);
}

apiAdapter.insertClassEvent = function(courseDataParser, course){
	var calEvent;
	for (var i = 0; i < course.date_range.length; i++){
		calEvent = courseDataParser.createCalEvent(course, i);

		// calEvent.calendarId = "primary";
		calEvent.calendarId = apiAdapter.calendarId;

		var requestInsertEvent = apiAdapter.gapi.client.calendar.events.insert(calEvent);
		requestInsertEvent.then(
			function(resp){
				console.log('successfully added');
				//console.log(JSON.stringify(resp));
			}, apiAdapter.printError);
	}
}



