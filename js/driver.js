//todo: 
//not working unless i provide a login hint?
//clean up the code
	//shorten functions
	//use this when possible
//bundle into a bookmarkelet


function run(){
	var btn = document.createElement("div");
	btn.id = "authorize-button";
	btn.textContent = "mybutton!";
	document.body.appendChild(btn);

	$.getScript("https://apis.google.com/js/client.js?onload=loadClient", function(){});
	console.log('loaded script');

	
}

// only add courses after gapi loads
function addAllCourses(){
	console.log('called back');
	scraper.scrape();
	for (var i = 0; i < scraper.courses.length; i++){
		apiAdapter.insertClassEvent(courseDataParser, scraper.courses[i]);
	}
}