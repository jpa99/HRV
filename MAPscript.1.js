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



function updateMaps(){
    map_toggles = [document.getElementById("needs_toggle"), document.getElementById("shelters_toggle")];
    var active_maps = [];
    console.log(map_toggles)
    for (var i = 0; i < map_toggles.length; i++){
        console.log("Toggle: ", map_toggles[i]);
        if (map_toggles[i].checked){
            active_maps.push(map_toggles[i].id);
        }
    }
    console.log(active_maps);
    console.log(map_toggles);
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
    
        
        
    var infoWindow = new google.maps.InfoWindow;

    navigator.geolocation.getCurrentPosition(function(position) {
        pos = { lat: position.coords.latitude, lng: position.coords.longitude };

        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        infoWindow.open(map);
        map.setCenter(pos);
        
        map_toggles = [document.getElementById("needs_toggle"), document.getElementById("shelters_toggle")];
        manageMap(pos, [], ["needs_toggle", "shelters_toggle"]);
    });
    var myControl = document.getElementById('name');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(myControl);
}

function heatmapVis(locations) {
    
    console.log(locations);
    var heatmapData = [];
    var marker;
    for (var i = 0; i < locations.length; i++) {
        var latLng = new google.maps.LatLng(locations[i]['latitude'], locations[i]['longitude'])
        var color = locations[i]['color']
        console.log(locations[i].length);
        heatmapData.push(latLng);
        if(markers){
            marker = new google.maps.Marker({
                position: latLng,
                map: map,
                //animation: google.maps.Animation.DROP,
                icon: color
            });
            
            google.maps.event.addListener(marker, 'click', function() {
                map.setZoom(10);
                map.setCenter(marker.getPosition());
                console.log(marker.getPosition());
            });
            
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


//function display()


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
