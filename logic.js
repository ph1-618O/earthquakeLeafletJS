// var queryJson = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
var queryJson = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
    "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

d3.json(queryJson, function (mapData) {
    createMap(mapData.features);
});



function createMap(quakeData) {
    function bindFeature(features, layer) {
        layer.bindPopup("<h3" > +feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
    var quakes = L.geoJSON(quakeData, {
        createMap,
    });
    buildMap(quakes);
}

function buildMap(quakes) {
    var magProp = feature.properties.mag
    var map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    var baseMap = {
        "Map": map,
        "Overlay": darkMap
    };

    var overlayMap = {
        quakes,
    };

    function setStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: setColor(magProp),
            color: "#000000",
            radius: radius(magProp),
            stroke: true,
            weight: 0.5
        };
    }

    function color(strength) {
        switch (true) {
            case strength > 5:
                return "#ff7400";
            case strength > 4:
                return "#ff9a00";
            case strength > 3:
                return "#ffb400";
            case strength > 2:
                return "#4094b4";
            case strength > 1:
                return "#0083c3";

        }
    }
    function magnitude(strength){
        if (strength === 0){
            return 1;
        }else{
            return strength * 4;
        }
    }

    L.geoJson(mapData, {
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng);
        },
        
    })




    var stackLayers = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [map, quakes]
    });




    L.control.layers(baseMap, overlayMap, {
        collapsed: false
    }).addTo(stackLayers)

};