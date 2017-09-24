//var AYLIENTextAPI = require('aylien_textapi');
var textapi = new AYLIENTextAPI({
  application_id: "e3f22c31",
  application_key: "96e77289aebcee16003e475f2667a8b7"
});
var map;
var pos;
var heatmap;
var houston = { lat: 29.7604, lng: -95.3698 };
var nonhouston = { lat: -30, lng: -100 };
var zm = 10;
var markers = true;
var map_toggles;
var markerslist = [];
var numel = 0;
var rendercount = 0;
var needs_analysis
var infowindow;
var info_screen = document.getElementById('infoModal');


function makeURL(URL, params) {
    return URL + "?" + Object
        .keys(params)
        .map(function(key) {
            return key + "=" + encodeURIComponent(params[key])
        })
        .join("&")
}



function manageMap(params, coords, types){
    if (types.length > 0){
        if (types[0] == "needs_toggle"){
            types.shift();
            getNeeds(params, coords, types);
        } else if (types[0] == "shelters_toggle"){
            types.shift();
            getShelters(params, coords, types);
        } else {
            types.shift();
        }
    } else {
        handleMagnitudes(coords, []);
    }
}

function openInfo(){
    info_screen.style.display = "block";
}

function closeInfo(){
    info_screen.style.display = "none";
}

function updateOverlay(){
    var overlay = document.getElementById("name");
    overlay.hidden = !document.getElementById("overlay_toggle").checked;
}

function updateMaps(){
    markers = document.getElementById("markers_toggle").checked;
    
    map_toggles = [document.getElementById("needs_toggle"), document.getElementById("shelters_toggle")];
    var active_maps = [];
    for (var i = 0; i < map_toggles.length; i++){
        if (map_toggles[i].checked){
            active_maps.push(map_toggles[i].id);
        }
    }
    
    
    clearmap();
    manageMap(pos, [], active_maps);
}



function getNeeds(params, coords, types) {
    var testrequest = new XMLHttpRequest();
    var requestURL = makeURL("https://api.harveyneeds.org/api/v1/needs", { "lat": params.lat, "lon": params.lng });
    testrequest.open("GET", requestURL, true);
    testrequest.responseType = "json";
    testrequest.onreadystatechange = function() {
        if (testrequest.readyState == 4) {
            var needs = testrequest.response.needs;
            needs = needs.map(function(point){
                point["color"] = 'red-dot.png';
                return point;
            });
            //var coordinates = needs.map(function(point) { return [point.latitude, point.longitude, 'red-dot.png'] });
            coords = coords.concat(needs);
            manageMap(params, coords, types);
        }
    };
    testrequest.send();
}

function getShelters(params, coords, types) {
    var testrequest = new XMLHttpRequest();
    var requestURL = makeURL("https://api.harveyneeds.org/api/v1/shelters", { "lat": params.lat, "lon": params.lng });
    testrequest.open("GET", requestURL, true);
    testrequest.responseType = "json";
    testrequest.onreadystatechange = function() {
        if (testrequest.readyState == 4) {
            var shelters = testrequest.response.shelters;
            shelters = shelters.map(function(point){
                point['color'] = 'blue-dot.png';
                return point;
            });
            //var coordinates = shelters.map(function(point) { return [point.latitude, point.longitude, 'blue-dot.png', point.id, point.counts, point.shelter, point.address, point.city, point.pets, point.phone, point.accepting, point.updated_by, point.notes, point.volunteer_needs, point.supply_needs] });
            coords = coords.concat(shelters);
            manageMap(params, coords, types);
        }
    };
    testrequest.send();
}



function initMap() {
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: zm,
        center: houston,
        mapTypeId: 'terrain'
    });
        
    infowindow = new google.maps.InfoWindow;

    navigator.geolocation.getCurrentPosition(function(position) {
        pos = { lat: position.coords.latitude, lng: position.coords.longitude };

        infowindow.setPosition(pos);
        infowindow.setContent('Location found.');
        
        infowindow.open(map);
        map.setCenter(pos);
        
        map_toggles = [document.getElementById("needs_toggle"), document.getElementById("shelters_toggle")];
        manageMap(pos,[],["needs_toggle", "shelters_toggle"]);
    });
    var myControl = document.getElementById('name');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(myControl);
    setTimeout(function(){
        updateMaps();
    }, 30000);
}

