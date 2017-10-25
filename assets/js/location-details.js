'use strict';

// FOLA’s Mapbox API key

var MAP_ACCESS_TOKEN = 'pk.eyJ1IjoiZm9vZG9hc2lzbGEiLCJhIjoiY2l0ZjdudnN4MDhpYzJvbXlpb3IyOHg2OSJ9.POBdqXF5EIsGwfEzCm8Y3Q';

var MAP_STYLE = 'mapbox://styles/mapbox/basic-v9';

(function () {

	/*
 Loop through the list of hours
 For each day, check to see if it matches the current date
 If there’s a match
 	If the store is open
 		Show an open indicator inline and at the top of the page
 	Else
 		Show a closed indicator inline and at the top of the page
 */

	var headerOpenNowShowing = false;
	function showOpenNowInHeader() {
		if (headerOpenNowShowing) return;
		var openTemplate = document.querySelector('.open-template');
		openTemplate.parentNode.insertAdjacentHTML('beforeend', openTemplate.innerHTML);
		headerOpenNowShowing = true;
	}

	(function () {
		var dtElements = document.querySelectorAll('dt[data-day]');
		var ddElements = document.querySelectorAll('dd[data-day]');

		var _loop = function _loop(index) {
			(function () {
				var dt = dtElements[index];
				var dd = ddElements[index];
				var data = {
					day: dd.getAttribute('data-day'),
					open: dd.getAttribute('data-open'),
					close: dd.getAttribute('data-close')
				};
				if (window.oasis.isOpenNow(data)) {
					dt.classList.add('open');
					dd.classList.add('open');
					var notice = document.createElement('i');
					notice.textContent = 'Open Now';
					dd.appendChild(document.createTextNode(' '));
					dd.appendChild(notice);
					showOpenNowInHeader();
				}
			})();
		};

		for (var index = 0; index < dtElements.length; index++) {
			_loop(index);
		}
	})();
})();

(function () {
	if (document.getElementById('map') && 'mapboxgl' in window && mapboxgl.supported()) {

		// Create the map
		mapboxgl.accessToken = MAP_ACCESS_TOKEN;

		var map = new mapboxgl.Map({
			container: 'map', // container id
			style: MAP_STYLE,
			center: [LOCATION_DETAILS.longitude, LOCATION_DETAILS.latitude], // starting position
			scrollZoom: false,
			zoom: 14 // starting zoom
		});

		// Add a zoom control
		map.addControl(new mapboxgl.NavigationControl({ position: 'top-right' })); // position is optional

		// Add a marker at the location of the food source
		var template = document.getElementById('marker-template');
		if (template) {
			var marker = document.createElement('div');
			marker.innerHTML = template.innerHTML;

			new mapboxgl.Marker(marker).setLngLat([LOCATION_DETAILS.longitude, LOCATION_DETAILS.latitude]).addTo(map);
		}
		(function () {
			function expandMap() {
				document.getElementById('map').className += ' expanded';
				map.resize();
				map.scrollZoom.enable();
			}
			document.getElementById('map').addEventListener('click', expandMap, false);
		})();
	} else {
		if (console && console.log) console.log('MapboxGL doesn’t appear to be supported in this web browser. Hiding the map…');
		document.getElementById('map').style.display = 'none';
	}
})();

(function () {

	var PAGE_PARAMETERS = {
		type: window.oasis.getParameterByName('type'),
		address: window.oasis.getParameterByName('address'),
		deserts: window.oasis.getParameterByName('deserts'),
		open: window.oasis.getParameterByName('open'),
		openStart: window.oasis.getParameterByName('open_start')
	};

	// Distance
	if (PAGE_PARAMETERS.type || PAGE_PARAMETERS.address || PAGE_PARAMETERS.deserts || PAGE_PARAMETERS.open || PAGE_PARAMETERS.openStart) {
		// If the user came from the search page
		var distance = void 0;
		window.oasis.findUserLocation(function (userLocation) {
			if (LOCATION_DETAILS.latitude != null && LOCATION_DETAILS.latitude != '' && userLocation && userLocation.latitude && userLocation.longitude) {
				distance = window.oasis.getDistanceInKilometers(userLocation.latitude, userLocation.longitude, parseFloat(LOCATION_DETAILS.latitude), parseFloat(LOCATION_DETAILS.longitude));
			} else {
				distance = window.oasis.INFINITY;
			}

			if (distance && distance != window.oasis.INFINITY) {
				var distanceTemplate = document.querySelector('.distance-template');
				distanceTemplate.parentNode.insertAdjacentHTML('beforeend', distanceTemplate.innerHTML);
				distanceTemplate.parentNode.querySelector('.distance span').innerHTML = window.oasis.getDistanceForPresentation(distance);
			}
		});
	}

	function updateLink(link) {
		var params = [];
		if (PAGE_PARAMETERS.type) params.push('type=' + PAGE_PARAMETERS.type);
		if (PAGE_PARAMETERS.address) params.push('address=' + PAGE_PARAMETERS.address);
		if (PAGE_PARAMETERS.deserts) params.push('deserts=' + PAGE_PARAMETERS.deserts);
		if (PAGE_PARAMETERS.open) params.push('open=' + PAGE_PARAMETERS.open);
		if (PAGE_PARAMETERS.openStart) params.push('openStart=' + PAGE_PARAMETERS.openStart);

		var queryString = params.join('&');
		link.setAttribute('href', link.getAttribute('href') + '?' + queryString);
	}

	if (PAGE_PARAMETERS.type || PAGE_PARAMETERS.address || PAGE_PARAMETERS.deserts || PAGE_PARAMETERS.open || PAGE_PARAMETERS.openStart) {
		var link = document.getElementById('back-link');
		if (link) {
			updateLink(link);
			link.querySelector('span').textContent = 'Back to All Results';
		}
	}
})();