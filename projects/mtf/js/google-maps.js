// Google map
var gmaps = (function() {
  var map;
  var autocomplete;
  var directionsService;
  var directionsDisplay;
  var geocoder;
  var infoWindowPrimary;
  var infoWindowSecondary;
  var markers = [];
  var markerCluster;
  var userLocationMarker;
  var numberOfNewMarkers = 15;
  var numberOfNearMarkers = 3;
  var travelMode = 'DRIVING';
  var filters = document.getElementsByName('map-filters');
  var addressInput = document.getElementById('address');
  var numberOfResultsInput = document.getElementById('numberOfResults');

  // Google map initialization
  google.maps.event.addDomListener(window, 'load', initMap);

  function initMap() {
    var mapCanvas = document.getElementById('map');
    var mapOptions = {
      zoom: 6,
      center: {
        lat: 48.5462491,
        lng: 31.5410313
      },
      mapTypeControl: false,
      fullscreenControl: false,
      scrollwheel: false
    };
    
    map = new google.maps.Map(mapCanvas, mapOptions);
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    geocoder = new google.maps.Geocoder();
    infoWindowPrimary = new google.maps.InfoWindow({maxWidth: 320});
    infoWindowSecondary = new google.maps.InfoWindow();
    userLocationMarker = new google.maps.Marker({
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5,
        strokeColor: '#008cff'
      }
    });
    
    if (!autocomplete) {
      autocomplete = new google.maps.places.Autocomplete(addressInput);
    }

    addMarkers();
    addFilters();
    addOptions();
  }

  function addMarkers() {
    var locations = storesData;

    locations.forEach(function(location) {
      var marker = new google.maps.Marker({
        icon: {
          url: 'img/map/mtf-marker.png',
          scaledSize: new google.maps.Size(32, 47),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(16, 47)
        },
        shape: {
          coords: [16,47,6,32,0,21,0,12,6,3,16,0,26,3,32,12,32,21,26,32],
          type: 'poly'
        },
        position: {
          lat: location.coords.lat,
          lng: location.coords.lon
        },
        title: location.adds,
        date: location.date
      });
      var content = '<strong>' + getTranslation('infowindowTitle') + '</strong><br>' + marker.title;

      marker.addListener('click', openInfoWindow(infoWindowPrimary, content, marker));
      markers.push(marker);
    });
  
    markerCluster = new MarkerClusterer(map, markers, {
      gridSize: 40,
      ignoreHiddenMarkers: true,
      styles: [{
        url: "img/map/cluster.png",
        height: 54,
        width: 50,
        anchor: [-14, 0],
        textColor: "#ff151f",
        textSize: 12
      }]
    });
  }

  function addOptions() {
    var zoom = document.getElementById('zoom');
    var type = document.getElementById('map-type');
    var fullscreen = document.getElementById('fullscreen');
    var scale = document.getElementById('scale');
    var zoomOnDoubleClick = document.getElementById('zoomondblclick');
    var infowindow = document.getElementById('infowindow');
    var routes = document.getElementsByName('route');
    var reset = document.getElementById('map-reset');
    var listener, listeners = [];

    zoom.addEventListener('change', function() {
      if (this.checked) {
        map.setOptions({
          scrollwheel: true
        });
      } else {
        map.setOptions({
          scrollwheel: false
        });
      }
    });

    type.addEventListener('change', function() {
      if (this.checked) {
        map.setOptions({
          mapTypeControl: true,
          mapTypeControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
          }
        });
      } else {
        map.setOptions({
          mapTypeControl: false
        });
      }
    });

    fullscreen.addEventListener('change', function() {
      if (this.checked) {
        map.setOptions({
          fullscreenControl: true,
          fullscreenControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
          }
        });
      } else {
        map.setOptions({
          fullscreenControl: false
        });
      }
    });

    scale.addEventListener('change', function() {
      if (this.checked) {
        map.setOptions({
          scaleControl: true
        });
      } else {
        map.setOptions({
          scaleControl: false
        });
      }
    });

    zoomOnDoubleClick.addEventListener('change', function() {
      if (this.checked) {
        markers.forEach(function(marker) {
          var listener = google.maps.event.addListener(marker, 'dblclick', function() {
            map.setZoom(17);
            map.panTo(this.getPosition());
          });
          listeners.push(listener);
        });
      } else {
        listeners.forEach(function(listener) {
          google.maps.event.removeListener(listener);
        });
      }
    });

    infowindow.addEventListener('change', function() {
      if (this.checked) {
        listener = google.maps.event.addListener(map, 'click', function() {
          closeInfoWindows(infoWindowPrimary, infoWindowSecondary);
        });
      } else {
        google.maps.event.removeListener(listener);
      }
    });

    for (var i = 0; i < routes.length; i++) {
      routes[i].addEventListener('change', function() {
        if (this.checked) {
          travelMode = this.value.toUpperCase();
        }
      });
    }

    reset.addEventListener('click', function(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }

      resetMap();
    });
  }

  function addFilters() {
    var btnGeolocation = document.getElementById('btn-geolocation');
    var btnGeocoding = document.getElementById('btn-geocoding');
    var btnToggle = document.querySelector('.btn-toggle');

    for (var i = 0; i < filters.length; i++) {
      filters[i].onchange = function() {
        switch (this.value) {
          case 'near':
            clearMap();
            filterByDistanceUsingGeolocation();
            break;
          case 'new':
            clearMap();
            filterByDate();
            break;
          default:
            alert('An incorrect input value');
        }
      };
    }

    btnGeolocation.setAttribute('title', getTranslation('filterMessage') + ' ' +
      numberOfNearMarkers + ' ' + declineWords(numberOfNearMarkers, getTranslation('resultDecline')));

    btnGeocoding.addEventListener('click', function() {
      // Close dropdown menu
      $('#btnGroupDrop1').dropdown('toggle');
      
      resetFilters();

      if (!(addressInput.value.length && numberOfResultsInput.value.length)) {
        alert(getTranslation('inputMessage1'));
      } else if (!numberOfResultsInput.value.length || numberOfResultsInput.value === '0') {
        alert(getTranslation('inputMessage2'));
      } else {
        clearMap();
        filterByDistanceUsingGeocoding();
      }
    });

    btnToggle.addEventListener('click', function() {
      if (this.classList.contains('active')) {
        this.setAttribute('title', getTranslation('hideFilter'));
      } else {
        this.setAttribute('title', getTranslation('showFilter'));
      }
    });
  }

  function filterByDate() {
    var newMarkers = markers.slice().sort(function(a, b) {
      return new Date(b.date) - new Date(a.date);
    }).splice(0, numberOfNewMarkers);

    newMarkers.forEach(function(marker) {
      var content = '<strong>' + getTranslation('infowindowTitle') + '</strong><br>' + marker.title;
      marker.addListener('click', openInfoWindow(infoWindowPrimary, content, marker));
    });

    updateMarkerCluster(newMarkers);
    fitToBounds(newMarkers);
  }

  function filterByDistanceUsingGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var currentPosition = new google.maps.LatLng(coords);
        var infoWindowContent = getTranslation('location');

        addUserLocationMarker(currentPosition, infoWindowContent);
        openInfoWindow(infoWindowSecondary, infoWindowContent, userLocationMarker)();
        addNearMarkers(currentPosition, numberOfNearMarkers);
      }, function() {
        resetOnError();
        handleLocationError(true, infoWindowSecondary, map.getCenter());
      });
    } else {
      resetOnError();
      handleLocationError(false, infoWindowSecondary, map.getCenter());
    }
  }

  function handleLocationError(browserHasGeolocation, infoWindow, position) {
    infoWindow.setOptions({
      position: position,
      content: browserHasGeolocation ? getTranslation('geolocationError1') : getTranslation('geolocationError2')
    });
    infoWindow.open(map);
  }

  function filterByDistanceUsingGeocoding() {
    var address = addressInput.value;
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === 'OK') {
        var position = results[0].geometry.location;
        var numberOfNearMarkers = parseInt(numberOfResultsInput.value);
        var infoWindowContent = getTranslation('coords');

        addUserLocationMarker(position, infoWindowContent);
        openInfoWindow(infoWindowSecondary, infoWindowContent, userLocationMarker)();
        addNearMarkers(position, numberOfNearMarkers);
      } else {
        resetOnError();
        alert(getTranslation('geocodingError') + status);
      }
    });
  }

  function addUserLocationMarker(position, content) {
    userLocationMarker.setOptions({
      map: map,
      position: position
    });
    
    userLocationMarker.addListener('click', openInfoWindow(infoWindowSecondary, content, userLocationMarker));
  }

  function addNearMarkers(currentPosition, numberOfResults) {
    var nearMarkers = markers.slice();

    nearMarkers.forEach(function(marker) {
      marker.distance = google.maps.geometry.spherical.computeDistanceBetween(currentPosition, marker.position);
    });

    nearMarkers.sort(function(a, b) {
      return a.distance - b.distance;
    });

    nearMarkers = nearMarkers.splice(0, numberOfResults);

    nearMarkers.forEach(function(marker) {
      var start = currentPosition.lat() + ', ' + currentPosition.lng();
      var end = marker.getPosition().lat() + ', ' + marker.getPosition().lng();
      var content = '<strong>' + getTranslation('infowindowTitle') + '</strong><p>' + marker.title + '</p>' +
        '<a href="#" onclick="gmaps.getDirections(\'' + start + '\', \'' + end + '\');return false;">' +
        getTranslation('route') + '</a>';
        
      marker.addListener('click', function() {
        deleteMapObjects(directionsDisplay);
        openInfoWindow(infoWindowPrimary, content, marker)();
      });
    });

    updateMarkerCluster(nearMarkers);
    fitToBounds(nearMarkers);
  }

  function calculateAndDisplayRoute() {
    return function(start, end) {
      directionsService.route({
        origin: start,
        destination: end,
        travelMode: travelMode
      }, function(response, status) {
        if (status === 'OK') {
          directionsDisplay.setOptions({
            map: map,
            directions: response,
            suppressMarkers: true
          });

          var calculateDistanceAndTime = function(result) {
            var route = result.routes[0].legs[0];
            var dist = route.distance.text;
            var time = route.duration.text;

            var div = document.createElement('div');
            div.innerHTML = infoWindowPrimary.getContent();
            var link = div.getElementsByTagName('a')[0];
            div.removeChild(link);
            var content = div.innerHTML +
              '<strong>' + getTranslation('distance') + ':</strong> ' + dist +
              '<br><strong>' + getTranslation('time') + ':</strong> ' + time;

            infoWindowPrimary.setContent(content);
            // Reopen an infowindow to fit its content in the viewport
            infoWindowPrimary.open(map, infoWindowPrimary.anchor);
          };

          calculateDistanceAndTime(response);
        } else {
          alert(getTranslation('directionsError') + status);
        }
      });
    };
  }

  function updateMarkerCluster(markers) {
    markerCluster.clearMarkers();
    markerCluster.addMarkers(markers);
  }

  function fitToBounds(markers) {
    var bounds = new google.maps.LatLngBounds();

    markers.forEach(function(marker) {
      bounds.extend(marker.position);
    });

    if (userLocationMarker && userLocationMarker.position) {
      bounds.extend(userLocationMarker.position);
    }

    map.fitBounds(bounds);
  }

  function openInfoWindow(infoWindow, content, marker) {
    return function() {
      infoWindow.setContent(content);
      infoWindow.open(map, marker);
    };
  }

  function closeInfoWindows() {
    for (var i = 0; i < arguments.length; i++) {
      var infoWindow = arguments[i];
      if (infoWindow) {
        infoWindow.close();
      }
    }
  }

  function deleteMapObjects() {
    for (var i = 0; i < arguments.length; i++) {
      var mapObject = arguments[i];
      if (mapObject) {
        mapObject.setMap(null);
      }
    }
  }

  function clearMap() {
    closeInfoWindows(infoWindowPrimary, infoWindowSecondary);
    deleteMapObjects(userLocationMarker, directionsDisplay);
  }

  function resetFilters() {
    for (var i = 0; i < filters.length; i++) {
      var filter = filters[i];
      filter.checked = false;
      filter.parentNode.classList.remove('active');
    }
  }

  function resetOptions() {
    var inputs = document.getElementById('toolbar').getElementsByTagName('input');
    var drivingDirections = document.getElementById('driving');
    
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      if (input.type === 'checkbox') {
        input.checked = false;
      }
    }

    drivingDirections.checked = true;
  }

  function resetOnError() {
    clearMap();
    markerCluster.clearMarkers();
    map.setOptions({
      center: map.center,
      zoom: 6
    });
  }

  function resetMap() {
    addressInput.value = numberOfResultsInput.value = '';
    markers = [];
    markerCluster.clearMarkers();
    resetFilters();
    resetOptions();
    initMap();
  }

  function declineWords(number, titles) {
    var cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
  }

  function getTranslation(key) {
    var lang = document.getElementsByTagName('html')[0].getAttribute('lang').substr(0,2) || 'uk';
    var data = {
      uk: {
        infowindowTitle: 'Магазин МТФ',
        coords: 'Координати введеної адреси',
        geocodingError: 'Службі геокодування не вдалося виконати запит через такі причини: ',
        location: 'Ваше місцезнаходження',
        geolocationError1: 'Помилка: не вдалося запустити службу геолокації. Дозвольте браузеру визначити Ваше місцезнаходження або скористайтеся службою геокодування',
        geolocationError2: 'Помилка: Ваш браузер не підтримує службу геолокації',
        route: 'Прокласти маршрут',
        directionsError: 'Службі Directions не вдалося виконати запит через такі причини: ',
        distance: 'Відстань',
        time: 'Час руху',
        inputMessage1: 'Заповніть усі поля.',
        inputMessage2: 'Заповніть поле "Кількість магазинів". Значення має бути цілим числом, більшим за 0.',
        filterMessage: 'Фільтрування за найближчими магазинами (служба геолокації), \nвідповідно до початкового налаштування відображається',
        resultDecline: ['результат', 'результата', 'результатів'],
        showFilter: 'Показати фільтри',
        hideFilter: 'Приховати фільтри'
      },
      ru: {
        infowindowTitle: 'Магазин МТФ',
        coords: 'Координаты введённого адреса',
        geocodingError: 'Службе геокодирования не удалось выполнить запрос по следующим причинам: ',
        location: 'Ваше местоположение',
        geolocationError1: 'Ошибка: не удалось запустить службу геолокации. Позвольте браузеру определить Ваше местоположение или воспользуйтесь службой геокодирования',
        geolocationError2: 'Ошибка: Ваш браузер не поддерживает службу геолокации',
        route: 'Проложить маршрут',
        directionsError: 'Службе Directions не удалось выполнить запрос по следующим причинам: ',
        distance: 'Расстояние',
        time: 'Время движения',
        inputMessage1: 'Заполните все поля.',
        inputMessage2: 'Заполните поле "Количество магазинов". Значение должно быть целым числом, большим 0.',
        filterMessage: 'Фильтрация по ближайшим магазинам (служба геолокации), \nсогласно начальным настройкам отображается',
        resultDecline: ['результат', 'результата', 'результатов'],
        showFilter: 'Показать фильтры',
        hideFilter: 'Скрыть фильтры'
      }
    };
  
    return data[lang][key];
  }

  return {
    getDirections: calculateAndDisplayRoute()
  };
}());