function heatmapVis(locations) {
    
    var heatmapData = [];
    var marker;
    
    markerslist = [];
    for (var i = 0; i < locations.length; i++) {
        var latLng = new google.maps.LatLng(locations[i]['latitude'], locations[i]['longitude'])
        var color = locations[i]['color'];
        var name = locations[i]['shelter'] || locations[i]['location_name'];
        console.log(locations[i]['magnitude']);
        heatmapData.push({location: latLng, weight:locations[i].magnitude});
        if(markers){
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                //animation: google.maps.Animation.DROP,
                icon: color,
                content: name
            });
            
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    map.setCenter(marker.getPosition());
                    infowindow.setContent(this.content);
                    infowindow.open(map, this);
                    
                    setOverlay(this.content, locations[i]);
                };
            })(marker, i));
            
            google.maps.event.addListener(marker, 'rightclick', (function(marker) {
                return function() {
                    /*displaymarker();*/
                    if(map.getZoom() < 12){
                        map.setZoom(12);
                    }
                    
                    map.setCenter(marker.getPosition());
                    infowindow.setContent(this.content);
                    infowindow.open(map, this);
                    
                    setOverlay(name, locations[i]);
                };
            })(marker));

            markerslist.push(marker);
        }
        
    }

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        dissipating: false,
        radius: 0.04,
        map: map
    });
    
}


function setOverlay(name, info){
    var title = document.getElementById("place_name");
    title.innerText = name;
    
    var link = document.getElementById("link");
    var address = info.address || info.location_address;
    var city = info.city || "";
    link.hidden = false;
    link.href = "https://maps.google.com/maps/place/" + address + " " + city + "/@" + info.latitude + "," + info.longitude;
    
    
    var desc = document.getElementById("text");
    var phone = info.phone || info.contact_for_this_location_phone_number;
    var volunteer_needs = info.volunteer_needs || info.tell_us_about_the_volunteer_needs;
    var supply_needs = info.supply_needs || info.tell_us_about_the_supply_needs;
    
    desc.innerHTML = "<p><u>ADDRESS:</u> " + address + "</p>" +
                        "<p><u>PHONE:</u> " + phone + "</p>" +
                        "<p><u>VOLUNTEER NEEDS:</u> " + volunteer_needs + "</p>" +
                        "<p><u>SUPPLY NEEDS:</u> " + supply_needs + " " + magnitude + "</p>";
    
    
}

function clearmap(){
    heatmap.setMap(null);
    for(var i=0;i<markerslist.length;i++){
        markerslist[i].setMap(null);
    }
    
}

function needs_anal(input) {
    $.ajax({
        type: "POST",
        url: "/needs_anal.py",
        data: { param: input },
        success: callbackFunc
    });
}

function callbackFunc(response) {
    console.log(response);
}


function updateZoom(){
    map.setZoom(10);
}

function updateOpacity(){
    var elem = document.getElementById("name");
    console.log([elem]);
    if(document.getElementById("opacity_toggle").checked){
        elem.style.opacity = 0.5;
    }
    else{
        elem.style.opacity = 1.0;
    }
    
}

function searchName(){
    var input = document.getElementById("searchTxt").value.toLowerCase();
    var mindistance = Number.MAX_VALUE;
    var minindex = 0;
    for(var i=0;i<markerslist.length;i++){
        var str = markerslist[i].content;
        console.log(str)
        var distance = editDistance(input, str)
        if(distance < mindistance){
            minindex = i;
            mindistance = distance;
        }
    }
    var minmarker = markerslist[minindex];
    console.log(minmarker.content)
    map.setCenter(minmarker.getPosition());
    infowindow.setContent(minmarker.content);
    infowindow.open(map, minmarker);
    
    google.maps.event.trigger(minmarker, 'click');
}


function editDistance(a, b){
	var dp = []
	for(var i=0; i <= a.length;i++){
      matrix = [];
  		for(var j=0; j <= b.length;j++){
  			matrix.push(-1);
  		}
  		dp.push(matrix);
	}
	for(var i=0; i <= a.length;i++){
		for(var j=0; j <= b.length;j++){
			if(i==0 || j==0)
				dp[i][j] = i+j;
			else if(a.charAt(i-1) == b.charAt(j-1))
				dp[i][j] = dp[i-1][j-1];
			else
				dp[i][j] = 1 + Math.min(Math.min(dp[i-1][j], dp[i][j-1]), dp[i-1][j-1]);
		}
	}
	return dp[a.length][b.length];
}



