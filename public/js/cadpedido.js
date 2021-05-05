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

    var food = document.querySelectorAll(".alimento.row");
    var tipfisico = document.querySelectorAll(".tpf");
    var medidaAl = document.querySelectorAll(".alMedida");

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

    //#region Input do Alimento
    var alimento = document.createElement("div");
    alimento.classList = ("alimento-input");

    var lblFood = document.createElement("label");
    lblFood.innerHTML = "Alimento"

    var txtFood = document.createElement("input");
    txtFood.setAttribute('type', 'text');
    txtFood.classList = "input-form alimentoInput"
    txtFood.setAttribute('name', 'alimentoInput');

    alimento.append(lblFood);
    alimento.append(txtFood);

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

    //#region Select da Medida
    var medida = document.createElement("div");
    medida.classList.add("medida-input");

    var lblMedida = document.createElement("label");
    lblMedida.innerHTML = "Medida"

    var slctMedida = document.createElement("select");
    slctMedida.classList = "input-form alMedida"
    slctMedida.setAttribute('name', 'alMedida')

    var optTipoK = document.createElement("option");
    optTipoK.innerHTML = "Quilos";
    optTipoK.setAttribute('value', 'KG');

    var optTipoG = document.createElement("option");
    optTipoG.innerHTML = "Gramas";
    optTipoG.setAttribute('value', 'G');

    var optTipoL = document.createElement("option");
    optTipoL.innerHTML = "Litros";
    optTipoL.setAttribute('value', 'L');

    var optTipoML = document.createElement("option");
    optTipoML.innerHTML = "ML";
    optTipoML.setAttribute('value', 'ML');

    slctMedida.append(optTipoK);
    slctMedida.append(optTipoG);
    slctMedida.append(optTipoL);
    slctMedida.append(optTipoML);

    medida.append(lblMedida);
    medida.append(slctMedida);
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
    alimentoContainer.append(medida);
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

document.getElementById("imagePed").addEventListener('change', event => {
    console.log(document.getElementById('imagePed').files[0])
})

document.getElementById("formPedido").addEventListener('submit', event => {
    event.preventDefault();
    var file = document.getElementById('imagePed').files[0];
    const img = []
    img.push({'imgPedido': file})

    var valores = []
    var alimentos = []

    const titulo = document.getElementById("titId").value;
    const dtPedido = new Date(document.getElementById("dtPed").value);
    const metaPed = document.getElementById("metaPed").value;
    const estado = document.getElementById("estadoPed").value;
    const cidade = document.getElementById("cidadePed").value;
    const descricao = document.getElementById("descPed").value;

    valores.push({ titulo: titulo, data: dtPedido, meta: metaPed, estado: estado, cidade: cidade, descricao: descricao })

    document.querySelectorAll('.alimentos-wrapper > .alimento').forEach(alimento => {
        const tipofisc = alimento.querySelectorAll('.input-form')[0].value;
        const alimName = alimento.querySelectorAll('.input-form')[1].value;
        const quantidade = alimento.querySelectorAll('.input-form')[2].value;
        const medida = alimento.querySelectorAll('.input-form')[3].value;
        alimentos.push({ tipoFisic: tipofisc, alimento: alimName, quantidade: quantidade, medida: medida })
    })

    valores.push(alimentos)

    /* fetch('cadpedido', {
        method: 'POST',
        body: JSON.stringify(valores),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        if (response.status == 200) {
            window.location.href = "/cadaccept"
        }
        if (response.status == 500) {
            window.location.href = "/cadrecused"
        }
    }) */
})