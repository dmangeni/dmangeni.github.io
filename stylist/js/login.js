$(document).ready(function()
	{
	
		var emailaddress = $("#email").text();
		var password = $("#password").text();


		$("#submitButton").on("click", function(){
			
			//Client side email address validation
			if ($.trim(emailaddress).length == 0){

		        $("#emailerror").innerHTML = "Please enter a valid email address.";
		        e.preventDefault();
        	}
        	if (!validateEmail(sEmail)){

		    	$("#emailerror").text("Invalid email address");
		      	e.preventDefault();
       		}

       		if(password == ""){
       			$("#passworderror").text("Password is required.");
       		}
       		else if(password.length < 5){
       			$("#passworderror").text("Password must be at least five characters.");
       		}

		});

		//get a reference to our firebase using the unique url (using the root)
		var myFirebaseRef = new Firebase("https://dm-findmystylist.firebaseio.com/");

		//Check whether the database is empty or has a stylists list
		myFirebaseRef.child("hairstylists").once("value", function(snapshot {

			if(snapshot.child().exists())
			{
				snapshot.forEach(function(childSnapshot){
                        
                    //pull the stylists object out of the snapshot
                    var stylists = childSnapshot.val();
                        
                    //print the guest info
                    console.log("Name: " + guest.name.firstName + " " +  guest.name.middleName + " " + guest.name.lastName);                        

                });
			}
			
		});	

		function validateEmail(emailaddress)
		{
	    	var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

	    	if (filter.test(emailaddress))
				return true;
			else
				return false;
		}
	    	

   
	});	

