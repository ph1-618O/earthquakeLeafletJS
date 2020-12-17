# Earthquakes with Leaflet
Visualizing USGS Earthquake data with leaflet.js
- This application sources current month long data from the Earthquake Data USGS. 
- If you so desire, you can change the code to query the hours results or the days results switching the var queryJson link to the ones included below::
- By the Hour
var queryJson = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
- By the Day
var queryJson = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
- By the Month/ current settings
var queryJson = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

# How to use this code::
- First apply to [Mapbox](https://docs.mapbox.com/api/overview/) for an api key
- Clone the repo
- In the repo you cloned touch file config.js
- In config.js add code const API_KEY = 'your api key here'
- Go to terminal or anaconda prompt, navigate to the cloned repo
- Type in python -m http.server
- Copy link http://0.0.0.0:8000/, paste in browser
- Enjoy!!


Satellite Map::
![Satellite Map](https://github.com/ph1-618O/earthquakeLeafletJS/blob/main/big_satellite.jpg)

Terrain Map:: 
![Terrain Map](https://github.com/ph1-618O/earthquakeLeafletJS/blob/main/big_dark.jpg)
