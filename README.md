# NDSU Bike Station Finder
This applications helps user find the closest NDSU bike station from their location in Fargo,ND.

## API:
- Bike stations are stored in sqlight database "bike_locations" with following columns : Id, latitude, longitude, and name
- Restful API is created with Python Flask which runs on "http://127.0.0.1:5000/"
- "http://127.0.0.1:5000/" URL redirects user to the home page
- "http://127.0.0.1:5000/search?address=#&city=#&state=#&zipcode=#" URL is the GET API call to fetch the closest bike location
- Following libraries are installed Flask, flask_restful, flask_sqlalchemy, and geopy

GET Request handler :
- Firstly validations are done on the submitted data (all are required in string)
- Submitted address is converted into longitude and latitude using geopy import, Error handling is added to catch any invalid addresses. 
- Program iterates through all the locations from database and returns the location closest to the submitted address. 
- Distance is calculated using the following method: geodesic().miles

## User Interface:
- CSS flexbox layout is used to keep the UI responsive.
- HTML Field level validation is added for required fields. City and State are prepopulated and disabled.
- Jquery AJAX is used to perform API call.
- Appropriate progress message is displayed : Error or found location name
- https://leafletjs.com/ is used for the map. All the leaflet coded was taken from official documentation.
- leaflet routing machine is used to display routing between two waypoints.