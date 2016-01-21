$(document).ready(function()
{
	//get a reference to our firebase using the unique url (using the root)
	var myFirebaseRef = new Firebase("https://dm-findmystylist.firebaseio.com/");

	var clientsRef;


	//Check whether the database is empty or has a stylists list
	myFirebaseRef.once("value", function(snapshot) {

		if(!snapshot.child("clients").exists())
		{
			var clients = {};
			myFirebaseRef.child("clients").set(clients);	
		}
		clientsRef =  myFirebaseRef.child("clients");
	});

	//Set up a handler to add a new stylist to the database
	$("#submitButton").on("click", function(){
		
		var firstName = $("#first_name").val();
		var lastName = $("#last_name").val();
		var emailaddress = $("#email").val();
		var cellphone = $("#contactinfo").val();
		var password = $("#password").val();
		var city_name = $("#city_name").val();
		var language = $("#languageDD option:selected").text();

		clientsRef.push({
			
			"firstName":firstName, 
			"lastName":lastName,
			"email":emailaddress,
			"mobilePhone":cellphone,
			"password": password,
			"city": city_name,
			"language":language
		});

		//Clear the textboxes to get ready for the next stylist
		$("#first_name").val("");
		$("#last_name").val("");
		$("#email").val("");
		$("#contactinfo").val("");
		$("#password").val("");
		$("#password").val("");
		$("#city_name").val("");
	});	

});

//TO DOLIST-Data validation