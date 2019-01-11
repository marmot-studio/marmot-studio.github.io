document.addEventListener('DOMContentLoaded', function() {
  'use strict';
  
  var body = document.body;
  var logo = document.querySelector('.navbar-logo');

  // Fullpage.js
  if (document.getElementById('fullpage')) {
    new fullpage('#fullpage', {
      licenseKey: 'OPEN-SOURCE-GPLV3-LICENSE',
      anchors: ['section01', 'section02', 'section03', 'section04', 'section05', 'section06'],
      lockAnchors: true,
      menu: '.nav-main',
      navigation: true,
      navigationPosition: 'right',
      navigationTooltips: ['Главная', 'Монетизация', 'Преимущества', 'Выплаты', 'Страны', 'Контакты'],
      responsiveHeight: 640,
      responsiveWidth: 992,
      fitToSection: false,
      bigSectionsDestination: 'top',
      normalScrollElements: '.modal',
      afterRender: function() {
        // The following piece of code + option "lockAnchors: true" = menu without using anchors
        selectAll('.js-nav-link').forEach(function(item, i) {
          item.addEventListener('click', function(e) {
            fullpage_api.moveTo(i + 1);
            e.preventDefault();
          });
        });
  
        document.querySelector('.js-scroll').addEventListener('click', function() {
          fullpage_api.moveTo(2);
        });
      },
      onLeave: function(origin, destination, direction) {
        if (destination.index > 0) {
          body.classList.add('is-active');
          if (window.innerWidth >= 1200) {
            document.querySelector('.nav-lang .dropdown').classList.remove('open');
          }
        } else {
          body.classList.remove('is-active');
        }
  
        if (destination.index % 2 != 0) {
          logo.classList.add('active');
        } else {
          logo.classList.remove('active');
        }
      }
    });
  }

  // Form validation
  var formValidSelector = '.form-validation';
  if (document.querySelector(formValidSelector)) {
    validate.init({
      selector: formValidSelector,
      messageValueMissing: 'Пожалуйста, заполните это поле.',
      messageValueMissingCheckbox: 'Это поле должно быть отмечено.',
      messageValueMissingRadio: 'Пожалуйста, выберите значение.',
      messageValueMissingSelect: 'Пожалуйста, выберите значение.',
      messageValueMissingSelectMulti: 'Пожалуйста, выберите по крайней мере одно значение.',
      messageTypeMismatchEmail: 'Пожалуйста, введите email-адрес.',
      messageTypeMismatchURL: 'Пожалуйста, введите URL.',
      messageTooShort: 'Текст должен содержать минимум {minLength} символов. Сейчас Вы используете {length} символов.',
      messageTooLong: 'Пожалуйста, сократите текст до {maxLength} символов. Сейчас Вы используете {length} символов.',
      messagePatternMismatch: 'Введённое значение должно соответствовать требуемому формату.',
      messageBadInput: 'Пожалуйста, введите число.',
      messageStepMismatch: 'Пожалуйста, выберите правильное значение.',
      messageRangeOverflow: 'Пожалуйста, выберите значение, не превышающее {max}.',
      messageRangeUnderflow: 'Пожалуйста, выберите значение, не меньше чем {min}.',
      messageGeneric: 'Неверное значение.',
      afterShowError: function (field, error) {
        var length = field.value.length;
        var minLength = field.getAttribute('minlength');
        var maxLength = field.getAttribute('maxlength');
        var words = ['символ', 'символа', 'символов'];
  
        if (field.hasAttribute('minlength') && length) {
          error = 'Текст должен содержать минимум ' + minLength + ' ' + declineWords(minLength, words) +
          '. Сейчас у Вас ' + length + ' ' + declineWords(length, words) + '.';
          field.nextSibling.innerHTML = error;
        }
  
        if (field.hasAttribute('maxlength') && length) {
          error = 'Пожалуйста, сократите текст до ' + maxLength + ' ' + declineWords(maxLength, ['символа', 'символов', 'символов']) +
          '. Сейчас Вы используете ' + length + ' ' + declineWords(length, words) + '.';
          field.nextSibling.innerHTML = error;
        }
      }
    });
  }

  // Password matching
  (function() {
    var forms = selectAll('.form-validation');
    var submitHandler = function(e) {
      e.preventDefault();
    };

    forms.forEach(function(form) {
      var fields = selectAll(form.elements);
  
      fields.forEach(function(field) {
        field.addEventListener('blur', function() {
          checkPasswords(form, this);
        });
      });
    });

    function checkPasswords(form, field) {
      if (field.name === 'password' || field.name === 'password-confirm') {
        var password = form.querySelector('[name="password"]');
        var passwordСonfirm = form.querySelector('[name="password-confirm"]');
        var error = 'Пароли не совпадают.';
  
        if (password.value.length && passwordСonfirm.value.length) {
          if (passwordСonfirm.value != password.value) {
            form.addEventListener('submit', submitHandler);
            validate.showError(passwordСonfirm, error);
          } else {
            form.removeEventListener('submit', submitHandler);
            validate.removeError(passwordСonfirm);
          }
        }
      }
    }
  }());

  // Loading SVG files
  selectAll('[data-svg]').forEach(function(item) {
    loadFile(item.dataset.svg, item, function() {
      // Responsive SVGs for old browsers (https://css-tricks.com/scale-svg/#article-header-id-10)
      var svg = item.firstChild;
      var viewBox = svg.getAttribute('viewBox').split(' ');
      var paddingBottom = viewBox[3] / viewBox[2] * 100 + '%';
      var height = getComputedStyle(item).height;
      var width = viewBox[2] * parseInt(height) / viewBox[3] + 'px';

      if (!item.classList.contains('js-fixed-height')) {
        svg.setAttribute('preserveAspectRatio', 'xMidYMin slice');
        svg.style.cssText = 'display: block;' +
          'width: 100%;' +
          'height: 1px;' +
          'box-sizing: content-box;' +
          'padding-bottom: ' + paddingBottom + ';' +
          'overflow: visible;';
      } else {
        svg.style.cssText = 'width: ' + width + ';' +
          'height: ' + height + ';';
      }

      if (item.classList.contains('js-map')) {
        animateMap();
      }
    });
  });
  
  // Map animation
  function animateMap() {
    var elements = document.getElementsByClassName('point');
    var numberOfElements = elements.length;
    var interval = 2000;
  
    function getRandomInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  
    function getRandomElements() {
      var randomElements = [];
      var numberOfRandomElements = getRandomInteger(10, 20);
  
      for (var i = numberOfRandomElements - 1; i >= 0; --i) {
        var randomElement = Math.floor(Math.random() * numberOfElements);
        randomElements.push(randomElement);
      }
  
      return randomElements;
    }
  
    function clearRandomElements() {
      for (var i = numberOfElements - 1; i >= 0; --i) {
        elements[i].classList.remove('active');
      }
    }
  
    function setRandomElements() {
      var randomElements = getRandomElements();
  
      clearRandomElements();
  
      for (var i = randomElements.length - 1; i >= 0; --i) {
        var index = randomElements[i];
        elements[index].classList.add('active');
      }
    }
  
    setRandomElements();
  
    setInterval(setRandomElements, interval);
  }

  // Navbar collapse
  (function() {
    var togglers = selectAll('.collapse-toggler');
    var togglerActiveClass = 'active';
    var collapseActiveClass = 'open';
    var dataAttribute = 'data-event-outside';

    togglers.forEach(function(item) {
      var target = item.dataset.target || item.getAttribute('href');
      var collapse = document.querySelector(target);

      item.addEventListener('click', function() {
        toggleAttributes(this, collapse);
        addEventListener(this, collapse);
      });
    });

    function toggleAttributes(toggler, collapse) {
      toggler.classList.toggle(togglerActiveClass);
      toggler.setAttribute('aria-expanded', toggler.getAttribute('aria-expanded') === 'false');
      collapse.classList.toggle(collapseActiveClass);
    }
    
    function addEventListener(toggler, collapse) {
      if (!collapse.hasAttribute(dataAttribute)) return;

      document.addEventListener('click', closeCollapse);
      document.addEventListener('keydown', closeCollapse);

      function closeCollapse(e) {
        if (!collapse.contains(e.target) && !toggler.contains(e.target) || e.keyCode === 27) {
          toggleAttributes(toggler, collapse);

          document.removeEventListener('click', closeCollapse);
          document.removeEventListener('keydown', closeCollapse);
        }
      }
    }
  }());

  // Dropdown
  (function() {
    var dropdown = '.dropdown';
    var trigger = '.dropdown-trigger';
    var toggleClass = 'open';
    var selectedItem = null;
    
    selectAll(trigger).forEach(function(elem) {
      elem.addEventListener('click', function(e) {
        e.preventDefault();
        this.closest(dropdown).classList.toggle(toggleClass);
        this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'false');
    
        if (selectedItem && selectedItem != this) {
          close(selectedItem);
        }
    
        selectedItem = this;
    
        document.addEventListener('click', closeDropdowns);
        document.addEventListener('keydown', closeDropdowns);
      });
    });
    
    function closeDropdowns(e) {
      if (!e.target.closest(trigger) || e.keyCode === 27) {
        selectAll(trigger).forEach(function(elem) {
          close(elem);
        });
    
        document.removeEventListener('click', closeDropdowns);
        document.removeEventListener('keydown', closeDropdowns);
      }
    }
    
    function close(elem) {
      elem.closest(dropdown).classList.remove(toggleClass);
      elem.setAttribute('aria-expanded', 'false');
    }
  }());

  // Modal
  (function() {
    var body = document.body;
    var triggers = selectAll('.modal-trigger');
    var closeButtons = selectAll('.modal-close');
    var fixedContent = selectAll('.fixed-top, .fixed-bottom');
    var openClass = 'modal-visible';
    var closeClass = 'modal-hidden';
    var animationClass = 'modal-animated';
    var currentModal;

    triggers.forEach(function(item) {
      item.addEventListener('click', function(e) {
        var target = this.dataset.modal || this.getAttribute('href');
        var modalToOpen = document.querySelector(target);

        if (e) {
          e.preventDefault();
        }

        if (currentModal && currentModal !== modalToOpen) {
          closeModal(currentModal);
        }

        currentModal = modalToOpen;
        openModal(currentModal);
      });
    });

    closeButtons.forEach(function(item) {
      item.addEventListener('click', function(e) {
        closeModal(currentModal);
      });
    });

    function openModal(modal) {
      modal.classList.remove(closeClass);
      modal.setAttribute('aria-hidden', 'false');
      setTimeout(function() {
        modal.classList.add(animationClass);
      }, 0);

      fixedContent.forEach(function(item) {
        var actualPadding = getComputedStyle(item).paddingRight;
        item.style.paddingRight = parseFloat(actualPadding) + getScrollbarWidth() + 'px';
      });

      body.style.paddingRight = getScrollbarWidth() + 'px';
      body.classList.add(openClass);
      
      modal.querySelector('.modal-dialog').addEventListener('click', closeOnOverlayClick);
      document.addEventListener('keydown', closeOnEscapePress);
    }

    function closeModal(modal) {
      modal.classList.remove(animationClass);
      
      fixedContent.forEach(function(item) {
        item.style.paddingRight = '';
      });

      body.style.paddingRight = '';
      body.classList.remove(openClass);

      var transitionEnd = function() {
        modal.removeEventListener('transitionend', transitionEnd);
        modal.classList.add(closeClass);
        modal.setAttribute('aria-hidden', 'true');
        
        if (currentModal === modal) {
          currentModal = null;
        }
      };

      modal.addEventListener('transitionend', transitionEnd);
      modal.querySelector('.modal-dialog').removeEventListener('click', closeOnOverlayClick);
      document.removeEventListener('keydown', closeOnEscapePress);
    }

    function closeOnOverlayClick(e) {
      if (e.target === this) {
        closeModal(currentModal);
      }
    }

    function closeOnEscapePress(e) {
      if (e.keyCode === 27) {
        closeModal(currentModal);
      }
    }

    function getScrollbarWidth() {
      var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        return scrollbarWidth;
      }
    }
  }());

  // Polyfill for Element.closest() (IE 9+)
  (function(ELEMENT) {
    ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
    ELEMENT.closest = ELEMENT.closest || function closest(selector) {
      if (!this) return null;
      if (this.matches(selector)) return this;
      if (!this.parentElement) {
        return null;
      } else return this.parentElement.closest(selector);
    };
  }(Element.prototype));

  // Converting an HTMLCollection object or a NodeList to an array
  function selectAll(el) {
    if (typeof el === 'string') {
      el = document.querySelectorAll(el);
    }
  
    return Array.prototype.slice.call(el);
  }
  
  // Declension of words
  function declineWords(number, titles) {
    var cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
  }

  // AJAX function
  function loadFile(url, element, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.send();
    request.onreadystatechange = function() {
      if (this.readyState != 4) return;
    
      if (this.status != 200) {
        console.log('Error: ' + (this.status ? this.statusText : 'request failed'));
        return;
      }

      element.innerHTML = this.responseText;
  
      if (callback) callback();
    }
  }
});