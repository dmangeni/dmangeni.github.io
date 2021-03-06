$(document).ready(function()
{
	console.log("DOM loaded");

	createLoanInformationHeading();

	var numberOfMonths = (parseInt($("#termDropDownBT option:selected").val()))*12;
	var data = [];
	for(var i = 1; i <= numberOfMonths; i++)
	{
		data[i] = i;
	}

	//Check for empty fields in the loan and interest rate textbox
		$(".form-control").each(function(){
	 	
	 	$(this).keyup(function(){

			var is_number =$(this).val();
			if(is_number){$(this).removeClass("invalid").addClass("valid");}
			else{$(this).removeClass("valid").addClass("invalid");}
	 	});
	 	
	 	$(this).bind('paste', function(){

	 		var is_number =$(this).val();
			if(is_number){$(this).removeClass("invalid").addClass("valid");}
			else{$(this).removeClass("valid").addClass("invalid");}
	 	}); });

	 	//Check for empty fields in the lstart and end month textbox fields
		$(".monthLimits").each(function(){
	 	
	 	$(this).keyup(function(){

	 		var is_number =$(this).val();
			if(is_number){$(this).removeClass("invalid").addClass("valid");}
			else{$(this).removeClass("valid").addClass("invalid");}
	 	});
	 	
	 	$(this).bind('paste', function(){

	 		var is_number =$(this).val();
			if(is_number){$(this).removeClass("invalid").addClass("valid");}
			else{$(this).removeClass("valid").addClass("invalid");}
	 	}); });

		//Check for a valid interest rate
		$("#interestRateTB").keypress(function(event){ 
    		console.log("Key: " + event.which);
		});




	//'input[type="number"]'

	//Grab the loan amount from the textbox
	var loan = $("#loanPrincipalTB").val();
	
	//Grab the value for interest rate from the textbox
	var annualRate = $("#interestRateTB").val()

	//Grab the value for the loan period from the drop down list object
	var yearName = $("#termDropDownBT option:selected").text();
	var numberOfYears = parseInt($("#termDropDownBT option:selected").val());

	var start = $("#startMonthTB").val();
	var end = $("#endMonthTB").val();

	var errorMessage = $("#infotext").text(); //to display error message


	//link the 'click' event on the button to the 'display' function
	$("#submitButton").on("click", function()
	{
		var form_data=$("#contact").serializeArray();
		var error_free=true;
		for (var input in form_data)
		{
			var element=$("#contact_"+form_data[input]['name']);
			var valid=element.hasClass("valid");
			var error_element=$("span", element.parent());
			if (!valid){error_element.removeClass("error").addClass("error_show"); error_free=false;}
			else{error_element.removeClass("error_show").addClass("error");}
		}
		if (!error_free){
			event.preventDefault(); 
		}

		
		 //Calculate data
		monthlyRate = annualRate / (12 * 100);
		var numberOfMonths = numberOfYears * 12;
		var temp = 1 - (Math.pow((1 + monthlyRate),( -numberOfMonths)));
		var monthlyPayment = (monthlyRate / temp) * loan;

		//Get the total principal paid and total interest
	    var totalPrincipalPaid = 0,
	    	totalInterest = 0,
	        principalBalance = loan;

	    for(var i = 0; i < numberOfMonths; i++)
	    {
	        var interest = monthlyRate * principalBalance;
	        var paymentForPrincipal = monthlyPayment - interest;

	        totalInterest = totalInterest + interest;
	        totalPrincipalPaid = totalPrincipalPaid + paymentForPrincipal;
	        principalBalance = principalBalance - paymentForPrincipal;
	    }

	    //Ensure the results are to two decimal points
	    var totalPaid = parseInt(totalInterest) + parseInt(loan);
	    var paidToPrincipal = (totalPaid / loan);

	    //Create an array of arrays to hold the items of the list
	    var summaryTablelabels = [["Loan", loan], 
	                  ["Annual Rate", annualRate], 
	                  ["Monthly Payment", monthlyPayment.toFixed(2)],
	                  ["Total Paid" , totalPaid.toFixed(2)], 
	                  ["Total Interest" , totalInterest.toFixed(2)],
	                  ["Ratio: PaidToPrincipal", paidToPrincipal.toFixed(2)]];


		//Create the Mortgage summary table only if it does not exist
		var retVal1 = $("summaryTableOutputDiv").length;
		var retVal2 = $("amortizationScheduleOutputDiv").length;


	    if(retVal1 == 0 && retVal2 == 0)
	    {
	       createSummaryScheduleHeading();

	       $("#summaryTableOutputDiv").append(createSummaryTable(summaryTablelabels, 6, 2));
	       $("#amortizationScheduleOutputDiv").append(createamortizationTable(numberOfMonths,monthlyPayment,annualRate,loan)); 
	       hideTableRows(start, end);
	    } 
	});

	//link the 'click' event on the button to the 'clear' function
	$("#clearButton").on("click", function(){

		//clear the contents of the div.
	     $("#mortgageSummaryDiv").empty();
	     $("#amortizationScheduleOutputDiv").empty();
	});

	//declare name validation function
	function validateInput()
	{
		
		


		/*/validation for empty loan field
		if (loan == "") {
			$("#errorSpanL").addClass("error");
			$(this).css('display', 'inline');
			$(this).addClass("error");
			return false;
		} else {
			$(this).removeClass("error");
			$(this).text("*");
			$(this).removeClass("error");
		}

		//Check for empty interest rate field
		if (annualRate == "") {
			$("#errorSpanI").addClass("error");
			$(this).css('display', 'inline');
			$(this).addClass("error");
			return false;
		} else {
			$(this).removeClass("error");
			$(this).text("*");
			$(this).removeClass("error");
		}
		//*Check for valid interest rate
		if (annualRate < $(this).min || annualRate > $(this).max) {
			name.addClass("error");
			nameInfo.text("Names with more than 2 letters!");
			nameInfo.addClass("error");
			return false;
		}
		//if it's valid
		else {
		name.removeClass("error");
		nameInfo.text("*");
		nameInfo.removeClass("error");
		}
		// validation only for characters no numbers
		var filter = /^[a-zA-Z]*$/;
		if (filter.test(name.val())) {
		name.removeClass("error");
		nameInfo.text("*");
		nameInfo.removeClass("error");
		return true;
		}
		else {
		name.addClass("error");
		nameInfo.text("Names cannot have numbers!");
		nameInfo.addClass("error");
		return false;
		}*/
	}

	//Create a summary table
	function createSummaryTable(data, rows, cols)
	{
	    
	    var mortgageSummaryTable = $("<table/>").attr("id","summaryTable").addClass("table table-hover");
	    
	    for(var r = 0; r < rows; r++)
	    {
	        var row = $("<tr/>").attr("id", "summaryTableRow" + r).addClass('summaryTableRow');

	        for(var c = 0; c < cols; c++)
	        {
	            var outputString = data[r][c];

	            var subrow = $("<td/>").attr("id", "summaryTableColumn" + c).addClass("summaryTableColumn").text(outputString);

	            row.append(subrow);     
	        }

	        mortgageSummaryTable.append(row);
	        
	    }
	    return mortgageSummaryTable;
	}

	//Create a summary table
	function createamortizationTable(numberOfMonths,monthlyPayment,annualRate,loan)
	{
	    var amortizationScheduleTable = $("<table/>").attr("id","amortizationTable").addClass("table table-hover");

	    //Initialize the number of cols and rows
	    var rows = numberOfMonths;
	    var cols = 5;

	    //Create the two arrays
	    var amortizationTableLabels = ["Month", "Monthly Payment", "Principal Paid", "Monthly Interest", "principal Balance"];
	    var amortizationTableData =[];
	    
	    var principalBalance = loan;
	    var monthlyRate = annualRate / (12 * 100);

	    for(var r = 0; r <= rows; r++)
	    {
	        
	        //Calculate the data for the table after the header row has been created
	        if(r > 0)
	        {
	            var interest = monthlyRate * principalBalance;
	            var paymentForPrincipal = monthlyPayment - interest;
	            principalBalance = principalBalance - paymentForPrincipal;

	            amortizationTableData[0] = r;
	            amortizationTableData[1] = monthlyPayment.toFixed(2);
	            amortizationTableData[2] = paymentForPrincipal.toFixed(2);
	            amortizationTableData[3] = interest.toFixed(2);
	            amortizationTableData[4] = principalBalance.toFixed(2);
	        }

	        var row = $("<tr/>").attr("id", "amortizationTableRow" + r).addClass("amortizationTable");

	        for(var c = 0; c < cols; c++)
	        {
	            var outputString = "null";
	            //Create the header row
	            if(r == 0)
	            {
	                outputString = amortizationTableLabels[c];
	                var headerRow = $("<th/>").attr("id", "amortizationTableHeadingColumn" + c).addClass("amortizationTableHeadingColumn").text(outputString);
	                row.append(headerRow);
	            }
	            else
	            {
	               outputString = amortizationTableData[c];
	               var subrow = $("<td/>").attr("id", "amortizationTableColumn" + c).addClass("amortizationTableColumn").text(outputString);
	               row.append(subrow);   
	            }   
	        }

	        amortizationScheduleTable.append(row);
	        
	    }
	    return amortizationScheduleTable;
	}
	function createSummaryScheduleHeading()
	{
	    var sheading = $("<h3/>").attr("id", "summaryHeading").addClass("subtitle").text("Mortgage Summary");
	    $("#summaryTableOutputDiv").append(sheading);

	    var asheading = $("<h3/>").attr("id", "amortizationHeading").addClass("subtitle").text("Amortization Schedule");
	    $("#amortizationScheduleOutputDiv").append(asheading);

	}
	function createLoanInformationHeading()
	{
	    var loanheading = $("<h3/>").attr("id", "loanInformationHeading").addClass("subtitle").text("Loan Information");
	    $("#loanInformation").append(loanheading);
	}

	function hideTableRows(low,high)
	{
		 $("#amortizationTable tr").each(function(rowIndex, value){
		 	console.log("index:" + rowIndex);

		 	if(rowIndex >= 1 && rowIndex < low){
		 		$(this).hide();
		 	}
		 	if(rowIndex > high){
		 		$(this).hide();
		 	}

		 });
	}	
});


/*/Fill the drop down list for start month //This
//should be outside the submit button
	$("#startDropDownBT").on("click", function()
		{
			var listItems = [];
			$.each(data, function(index){
	    		listItems.push($('<li/>').text(index + 1));
	    	});

	    	//$(".monthList").append("<li>" + $(this).text(i) + "</li>");
			$("#startList").append(listItems);

	});

	//Fill the List for the end month
	$("#endDropDownBT").on("click",function()
		{
			var listItems = [];
			$.each(data, function(index){
	    		listItems.push($('<li/>').text(index + 1));
	    	});

	    	//$(".monthList").append("<li>" + $(this).text(i) + "</li>");
			$("#endList").append(listItems);

	}); */