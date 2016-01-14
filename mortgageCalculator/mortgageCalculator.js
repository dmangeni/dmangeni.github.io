$(document).ready(function())
{
	console.log("DOM loaded");

	createLoanInformationHeading();

	//get the buttons
	var submitButton = document.querySelector("#submitButton");
	var clearButton = document.querySelector("#clearButton");

	//link the 'click' event on the button to the 'clear' function
	clearButton.addEventListener("click", clear, false);
	    
	//link the 'click' event on the button to the 'display' function
	submitButton.addEventListener("click", display, false);


	function display(event)
	{
	     
	     //Global variables
	    var numberOfMonths,
	        annualRate,
	        monthlyPayment,
	        totalPaid,
	        paidToPrincipal,
	        totalInterest,
	        loan;

	    //Grab the value for the loan from the textbox
	    loan = document.querySelector("#loanPrincipalTB").value;


	    //Grab the value for interest rate from the textbox
	    annualRate = document.querySelector("#interestRateTB").value;


	    //Grab the value for the loan period from the drop down list object
	    var termDropDown = document.querySelector("#termDropDownBT");
	    var yearIndex = termDropDown.selectedIndex;
	    var yearName = termDropDown.options[yearIndex].text;
	    var numberOfYears = parseInt(termDropDown.options[yearIndex].value);


	    //Calculate summary table data
	    monthlyRate = annualRate / (12 * 100);
	    numberOfMonths = numberOfYears * 12;

	    //Get the monthly payment
	    var temp = 1 - (Math.pow((1 + monthlyRate),( -numberOfMonths)));
	    monthlyPayment = (monthlyRate / temp) * loan;


	    //Get the total principal paid and total interest
	    totalInterest = 0;
	    var totalPrincipalPaid = 0,
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
	    totalPaid = parseInt(totalInterest) + parseInt(loan);
	    paidToPrincipal = (totalPaid / loan);


	    //Create an array of arrays to hold the items of the list
	    var summaryTablelabels = [["Loan", loan], 
	                  ["Annual Rate", annualRate], 
	                  ["Monthly Payment", monthlyPayment.toFixed(2)],
	                  ["Total Paid" , totalPaid.toFixed(2)], 
	                  ["Total Interest" , totalInterest.toFixed(2)],
	                  ["Ratio: PaidToPrincipal", paidToPrincipal.toFixed(2)]];


	     //Create the Mortgage summary table only if it does not exist

	    var mysummaryTable = document.querySelector("#summaryTable");
	    var myamortizationTable = document.querySelector("#amortizationTable");

	    var retVal1 = document.getElementById("summaryTableOutputDiv").contains(mysummaryTable);
	    var retVal2 = document.getElementById("amortizationScheduleOutputDiv").contains(mysummaryTable);


	    if(retVal1 == false && retVal2 == false)
	    {
	        createMortgageSummaryHeading();
	        createAmortizationScheduleHeading();

	       $("#summaryTableOutputDiv").append(createSummaryTable(summaryTablelabels, 6, 2));
	       $("#amortizationScheduleOutputDiv").append(createamortizationTable(numberOfMonths,monthlyPayment,annualRate,loan)); 
	    }  
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
	function createMortgageSummaryHeading()
	{
	    var sheading = $("<h3/>").attr("id", "summaryHeading").addClass("subtitle").text("Mortgage Summary");
	    $("#summaryTableOutputDiv").append(sheading);
	}

	function createAmortizationScheduleHeading()
	{
	    var asheading = $("<h3/>").attr("id", "amortizationHeading").addClass("subtitle").text("Amortization Schedule");
	    $("#amortizationScheduleOutputDiv").append(asheading);
	}
	function createLoanInformationHeading()
	{
	    var loanheading = $("<h3/>").attr("id", "loanInformationHeading").addClass("subtitle").text("Loan Information");
	    $("#loanInformation").append(loanheading);
	}
	 //function to clear out the output div
	function clear(e) 
	{
	    //get the output div
	        var outputDiv1 = document.querySelector("#mortgageSummaryDiv");
	        var outputDiv2 = document.querySelector("#amortizationScheduleOutputDiv");
	        
	    //clear out the entire contents of the div
	     outputDiv1.innerHTML = "";
	     outputDiv2.innerHTML = "";

	}
});

