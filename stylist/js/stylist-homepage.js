$(document).ready(function()
{
	//get a reference to our firebase using the unique url (using the root)
	var myFirebaseRef = new Firebase("https://dm-findmystylist.firebaseio.com/");

	//Check whether the database is empty or has a stylists list
	myFirebaseRef.once("value", function(snapshot) {

		if(snapshot.child("hairstylists").exists())
		{
			var hairstylistsRef =  myFirebaseRef.child("hairstylists");

			var emailaddress = $("#email")
		}
		
	});
});