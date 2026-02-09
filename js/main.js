(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-150px');
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Header carousel
    var headerCarousel = $(".header-carousel");
    headerCarousel.owlCarousel({
        items: 1,
        autoplay: true,
        smartSpeed: 1000,
        loop: true,
        dots: false,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ]
    });

    // Handle video in carousel
    headerCarousel.on('translated.owl.carousel', function (event) {
        var currentItem = $(event.target).find(".owl-item.active");
        var video = currentItem.find("video").get(0);

        if (video) {
            headerCarousel.trigger('stop.owl.autoplay');
            video.currentTime = 0;
            video.play();

            $(video).off('ended').on('ended', function () {
                headerCarousel.trigger('next.owl.carousel');
                headerCarousel.trigger('play.owl.autoplay');
            });
        } else {
            // Stop any playing videos in other slides (though usually handled by loop/hidden)
            $('video').each(function () {
                this.pause();
            });
            headerCarousel.trigger('play.owl.autoplay');
        }
    });

    // Initial check for video on load
    $(document).ready(function () {
        var currentItem = $(".header-carousel .owl-item.active");
        var video = currentItem.find("video").get(0);
        if (video) {
            headerCarousel.trigger('stop.owl.autoplay');
            video.play();
            $(video).off('ended').on('ended', function () {
                headerCarousel.trigger('next.owl.carousel');
                headerCarousel.trigger('play.owl.autoplay');
            });
        }
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: false,
        smartSpeed: 1000,
        margin: 25,
        loop: true,
        center: true,
        dots: false,
        nav: true,
        navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    });

})(jQuery);

