const btnNext = document.querySelector('.btn.next');
const btnPrevious = document.querySelector('.btn.previous');
const tab = document.querySelectorAll('.tab');
const form = document.querySelector('form');
const formTabs = document.querySelector('.formTabs')
var currentTab = 0;

const radiosContainer = document.querySelector('.fieldRadio');

var radioRelacao = document.querySelectorAll('input[type=radio][name="relacao"]');
var radioDenuncia = document.querySelectorAll('input[type=radio][name="denuncia"]');
var radioMotivo = document.querySelectorAll('input[type=radio][name="motivo"]');
var textDescricao = document.querySelector('textarea[name=descricao]');
var rw = document.querySelector('.radios.column')


formTabs.innerText = `${currentTab + 1}/${tab.length}`

if (radiosContainer) {
  //#region Variáveis
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

  //#endregion


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
        inputRadio[motivo].setAttribute("name", "motivo")
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


  //#region Change radios


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

  Array.prototype.forEach.call(radioDenuncia, function (radio) {
    radio.addEventListener('change', changeHandler);
  });
  //#endregion


  //#region ValidateForm

  function validateRelacao() {
    if (radioRelacao) {
      for (option in radioRelacao) {
        if (radioRelacao[option].checked) {
          return true;
        }
      }
      return false;
    }
  }

  function validateMotivo() {
    var radioMotivo = document.querySelectorAll('input[type=radio][name="motivo"]');

    if (radioMotivo) {
      for (option in radioMotivo) {
        if (radioMotivo[option].checked) {
          return true;
        }
      }
      return false;
    }
  }
  //#endregion
}

function validateDescricao() {
  var textDescricao = document.querySelector('textarea[name=descricao]');

  if (textDescricao) {
    if (textDescricao.value === "") {
      return false;
    }
    return true;
  }
}

function validateDenuncia() {
  if (radioDenuncia) {
    for (option in radioDenuncia) {
      if (radioDenuncia[option].checked) {
        return true;
      }
    }
    return false;
  }
}


// Botão Próximo
btnNext.addEventListener('click', () => {
  if (currentTab !== (tab.length - 1)) {
    if (radiosContainer) {
      if (currentTab === 0) {
        if (validateDenuncia() && validateRelacao()) {
          currentTab++;
          tab[currentTab].style.display = "initial";
          tab[currentTab - 1].style.display = "none";
        } else {
          console.log("Não vai passar")
        }
      } else if (currentTab === 1) {
        if (validateMotivo()) {
          currentTab++;
          tab[currentTab].style.display = "initial";
          tab[currentTab - 1].style.display = "none";

        } else {
          console.log("Não vai passar")
        }
      }


    } else {
      if (currentTab === 0 && validateDenuncia()) {
        currentTab++;
        tab[currentTab].style.display = "initial";
        tab[currentTab - 1].style.display = "none";
      } else {
        console.log("Não vai passar")
      }


    }

    if (currentTab === (tab.length - 1)) {
      btnNext.innerHTML = "Enviar";
    }

    if (currentTab > 0) {
      btnPrevious.classList.add('visible')
    }





  } else {
    if (validateDescricao()) {
      form.submit();
    } else {
      console.log("Não vai passar")
    }
  }

  formTabs.innerText = `${currentTab + 1}/${tab.length}`
})

// Botão Anterior
btnPrevious.addEventListener('click', () => {
  if (currentTab > 0) {
    tab[currentTab].style.display = "none"
    tab[currentTab - 1].style.display = "initial"

    currentTab--;

    if (currentTab === 0) {
      btnPrevious.classList.remove('visible')
    }


    if (currentTab !== (tab.length - 1)) {
      btnNext.innerHTML = "Próximo";
    }
  }

  formTabs.innerText = `${currentTab + 1}/${tab.length}`
})