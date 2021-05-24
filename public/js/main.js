var navbar = document.querySelector('.nav-bar');
var currentScrollY = window.scrollY;
var lastScrollY = 0;


window.addEventListener("scroll", () => {
  var currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY) {
    navbar.classList = "nav-bar hidden"
  } else {
    navbar.classList = "nav-bar"
  }
  lastScrollY = currentScrollY;

})
// })

// $(window).scroll(function () {
//     if ($(window).scrollTop() > 50) {
//         $(".header").addClass("scroll");
//     } else {
//         $(".header").removeClass("scroll");
//     }
// });

// // Header hidden
// var prev = 0;
// var $window = $(window);
// var nav = $('.header');

// $window.on('scroll', function () {
//     var scrollTop = $window.scrollTop();
//     nav.toggleClass('hidden', scrollTop > prev);
//     prev = scrollTop;
//