var map;
function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });

    // auto complete search bar
    var input = document.getElementById('address');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);


    start = {lat: -34.39744444, lng: 150.21344};
    //start = new google.maps.LatLng(-34.397, 150.644);
    destination = {lat: -33.6112321, lng: 149.64412344433};
    //destination = new google.maps.LatLng(-33.6, 149.644);
    // marker 1 represents the current position
    marker1 = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: start
    });

    marker1.addListener('click', toggleBounce); // adds animations
    drawCircle(start)

    // marker 2 represents any other destination
    marker2 = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: destination
    });

    marker2.addListener('drag', function() {
        var lat = marker2.position.lat()
        var lng = marker2.position.lng()
        document.getElementById('lat').value = lat;
        document.getElementById('lng').value = lng;
        destination = {lat: lat, lng: lng}
    });

    // Initialize the directions display
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    // Initialize the directions service
    directionsService = new google.maps.DirectionsService();

    var contentString = "<input type=\"button\" value=\"Get Directions\" onclick=\"computeDirections()\" />";
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    marker2.addListener('click', function() {
        infowindow.open(map, this);
    });
    // geocode and reverse geocode
    var geocoder = new google.maps.Geocoder();
    document.getElementById('submitAddress').addEventListener('click', function() {
        geocodeAddress(geocoder, map);
    });
    document.getElementById('submitLatLng').addEventListener('click', function() {
        geocodeLatLng(geocoder);
    });
}

// Get the directions
function computeDirections() {
    // {lat: -34.39744444, lng: 150.21344}
    // {lat: -33.6112321, lng: 149.64412344433};
    var request = {
        origin: start,
        destination: destination,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            directionsDisplay.setOptions( { suppressMarkers: true, preserveViewport: true } );
            showDirections(response);
        } else {
            alert('Error generating directions');
        }
    });
}

function showDirections(response) {
    var myRoute = response.routes[0];
    var txtDir = '';
    for (var i=0; i<myRoute.legs[0].steps.length; i++) {
        txtDir += myRoute.legs[0].steps[i].instructions+"<br />";
    }
    document.getElementById('directions').innerHTML = txtDir;
}

function geocodeLatLng(geocoder) {
    var input = document.getElementById('latlng').value;
    var latlngStr = input.split(',', 2);
    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                document.getElementById('addressOut').value = results[1].formatted_address;
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}

function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('address').value;
    geocoder.geocode({'address': address}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            // resultsMap.setCenter(results[0].geometry.location);
            document.getElementById('lat').value = results[0].geometry.location.lat();
            document.getElementById('lng').value = results[0].geometry.location.lng();
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function drawCircle(center) {
    var cityCircle = new google.maps.Circle({
        strokeColor: '#2196F3',
        strokeOpacity: 0.35,
        strokeWeight: 2,
        fillColor: '#2196F3',
        fillOpacity: 0.35,
        map: map,
        center: center,
        radius: 40000
    });
}


function toggleBounce() {
    if (this.getAnimation() !== null) {
        this.setAnimation(null);
    } else {
        this.setAnimation(google.maps.Animation.BOUNCE);
    }
}