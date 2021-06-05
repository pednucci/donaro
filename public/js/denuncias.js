var toggleInfo = document.querySelectorAll('.toggle-arrow');
var infoContainer = document.querySelectorAll('.profile-container');
var btnPunir = document.querySelector('.btn.punir');
var togglePunicoes = document.querySelector('.toggle-menu.punicoes');


toggleInfo.forEach(function (value, index,) {
    toggleInfo[index].addEventListener('click', () => {
        if (infoContainer[index].classList.contains('toggled')) {
            infoContainer[index].classList.remove('toggled')
        } else {
            infoContainer[index].classList.add('toggled')
        }
    })
});

btnPunir.addEventListener('click', () => {
    if (togglePunicoes.classList.contains('visible')) {
        togglePunicoes.classList.remove('visible')
    } else {
        togglePunicoes.classList.add('visible')
    }

    window.scrollTo(
        {
            top: document.body.scrollHeight,
            behavior: 'smooth',
        });
})
