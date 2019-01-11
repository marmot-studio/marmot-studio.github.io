$(function() {
  // Logotype animation with anime.js
  var logo;

  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    logo = 'img/logo-mobile.svg';
  } else {
    logo = 'img/logo-desktop.svg';
  }
  
  $('.navbar-brand').load(logo, function() {
    var logoAnimation = anime.timeline({
      direction: 'alternate',
      loop: true
    });
    logoAnimation
      .add({
        targets: ['.logo .a', '.logo .b'],
        strokeOpacity: 1,
        strokeDashoffset: {
          value: [anime.setDashoffset, 0],
          duration: 1800,
          easing: 'easeInOutSine'
        },
        fillOpacity: {
          value: 1,
          delay: 1800,
          duration: 800,
          easing: 'easeInOutQuad'
        }
      })
      .add({
        targets: '.logo .c',
        fillOpacity: [
          {
            value: 1,
            delay: function(el, i, l) {
              return i * 100;
            },
            easing: 'easeInOutQuad'
          },
          {
            duration: 5000
          }
        ]
      });
  });

  // "Scroll to top" button
  (function() {
    var $btnScrolltop = $('#btn-scrolltop');

    $(window).on('scroll', function() {
      if ($(this).scrollTop() > 400) {
        $btnScrolltop.fadeIn(200);
      } else {
        $btnScrolltop.fadeOut(200);
      }
    });

    $btnScrolltop.on('click', function() {
      $('html, body').animate({
        scrollTop: 0
      }, 400);
    });
  })();

  // Slick carousel
  (function() {
    var $carousel1 = $('.slick-carousel1'),
        $carousel2 = $('.slick-carousel2'),
        $carousel3 = $('.slick-carousel3'),
        $carousel3lg = $('.slick-carousel3-lg'),
        $carousel4 = $('.slick-carousel4');

    if ($carousel1.length) {
      $carousel1.slick({
        autoplay: true,
        autoplaySpeed: 5000,
        prevArrow: '<button type="button" class="slick-prev"><i class="icon icon-chevron-thin-left"></i></button>',
        nextArrow: '<button type="button" class="slick-next"><i class="icon icon-chevron-thin-right"></i></button>',
        mobileFirst: true,
        responsive: [{
          breakpoint: 0,
          settings: {
            arrows: false
          }
        }, {
          breakpoint: 991,
          settings: {
            arrows: true,
            centerMode: true,
            centerPadding: '18%'
          }
        }, {
          breakpoint: 1919,
          settings: {
            arrows: true,
            centerMode: true,
            centerPadding: '23%'
          }
        }]
      });
    }

    if ($carousel2.length) {
      $carousel2.on('init breakpoint', function() {
        var $slickList = $carousel2.find('.slick-list'),
            $slickSlide = $carousel2.find('.slick-slide');
        $slickSlide.on('mouseenter', function() {
          $slickList.css('z-index', '1');
        }).on('mouseleave', function() {
          $slickList.css('z-index', 'auto');
        });
      }).slick({
        slidesToShow: 4,
        infinite: false,
        arrows: false,
        dots: true,
        responsive: [{
          breakpoint: 992,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 414,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 414,
          settings: {
            slidesToShow: 1
          }
        }]
      });
    }
    
    if ($carousel3.length) {
      $carousel3lg.slick({
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.slick-carousel3'
      });

      $carousel3.slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        swipeToSlide: true,
        asNavFor: '.slick-carousel3-lg',
        focusOnSelect: true,
        mobileFirst: true,
        responsive: [
          {
            breakpoint: 575,
            settings: {
              vertical: true,
              verticalSwiping: true
            }
          },
          {
            breakpoint: 991,
            settings: {
              vertical: false,
              slidesToShow: 3
            }
          },
          {
            breakpoint: 1199,
            settings: {
              vertical: true,
              verticalSwiping: true
            }
          }
        ]
      }).on('wheel', function (e) {
        e.preventDefault();
        if (e.originalEvent.deltaY < 0) {
          $(this).slick('slickPrev');
        } else {
          $(this).slick('slickNext');
        }
      });

      $('[data-fancybox]').fancybox();
    }

    if ($carousel4.length) {
      $carousel4.slick({
        arrows: false,
        fade: true,
        autoplay: true,
        autoplaySpeed: 10000
      });
    }
  })();

  // JQuery UI slider
  (function() {
    var $priceRange = $('#price-range'),
        $priceMin = $('#price-min'),
        $priceMax = $('#price-max');

    if ($priceRange.length) {
      $priceRange.slider({
        range: true,
        min: 0,
        max: 3000,
        values: [0, 3000],
        slide: function(event, ui) {
          $priceMin.val(ui.values[0]);
          $priceMax.val(ui.values[1]);
        }
      });

      $priceMin.val($priceRange.slider('values', 0)).on('input', function() {
        $priceRange.slider('values', 0, parseInt($(this).val()));
      });

      $priceMax.val($priceRange.slider('values', 1)).on('input', function() {
        $priceRange.slider('values', 1, parseInt($(this).val()));
      });
    }

    var $sizeRange = $('#size-range'),
        $sizeMin = $('#size-min'),
        $sizeMax = $('#size-max');

    if ($sizeRange.length) {
      $sizeRange.slider({
        range: true,
        min: 38,
        max: 70,
        step: 2,
        values: [38, 70],
        slide: function(event, ui) {
          $sizeMin.val(ui.values[0]);
          $sizeMax.val(ui.values[1]);
        }
      });

      $sizeMin.val($sizeRange.slider('values', 0)).on('input', function() {
        $sizeRange.slider('values', 0, parseInt($(this).val()));
      });

      $sizeMax.val($sizeRange.slider('values', 1)).on('input', function() {
        $sizeRange.slider('values', 1, parseInt($(this).val()));
      });
    }
  })();

  // JQuery UI spinner
  (function() {
    var $spinner = $('.spinner');
    if ($spinner.length) {
      $spinner.spinner({
        min: 0
      });

      $('.cart-table').find($spinner).spinner({
        min: 1,
        spin: function(event, ui) {
          $(this).val(ui.value).closest('.ms2_form').submit();
        }
      });
    }
  })();

  // Polyfill for "position: sticky"
  (function() {
    var $sticky = $('.js-sticky');
    if ($sticky.length) {
      $sticky.Stickyfill();
    }
  })();

  // Particles.js
  if ($('#particles').length) {
    particlesJS.load('particles', 'data/particles.json');
  }

  // Disable a button using JS
  $('.disabled').on('click', function(e) {
    e.preventDefault();
  });

  // Select2 plugin
  (function() {
    var $select = $('.select');
    if ($select.length) {
      for (var i = 1; i < 3; i++) {
        $('.select.style-' + i).select2({
          minimumResultsForSearch: Infinity,
          theme: 'default select2-style' + i
        });
      }
    }
  })();

  // Preventing page scrolling when scrolling a DIV element
  $('.js-scrollable').on('mousewheel DOMMouseScroll', function(e) {
    var $this = $(this),
        scrollTop = this.scrollTop,
        scrollHeight = this.scrollHeight,
        height = $this.height(),
        delta = (e.type == 'DOMMouseScroll' ? e.originalEvent.detail * -40 : e.originalEvent.wheelDelta),
        up = delta > 0;

    var prevent = function() {
      e.stopPropagation();
      e.preventDefault();
      e.returnValue = false;
      return false;
    };

    if (!up && -delta > scrollHeight - height - scrollTop) {
      $this.scrollTop(scrollHeight);
      return prevent();
    } else if (up && delta > scrollTop) {
      $this.scrollTop(0);
      return prevent();
    }
  });

  // Fancybox galleries
  (function() {
    var $popup = $('.js-popup-link');
    if ($popup.length) {
      $popup.each(function() {
        var $this = $(this);
        var id = $this.closest('.list-group-item').data('id');
        $this.attr('data-fancybox', id);
      }).fancybox({animationDuration:0});
    }
  })();

  // Off-canvas menu
  $('[data-toggle="offcanvas"]').on('click', function() {
    $('.row-offcanvas').toggleClass('active');
  });

  // Bootstrap dropdown menu
  $('.dropdown-toggle').dropdown({
    flip: false
  });

  // Prevent Bootstrap dropdown menu from closing on click inside
  (function() {
    var $dropdown = $('#toolbar').find('.dropdown-menu');
    $dropdown.on('click', function(e) {
      if (!$(e.target).hasClass('dropdown-item')) {
        e.stopPropagation();
      }
    });
  })();

  // Bootstrap tooltip
  $('.custom-tooltip').tooltip({
    delay: {
      'show': 400,
      'hide': 0
    }
  });

  // Bootstrap popover
  (function() {
    var $popover = $('.form-account').find('.icon');
    $popover.popover({
      trigger: 'hover',
      placement: 'top',
      offset: -95,
      template: '<div class="popover custom-popover" role="tooltip"><div class="popover-inner"><div class="arrow"></div><div class="popover-body"></div></div></div>',
      delay: {
        'show': 200,
        'hide': 0
      }
    });
  })();

  // Save Bootstrap collapse state on page refresh
  (function() {
    var values = [];
    var storedItem = localStorage.getItem('accordion');

    $('#accordion').on('shown.bs.collapse', function(e) {
      values.push(e.target.id);
      localStorage.setItem('accordion', JSON.stringify(values));
    }).on('hidden.bs.collapse', function(e) {
      values = values.filter(function(value) {
        return value !== e.target.id;
      });
      localStorage.setItem('accordion', JSON.stringify(values));
    });

    if (storedItem && storedItem !== '[]') {
      var data = JSON.parse(storedItem);
      data.forEach(function(elem) {
        $('#' + elem).collapse('show');
      });
    }
  })();
});

(function(w) {
  var $bg = $('.js-account-bg');

  if ($bg.length) {
    var getImgAspectRatio = function() {
      var img = document.createElement('img');
      img.src = 'img/account/bg.png';
  
      return img.naturalWidth/img.naturalHeight;
    };

    var imgAspectRatio = getImgAspectRatio();

    $(w).on('load', function() {
      $bg.fadeIn(400);
    });

    $(w).on('load resize', function() {
      var bgWidth = $bg.outerWidth(),
          bgHeight = $bg.outerHeight(),
          bgAspectRatio = bgWidth/bgHeight,
          bgPos = $bg.css('backgroundPosition').split(' '),
          bgPosY = parseInt(bgPos[1].replace('px,', ''));

      if (bgAspectRatio > imgAspectRatio || bgWidth < 576) {
        $bg.css('backgroundSize', 'cover');
      } else {
        $bg.css('backgroundSize', 'auto ' + (bgHeight - bgPosY) + 'px');
      }
    });
  }
})(window);

$(window).on('load resize', function() {
  // Shave.js
  (function() {
    var $ellipsis = $('.ellipsis');
        
    if ($ellipsis.length) {
      $('.ellipsis').shave(48);
    }
  })();
});