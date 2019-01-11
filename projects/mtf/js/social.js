$(function() {
  var url = window.location.href;

  var locale = {
    uk: {
      greeting: 'Привіт, друзі!'
    },
    ru: {
      greeting: 'Привет, друзья!'
    }
  };

  function getLocale(phrase) {
    var lang = document.getElementsByTagName('html')[0].getAttribute('lang').substr(0,2) || 'uk';
  
    return locale[lang][phrase];
  }

  $('.fb-share-button').on('click', function(e) {
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + url,
      'facebook-share-dialog',
      'width=800,height=600'
    );
    e.preventDefault();
  });

  $('.tw-share-button').on('click', function(e) {
    window.open('https://twitter.com/intent/tweet?text=' + getLocale('greeting'),
      'twitter-share-dialog',
      'width=800,height=600'
    );
    e.preventDefault();
  });

  $('.gplus-share-button').on('click', function(e) {
    window.open('https://plus.google.com/share?url=' + url,
      'gplus-share-dialog',
      'width=800,height=600'
    );
    e.preventDefault();
  });
});