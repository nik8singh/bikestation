
$(document).ready(function () {
   let map = L.map('map').setView([46.891579, -96.800018], 13);
   let start = null, destination = null;

    L.tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> Contributors',
          maxZoom: 18,
          }).addTo(map);


$('form').submit(function (event) {
        event.preventDefault();
        if(start!==null) {
            map.removeLayer(start);
            map.removeLayer(destination);
        }
        console.log("searching...")
       let data = "address="+$("#address").val()+"&city="+$("#city").val()+"&state="+$("#state").val()+"&zipcode="+$("#zipcode").val()+""
        $.ajax({
            url:"http://localhost:5000/search?"+data,
            contentType: 'application/text; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                console.log(response)
                $(".closestStation").text(response.closest_bike_station);

                start = L.marker([response.person_latitude, response.person_longitude]).addTo(map);
                start.bindPopup("You are here", {closeOnClick: false, autoClose: false}).openPopup();

                destination = L.marker([response.latitude, response.longitude]).addTo(map);
                destination.bindPopup(response.closest_bike_station, {closeOnClick: false, autoClose: false}).openPopup();
            },
            error: function (requestObject, error, errorThrown) {
                console.log(~requestObject.responseText);
                console.log(error);
                console.log(errorThrown);
                $(".closestStation").text("No results. Try typing full address");
            },
        });
    return false;
    });

});