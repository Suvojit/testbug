$(document).ready(function(){
	var baseURL="https://knowmax3.ultimatix.net/relnsites/dowchem/dowchemdemo/";
	var results = [];
	var noNext = false;
    var dataJson= [];
    var flag=-1;

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
    function drawChart(resultData) {
		
		var data = new google.visualization.DataTable();

        data.addColumn('string', 'Designation');
        data.addColumn('number', 'Total Employees');
          
        // var resultData1 = [{"Designation":"IT"},{"Designation":"SE"},{"Designation":"IT"},{"Designation":"ASE"},{"Designation":"ASE"}];
        $.each(resultData, function (i, row) {
            if(dataJson.length == 0){
                dataJson.push({"designation": row.Designation,"count":1});
            } else{
                $.each(dataJson,function(j,row2){
                    if(row.Designation == row2.designation){
						flag=j;
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
		  
        $.each(dataJson, function (k, row3) {
		    data.addRow([
              row3.designation,
              parseInt(row3.count)
            ]);
        });
		  		  
        // Set chart options
        var options = {'title':'Designation',
                       'width':800,
                       'height':500,
					   'is3D': true,
					   'pieHole': 0.4,};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }
	
	function GetItems(baseURL, listTitle, queryList) {
		// construct sharepoint endpoint URL 
		if(queryList){
			url = baseURL + "_api/web/lists/getByTitle('" + listTitle + "')/items" + queryList;
		} else if(!queryList && listTitle){
			url = baseURL + "_api/web/lists/getByTitle('" + listTitle + "')/items";
		} else {
			url= baseURL;
		}
		
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
					GetItems(nextURL);
				} else{
					noNext = true;
				}
				
				if(noNext){
					// Load the Visualization API and the corechart package.
					google.charts.load('current', {'packages':['corechart']});

					// Set a callback to run when the Google Visualization API is loaded.
					google.charts.setOnLoadCallback(function() { drawChart(results); });
				}
			},
			error: function (err) {
				console.log(JSON.stringify(err));				
			}
		});		
	}
		
	GetItems(baseURL,'Team%20Details','?$select=ID,Designation');
	
	
});
