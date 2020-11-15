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


function color(strength) {
    switch (true) {
        case strength > 5:
            return "#ff7400"; //"#ff0000"; 
        case strength > 4:
            return "#ff9a00";
        case strength > 3:
            return "#ffb400";
        case strength > 2:
            return "#4094b4";
        case strength > 1:
            return "#0083c3";

    }
};

//2
d3.json(queryJson, function (mapData) {
    createMap(mapData.features);
});



//3
function createMap(quakeData) {
    var quakes = L.geoJson(quakeData, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude" + feature.properties.mag + "</p>")
        },
        pointToLayer: function (feature, latlng) {
            return new L.circle(
                latlng, {
                    radius: markerSize(feature.properties.mag),
                    fillColor: color(feature.properties.mag),
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

    var terrain = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",{
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
        quakes,
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
        position: 'bottomleft'
    });

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend'),
            sizes = [0, 1, 2, 3, 4, 5];

        // for (var i = 0; i < sizes.length; i++) {
        //     div.innerHTML +=
        //         '<i style="background:' + color(sizes[i] + 1) + "></i>" + sizes[i] + (sizes[i + 1] ? ' - ' + sizes[i + 1] + '<br>' : ' + ');
        // }
        return div;
    };

    legend.addTo(stackLayers);
}