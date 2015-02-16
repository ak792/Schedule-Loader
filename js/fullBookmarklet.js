
(function run(){
	$.getScript('https://apis.google.com/js/client.js?onload=scheduleLoaderLoadClient');
})();

function scheduleLoaderLoadClient(){

	var apiAdapter = {};
	apiAdapter.apiKey = "AIzaSyCeKGMtbJLsVrdJX9gJ3fs3_c6GEn_1Gdk";
	apiAdapter.clientId = "736158154921-0kh3ksre0i2s8banbektai9vkqo99oql.apps.googleusercontent.com";
	apiAdapter.scopes = "https://www.googleapis.com/auth/calendar";

	apiAdapter.printError = function(reason){
		console.log("Error: " + reason.result.error.message);
	}

	apiAdapter.addAllCourses = function(){
		scraper.scrape();
		for (var i = 0; i < scraper.courses.length; i++){
			apiAdapter.insertClassEvent(courseDataParser, scraper.courses[i]);
		}
	}

	apiAdapter.handleClientLoad = function(){
		this.gapi = gapi;
		this.gapi.client.setApiKey(this.apiKey);
		window.setTimeout(apiAdapter.checkAuth, 1);
	}

	apiAdapter.checkAuth = function(){
		apiAdapter.gapi.auth.authorize(
				{client_id: apiAdapter.clientId,
					scope: apiAdapter.scopes,
					immediate: false},
				apiAdapter.handleAuthResult);
	}

	apiAdapter.handleAuthResult = function(authResult){
		if (authResult && !authResult.error){
			apiAdapter.gapi.client.load('calendar', 'v3')
				.then(apiAdapter.addAllCourses, apiAdapter.printError);
		}
	}

	apiAdapter.insertClassEvent = function(courseDataParser, course){
		var calEvent;
		for (var i = 0; i < course.date_range.length; i++){
			calEvent = courseDataParser.createCalEvent(course, i);
			calEvent.calendarId = "primary";

			var requestInsertEvent = apiAdapter.gapi.client.calendar.events.insert(calEvent);
			requestInsertEvent.then(
				function(resp){
					console.log('successfully added');
				}, apiAdapter.printError);
		}
	}


	apiAdapter.handleClientLoad();



	var courseDataParser = {}


	courseDataParser.createCalEvent = function(course, row){
		var calEvent = {};

		calEvent.summary = course.courseName;
		calEvent.description = 
			"Professor: " + course.professor +
			"\nType: " + course.classType[row];
		calEvent.location = course.where[row];

		var dates = this.getDateRangeAsDates(course, row);
		var days = course.days[row].split("");

		var startEndFirstClass = this.getStartEndFirstClass(dates[0], days, course.time[row]);
		calEvent.start = { 
			dateTime : startEndFirstClass.start.toISOString(),
			timeZone : "America/New_York"
		};
		calEvent.end = {
			dateTime : startEndFirstClass.end.toISOString(),
			timeZone : "America/New_York"
		};
		
		var recurrence = this.buildRecurrence(dates[1], days);
		calEvent.recurrence = [recurrence];

		return calEvent;
	}

	courseDataParser.getDateRangeAsDates = function(course, row){
		var dates = [];
		dates = course.date_range[row].split(" - ")
			.map(function(item){
				return new Date(item);
			});
		dates[1].setHours(23);
		dates[1].setMinutes(59);
		dates[1].setSeconds(59);

		return dates;
	}


	courseDataParser.getStartEndFirstClass = function(date, days, time){
		var firstDate = this.getFirstDate(date, days);
		
		var times = time.split(" - ");
		var startTime = this.toTime(times[0]);
		var endTime = this.toTime(times[1]);

		var startDateTime = new Date(firstDate.getTime());
		startDateTime.setHours(startTime.hours);
		startDateTime.setMinutes(startTime.mins);

		var endDateTime = new Date(firstDate.getTime());
		endDateTime.setHours(endTime.hours);
		endDateTime.setMinutes(endTime.mins);

		return {
			"start" : startDateTime,
			"end" : endDateTime
		};
	}

	courseDataParser.getFirstDate = function(date, days){

		var currDate = new Date(date.getTime());
		console.log('here');
		var daysInNums = days.map(function(item){ return courseDataParser.daysMapping[item].num; });
		
		while (daysInNums.indexOf(currDate.getDay()) == -1 ){
			currDate.setDate(currDate.getDate() + 1);
		}
		return currDate;
	}

	courseDataParser.toTime = function(time_string){
		var date = new Date("2000-01-01 " + time_string);

		return { 
			hours : date.getHours(),
			mins :	date.getMinutes()
	 	};
	}

	courseDataParser.buildRecurrence = function(endDate, days){
		var recurrence = "RRULE:FREQ=WEEKLY;UNTIL="; 
		var recPattern = /[^a-zA-Z0-9]+/g;
		var str = endDate.toISOString().slice(0, -5) + endDate.toISOString().slice(-1);
		var daysToRepeat = days.map(function(item){ return courseDataParser.daysMapping[item].code; });
		var daysToRepeatStr = ";BYDAY=" +  daysToRepeat.reduce(function(prevStr, curr) { return prevStr + "," + curr; });


		var output = recurrence + str.replace(recPattern, "") + daysToRepeatStr;	

		return output;
	}

	courseDataParser.daysMapping = {
	   'S' : 
			{ num : 0,
			code : "SU"},
		'M' : 
			{ num : 1,
			code : "MO"},
		'T' : 
			{ num : 2,
			code : "TU"},
		'W' : 
			{ num : 3,
			code : "WE"},
		'R' : 
			{ num : 4,
			code : "TH"},
		'F' : 
			{ num : 5,
			code : "FR"},
		'S' : 
			{ num : 6,
			code : "SA"},
	};

	var scraper ={};
	scraper.courses = [];

	scraper.scrape = function(){
		var courses = [];
		$('.captiontext:even').each(function(){ 
			courses.push({"courseName" : $(this).html()}) 
		});

		$('.ddlabel:contains("Assigned Instructor")').next().children().each(function(ind) { 
			courses[ind].professor = $(this).attr('target'); 
		});

		$('.captiontext:odd').next().each(function(ind){
			var classProps = [];
			$(this).children().each(function(){
				var obj = [];
				$(this).children().each(function() { 
					obj.push($(this).text());
				});
				classProps.push(obj)
			});

			var course = courses[ind];
			for (var i = 0; i < classProps[0].length; i++){
				var currProp = classProps[0][i].toLowerCase().replace(" ", "_");
				if (currProp == "type")
						currProp = "classType";

				course[currProp] = [];
			}

			for (var i = 1; i < classProps.length; i++){
				for (var j = 0; j < classProps[i].length; j++){
					var currProp = classProps[0][j].toLowerCase().replace(" ", "_");
					if (currProp == "type")
						currProp = "classType";

					var currVal = classProps[i][j];
					course[currProp].push(currVal);
				}
			}
		});

		this.courses = courses;
	}
}


