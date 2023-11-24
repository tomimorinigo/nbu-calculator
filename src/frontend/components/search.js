import { contenidoJson, addNewPracticeToList, acortarString, search, nbu_value, nbu_error } from "./script.js"; 

const searchInput = document.getElementById('input_search');
const resultList = document.querySelector('.search-list')

let resultados;

const searchFunction = practica =>{
    const datos = JSON.parse(contenidoJson);
    const resultados = datos.filter((item) => item.practica.toLowerCase().includes(practica.toLowerCase()));
    console.log(resultados);
    return resultados
}

const agregarResultados = resultados =>{

    for (let index = 0; index < resultados.length; index++) {
        const newResultado = document.createElement("li");
        newResultado.innerHTML = `<p>${acortarString(resultados[index].practica, 25)}</p>`;
        newResultado.setAttribute('title', resultados[index].practica)
        resultList.appendChild(newResultado);
    }

}

const clearAll = ()=>{
    while(resultList.firstChild){
        resultList.removeChild(resultList.firstChild);
    }
}

searchInput.addEventListener('keydown', (event)=>{
    if(event.key === 'Enter'){
        clearAll();
        let practicaBuscada = searchInput.value;
        resultados = searchFunction(practicaBuscada);
        agregarResultados(resultados);
    }
})

resultList.addEventListener('click', (e) => {
    if(nbu_value > 0){
        const elementsLI = Array.from(resultList.getElementsByTagName('li'));
        console.log(elementsLI);
        const elementoPadre = e.target.parentNode;
        let numberLI = search(elementoPadre, elementsLI);
        
        let practiceToAdd = resultados[numberLI];
    
        addNewPracticeToList(practiceToAdd);
        searchInput.value = '';
        clearAll();
    } else{
        nbu_error.style.display = "block";
    }
})