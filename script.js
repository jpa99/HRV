






function makeURL(URL, params){
  return URL + "?" + Object
        .keys(params)
        .map(function(key){
          return key+"="+encodeURIComponent(params[key])
        })
        .join("&")
}

function getNeeds(lat, lon){
  var testrequest = new XMLHttpRequest();
  var requestURL = makeURL("https://api.harveyneeds.org/api/v1/needs", 
                          {"lat": lat, "lon" : lon});
  testrequest.open("GET", requestURL, true);
  testrequest.responseType = "json";
  testrequest.onreadystatechange = function() {
      if (testrequest.readyState == 4) {
          var needs = testrequest.response.needs;
          fs.writeFile("./needs.json", JSON.stringify(needs));
          console.log(needs);
          var coordinates = needs.map(function(point){return [point.latitude, point.longitude]});
          console.log(coordinates);
      }
  };
  testrequest.send();
}

function getShelters(lat, lon){
  var testrequest = new XMLHttpRequest();
  var requestURL = makeURL("https://api.harveyneeds.org/api/v1/shelters", 
                          {"lat": lat, "lon" : lon});
  testrequest.open("GET", requestURL, true);
  testrequest.responseType = "json";
  testrequest.onreadystatechange = function() {
      if (testrequest.readyState == 4) {
          var shelters = testrequest.response.shelters;
          fs.writeFile("./shelters.json", JSON.stringify(shelters));
          console.log(shelters);
          var coordinates = shelters.map(function(point){return [point.latitude, point.longitude]});
          console.log(coordinates);
          
          
      }
  };
  testrequest.send();
}


//getNeeds(29.739340, -95.360920);
//getShelters(29.739340, -95.360920);


function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    console.log(array);

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','
            
            var linevalue = array[i][index]
            
            if (typeof linevalue == "string"){
              linevalue = linevalue.replace(/(\r\n|\n|\r)/gm,"");
            } else if (linevalue instanceof Array){
              for (var x in linevalue){
                console.log(x)
                x.replace(/(\r\n|\n|\r)/gm,"");
              }
            }
            line += linevalue;
        }

        str += line + '\r\n';
    }
    console.log(str)
    return str;
}

function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
        items.unshift(headers);
    }

    // Convert Object to JSON


    var csv = this.convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}







function unpack(rows, key) {
  return rows.map(function(row) 
    { return row[key]; });
}

function RunPlotly(){

var trace1 = {
  x: unpack(rows, vari),  
  y: unpack(rows, vari), 
  z: unpack(rows, vari), 
  hovertext: unpack(rows, vari),
  marker: {
    size: 2,
    color:unpack(rows, vari),
    colorscale:col,
    showscale: true,
    
    colorbar: {
      outlinewidth:0,
      thickness:5,
      len:0.75
    },
    opacity: 0.0
  },
  line: {
    color:unpack(rows, vari),
    colorscale:col,
    showscale: true,
    colorbar: {
      outlinewidth:0,
      thickness:5,
      len:0.75
    },
    opacity: 0.0
  },
  
  
  type: 'scatter3d'
};

  
var data = [trace1]
var layout = {};

Plotly.newPlot('plotDiv', data, layout);
}





function RunPlotlyLine() {
    
    var lineTrace = {
        y:unpack(rows,'fps1'),
        x:Array.from(Array(rows.length).keys()),
        hovertext: unpack(rows, 'zone1'),
        type: 'scatter'
    };
    
    var dataTrace = [lineTrace];
    
  Plotly.newPlot('plotDiv', dataTrace);
}

