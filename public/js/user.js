var navMenu = document.querySelector('.nav-menu');
var navProfile = document.querySelector('.nav-profile');
var toggleMenu = document.querySelector('.toggle-menu.header');
var seta = document.querySelector('.seta')

navProfile.addEventListener('click', () => {
  if (navMenu.classList.contains('toggled')) {
    navMenu.classList.remove('toggled');
  } else {
    navMenu.classList.add('toggled');
  }

})

// window.addEventListener('click', (e) => {
//   if (display == "block") {
//     if (e.target.tagName == "section") {
//       console.log(e.target.tagName)
//       toggleMenu.style.display = "none";
//     } else {
//       console.log(e.target.tagName)
//       toggleMenu.style.display = "block";
//     }
//     display = toggleMenu.style.display;
//   }
// })

