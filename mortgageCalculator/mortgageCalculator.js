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

	/*/Fill the drop down list for start month
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
   
	//link the 'click' event on the button to the 'display' function
	$("#submitButton").on("click", function()
	{
		//Grab the loan amount from the textbox
		var loan = $("#loanPrincipalTB").val();
		
		//Grab the value for interest rate from the textbox
		var annualRate = $("#interestRateTB").val()

		//Grab the value for the loan period from the drop down list object
		var yearName = $("#termDropDownBT option:selected").text();
		var numberOfYears = parseInt($("#termDropDownBT option:selected").val());

		var start = $("#startMonthTB").val();
		var end = $("#endMonthTB").val();

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
	     $("#mortgageSummaryDiv").remove();
	     $("#amortizationScheduleOutputDiv").remove();
	});

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

		 	if(rowIndex >= 1 && rowIndex < low){
		 		$(this).hide();
		 	}
		 	if(rowIndex > high){
		 		$(this).hide();
		 	}

		 });
	}	
});

