// (function($) {
//   /**
//    *  Namespace: the namespace the plugin is located under
//    *  pluginName: the name of the plugin
//    */
//       var extensionMethods = {
//           /*
//            * retrieve the id of the element
//            * this is some context within the existing plugin
//            */
//           showId: function(){
//               return this.element[0].id;
//           }
//       };
  
//       $.extend(true, $[ Namespace ][ pluginName ].prototype, extensionMethods);
  
  
//   })(jQuery);

// console.log($.fn.barrating.BarRating);

// (function($) {
//   /**
//    *  Namespace: the namespace the plugin is located under
//    *  pluginName: the name of the plugin
//    */
//       var extensionMethods = {
//           /*
//            * retrieve the id of the element
//            * this is some context within the existing plugin
//            */
//           showId: function() {
//             return this.element[0].id;
//           }
//       };
  
//       $.extend(true, $.fn.barrating.prototype, extensionMethods);
  
  
//   })(jQuery);

//   $('.rating-color-star').barrating().showId();



// BarRating.barrating.prototype




// BarRating.fn.extend({
//   check: function() {
//     return this.each(function() {
//       this.checked = true;
//     });
//   }
// });














// ;(function($) {

//   if (typeof $.fn.barrating.Constructor === 'undefined') {
//     throw new Error('BarRating must be included first!');
//   }

//   var BarRating = $.fn.barrating.Constructor;

//   // add customClass option to BarRating
//   $.extend(BarRating.defaults, {
//     customClass: ''
//   });

//   var _attachMouseEnterHandler = BarRating.prototype.attachMouseEnterHandler;

//   BarRating.prototype.attachMouseEnterHandler = function () {

//     // invoke parent method
//     _attachMouseEnterHandler.apply(this, Array.prototype.slice.apply(arguments));

//     if (this.config.customClass) {
//       var $a = $(this);
//       $a.addClass(this.config.customClass);
//     }

//   };

// })(window.jQuery);