(function() {
  var map;
  var markerCluster;
  var markers = [];
  var markersByLocality = [];
  var mapCenter = new google.maps.LatLng(48.5462491, 31.5410313);
  var infoWindow = new google.maps.InfoWindow();

  google.maps.event.addDomListener(window, 'load', initMap);

  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: mapCenter,
      zoom: 6,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT
      },
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT
      }
    });

    addMarkers();
    addControls();
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
        id: location.id,
        loc: location.loc,
        title: location.adds,
        date: location.date,
        visible: false
      });

      markers.push(marker);

      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(marker.title);
        infoWindow.open(map, marker);
      });
    });
      
    markerCluster = new MarkerClusterer(map, markers, {
      gridSize: 40,
      averageCenter: true,
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

  function addControls() {
    var $select = $('.location-filter').find('.select');
    var $list = $('.location-list');
    var $listBody = $list.find('.location-list-body');
    var $listItem = $listBody.find('.list-group-item');
    var closeInfoWindow = function() {
      if (infoWindow) {
        infoWindow.close();
      }
    };
    
    $select.on('select2:select', function() {
      var locality = $(this).val();

      $listBody.scrollTop(0);
      $listItem.removeClass('active');
      $list.each(function() {
        var $this = $(this);
        $this.data('locality') === locality ? $this.addClass('open') : $this.removeClass('open shifted');
      });

      closeInfoWindow();

      markersByLocality = [];
    
      markers.forEach(function(marker) {
        if (marker.loc === locality) {
          marker.setVisible(true);
          map.panTo(marker.position);
          markersByLocality.push(marker);
        } else {
          marker.setVisible(false);
        }
      });

      markerCluster.repaint();
      map.setZoom(6);
    });

    $list.on('click', '.btn-close', function() {
      $(this).closest('.location-list').removeClass('open shifted');
      $select.val(null).trigger('change');

      map.setOptions({
        center: mapCenter,
        zoom: 6
      });

      closeInfoWindow();

      markers.forEach(function(marker) {
        marker.setVisible(false);
      });

      markerCluster.repaint();
    }).on('click', '.btn-shift', function() {
      $(this).closest('.location-list').toggleClass('shifted');
    });

    $listItem.on('click', function() {
      var $this = $(this), id = $this.data('id');

      $this.toggleClass('active').siblings().removeClass('active');

      closeInfoWindow();

      markersByLocality.forEach(function(marker) {
        if ($this.hasClass('active') && marker.id !== id) {
          marker.setVisible(false);
        } else {
          marker.setVisible(true);
          if ($this.hasClass('active')) {
            map.panTo(marker.position);
            map.setZoom(17);
          } else {
            map.setZoom(6);
          }
        }
      });
    });

    $listItem.on('click', '.js-popup-link', function(e) {
      e.stopPropagation();
    });

    $listBody.on('scroll', function() {
      var $this = $(this);
      var $listHead = $this.prev();
    
      if ($this.scrollTop() > 0) {
        $listHead.addClass('active');
      } else {
        $listHead.removeClass('active');
      }
    });
  }
}());