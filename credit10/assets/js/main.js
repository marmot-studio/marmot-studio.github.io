$(function() {
  // Close navbar on click outside / ESCAPE press
  var closeNavbar = function(e) {
    var $nav = $('.navbar-collapse');
    if (!$(e.target).closest($nav).length && e.type === 'click' || e.keyCode === 27) {
      $nav.collapse('hide');
      $(document).off('click keydown', closeNavbar);
    }
  };

  $('#navbar').on('shown.bs.collapse', function() {
    $(document).on('click keydown', closeNavbar);
  });

  // Use external SVG spritemaps in any browser
  svg4everybody();

  // Polyfill for CSS `position: sticky`
  var stickyElems = $('.sticky');
  Stickyfill.add(stickyElems);

  // Bootstrap tooltips
  $('[data-toggle="tooltip"]').tooltip({
    delay: {
      "show": 200,
      "hide": 150
    }
  });

  // Cookie toast
  var $toastСookie = $('.toast-cookie');
  if ($toastСookie.length) {
    $toastСookie.toast({
      autohide: false
    });

    setTimeout(function() {
      $toastСookie.toast('show');
    }, 1000);

    $toastСookie.on('show.bs.toast', function() {
      // Вешаем куки
    });
  }

  // Credit toast
  var $toastCredit = $('.toast-credit');
  if ($toastCredit.length) {
    $toastCredit.toast({
      delay: 2000000
    });

    setTimeout(function() {
      $toastCredit.toast('show');
    }, 1000);
  }

  // Range slider
  var rangeObj = {
    '.range-amount': '#amount',
    '.range-term': '#term'
  };
  var $rangeSlider = $('.range');

  $.each(rangeObj, function(slider, field) {
    $(slider).rangeslider({
      polyfill: false,
      onSlide: function(position, value) {
        $(field).val(value);
      },
      onSlideEnd: function(position, value) {
        $(field).val(value).change();
      }
    });

    $(field).on('change', function() {
      var $this = $(this);
      var min = $this.attr('min');
      var max = $this.attr('max');
      var val = $this.val();

      if (val < min) $this.val(min);
      if (val > max) $this.val(max);

      $(slider).val(val).change();

      var condition = $rangeSlider.get().some(function(item) {
        return item.value && +item.value > +item.min;
      });

      $('.reset-container').css('display', condition ? 'block' : 'none');
    });
  });

  // Reset filter
  var resetFilter = function(e) {
    e.preventDefault();
    $('.reset-container').hide();
    $rangeSlider.each(function() {
      var value = $(this).attr('min');
      $(this).val(value).change();
    });
  };

  $('.reset-trigger').on('click', resetFilter);

  // Initialize sorting plugin
  var panels = '.panel-group';
  if ($(panels).length) {
    var grid = new Muuri(panels, {
      sortData: {
        id: function(item, element) {
          return parseInt(element.dataset.id);
        },
        rating: function(item, element) {
          return parseFloat(element.dataset.rating.replace(/,/g, '.'));
        },
        sum: function(item, element) {
          return parseInt(element.dataset.sum);
        },
        period: function(item, element) {
          return parseInt(element.dataset.period);
        },
        rate: function(item, element) {
          var percent = parseFloat(element.dataset.rate.replace(/,/g, '.'));
          return isNaN(percent) ? 0 : percent;
        }
      }
    });
  }

  var $sortControl = $('.sort-control');
  var sortValue = $sortControl.eq(0).val(); // Get initial active sort value

  // Sort
  $sortControl.on('change', sort);

  function sort() {
    var $this = $(this), currentSortValue = $this.val();

    if (sortValue === currentSortValue) {
      return;
    }

    if (currentSortValue === 'id' || currentSortValue === 'rate') {
      grid.sort(currentSortValue);
    } else {
      grid.sort(currentSortValue, {descending: true});
    }

    sortValue = currentSortValue;
  }

  $('.panel-collapse').on('shown.bs.collapse', function() {
    grid.refreshItems().layout(true);
  }).on('hidden.bs.collapse', function() {
    grid.refreshItems().layout(true);
  });

  // jQuery Bar Rating
  (function() {
    var ratings = ['star', 'brick'];

    $.each(ratings, function(i, el) {
      $('.rating-' + el).each(function() {
        var $this = $(this);
        var initialRating = parseFloat($this.parent().data('rating').replace(/,/g, '.'));

        $this.barrating({
          theme: el,
          initialRating: initialRating,
          showSelectedRating: false,
          readonly: true
        });
      });
    });

    $('.rating-color-star').barrating({
      theme: 'star color-star'
    });
  }());

  // Add smooth scrolling
  var scroll = new SmoothScroll('.scroll-link', {
    speed: 500,
    speedAsDuration: true,
    offset: 5
  });

  var links = document.getElementsByTagName('a');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function(e) {
      if (this.getAttribute('href') === '#') {
        e.preventDefault();
      }
    });
  }

});