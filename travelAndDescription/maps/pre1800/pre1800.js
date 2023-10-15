

//Define map start up options, here defined to center on Italy
		var mapOptions = {
			center: [41.8875, 0], //set center
			zoom: 2 , //set initial zoom
			maxZoom : 7,  //set max zoom
			minZoom : 1,
			maxBounds: [ [-90, -180] , [90,180] ],
			tap: false
			}

//Creates Map according to map options
		var map = new L.map('map', mapOptions);
//Examples of an externally called tiled basemap
		var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
			}).addTo(map);


//Example of a localled called tiled basemap created from a .geotiff  using gdal2tiles (workflow available)
var piriReis1554 = L.tileLayer('WorldMap2/{z}/{x}/{y}.png', {tms: true, attribution: "David Rumsey Map Collection"});


var places = L.geoJson(data, {
	onEachFeature: popUp
}
);

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

var imagesMap =L.geoJson(images, {
	pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    },
	onEachFeature: popUpImages
}
).addTo(map);

function popUpImages(f,l) {
	var photoImg = '<img src="'+f.properties.ImageURL+'" width="300px" />';
	var out = [];
	if (f.properties) {
		out.push('<i>' + f.properties.ImageTitle + ' </i> (' + f.properties.PlaceName +', '+f.properties.Year+ ')');
		out.push(f.properties.Artist);
		out.push(f.properties.HostInstitution);
		out.push('<a href="' +f.properties.ImageURL + '" target="_blank">' + photoImg +'</a>');
		l.bindPopup(out.join("<br />"));
	}};

function popUp(f,l) {
	var out = [];

	//adds spaces in between entries
	if (f.properties) {
		out.push('<h3>' + f.properties.PlaceName + '</h3>' + ' (' + f.properties.PlaceNameModern + ') <br>');
		out.push('<b>Traveller: </b>' + f.properties.NameOfTraveler);
		out.push('<b>Date: </b>' + f.properties.YearOfTravel);
		out.push('<b>Description: </b>' + f.properties.Description + '<br>');
		out.push('<b>Fulltext and Citation: </b>' + '<a href="'+ f.properties.Hyperlink + '" target="_blank">Read the text</a>' + ' of' );  //allows for link to external URL via attribute in .geoJson table
		out.push(f.properties.Citation);
		l.bindPopup(out.join("<br />"));
	}
}

			var cluster_places= new L.MarkerClusterGroup({showCoverageOnHover: false});
				 cluster_places.addLayer(places);
				 cluster_places.addTo(map);

//Lets you see lat/long in the console window. Useful for placing non-georeferenced maps in the correct location or for placing markers

			var baseLayers = {
				"Satellite Imagery" : Esri_WorldImagery,
				};

			var overlayMaps = {
		  	"<a target='_blank' href='https://www.davidrumsey.com/luna/servlet/detail/RUMSEY~8~1~299966~90071732:fol--41a-Oval-world-map-with-the-At?sort=Pub_List_No_InitialSort%2CPub_Date%2CPub_List_No%2CSeries_No&qvq=q:%3Dworld%20AND%20pub_date%3D1500...1700%20;sort:Pub_List_No_InitialSort%2CPub_Date%2CPub_List_No%2CSeries_No;lc:RUMSEY~8~1&mi=190&trs=10031'>Pirî Reis, 1554</a>" : piriReis1554,
				"Descriptions" : cluster_places,
				"Images" : imagesMap
				};
			var controlBox = L.control.layers(baseLayers, overlayMaps).addTo(map);

				L.control.pan().addTo(map);
				L.control.scale().addTo(map);
				map.addControl(new L.Control.Fullscreen());

				var searchLayers = L.layerGroup([cluster_places]);

				var searchControl = new L.Control.Search({
					layer: searchLayers,
					propertyName: 'PlaceName',
					marker: false,
					textPlaceholder: 'Search by Location',
					textErr: 'Location not found',
					moveToLocation: function(latlng, title, map) {
						//map.fitBounds( latlng.layer.getBounds() );
						//var zoom = map.getBoundsZoom(latlng.layer.getBounds());
						var zoom = 8;
						map.setView(latlng, zoom); // access the zoom
					}
				});
				map.addControl( searchControl );  //inizialize search control

				searchControl.on('search:locationfound', function(e) {
					if(e.layer._popup)
						e.layer.openPopup();
				}).on('search:collapsed', function(e) {
				});

var yearSlider = document.getElementById('slider-year');
noUiSlider.create(yearSlider, {
    start: [1450, 1920],
    connect: true,
		step:5,
		pips: {
        mode: 'positions',
        values: [0, 25, 50, 75, 100],
        density: 4,
        stepped: true
    },
    range: {
        'min': 1400,
        'max': 1900
    },
		format: wNumb({
        decimals: 0})
});
var yearValues = [
	document.getElementById('event-start'),
	document.getElementById('event-end')
];
yearValues[0].innerHTML=1500;
yearValues[1].innerHTML=1900;

yearSlider.noUiSlider.on('change', function (values, handle) {
	yearValues[handle].innerHTML = values[handle];
	rangeMin= yearValues[0].innerHTML; //set min for filtering
	rangeMax= yearValues[1].innerHTML; //set max for filtering
	console.log(rangeMin);
	console.log(rangeMax);
	cluster_places.clearLayers();
	map.removeLayer(imagesMap);
	controlBox.removeLayer(imagesMap);
	places = new L.geoJson(data,{
		onEachFeature: popUp,
		filter:
			function(feature, layer) {
				return (feature.properties.YearOfTravel <= rangeMax) && (feature.properties.YearOfTravel >= rangeMin);
			}
	});

	imagesMap = new L.geoJson(images, {
		pointToLayer: function (feature, latlng) {
	        return L.circleMarker(latlng, geojsonMarkerOptions);
	    },
		onEachFeature: popUpImages,
		filter:
			function (feature,layer) {
				return (feature.properties.Year <= rangeMax) && (feature.properties.Year >= rangeMin);
		}
	}).addTo(map);



	cluster_places.addLayer(places);
	controlBox.addOverlay(imagesMap , "Images");

});

const legend = L.control.Legend({
				position: "bottomright",
				collapsed: false,
				symbolWidth: 24,
				opacity: 1,
				column: 2,
				legends: [{
						label: "Description",
						type: "image",
						url: "../plugins/marker/blue.png",
				}, {
						label: "Image",
						type: "image",
						url: "../plugins/marker/orange.png"
				}]
		})
		.addTo(map);
