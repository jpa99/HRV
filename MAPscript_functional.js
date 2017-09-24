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
        
        
        
        heatmapVis(coords);
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
        heatmapData.push(latLng);
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
                        "<p><u>SUPPLY NEEDS:</u> " + supply_needs + "</p>";
    
    
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