const foodWrapper = document.querySelector('.alimentos-wrapper');
var idCount = 1;

const btnAddFood = document.querySelector(".btn.adicionar");

var food = document.querySelectorAll(".alimento.row");
var tipfisico = document.querySelectorAll(".tpf");
var medidaAl = document.querySelectorAll(".alMedida");

//#region Filtro da medida com base no tipo selecionado 
// // medidaSolido()
// // medidaLiquido()



// tipfisico.forEach(
//     tipfisico => {
//         medidaAl.forEach(
//             medidaAl => {
//                 tipfisico.addEventListener('change', event => {
//                     for (i = 0; i < tipfisico.options.length; i++) {
//                         medidaAl.remove(medidaAl.options[i])
//                     };
//                     medidaSolido()
//                     medidaLiquido()
//                 })
//             }
//         )
//     }
// )


// function medidaSolido() {


//     tipfisico.forEach(
//         tipfisico => {
//             medidaAl.forEach(
//                 medidaAl => {
//                     if (tipfisico.selectedIndex == 0) {

//                         console.log
//                         console.log(food)

//                         const kg = document.createElement('option');
//                         kg.value = 'KG';
//                         kg.text = 'KG';
//                         medidaAl.add(kg, medidaAl.options[0]);

//                         const gramas = document.createElement('option');
//                         gramas.value = 'G';
//                         gramas.text = 'Gramas';
//                         medidaAl.add(gramas, medidaAl.options[1])
//                     }
//                 }
//             )
//         }
//     )


// }

// function medidaLiquido() {

//     tipfisico.forEach(
//         tipfisico => {
//             medidaAl.forEach(
//                 medidaAl => {
//                     if (tipfisico.selectedIndex == 1) {

//                         const litro = document.createElement('option');
//                         litro.value = 'L';
//                         litro.text = 'Litros';
//                         medidaAl.add(litro, medidaAl.options[0]);

//                         const ml = document.createElement('option');
//                         ml.value = 'ML';
//                         ml.text = 'ML';
//                         medidaAl.add(ml, medidaAl.options[1])
//                     }
//                 }
//             )
//         }
//     )
// }

//#endregion

//#region  Botões Adicionar/Remover alimentos
console.log(document.querySelector('.alimentos-wrapper'))

btnAddFood.addEventListener('click', () => {
    foodWrapper.append(addFood())

    // var food = document.querySelectorAll(".alimento.row");
    // var tipfisico = document.querySelectorAll(".tpf");
    // var medidaAl = document.querySelectorAll(".alMedida");
    // medidaSolido()
    // medidaLiquido()
    // console.log(tipfisico.length)
});

function addFood() {

    //#region Select do Tipo
    var tipo = document.createElement("div");
    tipo.classList = ("tipo-input");

    var lblTipo = document.createElement("label");
    lblTipo.innerHTML = "Tipo";

    var slctTipo = document.createElement("select");
    slctTipo.classList = "input-form tpf";
    slctTipo.setAttribute('name', 'tpf');

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

    //#region Select do Alimento
    var alimento = document.createElement("div");
    alimento.classList.add("alimento-input");

    var lblAlimento = document.createElement("label");
    lblAlimento.innerHTML = "Alimento"

    var slctAlimento = document.createElement("select");
    slctAlimento.classList = "input-form alimentoInput"
    slctAlimento.setAttribute('name', 'alimentoInput')

    var optArroz = document.createElement("option");
    optArroz.innerHTML = "Arroz";
    optArroz.setAttribute('value', 'Arroz');

    slctAlimento.append(optArroz);


    alimento.append(lblAlimento);
    alimento.append(slctAlimento);
    //#endregion

    //#region Input da quantidade
    var qtd = document.createElement("div");
    qtd.classList = ("quantidade-input ");

    var lblQtd = document.createElement("label");
    lblQtd.innerHTML = "Quantidade"

    var txtQtd = document.createElement("input");
    txtQtd.classList = "input-form"
    txtQtd.setAttribute('type', 'number');
    txtQtd.setAttribute('min', '1');
    txtQtd.setAttribute('name', 'quantidade');

    qtd.append(lblQtd);
    qtd.append(txtQtd);
    //#endregion 

    //#region Input do Botão
    var btn = document.createElement("button");
    btn.classList.add("btn");
    btn.classList.add("red");
    btn.classList.add("excluir");
    btn.setAttribute("type", "button");
    btn.setAttribute("onclick", "delFood(this)");

    var imgBtn = document.createElement("img");
    imgBtn.setAttribute("src", "/assets/img/trash.svg");
    imgBtn.setAttribute("alt", "excluir");
    btn.append(imgBtn);
    //#endregion

    //#region Container alimentos 

    var alimentoContainer = document.createElement("div");
    alimentoContainer.classList = ("alimento row");

    alimentoContainer.append(tipo);
    alimentoContainer.append(alimento);
    alimentoContainer.append(qtd);
    alimentoContainer.append(btn);
    alimentoContainer.setAttribute("id", idCount);

    //#endregion

    idCount++;
    return alimentoContainer;
}

function delFood(btn) {
    var divId = btn.parentNode.id
    var toRemove = document.getElementById(divId);

    foodWrapper.removeChild(toRemove);
    idCount--;
}
//#endregion

// document.getElementById("imagePed").addEventListener('change', event => {
//     console.log(document.getElementById('imagePed').files[0])
// })