// jQuery Picturize -- responsive images for everyone.
// 
// Copyright (c) 2012 Gordon Brander.
// Released under the
// [MIT license] (http://www.opensource.org/licenses/mit-license.php).
// 
// Go forth mightily to do good on the interwebs!
;(function (window, document, Modernizr, $) {
  // Register a Modernizr test for `<picture>`.
  // If you have support for Modernizr classes in your build, this will also
  // give you a handy `.picture` or `.no-picture` class on the `html` element.
  Modernizr.addTest('picture', function () {
    return !!(document.createElement('picture') && window.HTMLPictureElement);
  });
  
  // Add a plugin to jQuery/Zepto/Ender plugin for polyfilling `picture`.
  $.fn.picturize = function (options) {
    // Exit early if the browser supports `picture`.
    if (Modernizr.picture) return;
    
    var $pictures = $(this);
    
    var defaults = {
      speed: 150,
      classes: 'picturize'
    };
    
    options = $.extend(defaults, options || {});

    // Define a function that will process a single jQuery picture object.
    var processPicture = function () {
      var $picture = $(this);

      // Get the collection of source tags.
      // Reject any sources that have a media query which doesn't match.
      var $sources = $('source', $picture).filter(function () {
        var media = $(this).attr('media');
        return !media || Modernizr.mq(media);
      });

      if (!$sources.length) return;

      // We don't have any way to know which matching source is the right
      // source, so may the last one win.
      var $source = $($sources.last());

      // Generate a polyfill image, if none has been generated.
      var key = 'img.picturize';
      var $img = $picture.data(key);
      if (!$img || !$img.length) {
        $img = $('<img/>').addClass(options.classes);
        $picture.data(key, $img).append($img);
      }

      // Create an image tag as a fallback, and append to the picture.
      $img.attr({
        src: $source.attr('src'),
        alt: $picture.attr('alt')
      });
    };
    
    // Create a bound function that loops over every picture element
    // found via query and applies polyfill to it.
    var processAll = $.proxy($pictures.each, $pictures, processPicture);
    
    // Loop over every picture element found via the query and apply picture
    // logic to it.
    processAll();
    
    // Re-apply any time the window size changes. Debounced to keep things
    // performant.
    var processJob;
    $(window).resize(function () {
      clearTimeout(processJob);
      processJob = setTimeout(processAll, options.speed);
    });
  };
})(window, document, Modernizr, jQuery || Zepto || Ender);