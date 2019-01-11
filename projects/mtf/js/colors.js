$(function() {

  // JavaScript version of Sass' mix() function. Example of use: mix('ffffff', 'd60000', 14)
  var mix = function(color1, color2, weight) {
    function d2h(d) {
      return d.toString(16);
    }

    function h2d(h) {
      return parseInt(h, 16);
    }

    weight = (typeof(weight) !== 'undefined') ? weight : 50;

    var color = "#";

    for (var i = 0; i <= 5; i += 2) {
      var v1 = h2d(color1.substr(i, 2)),
          v2 = h2d(color2.substr(i, 2)),
          val = d2h(Math.floor(v2 + (v1 - v2) * (weight / 100.0))); 

      while(val.length < 2) { val = '0' + val; }
      
      color += val;
    }
      
    return color;
  };

  // Getting YIQ value. Example of use: getYIQ('#f8f8f8')
  function getYIQ(hexColor) {
    hexColor = hexColor.replace('#', '');

    var r = parseInt(hexColor.substr(0,2),16),
        g = parseInt(hexColor.substr(2,2),16),
        b = parseInt(hexColor.substr(4,2),16);

    return ((r*299)+(g*587)+(b*114))/1000;
  }

  // Calculating color contrast
  function getContrastYIQ(hexColor, props) {
    var yiq = getYIQ(hexColor),
        props = props || {},
        threshold = isNumber(props.threshold) ? props.threshold : 150,
        darkColor = props.darkColor || '#000000',
        lightColor = props.lightColor || '#ffffff';

    return (yiq >= threshold) ? darkColor : lightColor;
  }

  // Check if a value is a number
  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  // Hex to rgb conversion
  function hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }

  // Rgb to hex conversion
  function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  // Creating a STYLE element
  var styleElem = document.createElement('style'),
      styleSheet;

  document.head.appendChild(styleElem);
  styleSheet = styleElem.sheet;

  // Adding a stylesheet rule to the document
  function addStylesheetRules(rules) {
    for (var i = 0, rl = rules.length; i < rl; i++) {
      var j = 1, rule = rules[i], selector = rules[i][0], propStr = '';

      if (Object.prototype.toString.call(rule[1][0]) === '[object Array]') {
        rule = rule[1];
        j = 0;
      }

      for (var pl = rule.length; j < pl; j++) {
        var prop = rule[j];
        propStr += prop[0] + ':' + prop[1] + (prop[2] ? ' !important' : '') + ';\n';
      }

      styleSheet.insertRule(selector + '{' + propStr + '}', styleSheet.cssRules.length);
    }
  }

  // Styling checkboxes
  var elements = document.querySelectorAll('[data-color]'),
      bodyColor = getComputedStyle(document.body).backgroundColor;

  for (var i = 0; i < elements.length; i++) {
    var color = elements[i].getAttribute('data-color'),
        input = '[data-color="' + color + '"]',
        checkMarkColor = getContrastYIQ(color.slice(1)).replace("#", "%23");

    addStylesheetRules([
      [input + ' ~ .custom-control-label::before',
        ['background-color', mix('ffffff', color.slice(1), 30)]
      ],
      [input + ':checked ~ .custom-control-label::before',
        ['background-color', color, true]
      ],
      [input + ':checked ~ .custom-control-label::after',
        ['background-image', 'url("data:image/svg+xml;charset=utf8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 8 8\'%3E%3Cpath fill=\'' + checkMarkColor + '\' d=\'M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z\'/%3E%3C/svg%3E")', true]
      ],
      [input + ':focus ~ .custom-control-label::before',
        ['box-shadow', '0 0 0 1px ' + bodyColor + ', 0 0 0 2px ' + color]
      ],
      [input + ':active ~ .custom-control-label::before',
        ['background-color', mix('ffffff', color.slice(1), 40)]
      ],
      [input + ':disabled ~ .custom-control-label',
        ['pointer-events', 'none']
      ],
    ]);

    if (getYIQ(color) > 240) {
      var boxShadowColor = mix('000000', color.slice(1), 9);

      addStylesheetRules([
        [input + ' ~ .custom-control-label::before',
          ['box-shadow', 'inset 0 0 0 1px ' + boxShadowColor]
        ],
        [input + ':focus ~ .custom-control-label::before',
          ['box-shadow', '0 0 0 1px ' + bodyColor + ', 0 0 0 2px ' + boxShadowColor]
        ],
        [input + ':disabled ~ .custom-control-label::before',
          ['box-shadow', 'none']
        ],
        [input + ':disabled:active ~ .custom-control-label::before',
          ['box-shadow', 'inset 0 0 0 1px ' + boxShadowColor]
        ]
      ]);
    }
  }

  // Styling radiobuttons
  var optionsColor = document.getElementById('js-options-color');

  if (optionsColor) {
    var optionColor = optionsColor.querySelectorAll('.custom-control-label');

    for (var i = 0; i < optionColor.length; i++) {
      var rgbColor = optionColor[i].style.backgroundColor,
          rgbColorArray = rgbColor.slice(4, -1).split(','),
          r = parseInt(rgbColorArray[0]),
          g = parseInt(rgbColorArray[1]),
          b = parseInt(rgbColorArray[2]),
          hexColor = rgbToHex(r, g, b),
          checkMarkColor = getContrastYIQ(hexColor.slice(1), {darkColor: '#666'}).replace("#", "%23");

      addStylesheetRules([
        ['.custom-control-label[style*="' + hexColor + '"]::before',
          ['background-color', mix('ffffff', hexColor.slice(1), 30)]
        ],
        ['.custom-control-input:checked ~ .custom-control-label[style*="' + hexColor + '"]::before',
          ['background-color', hexColor]
        ],
        ['.custom-control-input:checked ~ .custom-control-label[style*="' + hexColor + '"]::after',
          ['background-image', 'url("data:image/svg+xml;charset=utf8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'-4 -4 14 14\'%3E%3Crect fill=\'' + checkMarkColor + '\' width=\'6\' height=\'6\'/%3E%3C/svg%3E")']
        ],
        ['.custom-control-input:focus ~ .custom-control-label[style*="' + hexColor + '"]::before',
          ['box-shadow', '0 0 0 1px ' + bodyColor + ', 0 0 0 2px ' + hexColor]
        ],
        ['.custom-control-input:active ~ .custom-control-label[style*="' + hexColor + '"]::before',
          ['background-color', mix('ffffff', hexColor.slice(1), 40)]
        ],
      ]);

      if (getYIQ(hexColor) > 240) {
        var boxShadowColor = mix('000000', hexColor.slice(1), 13);
  
        addStylesheetRules([
          ['.custom-control-label[style*="' + hexColor + '"]::before',
            ['box-shadow', 'inset 0 0 0 1px ' + boxShadowColor]
          ],
          ['.custom-control-input:focus ~ .custom-control-label[style*="' + hexColor + '"]::before',
            ['box-shadow', '0 0 0 1px ' + bodyColor + ', 0 0 0 2px ' + boxShadowColor]
          ]
        ]);
      }
    }
  }

});