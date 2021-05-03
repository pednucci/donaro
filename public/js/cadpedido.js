const foodWrapper = document.querySelector('.alimentos-wrapper');
const btnAddFood = document.querySelector(".btn.adicionar");
const tipoContainer = document.querySelector('.tipo-input');
const foodContainer = document.querySelector('.alimento-input');
const qtdContainer = document.querySelector('.quantidade-input');
const medContainer = document.querySelector('.medida-input');
const btnDelFood = document.querySelector('.btn.excluir');

const tipfisico = document.querySelector(".tpf");
const medida = document.querySelector(".alMedida");

function medidaSolido() {
    if (tipfisico.selectedIndex == 0) {

        const kg = document.createElement('option');
        kg.value = 'KG';
        kg.text = 'KG';
        medida.add(kg, medida.options[0]);

        const gramas = document.createElement('option');
        gramas.value = 'G';
        gramas.text = 'Gramas';
        medida.add(gramas, medida.options[1])
    }
}

function medidaLiquido() {
    if (tipfisico.selectedIndex == 1) {

        const litro = document.createElement('option');
        litro.value = 'L';
        litro.text = 'Litros';
        medida.add(litro, medida.options[0]);

        const ml = document.createElement('option');
        ml.value = 'ML';
        ml.text = 'ML';
        medida.add(ml, medida.options[1])
    }
}


function addFood() {
    let div = document.createElement('input');
    // foodWrapper
    // div.classList.add('alimentos row');

    console.log('Coé');
}

function delFood() {

    console.log('Coé');
}




medidaSolido()
medidaLiquido()

tipfisico.addEventListener('change', event => {
    for (i = 0; i < tipfisico.options.length; i++) {
        medida.remove(medida.options[i])
    }
    medidaSolido()
    medidaLiquido()
})

btnAddFood.addEventListener('click', addFood);
btnDelFood.addEventListener('click', delFood);
