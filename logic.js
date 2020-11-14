var queryJson = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"

d3.json(queryJson, function(mapData){
    createMap(mapData.feature);
});

function createMap(quakeData){
    function bindFeature(feature, layer){
        layer.bindPopup("<h3"> + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
    var quakes = L.geoJSON(quakeData,{
        createMap,
    });
    buildMap(quakes);
}

function buildMap(quakes{
    
})