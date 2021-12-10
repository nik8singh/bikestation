
let start = null, destination = null,  routing = null;
$(document).ready(function () {

    // Set up initial map location
    let map = L.map('map').setView([46.891579, -96.800018], 13);
    L.tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> Contributors',
          maxZoom: 18,
          }).addTo(map);


$('form').submit(function (event) {
        event.preventDefault();
        let $message =$(".closestStation");
        // clear the map for any waypoints and routing
        if(start!==null) {
            map.removeLayer(start);
            map.removeLayer(destination)
            map.removeControl(routing);
        }

        //display progress message
        $message.html("<span class='inProgress'>searching...</span>");

        // Fetch inputs and prep API call data
       let data = "address="+$("#address").val()+"&city="+$("#city").val()+"&state="+$("#state").val()+"&zipcode="+$("#zipcode").val()+""

        //API call
        $.ajax({
            url:"http://localhost:5000/search?"+data,
            contentType: 'application/text; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                //display progress message
                $message.html("<span class='foundit'>"+response.closest_bike_station+"</span>");

                // Add waypoint of the user and display pop up message
                start = L.marker([response.person_latitude, response.person_longitude]).addTo(map);
                start.bindPopup("You are here", {closeOnClick: false, autoClose: false}).openPopup();

                // Add waypoint of the closest location and display pop up message
                destination = L.marker([response.latitude, response.longitude]).addTo(map);
                destination.bindPopup(response.closest_bike_station, {closeOnClick: false, autoClose: false}).openPopup();

                // Add routing between the two waypoints and adjust the zoom level
                routing = new L.Routing.Control({
                    waypoints:[
                        L.latLng(response.person_latitude, response.person_longitude),
                        L.latLng(response.latitude, response.longitude)
                    ],
                   fitSelectedRoutes: true,
                }).addTo(map);
            },
            error: function (requestObject, error, errorThrown) {
                console.log(~requestObject.responseText);
                console.log(error);
                console.log(errorThrown);
                //display error message
                $message.html("<span class='error'>No results. Try typing full address</span>");
            },
        });
    return false;
    });

});
