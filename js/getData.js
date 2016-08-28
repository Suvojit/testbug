$(document).ready(function(){
	var baseURL="https://knowmax3.ultimatix.net/relnsites/dowchem/dowchemdemo/";
	var results = [];
	var noNext = false;
	var dataJson= [];
	var genderJson= [];
	var allocationJson= [];
	var visaJson= [];
    var flag=-1;
	
    function drawChart(resultData) {
		console.log("ResultData");
		console.log(resultData);
		
		//Total Associates
		var totalAssociates = resultData.length;
		$(".totalAssociates").html(totalAssociates);
		
		// create genderJson for calculating the ratio of Male vs Female associates
		$.each(resultData, function (i, row) {
            if(genderJson.length == 0){
				genderPercent = (1/totalAssociates)*100;
                genderJson.push({"Gender": row.Gender,"count":1,"percent":genderPercent});				
            } else{
                $.each(genderJson,function(j,row2){
                    if(row.Gender == row2.Gender){
						flag=j;
						return false;
                    } 
                });
				
                if(flag==-1){
					genderPercent = (1/totalAssociates)*100;
					genderJson.push({"Gender": row.Gender,"count":1,"percent":genderPercent});
                } else{
					genderJson[flag].count = genderJson[flag].count + 1;
					genderJson[flag].percent = (genderJson[flag].count/totalAssociates)*100;
                }				
            }
            flag=-1;
        });
		
		var malePercent,femalePercent;
		//Calculate Ratio of Male vs Female Associates
		$.each(genderJson, function (i, row) {
			if(row.Gender == "Male"){
				malePercent = Math.round(row.percent);
			} else if(row.Gender == "Female"){
				femalePercent = Math.round(row.percent);
			}
		});
		
		var genderRatio = malePercent + ":" + femalePercent;
		
		$(".genderRatio").html(genderRatio);
		
		// create allocation status json for calculating percentage allocation
		$.each(resultData, function (i, row) {
            if(allocationJson.length == 0){
				allocationPercent = (1/totalAssociates)*100;
                allocationJson.push({"allocationStatus": row.Allocation_x0020_Status,"count":1,"percent":allocationPercent});				
            } else{
                $.each(allocationJson,function(j,row2){
                    if(row.Allocation_x0020_Status == row2.allocationStatus){
						flag=j;
						return false;
                    } 
                });
				
                if(flag==-1){
					allocationPercent = (1/totalAssociates)*100;
					allocationJson.push({"allocationStatus": row.Allocation_x0020_Status,"count":1,"percent":allocationPercent});	
                } else{
					allocationJson[flag].count = allocationJson[flag].count + 1;
					allocationJson[flag].percent = (allocationJson[flag].count/totalAssociates)*100;
                }				
            }
            flag=-1;
        });
		
		// get allocation percent from allocationJson 
		$.each(allocationJson, function (i, row) {
			if(row.allocationStatus == "Allocated"){
				allocationPercent = Math.round(row.percent);
			}
		});
		
		console.log("AllocationJson");
		console.log(allocationJson);
		
		$(".allocationPercent").html(allocationPercent + '<sup style="font-size: 20px">%</sup>');
		
		// create dataJson for designation wise report
		$.each(resultData, function (i, row) {
            if(dataJson.length == 0){
                dataJson.push({"designation": row.Designation,"count":1});
            } else{
                $.each(dataJson,function(j,row2){
                    if(row.Designation == row2.designation){
						flag=j;
						return false;
                    } 
                });
				
                if(flag==-1){
					dataJson.push({"designation": row.Designation,"count":1});
                } else{
					dataJson[flag].count = dataJson[flag].count + 1;
                }
            }
            flag=-1;
        });
		
		console.log("PieChartJson");		
		console.log(dataJson);		
		
		var data = new google.visualization.DataTable();

        data.addColumn('string', 'Designation');
        data.addColumn('number', 'No of Associates');
          
        $.each(dataJson, function (i, row3) {
		    data.addRow([
              row3.designation,
              parseInt(row3.count)
            ]);
        });
		  		  
        // Set chart options
        var options = {'title':'Designation wise Report',
                       'height':500,
					   'legend':'none',
					   'is3D': true,
					   'pieHole': 0.4,};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
		
		// create visaJson for getting counts of Visa Status
		$.each(resultData, function (i, row) {
            if(visaJson.length == 0){
				visaPercent = (1/totalAssociates)*100;
                visaJson.push({"visaStatus": row.Visa_x0020_Status,"count":1,"percent":visaPercent});				
            } else{
                $.each(visaJson,function(j,row2){
                    if(row.Visa_x0020_Status == row2.visaStatus){
						flag=j;
						return false;
                    } 
                });
				
                if(flag==-1){
					visaPercent = (1/totalAssociates)*100;
					visaJson.push({"visaStatus": row.Visa_x0020_Status,"count":1,"percent":visaPercent});
                } else{
					visaJson[flag].count = visaJson[flag].count + 1;
					visaJson[flag].percent = (visaJson[flag].count/totalAssociates)*100;
                }				
            }
            flag=-1;
        });
		
		console.log("VisaJson");
		console.log(visaJson);
		
		// Draw bar chart for Visa Allocation Status
		var data = new google.visualization.DataTable();

        data.addColumn('string', 'Visa Status');
        data.addColumn('number', 'No of Associates');
          
		$.each(visaJson, function (i, row3) {
			if(row3.visaStatus){
				data.addRow([
				  row3.visaStatus,
				  parseInt(row3.count)
				]);
			}else {
				data.addRow([
				  'Not Applied',
				  parseInt(row3.count)
				]);
			}
        });        
		  		  
        // Set chart options
        var options = {'title':'Visa Status Report',
                       'height':500,
					   'legend':'none',
					   'is3D': true,
					   'pieHole': 0.4,};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.charts.Bar(document.getElementById('chart_div_new'));
        chart.draw(data, options);
    }
	
	function GetItems(chartNo, baseURL, listTitle, queryList) {
    
        chartData= {"chartNo":chartNo};
		// construct sharepoint endpoint URL 
		if(queryList){
			url = baseURL + "_api/web/lists/getByTitle('" + listTitle + "')/items" + queryList;
		} else if(!queryList && listTitle){
			url = baseURL + "_api/web/lists/getByTitle('" + listTitle + "')/items";
		} else {
			url= baseURL;
		}
		console.log(url);
		//Asyncronous request
		$.ajax({
			url: url,
			type: "GET",
			headers: {
				"accept": "application/json;odata=verbose",
			},
			success: function (data) {
           		results = results.concat(data.d.results);
				// check to see if more pages are there or not
				if (data.d.__next) {
					nextURL = data.d.__next;
					GetItems(chartData.chartNo, nextURL);
				} else{
					noNext = true;
				}
				
				if(noNext){
                    // Load the Visualization API and the corechart package.
					if ((typeof google === 'undefined') || (typeof google.visualization === 'undefined')) {
					   google.charts.load('current', {'packages':['corechart','bar']});
					}				

					// Set a callback to run when the Google Visualization API is loaded.
					google.charts.setOnLoadCallback(function() {
                        if(chartData.chartNo == 1){
                            drawChart(results); 
                        }
                    });
				}
			},
			error: function (err) {
				console.log(JSON.stringify(err));				
			}
		});		
	}
	
	GetItems(1, baseURL,'Team%20Details','?$select=Designation,Gender,Allocation_x0020_Status,Visa_x0020_Status');
});
