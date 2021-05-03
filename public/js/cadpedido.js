const foodWrapper = document.querySelector('.alimentos-wrapper');
var idCount = 1;

const btnAddFood = document.querySelector(".btn.adicionar");

const tipfisico = document.querySelectorAll(".tpf");
const medidaAl = document.querySelectorAll(".alMedida");

//#region Filtro da medida com base no tipo selecionado 
medidaSolido()
medidaLiquido()

tipfisico.forEach(
    function (currentValue, currentIndex) {
        tipfisico[currentIndex].addEventListener('change', event => {
            for (i = 0; i < tipfisico[currentIndex].options.length; i++) {
                medidaAl[currentIndex].remove(medidaAl[currentIndex].options[i])
            };
            medidaSolido()
            medidaLiquido()
        })
    }
)



function medidaSolido() {

    tipfisico.forEach(
        function (currentValue, currentIndex) {
            if (tipfisico[currentIndex].selectedIndex == 0) {

                const kg = document.createElement('option');
                kg.value = 'KG';
                kg.text = 'KG';
                medidaAl[currentIndex].add(kg, medidaAl[currentIndex].options[0]);

                const gramas = document.createElement('option');
                gramas.value = 'G';
                gramas.text = 'Gramas';
                medidaAl[currentIndex].add(gramas, medidaAl[currentIndex].options[1])
            }
        }
    )


}

function medidaLiquido() {
    tipfisico.forEach(
        function (currentValue, currentIndex) {
            if (tipfisico[currentIndex].selectedIndex == 1) {

                const litro = document.createElement('option');
                litro.value = 'L';
                litro.text = 'Litros';
                medidaAl[currentIndex].add(litro, medidaAl[currentIndex].options[0]);

                const ml = document.createElement('option');
                ml.value = 'ML';
                ml.text = 'ML';
                medidaAl[currentIndex].add(ml, medidaAl[currentIndex].options[1])
            }
        }
    )
}

//#endregion

//#region  Adição de novos campos para inserir alimentos

btnAddFood.addEventListener('click', () => {
    foodWrapper.append(addFood())
    medidaSolido()
    medidaLiquido()
});

function addFood() {

    //#region Input do tipo
    var tipo = document.createElement("div");
    tipo.classList = ("tipo-input");

    var lblTipo = document.createElement("label");
    lblTipo.innerHTML = "Tipo";

    var slctTipo = document.createElement("select");
    slctTipo.classList = "input-form tpf";

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

    medida.append(lblMedida);
    medida.append(slctMedida);
    //#endregion

    //#region Input do botão
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
    console.log(alimentoContainer);
    console.log("added")

    idCount++;
    return alimentoContainer;
}
//#endregion

function delFood(btn) {
    let divId = btn.parentNode.id
    let toRemove = document.getElementById(divId);

    console.log(btn.parentNode)
    foodWrapper.removeChild(toRemove);
    console.log("removed")
    idCount--;
}
