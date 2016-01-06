(function($) {
  var ProductMediaSlider = {
    // Delcare Constants
    STEP_SIZE: 5,
    KEY_ENTER: 13,
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40,
    KEY_ESC: 27,

    // Declare Variables
    swatchOptionId: null,
    ElevateZoom: null,
    flexsliderContainer: $('#flexslider'),
    keyboardZoomBound: false,

    /**
     * The path of the righteous method is beset on all sides by the inequities of the selfish and the tyranny of careless developers. Blessed is he who, in the name of good documentation and best practices, shepherds the uglified through the valley of spaghetti code, for he is truly his sibling element's keeper and the finder of lost childNodes. And I will blame down upon thee with great vengeance and furious PR comments those who attempt to recur and delete My sibling elements. And you will know I am the LORD when I initialize My functionality upon you.
     */
    init: function() {
      ProductMediaSlider.swatchLink = $('.swatch-link');

      ProductMediaSlider.bindSwatches();
      ProductMediaSlider.initFlexslider();
      ProductMediaSlider.toggleKeyboardSlide('on');
    },

    /**
     * Initialize the Flexslider, which options pre-setup.
     */
    initFlexslider: function() {
      ProductMediaSlider.flexsliderContainer.removeData("flexslider");
      ProductMediaSlider.flexsliderContainer.flexslider({
        animation: "slide",
        controlNav: false,
        slideshow: false,
        keyboard: false, // Since keyboard is a private flexslider method, we'll use our own.
        before: function() {
          ProductMediaSlider.destroyZoom();
        },
        after: function() {
          ProductMediaSlider.createZoom($('.flex-active-slide img'));
        },
      });
      ProductMediaSlider.destroyZoom();
      ProductMediaSlider.createZoom($('.flex-active-slide img'));
    },

    /**
     * Bind the swatch switching functionality
     */
    bindSwatches: function() {
      ProductMediaSlider.swatchLink.on('click', function() {
        ProductMediaSlider.swatchOptionId = $(this).attr('id').slice(6);
        ProductMediaSlider.setSlides();
      });
    },

    /**
     * Change out the sliders based on the collection in the JSON
     */
    setSlides: function() {
      var output = ProductMediaSlider.prepareSlidesHtml();
      ProductMediaSlider.smartReplace(ProductMediaSlider.flexsliderContainer, output);
      ProductMediaSlider.initFlexslider();
    },

    /**
     * Prepare the html needed to render the new slides
     * @return {html} The undordered list containing the new slides
     */
    prepareSlidesHtml: function() {
      var images = ProductMediaSlider.getSlidesSrc();
      var output = '<ul class="slides product-image-gallery">';
      $.each(images, function(index, value) {
        output += '<li><img id="image-' + value.img_id +'" src="' + value.src +'" class="gallery-image lazyautosizes lazyloaded" data-zoom-image="' + value.zoom + '"></li>';

      });
      output += '</ul>';
      return output;
    },

    /**
     * Get the url source of all the slides for the selected color
     * @return [object] product
     */
    getSlidesSrc: function() {
      return AssociatedProductImages.products.filter(function(product) {
        if (product.swatch === ProductMediaSlider.swatchOptionId) {
          return product;
        }
      })[0].images;
    },

    /**
     * Replace image by appending it, then removing the old one.
     * @param block       old block, the one being removed.
     * @param replacement new block
     */
    smartReplace: function(block, replacement) {
      block.wrapInner("<div class='death-row'></div>");
      block.append(replacement);
      $('.death-row').remove();
    },

    /**
     * Create the zoom functionality, using Magento's default
     * elevateZoom functionality.
     * @param  {jQuery object} image current image, for zoom to act on
     */
    createZoom: function(image) {
        if(
            // Don't use zoom on devices where touch has been used
            PointerManager.getPointer() == PointerManager.TOUCH_POINTER_TYPE
            // Don't use zoom when screen is small, or else zoom window shows outside body
            || Modernizr.mq("screen and (max-width:" + bp.medium + "px)")
        ) {
            return; // zoom not enabled
        }

        if (ProductMediaSlider.isLargeImage(image)) {
          image.parents('.product-image').addClass('zoom-available');
        } else {
          image.parents('.product-image').removeClass('zoom-available');
          return;
        }
        image.elevateZoom();
        ProductMediaSlider.bindKeyboardZoom();
    },

    /**
     * Remove the zoom functionatliy
     */
    destroyZoom: function() {
        $('.zoomContainer').remove();
        $('.product-image-gallery .gallery-image').removeData('elevateZoom');
    },

    /**
     * Check image to see if it is large enough to require zoom.
     * @param  {jQuery Object} image Image to check
     * @return {Boolean}
     */
    isLargeImage: function(image) {
      var img = new Image();
      img.src = image.attr('src');
      var renderedSize = img.width * img.height;
      var originalSize = image.data('image-size');
      return renderedSize < originalSize;
    },

    /**
     * Rewrite Flexslider's keyboard arrow functionality so that we can access
     * it and turn it off when keyboard zooming.
     * @param  {jQuery Object} image image with felxslider functionality
     */
    bindKeyboardZoom: function() {
      $('#flexslider').on("keydown", function(e) {
        if (e.keyCode == ProductMediaSlider.KEY_ENTER && ProductMediaSlider.keyboardZoomBound === false) {
          ProductMediaSlider.keyboardZoom(e, $('.flex-active-slide img'));
        }
      });
    },

    /**
     * Rewrite Flexslider's keyboard arrow functionality so that we can access
     * it and turn it off when keyboard zooming.
     * @param  {jQuery Object} image image with felxslider functionality
     */
    toggleKeyboardSlide: function(state) {
      if (state === 'off') {
        $(document).off('keyup.keyboardSlide');
        return;
      }

      if (ProductMediaSlider.flexsliderContainer.length === 1) {
        $(document).on('keyup.keyboardSlide', function bindHandler(event) {
          var keycode = event.keyCode;
          var slider = ProductMediaSlider.flexsliderContainer.data('flexslider');
          if (!slider.animating && (keycode === 39 || keycode === 37)) {
            var target = (keycode === 39) ? slider.getTarget('next') :
                         (keycode === 37) ? slider.getTarget('prev') : false;
            slider.flexAnimate(target, slider.vars.pauseOnAction);
          }
        });
      }
    },

    /**
     * Allow the keyboard to control the zoom box when tabbed to the
     * flexslider image and activating.
     * @param  {event}  e      Event from hanlder
     * @param  {jQuery Object} image       image with zoom functionality
     */
    keyboardZoom: function(e, image) {
      ProductMediaSlider.keyboardZoomBound = true;
      ElevateZoom = image.data('elevateZoom');
      ElevateZoom.setPosition(ProductMediaSlider.calcCenterPosition(ElevateZoom, image));
      image.mouseover();
      ProductMediaSlider.toggleKeyboardSlide('off');


      $(document).on("keydown", function(e) {
        if (e.keyCode == ProductMediaSlider.KEY_UP) {
          ProductMediaSlider.handleKeyboardPan(ElevateZoom, image, 0, -1);
        } else if (e.keyCode == ProductMediaSlider.KEY_DOWN) {
          ProductMediaSlider.handleKeyboardPan(ElevateZoom, image, 0, 1);
        } else if (e.keyCode == ProductMediaSlider.KEY_LEFT) {
          ProductMediaSlider.handleKeyboardPan(ElevateZoom, image, -1, 0);
        } else if (e.keyCode == ProductMediaSlider.KEY_RIGHT) {
          ProductMediaSlider.handleKeyboardPan(ElevateZoom, image, 1, 0);
        } else if (e.keyCode == ProductMediaSlider.KEY_ESC) {
          if (ElevateZoom.isLensActive) {
            image.mouseleave();
            ProductMediaSlider.toggleKeyboardSlide('on');
            ElevateZoom.setElements("hide");
            ElevateZoom.keyFocus = false;
            ProductMediaSlider.keyboardZoomBound = false;
          } else {
            // Don't cancel the event.
            return;
          }
        } else {
          // Skip it, not interesting.  We don't want to cancel.
          return;
        }
        // If we didn't bail, it means we handled the event.
        // Prevent it from doing other silly things like scrolling the page.
        e.preventDefault();
      });
    },

    /**
     * Handle the change in position by clicking the arrow and setting the position
     * @param  {object}         ElevateZoom ElevateZoom object
     * @param  {jQuery Object}  image       image with zoom functionality
     * @param  {int} deltaX     change in X axis
     * @param  {int} deltaY     change in Y axis
     */
    handleKeyboardPan: function(ElevateZoom, image, deltaX, deltaY) {
      // Great, we have a winner.  Now let's move the viewport.
      if (!ElevateZoom.currentLoc) {
        ElevateZoom.currentLoc = ProductMediaSlider.calcCenterPosition(ElevateZoom, image);
      }

      ElevateZoom.currentLoc.clientX += deltaX * ProductMediaSlider.STEP_SIZE;
      ElevateZoom.currentLoc.clientY += deltaY * ProductMediaSlider.STEP_SIZE;
      ElevateZoom.currentLoc.pageX += deltaX * ProductMediaSlider.STEP_SIZE;
      ElevateZoom.currentLoc.pageY += deltaY * ProductMediaSlider.STEP_SIZE;
      ElevateZoom.currentLoc = ProductMediaSlider.clampPositionToBounds(ElevateZoom, image, ElevateZoom.currentLoc);
      ElevateZoom.setPosition(ElevateZoom.currentLoc);
      ElevateZoom.lastX = ElevateZoom.currentLoc.clientX;
      ElevateZoom.lastY = ElevateZoom.currentLoc.clientY;
    },

    /**
     * Recalulate the position
     * @param  {object}         ElevateZoom ElevateZoom object
     * @param  {jQuery Object}  image       image with zoom functionality
     */
    recalcElemPos: function(ElevateZoom, image) {
      // We do this often in case other page elements change.
      ElevateZoom.nzWidth = image.width();
      ElevateZoom.nzHeight = image.height();
      ElevateZoom.nzOffset = image.offset();
    },

    /**
     * Recalulate the center of the image
     * @param  {object}         ElevateZoom ElevateZoom object
     * @param  {jQuery Object}  image       image with zoom functionality
     */
    calcCenterPosition: function(ElevateZoom, image) {
      // Recalculate the element size and pos.
      ProductMediaSlider.recalcElemPos(ElevateZoom, image);

      // Now just grab the center of the bounds.  Easy.
      var bounds = ProductMediaSlider.calcPositionBounds(ElevateZoom, image);
      var pos = {
        pageX: ElevateZoom.nzOffset.left + Math.floor(bounds.left + (bounds.right - bounds.left) / 2),
        pageY: ElevateZoom.nzOffset.top + Math.floor(bounds.top + (bounds.bottom - bounds.top) / 2),
      };
      pos.clientX = pos.pageX;
      pos.clientY = pos.pageY;
      return pos;
    },

    /**
     * Calculate the boundaries of the image
     * @param  {object}         ElevateZoom ElevateZoom object
     * @param  {jQuery Object}  image       image with zoom functionality
     * @return {object}         bounds      boundaries of the image
     */
    calcPositionBounds: function(ElevateZoom, image) {
      var bounds = {};

      //calculate the bound regions - but only if zoom window
      if (ElevateZoom.options.zoomType == "window") {
        bounds.top = ElevateZoom.zoomLens.height() / 2;
        bounds.bottom = ElevateZoom.nzHeight - (ElevateZoom.zoomLens.height() / 2) - (ElevateZoom.options.lensBorderSize * 2);
        bounds.left = 0 + (ElevateZoom.zoomLens.width() / 2);
        bounds.right = ElevateZoom.nzWidth - (ElevateZoom.zoomLens.width() / 2) - (ElevateZoom.options.lensBorderSize * 2);
      }
      //calculate the bound regions - but only for inner zoom
      if (ElevateZoom.options.zoomType == "inner") {
        bounds.top = (ElevateZoom.nzHeight / 2) / ElevateZoom.heightRatio;
        bounds.bottom = ElevateZoom.nzHeight - ((ElevateZoom.nzHeight / 2) / ElevateZoom.heightRatio);
        bounds.left = 0 + ((ElevateZoom.nzWidth / 2) / ElevateZoom.widthRatio);
        bounds.right = ElevateZoom.nzWidth - (ElevateZoom.nzWidth / 2) / ElevateZoom.widthRatio - (ElevateZoom.options.lensBorderSize * 2);
      }

      return bounds;
    },

    /**
     * Recalulate the center of the image
     * @param  {object}         ElevateZoom ElevateZoom object
     * @param  {jQuery Object}  image       image with zoom functionality
     * @param  {jQuery Object}  pos         position of the image
     * @return {pos}            pos         position of the image
     */
    clampPositionToBounds: function(ElevateZoom, image, pos) {
      // Recalculate the element size and pos.
      ProductMediaSlider.recalcElemPos(ElevateZoom, image);

      var bounds = ProductMediaSlider.calcPositionBounds(ElevateZoom, image);
      if (pos.pageX < bounds.left + ElevateZoom.nzOffset.left) {
        pos.pageX = bounds.left + ElevateZoom.nzOffset.left;
      } else if (pos.pageX > bounds.right + ElevateZoom.nzOffset.left) {
        pos.pageX = bounds.right + ElevateZoom.nzOffset.left;
      }

      if (pos.pageY < bounds.top + ElevateZoom.nzOffset.top) {
        pos.pageY = bounds.top + ElevateZoom.nzOffset.top;
      } else if (pos.pageY > bounds.bottom + ElevateZoom.nzOffset.top) {
        pos.pageY = bounds.bottom + ElevateZoom.nzOffset.top;
      }

      return pos;
    }
  }

  window.ProductMediaSlider = ProductMediaSlider;

}(jQuery));

ProductMediaSlider.init();
