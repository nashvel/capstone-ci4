<<<<<<< HEAD
(function () {
    'use strict';

    // swiper with navigation
    var swiper = new Swiper(".swiper-related-jobs", {
      slidesPerView: 2,
        spaceBetween: 5,
        mousewheel: true,
        loop: true,
        direction: "vertical",
        autoplay: {
            delay: 2500,
            disableOnInteraction: false
        },
        breakpoints: {
            350: {
                slidesPerView: 3,
                spaceBetween: 10,
            },

        },
    });

=======
(function () {
    'use strict';

    // swiper with navigation
    var swiper = new Swiper(".swiper-related-jobs", {
      slidesPerView: 2,
        spaceBetween: 5,
        mousewheel: true,
        loop: true,
        direction: "vertical",
        autoplay: {
            delay: 2500,
            disableOnInteraction: false
        },
        breakpoints: {
            350: {
                slidesPerView: 3,
                spaceBetween: 10,
            },

        },
    });

>>>>>>> 60d50bc (first commit)
})();