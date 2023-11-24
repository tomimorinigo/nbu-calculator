const { ipcRenderer } = require('electron'); // IMPORTAMOS IPCRENDERER PARA LLAMADOS CON EL MAIN.JS

const button = document.getElementById('accept');

button.addEventListener('click', ()=>{
    ipcRenderer.send('cerrar-ventana-emergente');
})