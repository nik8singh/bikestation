from flask import Flask, render_template, request
from flask_restful import Api, reqparse
from flask_sqlalchemy import SQLAlchemy
from geopy import Nominatim
from geopy.distance import geodesic

app = Flask(__name__)

# Initialize restful API
api = Api(app)

# sql connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bikelocations.db'
db = SQLAlchemy(app)


# Table persistence
class BikeLocations(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    latitude = db.Column(db.REAL, nullable=False)
    longitude = db.Column(db.REAL, nullable=False)
    name = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f"BikeLocation(id={self.id}, latitude={self.latitude}, longitude={self.longitude}, name={self.name}, )"


# validation rules on submitted form
get_args = reqparse.RequestParser()
get_args.add_argument("address", type=str, help="Address line is required", required=True)
get_args.add_argument("city", type=str, help="city is required", required=True)
get_args.add_argument("state", type=str, help="state is required", required=True)
get_args.add_argument("zipcode", type=str, help="zipcode is required", required=True)


# redirects user to index.html
@app.route('/')
def home():
    return render_template('index.html')


# GET Request handler
@app.route('/search', methods=['GET'])
def get():
    # Parse submitted address
    args = get_args.parse_args()
    address = args["address"] + " " + args["city"] + " " + args["state"] + " " + args["zipcode"]

    try:
        # Convert submitted address into lat and log values.
        locator = Nominatim(user_agent="bikestation")
        person_location = locator.geocode(address)
    except AttributeError as e:
        print("GEOCODE ERROR")
        return {"error": "Something went wrong. Try using full address values"}, 400

    if not person_location:
        print("No address Found")
        return {"error": "Something went wrong. Try using full address values"}, 400

    # Fetch all bike locations from database
    query = BikeLocations.query.all()

    # Prep variables to determine closest bike station
    closest_bike_station = None
    current_distance = None

    # Submitted address location
    person = (person_location.latitude, person_location.longitude)

    # Iterate through rows fetched from database
    for row in query:
        # Location of bus station from database
        db_station = (row.latitude, row.longitude)

        # distance between submitted address and bus station from database
        new_distance = geodesic(person, db_station).miles

        # If there is no closest location selected or new bus station is closer then save this bus location as
        # closest
        if current_distance:
            if new_distance <= current_distance:
                current_distance = new_distance
                closest_bike_station = row
        else:
            current_distance = new_distance
            closest_bike_station = row

    print(closest_bike_station)
    return {"closest_bike_station": closest_bike_station.name, "latitude": closest_bike_station.latitude,
            "longitude": closest_bike_station.longitude, "current_distance": current_distance, "person_latitude": person_location.latitude,"person_longitude": person_location.longitude }, 200


if __name__ == '__main__':
    app.run(debug=True)
