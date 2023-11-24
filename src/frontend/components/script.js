const nbu_input = document.getElementById("nbu");
const practices_input = document.getElementById("practice");
const practices_list = document.getElementById("practices-list");
const error_pratice = document.getElementById("err_practice");
const repeat_practice = document.getElementById("repeat_practice");
const monto_total = document.getElementById("monto_total");
const restart_button = document.getElementById("restart");
const nbu_error = document.getElementById("nbu_error");
const list_practices = document.getElementById("practices-list");
const lista_container = document.querySelector('.practices');

let total = 0;
let nbu_value = 0;
let array_practices = [];

let contenidoJson;

fetch('../components/bd.json')
.then((response) => response.json())
.then((data) => {
    contenidoJson = JSON.stringify(data);
})

const acortarString = (string, num)=>{
    if (string.length > num) {
        return string.slice(0, num) + "...";
      }
    return string;
}

const search = (element, array)=>{
    for (let index = 0; index < array.length; index++) {
        if(array[index] == element){
            return index
        }
    }
}

const subtractRemoved = (codigo)=>{

    const datos = JSON.parse(contenidoJson);
    const data = datos.find((item) => item.codigo == codigo);

    let amountToSubstract = nbu_value * data.ub;
    total -= amountToSubstract;
    monto_total.textContent = `$${total}`;
}

const checkRepeat = (array_practices, new_code)=>{
    for (let index = 0; index < array_practices.length; index++) {
        if (array_practices[index][0] == new_code){
            error_pratice.style.display = "none";
            nbu_error.style.display = "none";
            repeat_practice.style.display = "block";
            return true;
        }
    }
}

const addPractice = (codigo, practica, ub)=>{
    const newPractice = document.createElement("li");
    newPractice.innerHTML = `<p>(${codigo}) ${acortarString(practica, 14)} - $${ub}</p><span class="material-symbols-outlined delete">close</span>`;
    practices_list.appendChild(newPractice);
}

const addNewPracticeToList = (data)=>{
    if (data){
        let codigo = data.codigo;
        let practica = data.practica;
        let ub = data.ub;

        if (!checkRepeat(array_practices, codigo)){
            addPractice(codigo, practica, ub*nbu_value);
            let practiceToPush = [codigo, practica, ub*nbu_value]
            array_practices.push(practiceToPush);
        
            error_pratice.style.display = "none";
            repeat_practice.style.display = "none";
            nbu_error.style.display = "none";

            total += ub * nbu_value
            monto_total.textContent = `$${total}`
        }

        lista_container.scrollTop = lista_container.scrollHeight;

    }else{
        console.log("No existe ese codigo");
        repeat_practice.style.display = "none";
        nbu_error.style.display = "none";
        error_pratice.style.display = "block";
    }
    practices_input.value = '';
}

nbu_input.addEventListener("keydown", (event)=>{
    if(event.key === "Enter"){
        nbu_value = nbu_input.value;
        practices_input.focus();
    } 
})

restart_button.addEventListener("click", ()=>{
    location.reload();
})

practices_input.addEventListener("keydown", (event)=>{
    if (nbu_value < 0){
        nbu_error.style.display = "block";
    } else{
        if(event.key === "Enter"){
            let codigo = practices_input.value;
            
            const datos = JSON.parse(contenidoJson);
            const data = datos.find((item) => item.codigo == codigo);

            addNewPracticeToList(data);
        } 
    }
  
})

// Borrar items
list_practices.addEventListener('click', (e)=>{
    const elementsLI = Array.from(list_practices.getElementsByTagName('li'));
    console.log(elementsLI);
    if(e.target.classList.contains('delete')){
        const elementoPadre = e.target.parentNode;
        let numberLI = search(elementoPadre, elementsLI);
        elementoPadre.remove();

        let codeToSubstract = array_practices[numberLI][0];
        subtractRemoved(codeToSubstract);

        array_practices.splice(numberLI, 1);
    }
})

// Para el PDF a generar

export { array_practices, total };

// Para el buscador
export {nbu_value, nbu_error, contenidoJson, addNewPracticeToList, acortarString, search};