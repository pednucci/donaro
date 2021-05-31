const btnNext = document.querySelector('.btn.next');
const btnPrevious = document.querySelector('.btn.previous');
const tab = document.querySelectorAll('.tab');
const form = document.querySelector('form');
var currentTab = 0;

const radiosContainer = document.querySelector('.fieldRadio');


if (radiosContainer) {
  var radios;

  var motivosDenunciaDoador = {
    0: 'Utilização não autorizada da minha imagem ou meus dados.',
    1: 'Sou o suposto beneficiário, mas não o criador da campanha, e não autorizei sua criação.',
    2: 'Sou o suposto beneficiário, mas não o criador da campanha, e estou removendo a autorização dada anteriormente para sua criação.',
    3: 'Outro',
  }

  var motivosDenunciaNaoDoador = {
    0: 'Violência ou discurso de ódio',
    1: 'Assédio ou conteúdo sexual',
    2: 'Conteúdo violento ou repulsivo',
    3: 'Conteúdo ilegal, fortemente regulamentado ou potencialmente perigoso',
    4: 'Uso indevido da imagem ou dados de uma pessoa ou entidade pública',
    5: 'Informações caluniosas ou incorretas',
    6: 'Duplicidade em imagem, título e/ou descrição aos de outra campanha',
    7: 'Outro',
  }

  //#region Criação dos inputs


  const radiosWrapper = document.createElement('div')
  radiosWrapper.classList = "radios column"

  var wrapperRadio = [];
  var inputRadio = [];
  var lblRadio = [];

  function addRadios(tipoMotivo) {
    if (tipoMotivo !== 0) {
      for (const motivo in tipoMotivo) {
        wrapperRadio[motivo] = document.createElement('div');
        inputRadio[motivo] = document.createElement('input');
        lblRadio[motivo] = document.createElement('label');

        wrapperRadio[motivo].classList = "row radio"
        inputRadio[motivo].setAttribute("type", "radio")
        inputRadio[motivo].setAttribute("name", "denuncia")
        inputRadio[motivo].setAttribute("value", motivo)
        inputRadio[motivo].setAttribute("id", motivo)

        lblRadio[motivo].setAttribute("for", motivo)
        lblRadio[motivo].textContent = tipoMotivo[motivo];

        wrapperRadio[motivo].appendChild(inputRadio[motivo])
        wrapperRadio[motivo].appendChild(lblRadio[motivo])


        radiosWrapper.appendChild(wrapperRadio[motivo])

      }
      return radiosWrapper
    } else if (tipoMotivo == 0) {
      console.log("0")
    }
  }

  //#endregion

  // radiosContainer.appendChild(addRadios(motivosDenunciaNaoDoador))

  //#region Change radios
  var radios = document.querySelectorAll('input[type=radio][name="relacao"]');
  var rw = document.querySelector('.radios.column')

  function changeHandler(event) {
    if (this.value === '0') {
      while (radiosWrapper.firstChild) {
        radiosWrapper.removeChild(radiosWrapper.lastChild)
      }
      radiosContainer.appendChild(addRadios(motivosDenunciaDoador))


    } else if (this.value === '1') {
      while (radiosWrapper.firstChild) {
        radiosWrapper.removeChild(radiosWrapper.lastChild)
      }
      radiosContainer.appendChild(addRadios(motivosDenunciaNaoDoador))
    }
  };

  Array.prototype.forEach.call(radios, function (radio) {
    radio.addEventListener('change', changeHandler);
  });
  //#endregion
}


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