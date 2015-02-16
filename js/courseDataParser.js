var courseDataParser = {}

//shorten
courseDataParser.createCalEvent = function(course, row){

	var calEvent = {};

	calEvent.summary = course.courseName;
	calEvent.description = 
		"Professor: " + course.professor +
		"\nType: " + course.classType[row];

	calEvent.location = course.where[row];

	
	var dates = [];
	dates = course.date_range[row].split(" - ")
		.map(function(item){
			return new Date(item);
		});
	dates[1].setHours(23);
	dates[1].setMinutes(59);
	dates[1].setSeconds(59);

	var days = [];
	days = course.days[row].split("");

	//get first day of class
	var startEndFirstClass = this.getStartEndFirstClass(dates[0], days, course.time[row]);
	calEvent.start = { 
		"dateTime" : startEndFirstClass.start.toISOString(),
		"timeZone" : "America/New_York"
	};
	calEvent.end = {
		"dateTime" : startEndFirstClass.end.toISOString(),
		"timeZone" : "America/New_York"
	};
	
	var recurrence = this.buildRecurrence(dates[1], days);
	calEvent.recurrence = [recurrence];

	return calEvent;
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

	var res = {
		"start" : startDateTime,
		"end" : endDateTime
	};

	return res;
}

courseDataParser.toTime = function(time_string){
	var date = new Date("2000-01-01 " + time_string);

	var res = 
	{ 
		"hours" : date.getHours(),
	 "mins" :	date.getMinutes()
 	};

	return res;
}

courseDataParser.getFirstDate = function(date, days){

	var currDate = new Date(date.getTime());
	var daysInNums = days.map(this.dayToNum);
	
	while (daysInNums.indexOf(currDate.getDay()) == -1 ){
		currDate.setDate(currDate.getDate() + 1);
	}
	return currDate;
}

//make into hashmaps
courseDataParser.dayToNum = function(day){
	var num;

	if (day == 'S'){
		num = 0;
	} else if (day == 'M'){
		num = 1;
	} else if (day == 'T'){
		num = 2;
	} else if (day == 'W'){
		num = 3;
	} else if (day == 'R'){
		num = 4;
	} else if (day == 'F'){
		num = 5;
	} else if (day == 'S'){
		num = 6;
	}

	return num;
}

courseDataParser.dayToTwoLetterCode = function(day){
	var code;

	if (day == 'S'){
		code = 'SU';
	} else if (day == 'M'){
		code = 'MO';
	} else if (day == 'T'){
		code = 'TU';
	} else if (day == 'W'){
		code = 'WE';
	} else if (day == 'R'){
		code = 'TH';
	} else if (day == 'F'){
		code = 'FR';
	} else if (day == 'S'){
		code = 'SA';
	}

	return code;
}

courseDataParser.buildRecurrence = function(endDate, days){
	var recurrence = "RRULE:FREQ=WEEKLY;UNTIL="; 
	var recPattern = /[^a-zA-Z0-9]+/g;
	var str = endDate.toISOString().slice(0, -5) + endDate.toISOString().slice(-1);
	var daysToRepeat = days.map(this.dayToTwoLetterCode);
	var daysToRepeatStr = ";BYDAY=" +  daysToRepeat.reduce(function(prevStr, curr) { return prevStr + "," + curr; });


	var output = recurrence + str.replace(recPattern, "") + daysToRepeatStr;	

	return output;
}

