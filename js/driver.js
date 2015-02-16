//todo: 
//bundle into a bookmarkelet
(function run(){
	$.getScript("https://apis.google.com/js/client.js?onload=loadClient", function(){});
})();

// only add courses after gapi loads
function addAllCourses(){
	scraper.scrape();
	for (var i = 0; i < scraper.courses.length; i++){
		apiAdapter.insertClassEvent(courseDataParser, scraper.courses[i]);
	}
}