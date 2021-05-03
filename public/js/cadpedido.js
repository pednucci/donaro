const foodWrapper = document.querySelector('.alimentos-wrapper');
const food = document.querySelector('.alimento.row');


const tipoContainer = document.querySelector('.tipo-input');
const foodContainer = document.querySelector('.alimento-input');
const qtdContainer = document.querySelector('.quantidade-input');
const medContainer = document.querySelector('.medida-input');

const btnAddFood = document.querySelector(".btn.adicionar");
const btnDelFood = document.querySelector('.btn.excluir');

const tipfisico = document.querySelector(".tpf");
const medida = document.querySelector(".alMedida");

//#region Filtro da medida com base no tipo selecionado 
medidaSolido()
medidaLiquido()

tipfisico.addEventListener('change', event => {
    for (i = 0; i < tipfisico.options.length; i++) {
        medida.remove(medida.options[i])
    };
    medidaSolido()
    medidaLiquido()
})


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

//#endregion

//#region  Adição de novos campos para inserir alimentos
btnAddFood.addEventListener('click', () => foodWrapper.append(addFood()));
btnDelFood.addEventListener('click', delFood);

function addFood() {

    // Container alimentos 
    var alimentoContainer = document.createElement("div");
    alimentoContainer.classList = ("alimento row");


    //#region Input do tipo
    var tipo = document.createElement("div");
    tipo.classList = ("tipo-input");

    var lblTipo = document.createElement("label");
    lblTipo.innerHTML = "Tipo";

    var slctTipo = document.createElement("select");
    slctTipo.classList = "input-form tpf";
    slctTipo.setAttribute('name', 'tipofis');

    var optTipoS = document.createElement("option");
    optTipoS.innerHTML = "Sólido";
    optTipoS.setAttribute('value', 'solido');

    var optTipoL = document.createElement("option");
    optTipoL.innerHTML = "Líquido";
    optTipoL.setAttribute('value', 'liquido');

    slctTipo.append(optTipoS);
    slctTipo.append(optTipoL);
    tipo.append(lblTipo);
    tipo.append(slctTipo);

    //#endregion

    //#region Input do Alimento
    var alimento = document.createElement("div");
    alimento.classList.add("alimento-input");

    var lblFood = document.createElement("label");
    lblFood.innerHTML = "Alimento"

    var txtFood = document.createElement("input");
    txtFood.setAttribute('type', 'text');
    txtFood.classList = "input-form"
    txtFood.setAttribute('name', 'alimento');

    alimento.append(lblFood);
    alimento.append(txtFood);

    //#endregion

    //#region Input da quantidade
    var qtd = document.createElement("div");
    qtd.classList.add("quantidade-input");

    var lblQtd = document.createElement("label");
    lblQtd.innerHTML = "Quantidade"

    var txtQtd = document.createElement("input");
    txtQtd.classList = "input-form"
    txtQtd.setAttribute('type', 'number');
    txtQtd.setAttribute('name', 'quantidade');
    txtQtd.setAttribute('min', '1');

    qtd.append(lblQtd);
    qtd.append(txtQtd);
    //#endregion 

    //#region Input da medida
    var medida = document.createElement("div");
    medida.classList.add("medida-input");

    var lblMedida = document.createElement("label");
    lblMedida.innerHTML = "Medida"

    var slctMedida = document.createElement("select");
    slctMedida.classList = "input-form alMedida"
    slctMedida.setAttribute('name', 'medida');

    medida.append(lblMedida);
    medida.append(slctMedida);
    //#endregion

    //#region Input do botão
    var btn = document.createElement("button");
    btn.classList.add("btn");
    btn.classList.add("red");
    btn.classList.add("excluir");
    btn.setAttribute("type", "button");

    var imgBtn = document.createElement("img");
    imgBtn.setAttribute("src", "/assets/img/trash.svg");
    imgBtn.setAttribute("alt", "excluir");

    btn.append(imgBtn);
    //#endregion


    // Adiciona os elementos ao container
    alimentoContainer.append(tipo);
    alimentoContainer.append(alimento);
    alimentoContainer.append(qtd);
    alimentoContainer.append(medida);
    alimentoContainer.append(btn);

    console.log(foodWrapper);

    return alimentoContainer;
}
//#endregion

function delFood() {

    console.log('tipo deleted');
}
