var $window = $(window),
    $navbar = $('.navbar');

$window.on('load', function() {
  var navbarHeight = $navbar.outerHeight();

  $navbar.removeClass('navbar-hidden');
  
  // Smooth scrolling
  $('#navbar').find('.nav-link').on('click', function(e) {
    e.preventDefault();
    var target = this.hash;
    $('html, body').stop().animate({
      'scrollTop': $(target).offset().top - (navbarHeight - 1)
    }, 600, 'swing');
  });

  // Bootstrap scrollspy
  $('body').scrollspy({
    target: '#navbar',
    offset: navbarHeight
  });

  // Form validation
  $('.needs-validation').on('submit', function(e) {
    if (this.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    $(this).addClass('was-validated');
  });

  var $form = $('.form');

  $form.find('.form-control').on('change blur', function() {
    var $input = $(this),
        $inputParent = $input.parent(),
        $error = $input.siblings('.invalid-feedback');

    if (!this.validity.valid) {
      $inputParent.addClass('is-invalid');
    } else {
      $inputParent.removeClass('is-invalid');
    }

    if (this.validity.valueMissing) {
      $error.text('The field is not filled').show();
    } else if (this.validity.typeMismatch) {
      $error.text('Please, provide a valid data').show();
    }
  });

  $form.find('.invalid-feedback').on('click', function() {
    $(this).hide().siblings('.form-control').trigger('focus');
  });
});

$window.on('load scroll', function() {
  if ($window.scrollTop() > 100) {
    $navbar.addClass('navbar-sm');
  } else {
    $navbar.removeClass('navbar-sm');
  }
});

$(function() {
  // Closing a collapsed navbar on clicking outside of it
  $(document).on('click', function(e) {
    var $collapse = $('.navbar-collapse');
    if (!$collapse.is(e.target) && $collapse.has(e.target).length === 0) {
      $collapse.collapse('hide');
    };
  });

  // For nested modals
  if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) === false) {
    $('.modal').on('hidden.bs.modal', function() {
      var $body = $('body'),
          $fixedContent = $('.fixed-top, .fixed-bottom, .is-fixed, .sticky-top'),
          scrollbarWidth = $(window).outerWidth() - $(window).innerWidth();
      if ($('.modal:visible').length) {
        $body.addClass('modal-open').css('padding-right', scrollbarWidth);
        $fixedContent.css('padding-right', scrollbarWidth);
      } else {
        $body.removeClass('modal-open').css('padding-right', '');
        $fixedContent.css('padding-right', '');
      }
    });
  }

  // Removing the :focus state from a link after modal window opens
  $('.modal').on('shown.bs.modal', function(e) {
    $('[data-toggle="modal"]').one('focus', function(e) {
      $(this).trigger('blur');
    });
  });
});
