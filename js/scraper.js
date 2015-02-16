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

