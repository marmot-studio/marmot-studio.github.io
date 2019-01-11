$(window).on('load scroll', function() {
  var winScrollTop = $(window).scrollTop(),
      $navbar = $('.navbar'),
      $scroll = $('#scroll');

  if (winScrollTop > 0) {
    $scroll.hide();
  } else {
    $scroll.show();
  }

  if (winScrollTop > 50) {
    $navbar.addClass('active');
  } else {
    $navbar.removeClass('active');
  }

  setTimeout(function() {
    $('#globe').css('pointer-events', 'auto');
  }, 1000);
});

$(function() {
  var $navbar = $('.navbar');

  $('#navbar').on('show.bs.collapse', function() {
    $navbar.css('backgroundColor', '#0f1015');
  }).on('hidden.bs.collapse', function() {
    $navbar.css('backgroundColor', 'transparent');
  });

  // Closing a collapsed navbar on clicking outside of it
  $(document).on('click', function(e) {
    var $collapse = $navbar.find('.collapse');
    if (!$collapse.is(e.target) && $collapse.has(e.target).length === 0) {
      $collapse.collapse('hide');
    };
  });

  // Smooth scroll to anchor
  $('.navbar-nav .nav-link, #scroll').on('click', function(e) {
    if (this.hash !== '') {
      e.preventDefault();
      var hash = this.hash,
          $root = $('html, body');
      $root.animate({
        scrollTop: $(hash).offset().top - 58
      }, 600);
    }
  });

  // Bootstrap Scrollspy plugin
  $('body').scrollspy({
    target: '#navbar',
    offset: 59
  });

  // For nested modals
  if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) === false) {
    $('.modal').on('hidden.bs.modal', function() {
      var $body = $('body'),
          $fixedContent = $('.fixed-top, .fixed-bottom, .is-fixed, .sticky-top');
      if ($('.modal:visible').length) {
        $body.addClass('modal-open').css('padding-right', '17px');
        $fixedContent.css('padding-right', '17px');
      } else {
        $body.removeClass('modal-open').css('padding-right', '');
        $fixedContent.css('padding-right', '');
      }
    });
  }

  // Removing the :focus state from a link after modal window opens
  $('.modal').on('shown.bs.modal', function(e) {
    $('[data-toggle="modal"]').one('focus', function(e) {
      $(this).blur();
    });
  });

  // Animation
  (function spinGlobeIcon() {
    var width = 66,
        height = 66,
        time = Date.now(),
        origin = [0, 0],
        velocity = [.015, 0];
    var projection = d3.geoOrthographic()
        .scale(width / 2)
        .translate([width / 2, height / 2])
        .clipAngle(90);
    var path = d3.geoPath()
        .projection(projection);
    var svg = d3.select('.globe-container').append('svg')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'icon-globe');
    d3.json('data/world-110m.json', function(error, world) {
      if (error) throw error;
      var feature = svg.append('path')
          .datum(topojson.feature(world, world.objects.land))
          .attr('class', 'globe-path')
          .attr('fill', '#ffe000')
          .attr('d', path);
      d3.timer(function() {
        var t = Date.now() - time;
        projection.rotate([origin[0] + velocity[0] * t, origin[1] + velocity[1] * t]);
        feature.attr('d', path);
      });
    });
  })();

  function animateCheckMark(duration) {
    var checkMark = anime({
      targets: '.check-mark .b',
      strokeOpacity: 1,
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeOutCubic',
      duration: duration,
      delay: function(el, i) {
        return i * duration
      }
    });
  }

  $(window).on('scroll', function() {
    if ($(window).scrollTop() == 0) {
      animateCheckMark(300);
    }
  });

  $('.check-mark-container').load('img/misc/check-mark.svg', function() {
    setTimeout(function() {
      animateCheckMark(400);
    }, 500);
  });

  $('.infinity-container').load('img/misc/icon-infinity.svg', function() {
    var infinity = anime({
      targets: '.icon-infinity .a',
      strokeOpacity: 1,
      strokeDashoffset: {
        value: [anime.setDashoffset, 0],
        duration: 6000,
        easing: 'linear'
      },
      fillOpacity: [
        {
          value: 1,
          delay: 6000,
          duration: 600,
          easing: 'easeInOutQuad'
        },
        {
          duration: 1500
        }
      ],
      direction: 'alternate',
      loop: true
    });
  });

  $('.arrows-container').load('img/misc/icon-arrows.svg', function() {
    var arrows = anime({
      targets: '.icon-arrows',
      rotate: '1turn',
      duration: 12000,
      easing: 'linear',
      loop: true
    });
  });

  $('.cogwheel-container').load('img/misc/icon-cogwheel.svg', function() {
    var cogwheel = anime({
      targets: '.icon-cogwheel .b',
      rotate: '1turn',
      duration: 12000,
      easing: 'linear',
      loop: true
    });
  });

  $('#about-us .img-container').load('img/misc/proxy-server.svg', function() {
    var elem1 = anime({
      targets: '.img-server .g',
      strokeDashoffset: [0, 500],
      duration: 20000,
      easing: 'linear',
      loop: true
    });
    var elem2 = anime({
      targets: '.img-server .k',
      fill: '#7ebbf1',
      duration: 4000,
      easing: 'easeInOutCubic',
      direction: 'alternate',
      loop: true
    });
  });

  $('#scroll').load('img/misc/mouse.svg');

  var svg = ['mobile', 'wifi', 'mix', 'days', 'weeks', 'months'];
  svg.forEach(function(item) {
    $('#' + item).load('img/calc/' + item + '.svg');
  });

  // Bootstrap touchspin
  var $touchspin = $('.touchspin');

  $touchspin.TouchSpin({
    buttondown_class: 'btn icon-minus',
    buttonup_class: 'btn icon-plus',
    min: 1,
    max: 999999
  });

  $touchspin.on('change', function() {
    var $this = $(this);
    if ($this.val().length) {
      $this.removeClass('input-blinking');
    } else {
      $this.addClass('input-blinking');
    }
  });

  // Select2
  $('.select.style-1').select2({
    minimumResultsForSearch: Infinity,
    templateSelection: function(data) {
      var $data = $('<span><span class="lang">' + data.text + '</span><img src="img/lang/' + data.text.toLowerCase() + '.svg" class="flag"></span>');
      return $data;
    },
    theme: 'default select2-style1'
  });

  $('.select.style-2').select2({
    minimumResultsForSearch: Infinity,
    placeholder: 'Select your language',
    theme: 'default select2-style2'
    // Localization options
    // language: 'ru',
    // placeholder: 'Выберите ваш язык'
  });

  // Calculator
  var $selectContainer = $('#select-container');
  var $select3 = $selectContainer.find('.select');
  
  $.getJSON('data/country-data.json', function(result) {
    $select3.select2({
      data: result,
      dropdownParent: $selectContainer,
      templateSelection: function(data) {
        return $('<span class="select2-country"><img src="img/flags/' + data.code + '.svg" class="country-flag" alt="' + data.code + '"><span class="country-name">' + data.text + '</span></span>');
      },
      closeOnSelect: false,
      theme: 'default select2-style3'
    }).on('select2:closing', function(e) {
      e.preventDefault();
    }).on('select2:selecting', function() {
      $(this).val('').trigger('change');
    }).on('select2:select', function() {
      setCardState('connection', true);
    }).on('select2:unselect', function() {
      resetCalculator();
    });
  
    $select3.select2('open');
  
    $selectContainer.find('.select2-results__options').perfectScrollbar({
      theme: 'custom'
    });
  
    $selectContainer.find('.select2').on('click', function() {
      $(this).find('.select2-search__field').css('visibility', 'visible').focus();
    });
  }).fail(function() {
    $selectContainer.text('Country data was not loaded.');
  });
  
  var $inputNumberConnection = $('.js-number-connection');
  var $inputNumberDuration = $('.js-number-duration');
  var $calcButton = $('.js-btn-calc');
  
  function setCardState(cardName, boolean) {
    var $card = $('.js-card-' + cardName);
    var $inputRadio = $('.js-radio-' + cardName);
    var $inputNumber = $('.js-number-' + cardName);
  
    if (boolean) {
      $card.removeClass('card-disabled');
      $inputRadio.prop('disabled', false);
    } else {
      $card.addClass('card-disabled');
      $inputRadio.prop({'disabled': true, 'checked': false});
      $inputNumber.val('').prop('disabled', true);
    }
  }
  
  function calculate() {
    $('.country-flag').clone().appendTo('.js-country-flag');
    $('.js-country-name').text($('.country-name').text());
    $('.js-duration-value').text($('.js-radio-duration:checked').val() + ':');
  
    jQuery.each(['connection', 'duration'], function(i, el) {
      $('.js-radio-' + el + ':checked').siblings('.radio-icon').children().clone().appendTo('.js-' + el + '-type');
      $('.js-' + el + '-number').text($('.js-number-' + el).val());
    });
  }
  
  function resetCalculator() {
    setCardState('connection', false);
    setCardState('duration', false);
    $calcButton.prop('disabled', true);
    $inputNumberDuration.addClass('input-blinking');
    $select3.val('').trigger('change');
    $selectContainer.find('.select2-results__option').removeClass('select2-results__option--highlighted').attr('aria-selected', 'false');
    $('.calc-data-icon').empty();
  }
  
  $('.js-radio-connection').on('change', function() {
    var value = $(this).val();
  
    $inputNumberConnection.prop('disabled', false);
    setCardState('duration', true);
  
    switch (value) {
      case 'mobile':
        $inputNumberConnection.val('10').trigger('touchspin.updatesettings', {min: 10});
        break;
      case 'wifi':
        $inputNumberConnection.val('300').trigger('touchspin.updatesettings', {min: 300});
        break;
      case 'mix':
        $inputNumberConnection.val('80').trigger('touchspin.updatesettings', {min: 80});
        break;
      default:
        $inputNumberConnection.val('1').trigger('touchspin.updatesettings', {min: 1});
    }
  });
    
  $('.js-radio-duration').on('change', function() {
    $inputNumberDuration.prop('disabled', false);
  });
  
  $inputNumberDuration.on('change input', function() {
    $calcButton.prop('disabled', false);
  });
  
  $calcButton.on('click', calculate);
  
  $('#modal-calculation').on('hide.bs.modal', resetCalculator);

  function getPricesData(data) {
    $.getJSON('data/prices-data.json', function(response) {
      var pricesData = response;
      data(pricesData);
    });
  }

  getPricesData(function(pricesData) {
    // Code that depends on 'pricesData'
    console.log(pricesData);
  });

  // Spinning globe made with D3.js
  (function spinGlobe() {
    var rotate = [0, 0],
        velocity = [.015, 0],
        timer,
        time,
        globeWidth = $('#globe').outerWidth(),
        width = globeWidth,
        height = globeWidth,
        offset = 15,
        viewBox = [-offset, -offset, width + 2 * offset, height + 2 * offset].join(' ');

    var projection = d3.geoOrthographic()
        .scale(width / 2)
        .translate([width / 2, height / 2])
        .clipAngle(90);

    var path = d3.geoPath()
        .projection(projection)
        .pointRadius(4);

    var svg = d3.select('#globe')
        .append('svg')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', viewBox)
        .on('mouseenter', stopGlobe)
        .on('mouseleave', rotateGlobe);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-8, -4])
        .html(function(d) {
          return d.globeData.country;
        });

    svg.call(tip);

    var q = d3.queue()
        .defer(d3.json, 'data/world-110m.json')
        .defer(d3.json, 'data/globe-data.json')
        .await(ready);

    d3.xml('img/globe/meridians.svg').mimeType('image/svg+xml').get(function(error, xml) {
      if (error) throw error;
      document.getElementById('globe').appendChild(xml.documentElement);
    });

    function ready(error, world, globeData) {
      if (error) throw error;

      svg
        .append('g')
        .append('path')
        .datum({type: 'Sphere'})
        .attr('class', 'sphere')
        .attr('d', path);

      svg
        .append('g')
        .append('path')
        .datum(topojson.feature(world, world.objects.land))
        .attr('class', 'land')
        .attr('d', path);

      svg
        .append('g')
        .append('path')
        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
        .attr('class', 'borders')
        .attr('d', path);

      var highlight = svg.append('g');

      highlight
        .append('ellipse')
        .attr('rx', '100')
        .attr('ry', '100')
        .attr('cx', '45%')
        .attr('cy', '61%')
        .attr('fill', 'url(#radialGradient)');

      var gradient = highlight.append('radialGradient').attr('id', 'radialGradient').attr('fx', '40%').attr('fy', '40%');

      gradient
        .append('stop')
        .attr('offset', '10%')
        .attr('stop-color', 'rgba(31, 112, 154, 0.3)')
        .attr('stop-opacity', '.8');

      gradient
        .append('stop')
        .attr('offset', '70%')
        .attr('stop-color', 'rgba(31, 112, 154, 0.3)')
        .attr('stop-opacity', '0');

      svg
        .append('g')
        .selectAll('path')
        .data(globeData)
        .enter()
        .append('path')
        .datum(function(d) {
          return {
            type: 'Point',
            globeData: d,
            coordinates: [d.lon, d.lat]
          };
        })
        .attr('class', 'marker')
        .attr('d', path)
        .on('mouseover', tip.show)
        .on('mouseleave', tip.hide);

      rotateGlobe();
    }

    function rotateGlobe() {
      timer = d3.timer(function(elapsed) {
        time = elapsed;
        projection.rotate([rotate[0] + velocity[0] * elapsed, rotate[1] + velocity[1] * elapsed]);
        svg.selectAll('path').attr('d', path);
      });
    }

    function stopGlobe() {
      timer.stop();
      var elapsed = time;
      rotate = [rotate[0] + velocity[0] * elapsed, rotate[1] + velocity[1] * elapsed];
    }

    $('.modal').on('show.bs.modal', function() {
      stopGlobe();
    }).on('hide.bs.modal', function() {
      rotateGlobe();
    });

    d3.select(window).on('resize', function() {
      globeWidth = $('#globe').outerWidth();
      width = globeWidth;
      height = globeWidth;
      offset = 15;
      viewBox = [-offset, -offset, width + 2 * offset, height + 2 * offset].join(' ');

      projection
        .scale(width / 2)
        .translate([width / 2, height / 2]);

      svg
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', viewBox);

      svg.selectAll('path').attr('d', path);
    });
  })();
});
