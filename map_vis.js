var map;
function initMap() {
	lat = 29.7604;
  lng = -95.3698;
  zoom = 11;
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: lat, lng: lng},
    zoom: zoom
  });
}