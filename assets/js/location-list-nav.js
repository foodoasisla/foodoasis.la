"use strict";

var PAGE_PARAMETERS = void 0;
var getParameterByName = void 0;
var updateLink = void 0;

(function () {
	// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript#answer-901144	
	getParameterByName = function getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		    results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	};

	PAGE_PARAMETERS = {
		type: getParameterByName('type') || PAGE_TYPE,
		address: getParameterByName('address'),
		deserts: getParameterByName('deserts'),
		open: getParameterByName('open')
	};

	// SHIM: Make the type persistent

	updateLink = function updateLink(link) {
		var params = [];
		if (PAGE_PARAMETERS.type) params.push('type=' + PAGE_PARAMETERS.type);
		if (PAGE_PARAMETERS.address) params.push('address=' + PAGE_PARAMETERS.address);
		if (PAGE_PARAMETERS.deserts) params.push('deserts=' + PAGE_PARAMETERS.deserts);
		if (PAGE_PARAMETERS.open) params.push('open=' + PAGE_PARAMETERS.open);

		var queryString = params.join('&');
		link.setAttribute('href', link.getAttribute('href') + '?' + queryString);
	};

	if (PAGE_PARAMETERS.type || PAGE_PARAMETERS.address || PAGE_PARAMETERS.deserts || PAGE_PARAMETERS.open) {
		var filtersLink = document.getElementById('filters-link');
		if (filtersLink) {
			updateLink(filtersLink);
		}

		var searchLink = document.getElementById('search-link');
		if (searchLink) {
			updateLink(searchLink);
		}
	}

	if (PAGE_PARAMETERS.type) {
		var types = PAGE_PARAMETERS.type.split('|');

		var searchType = document.getElementById('search-type');
		var near = document.getElementById('search-near');

		if (types.length === 1 || types.length === 2) {
			// SHIM: Translate to a human readable version of the “type”.
			var formattedTypes = [];
			for (var index = 0; index < types.length; index++) {
				formattedTypes.push(types[index] === 'food-pantry' ? 'food pantries' : types[index] === 'summer-lunch' ? 'summer lunch for kids' : types[index].replace(/\-/g, ' ') + 's');
			}
			searchType.innerText = formattedTypes.join(', ');
			searchType.style.textTransform = 'capitalize';
			//searchType.style.display = 'inline';
			//near.style.display = 'inline';
		} else {
			//searchType.style.display = 'none';
			//near.style.display = 'none';
			searchType.innerText = 'Everything';
			searchType.style.textTransform = 'capitalize';
		}
	}
})();