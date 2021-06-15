var navbar = document.querySelector('.nav-bar');
var currentScrollY = window.scrollY;
var lastScrollY = 0;

var flashMsg = document.querySelectorAll('.flash-msg');
var closeMsg = document.querySelectorAll('.close-flash');

if (closeMsg != null) {
    flashMsg.forEach(function (value, index) {
        closeMsg[index].addEventListener('click', () => {
            flashMsg[index].classList.add('hidden')
        })
    })

}
