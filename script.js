/*--------------------------------------------------------------------
GGR472 LAB 4: Incorporating GIS Analysis into web maps using Turf.js 
--------------------------------------------------------------------*/
// Define access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFybGluZ28iLCJhIjoiY2xzaHVqbnl2MWtzMTJsbGdyNjcyY3VwNCJ9.LbZUBciGOa6khxwAkkmBJQ'; //****ADD YOUR PUBLIC ACCESS TOKEN*****

// Initialize map and edit to your preference
const map = new mapboxgl.Map({
    container: 'map', // container id in HTML
    style: 'mapbox://styles/mapbox/streets-v11',  // ****ADD MAP STYLE HERE *****
    center: [-79.39, 43.65],  // starting point, longitude/latitude
    zoom: 12 // starting zoom level
});

/*--------------------------------------------------------------------
Step 2: VIEW GEOJSON POINT DATA ON MAP
--------------------------------------------------------------------*/

// Fetch GeoJSON data and add to map
fetch('https://raw.githubusercontent.com/OwenDarling/ggr472-lab4-main/main/data/pedcyc_collision_06-21.geojson')
    .then(response => response.json())
    .then(data => {
    
        map.addSource('collision-data', {
            type: 'geojson',
            data: data
        });
        
        map.addLayer({
            'id': 'collision-points',
            'type': 'circle',
            'source': 'collision-data',
            'paint': {
                'circle-radius': 6,
                'circle-color': '#FF0000'
            }
        });

        /*--------------------------------------------------------------------
        Step 3: CREATE BOUNDING BOX AND HEXGRID
        --------------------------------------------------------------------*/
        
        const bbox = turf.bbox(data);
        
        const bboxPolygon = turf.bboxPolygon(bbox);

        // Create hexgrid using bounding box
        const options = { units: 'kilometers', mask: bboxPolygon };
        const hexgrid = turf.hexGrid(bbox, 1, options); // 1 is the size of hexagon

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
                'fill-color': '#5698b8',
                'fill-opacity': 0.5
            }
        });

        /*--------------------------------------------------------------------
        Step 4: AGGREGATE COLLISIONS BY HEXGRID
        --------------------------------------------------------------------*/
        // Collect collisions by hexgrid
        const aggregated = turf.collect(hexgrid, data, '_id', 'collisions');

        // Log the aggregated data to console
        console.log(aggregated);
    })
/*--------------------------------------------------------------------
Step 5: FINALIZE YOUR WEB MAP
--------------------------------------------------------------------*/
// This step is optional and depends on additional functionality you want to add to your map, such as legends, popups, etc.
