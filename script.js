/*--------------------------------------------------------------------
GGR472 LAB 4: Incorporating GIS Analysis into web maps using Turf.js 
--------------------------------------------------------------------*/
// Define access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFybGluZ28iLCJhIjoiY2xzaHVqbnl2MWtzMTJsbGdyNjcyY3VwNCJ9.LbZUBciGOa6khxwAkkmBJQ'; //****ADD YOUR PUBLIC ACCESS TOKEN*****

// Initialize map and edit to your preference
const map = new mapboxgl.Map({
    container: 'map', // container id in HTML
    style: '',  // ****ADD MAP STYLE HERE *****
    center: [-79.39, 43.65],  // starting point, longitude/latitude
    zoom: 12 // starting zoom level
});



/*--------------------------------------------------------------------
Step 2: VIEW GEOJSON POINT DATA ON MAP
--------------------------------------------------------------------*/

// Fetch GeoJSON data
fetch('URL_TO_YOUR_GEOJSON_FILE')
    .then(response => response.json())
    .then(data => {
        // Add GeoJSON layer to map
        map.addSource('collision-data', {
            type: 'geojson',
            data: data
        });
        // Add layer to map
        map.addLayer({
            'id': 'collision-points',
            'type': 'circle',
            'source': 'collision-data',
            'paint': {
                'circle-radius': 6,
                'circle-color': '#FF0000'
            }
        });
    });


/*--------------------------------------------------------------------
Step 3: CREATE BOUNDING BOX AND HEXGRID
--------------------------------------------------------------------*/
map.on('load', () => {
    // Create a bounding box around the collision point data
    const bbox = turf.bbox(data); // Assuming 'data' is your GeoJSON data
    
    // Convert bounding box coordinates to a feature
    const bboxPolygon = turf.bboxPolygon(bbox);
    
    // Create hexgrid using bounding box
    const options = {units: 'kilometers', mask: bboxPolygon};
    const hexgrid = turf.hexGrid(bbox, 0.5, options); // 0.5 is the size of hexagon
    
    // Add hexgrid to map
    map.addSource('hexgrid', {
        type: 'geojson',
        data: hexgrid
    });
    
    map.addLayer({
        'id': 'hexgrid-layer',
        'type': 'fill',
        'source': 'hexgrid',
        'paint': {
            'fill-color': '#008000',
            'fill-opacity': 0.5
        }
    });
});


/*--------------------------------------------------------------------
Step 4: AGGREGATE COLLISIONS BY HEXGRID
--------------------------------------------------------------------*/
// Collect collisions by hexgrid
const aggregated = turf.collect(hexgrid, data, '_id', 'collisions');

// Log the aggregated data to console
console.log(aggregated);


/*--------------------------------------------------------------------
Step 5: FINALIZE YOUR WEB MAP
--------------------------------------------------------------------*/
// Here you can add legends, popups, and other user interface elements as per your requirements.

// /*--------------------------------------------------------------------
// Step 5: FINALIZE YOUR WEB MAP
// --------------------------------------------------------------------*/
//HINT: Think about the display of your data and usability of your web map.
//      Update the addlayer paint properties for your hexgrid using:
//        - an expression
//        - The COUNT attribute
//        - The maximum number of collisions found in a hexagon
//      Add a legend and additional functionality including pop-up windows


