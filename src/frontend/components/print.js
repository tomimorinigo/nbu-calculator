const button = document.getElementById("print-pdf");

// INFORMACION PARA EL NOMBRE DEL PDF
const date = new Date();
const dia = date.getDay();
let hora = date.getHours();
let min = date.getMinutes();

const { ipcRenderer } = require('electron'); // IMPORTAMOS IPCRENDERER PARA LLAMADOS CON EL MAIN.JS

import { array_practices, total } from "./script.js"; // IMPORTAMOS DEL SCRIPT.JS ALGUNAS VARIABLES

const addBackground = (doc)=>{
    const imgSrc = '../../media/membrete.png';
    doc.addImage(imgSrc, 'PNG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);
}

const crearPDF = (array_practices)=>{
    const doc = new jspdf.jsPDF();

    console.log(array_practices);

    addBackground(doc);

    // CONFIGURACIONES TABLA

    const options = {
        startY: 64, // Posición vertical donde comienza la tabla
    };
    const headStyles = {
        fillColor: [236, 36, 156], // Color en formato RGB (magenta)
    }
    const styles = {
        fontSize: 14, // Tamaño de fuente para la tabla
    }

    doc.text('Presupuesto:', 15, 58)

    doc.autoTable({
        head: [['Código', "Práctica", "Precio"]],
        body: array_practices,
        startY: options.startY, // Posición vertical donde comienza la tabla
        headStyles,
        styles,
    })
    
    // Calcular la altura total de la tabla
    const alturaTabla = doc.autoTable.previous.finalY;
    const x = 15;
    const y = alturaTabla + 13;

    doc.text(`Monto total: $${total}`, x, y)

    doc.save(`presupuesto-${dia}-${hora}-${min}`);
}


button.addEventListener('click', ()=>{
    if (array_practices.length == 0){
        ipcRenderer.send('abrir-ventana-emergente');
    } else{
        crearPDF(array_practices);
    }
})