'use strict';

window.oasis = window.oasis || {};

(function () {

	// latitude is the position of the center of the map
	// userLatitude is the position the user searched for
	function sortByClosest(latitude, longitude, userLatitude, userLongitude) {
		if (!userLatitude || !userLongitude) {
			userLatitude = latitude;
			userLongitude = longitude;
		}
		var list = [];
		var nextLatitude = void 0,
		    nextLongitude = void 0,
		    distance = void 0,
		    travelDistance = void 0,
		    distanceFromUser = void 0;
		for (var index = 0; index < locations.length; index++) {
			nextLatitude = locations[index].latitude;
			nextLongitude = locations[index].longitude;
			if (nextLatitude != null && nextLatitude != '') {
				distance = window.oasis.getDistanceInKilometers(latitude, longitude, parseFloat(nextLatitude), parseFloat(nextLongitude));
				travelDistance = window.oasis.getDistanceInKilometers(userLatitude, userLongitude, parseFloat(nextLatitude), parseFloat(nextLongitude));
			} else {
				distance = window.oasis.INFINITY;
				travelDistance = window.oasis.INFINITY;
			}
			locations[index].distance = distance;
			locations[index].travelDistance = travelDistance;
			list.push(locations[index]);
		}
		list.sort(function (a, b) {
			if (a.distance > b.distance) {
				return 1;
			}
			if (a.distance < b.distance) {
				return -1;
			}
			// a must be equal to b
			return 0;
		});

		var type = window.oasis.getParameterByName('type');
		if (type) {
			var types = type.split('|');
			list = list.filter(function (item) {
				for (var _index = 0; _index < types.length; _index++) {
					if (item.category.toLowerCase().replace(/\s/g, '-') === types[_index]) {
						return true;
					}
				}

				// SHIM: Always show misc locations, if we’re showing all types
				if (item.uri.indexOf('locations/') >= 0 && (types.length === 8 || types.length === 0)) {
					return true;
				}

				return false;
			});
		}

		var open = window.oasis.getParameterByName('open');
		if (open) {
			list = list.filter(function (item) {
				var open = false;
				for (var _index2 = 0; _index2 < item.hours.length; _index2++) {
					if (window.oasis.isOpenNow(item.hours[_index2])) {
						open = true;
					}
				}

				return open;
			});
		}
		return list;
	}

	window.oasis.sortByClosest = sortByClosest;
})();