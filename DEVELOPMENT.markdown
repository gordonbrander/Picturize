Ok, so what does this script have to do?

Requirements:

1. Fallback `img` should not be loaded (or needed?).
  * We need to test if images are loaded when hidden with Modernizr's `.js` class.
2. Alt text should be accessible.
  * It should probably be just in the element with the `source` tags. This is how `video` and `audio` work.
3. Developers should have work-around hooks for this element
  * Custom Modernizr plugin.

---

Approach:

* Fast exit if the tag is supported.
* `source` media attributes must be parsed (`Modernizr.mq`) and the appropriate image tag created.

---

Questions/Issues:

Preventing load of fallback images: Firefox 7 and Chrome both fetch an image, even if it is display:none. So basically, this technique does not help us when it comes to fallback images.

`Modernizr.mq` does not work in browsers that don't support media queries anymore. Modernizr no longer supports Respond.js. Bummer. We might be reduced to string parsing and measuring against window width.

How do we determine which source to use in the even of multiple matches?

Do we need a polyfill? Assuming browsers go forward with support of this tag:

* (n) The picture element will "just work" in browsers that support it. They will ignore the image tag.
* (n) Older browsers will load fallback image tag.
* (y) Older browsers with the script installed will get images that are triggered to load at different sizes.
* (y) If we support a media query shim, browsers that don't support media queries can get in on the fun (questionable benefit if styles can't also adapt -- look into hooking up to Respond.js)