/*
textapi.sentiment({
    'text': 'John is a very good football player!'
}, function(error, response) {
    if (error === null) {
        console.log(response);
    }
});*/
         


 
  var hierarchy = {};
  
  hierarchy['Auto Parts'] = 5;
  hierarchy['Auto Repair'] = 5;
  hierarchy['Construction'] = 7;
  hierarchy['Home Repair'] = 7;
  hierarchy['Environmental Safety'] = 7;
  hierarchy['Daycare/Pre School'] = 8;
  hierarchy['Eldercare'] = 8;
  hierarchy['Food Allergies'] = 8;
  hierarchy['Road-side Assistance'] = 7;
  hierarchy['Remodeling & Construction'] = 8;
  hierarchy['U.S. Government Resources'] = 5;
  hierarchy['Agriculture'] = 4;
  hierarchy['7-12 Education'] = 6;
  hierarchy['Adult Education'] = 5;
  hierarchy['Special Education'] = 5;
  hierarchy['Babies & Toddlers'] = 10;
  hierarchy['Pregnancy'] = 10;
  hierarchy['Credit/Debt & Loans'] = 9;
  hierarchy['Senior Living'] = 8;
  hierarchy['Clothing'] = 10;
  hierarchy['Accessories'] = 7;
  hierarchy['Health & Fitness'] = 10
  hierarchy['Food & Drink'] = 10
  hierarchy['Home & Garden'] = 8
  hierarchy['Family & Parenting'] = 7
  hierarchy['Automotive'] = 7
  hierarchy['Business'] = 7
  hierarchy['Education'] = 5
  hierarchy['Law, Gov\'t & Politics'] = 5
  hierarchy['Careers'] = 3
  hierarchy['Arts & Entertainment'] = 1
  hierarchy['Hobbies & Interests'] = 1
  hierarchy['News'] = 1
  
  var category_weight = 0.65;
  
  function handleMagnitudes(points,results){
    console.log(points);
    if (points.length > 0){
        findNeedsCategory(points, results);
    } else {
        heatmapVis(results);
    }
  }
  
  function getProperty(dict, prop) {
    if (dict[prop] !== undefined) return dict[prop];
    else return 1;
  }
  
  function findNeedsCategory(points, results){
    console.log(points);
    console.log(results);
    test_text = points[0]["tell_us_about_the_supply_needs"] || points[0]["supply_needs"] || "Test";
    console.log(test_text);
    textapi.classifyByTaxonomy({
      'text': test_text,
      'taxonomy': 'iab-qag'
    }, function(error, response) {
      if (error === null) {
        category_value(response, points, results)
      }
    });
  }
  
  
  
  function category_value(json_input, points, results){
  	var cat_list = json_input.categories;
  	//console.log(cat_list);
  	var prod = 0;
  	for(var i=0;i<cat_list.length;i++){
  	  //console.log(cat_list[i].label);
  		prod+=getProperty(hierarchy, cat_list[i].label)*cat_list[i].score;
  	}
  	prod/=10.0*cat_list.length;
  	//console.log(prod);
  	findSentiment(prod, points, results);
  }
  
  function findSentiment(category, points, results){
    test_text = points[0]["tell_us_about_the_supply_needs"] || points[0]["supply_needs"] || "Test";
    textapi.sentiment({
      text: test_text,
      mode: 'tweet'
    }, function(error, response) {
      if (error === null) {
        sentiment_value(response, category, points, results);
      }
    });
  }
  
  
  function sentiment_value(json_input, category, points, results){
    var num = 0;
    if(json_input.polarity == "positive"){
      num = -1;
    }
    else if(json_input.polarity == 'negative'){
      num = 1;
    }
  	var sentiment = 0.5*num*json_input.polarity_confidence + 0.5;
  	//console.log(sentiment);
  	val(sentiment, category, points, results)
  }
  
  function val(category_val, sentiment_val, points, results){
  	var result = (1-category_weight)*sentiment_val + category_weight*category_val;
  	console.log(result);
  	points[0]["magnitude"] = result;
  	results.push(points[0]);
  	points.shift();
  	handleMagnitudes(points, results);
  }
  
  
  
  
 var json_data = [0.3293682099260698,
0.3731390010728775,
0.33152605799939294,
0.5795121937831157,
0.3270921394831763,
0.32719853757567136,
0.32712343550438855,
0.34010532386552206,
0.3941246493420357,
0.32942553820526566,
0.3890000910469272,
0.3731390010728775,
0.32719853757567136,
0.326982456823376,
0.32712343550438855,
0.3320193938874755,
0.32781707543466,
0.3297932209937081,
0.3270921394831763,
0.3542279512765066,
0.17141430206269745,
0.32987816279536675,
0.3369912471442531,
0.32719853757567136,
0.3731390010728775,
0.3731390010728775,
0.32719853757567136,
0.3980472279625197,
0.49010728937937037,
0.3549553125112267,
0.4107737889934342,
0.3731390010728775,
0.3369912471442531,
0.3465119369451649,
0.32705890062270504,
0.40751472995983573,
0.3993976634943665,
0.328108084530638,
0.3293682099260698,
0.41339044839616906,
0.394099291703896,
0.5026021429685316,
0.45961987040699515,
0.38015310356941023,
0.3271429286937298,
0.33809236461215597,
0.36912870216059607,
0.35399886366171873,
0.5210819664599703,
0.394099291703896,
0.3269353088994791,
0.3293826120777957,
0.331115452584023,
0.32720352987898504,
0.3437715958622058,
0.45961987040699515,
0.3271947549463583,
0.33123802922423645,
0.3320193938874755,
0.32719853757567136,
0.3269856603041298,
0.37515687784339996,
0.3290047534737815,
0.3322654232012934,
0.45961987040699515,
0.3293682099260698,
0.32719853757567136,
]