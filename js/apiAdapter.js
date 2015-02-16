console.log("loaded");

function loadClient(){
	apiAdapter.handleClientLoad();
}


var apiAdapter = {};
apiAdapter.apiKey = "AIzaSyCeKGMtbJLsVrdJX9gJ3fs3_c6GEn_1Gdk";
apiAdapter.clientId = "736158154921-0kh3ksre0i2s8banbektai9vkqo99oql.apps.googleusercontent.com";
apiAdapter.scopes = "https://www.googleapis.com/auth/calendar";

apiAdapter.loaded = false;

//called when JS client library loads --> need to load this script beforehand
apiAdapter.handleClientLoad = function(){
	console.log("handling client load");
	console.log(this);
	this.gapi = gapi;
	this.gapi.client.setApiKey(this.apiKey);
	window.setTimeout(apiAdapter.checkAuth, 1);
}

//callback of handleClientLoad
apiAdapter.checkAuth = function(){
	console.log(apiAdapter.apiKey);
	console.log({client_id: apiAdapter.clientId,
				scope: apiAdapter.scopes,
				'login_hint' : 'ark73@georgetown.edu',
				immediate: true});
	apiAdapter.gapi.auth.authorize(
			{client_id: apiAdapter.clientId,
				scope: apiAdapter.scopes,
				'login_hint' : 'ark73@georgetown.edu',
				immediate: true},
			apiAdapter.handleAuthResult);

}

//callback of checkAuth
apiAdapter.handleAuthResult = function(authResult){
	var authorizeButton = document.getElementById('authorize-button');
	if (authResult && !authResult.error){
		authorizeButton.style.visibility = 'hidden';
		this.loaded = true;
		addAllCourses();
	} else {
		authorizeButton.style.visibility = '';
		authorizeButton.onclick = apiAdapter.handleAuthClick;
	}
}

//tied to the button by handleAuthResult
apiAdapter.handleAuthClick = function(event){
	apiAdapter.gapi.auth.authorize(
			{client_id: apiAdapter.clientId,
				scope: apiAdapter.scopes,
				'login_hint' : 'ark73@georgetown.edu',
				immediate: false},
			apiAdapter.handleAuthResult);

}

apiAdapter.insertClassEvent = function(courseDataParser, course){
	
	this.gapi.client.load('calendar', 'v3');
	console.log("adding the following to calendar:");
	console.log(course);

	var calEvent;
	for (var i = 0; i < course.date_range.length; i++){
		calEvent = courseDataParser.createCalEvent(course, i);
		calEvent.calendarId = "primary";

		var requestInsertEvent = this.gapi.client.calendar.events.insert(calEvent);
		requestInsertEvent.then(function(resp){
			console.log(JSON.stringify(resp));
		}, function (reason){
			console.log("Error: " + reason.result.error.message);
		});
	}

}

