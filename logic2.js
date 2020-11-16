//day is also fast
var queryJson = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
//hour, is faster
//var queryJson = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
//month for more detail, add options later
// var queryJson = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
// from Class example
// var queryJson = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
//     "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

function markerSize(mag) {
    return mag * 30000;
}

// need to make shallow 0-70km, inter 70-300, and deep 300-700 cases
function color(depth) {
    switch (true) {
        case depth > 5:
            return "#0083c3";
        case depth > 4:
            return "#31e89d"; //"#4094b4";
        case depth > 3:
            return "#ffb400";
        case depth > 2:
            return "#ff9a00";
        case depth > 1:
            return "#ff7400";
        case depth = 1:
            return "#ff0000";

    }
};

//2
d3.json(queryJson, function (mapData) {
    createMap(mapData.features);
});


//3
function createMap(quakeData) {
    // console.log(quakeData[2].properties.place);
    // console.log(quakeData[0].geometry.coordinates);
    // console.log(quakeData[0].geometry.coordinates[2]);

    var quakes = L.geoJson(quakeData, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " + feature.properties.mag + "</p>" + "<p> Depth: " + feature.geometry.coordinates[2] + "</p>")
        },
        pointToLayer: function (feature, latlng) {
            return new L.circle(
                latlng, {
                    radius: markerSize(feature.properties.mag),
                    fillColor: color(feature.geometry.coordinates[2]),
                    fillOpacity: 0.5,
                    color: 'white',
                    weight: 0.5,
                    stroke: true,
                })
        }
    });

    buildMap(quakes);
}


//4
function buildMap(quakes) {

    //satellite map is very detailed
    var map = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    var darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    var terrain = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.mapbox-terrain-v2",
        accessToken: API_KEY
    });

    var baseMap = {
        "Satellite Map": map,
        "Dark Outlines": darkMap,
        "Terrain": terrain
    };
    var overlayMap = {
        "Quake Depth":quakes,
    };
    var stackLayers = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [map, quakes]
    });
    L.control.layers(baseMap, overlayMap, {
        collapsed: false
    }).addTo(stackLayers);

    var legend = L.control({
        position: 'topleft'
    });

    legend.onAdd = function () {
        console.log('working')
        var div = L.DomUtil.create('div', 'info legend');
        var sizes = [0, 1, 2, 3, 4, 5, 6, 7];
        var colors = [
            "#ff0000",
            "#ff7400",
            "#ff9a00",
            "#ffb400",
            "#f3de11",
            "#31e89d",
            "#4094b4",
            "#0083c3"
        ];
        var labels = [];

//adding legend header
        var legendInfo =
            "<h6>Earthquake Depth</h6>"
        div.innerHTML = legendInfo;

//code below works, trying code from web
        sizes.forEach(function (size, index) {
            labels.push("<div class=\'labels\'>" + "<li style=\"background-color: " + colors[index] + "\">" + sizes[index] + (sizes[index + 1] ? "&ndash;" + sizes[index + 1] + "<br>" : " + ") + "</li");
        });
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    }
    // console.log(div);
    legend.addTo(stackLayers);

}