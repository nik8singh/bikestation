import requests

BASE = "http://127.0.0.1:5000/"

response = requests.get(BASE + "search", {"address": "1435 4th st North",
                                          "city": "Fargo",
                                          "state": "ND",
                                          "zipcode": "58102"})

print(response.json())

