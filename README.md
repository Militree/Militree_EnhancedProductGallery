Slider Swatches
================

This software is early in development, and is presented as-is.

Requirements
------------

The supported Magento version is 1.9.x. This was tested as working with RWD.

This module uses jQuery 1.10, which is packaded with Magento.

This uses [wootheme's](https://github.com/woothemes) awesome [Flexslider](https://github.com/woothemes/FlexSlider).


Features
----------------

- Use a Flexslider based image slider for product images on the PDP
- When viewing a configurable swatch, the slider collection will repopulate with all the children product's images when the corresponding color swatch is selected.
- Supports Magento's elevateZoom
- For accessibility, tabbing to the image and pressing enter will let the user move the zoom lens with the keyboard. Pressing escape will return the fuctionality to flexlider.

Note: There are currently no thumbnails. This ia a TODO.

Install via Modman
----------------

You can install this module using [Colin Mollenhour's](https://github.com/colinmollenhour) [Modman tool](https://github.com/colinmollenhour/modman).

```bash
$ modman init
$ modman clone https://github.com/Militree/Militree_SliderSwatches.git
```

Contribution
------------

To contribute please issue pull requests to the `develop` branch _only_. New releases will be merged to feature branches. Bugfixes are hotfix patched to both `master` and `develop`.
