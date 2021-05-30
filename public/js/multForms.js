const btnNext = document.querySelector('.btn.next')
const btnPrevious = document.querySelector('.btn.previous')
const tab = document.querySelectorAll('.tab')
const form = document.querySelector('form');
var currentTab = 0;


btnNext.addEventListener('click', () => {
  if (currentTab !== (tab.length - 1)) {
    currentTab++;
    tab[currentTab].style.display = "initial";
    tab[currentTab - 1].style.display = "none";

    if (currentTab === (tab.length - 1)) {
      btnNext.innerHTML = "Enviar";
    }

    if (currentTab > 0) {
      btnPrevious.classList.add('visible')
    }

  } else {
    form.submit();
  }
  console.log(currentTab)
})

btnPrevious.addEventListener('click', () => {
  if (currentTab > 0) {
    tab[currentTab].style.display = "none"
    tab[currentTab - 1].style.display = "initial"

    currentTab--;

    if (currentTab === 0) {
      btnNext.innerHTML = "Próximo";
      btnPrevious.classList.remove('visible')
    }
  }
})