var navbar = document.querySelector('.nav-bar');
var navProfile = document.querySelector('.nav-profile');
var toggleMenu = document.querySelector('.toggle-menu');
var display = toggleMenu.style.display;



navProfile.addEventListener('click', () => {
  if (display == "block") {
    toggleMenu.style.display = "none";
  } else {
    toggleMenu.style.display = "block";
  }
  display = toggleMenu.style.display;

})

// window.addEventListener("scroll", () => {
//   if (window.scrollY > 0) {
//     navbar.style.position = "fixed"
//     // navbar.style.display = "none"
//   } else {
//     navbar.style.position = "initial"
//     // navbar.style.display = "block"
//   }

// })

// // $(window).scroll(function () {
// //     if ($(window).scrollTop() > 50) {
// //         $(".header").addClass("scroll");
// //     } else {
// //         $(".header").removeClass("scroll");
// //     }
// // });

// // // Header hidden
// // var prev = 0;
// // var $window = $(window);
// // var nav = $('.header');

// // $window.on('scroll', function () {
// //     var scrollTop = $window.scrollTop();
// //     nav.toggleClass('hidden', scrollTop > prev);
// //     prev = scrollTop;
// // });