var classNames = [];
$('.captiontext:even').each(function(){ 
	classNames.push($(this).html()) 
});

var professors = [];
$('.ddlabel:contains("Assigned Instructor")').next().children().each(function() { 
	professors.push($(this).attr('target')); 
});

var propertyNames = [];
$('.captiontext:odd').next().children(":nth-child(1)").each(function() { 
	var obj = [];
	$(this).children().each(function() { 
		obj.push($(this).text());
	});
	propertyNames.push(obj);
});


//convert to getting all children except the first, not just the 2nd
//array
var properties = [];
$('.captiontext:odd').next().children(":nth-child(2)").each(function() { 
	var obj = [];
	$(this).children().each(function() { 
		obj.push($(this).text());
	});
	properties.push(obj);
});

//doesn't work for classes with multiple times
var classes = [];
for (var i = 0; i < classNames.length; i++){
	var currClass = {};
	currClass.courseName = classNames[i];
	currClass.professor = professors[i];
	for (var j = 0; j < propertyNames.length; j++){
		var currPropName = propertyNames[i][j].toLowerCase().replace(" ", "_");
		var currPropVal =  properties[i][j];

		if (currPropName == "type") {
			currClass.classType = currPropVal;
		} else {
			currClass[currPropName] = currPropVal;
		}
	}

	classes.push(currClass);
}
