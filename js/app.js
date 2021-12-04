const carrito = document.querySelector('#carrito')
const contenedorCarrito = document.querySelector('#lista-carrito tbody')
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito')
const listaCursos = document.querySelector('#lista-cursos')
let articulosCarritos = []

cargarEventListeners()

function cargarEventListeners(){
    //Cuando agregs un curso presionando "Agregar carrito"
    listaCursos.addEventListener('click', addCurso)

    //delet cursos del carrito
    carrito.addEventListener('click', deleteCurso)

    //muestra los cursos de local storage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarritos = JSON.parse( localStorage.getItem('carrito') ) || []
        
        carritoHTML()
    })



    //vaciar carrito
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito)
}

function addCurso(e){
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        leerDatosCursos(e.target.parentElement.parentElement)
        carritoHTML() //iterar sobre el carrito y mostrar su Html
    }
}

function deleteCurso(e){
    if (e.target.classList.contains('borrar-curso')) {
        const id = e.target.getAttribute('data-id')
        //eliminar del array articulosCarritos por el data-id
        articulosCarritos = articulosCarritos.filter( c => c.id !== id )
        carritoHTML() //iterar sobre el carrito y mostrar su Html
    }
}

function vaciarCarrito(){
    articulosCarritos = []
    clearHtml()
}


//lee el contenido del Html al que le da click y extrae la información del curso
function leerDatosCursos(curso){
    const objCurso = {
        img:curso.querySelector('img').src,
        titulo:curso.querySelector('h4').textContent,
        precio:curso.querySelector('.precio span').textContent,
        id:curso.querySelector('a').getAttribute('data-id'),
        cantidad:1
    }

    const existe = articulosCarritos.some( c => c.id === objCurso.id)
    if (existe) {
        //update cantidad
        const arrCurso = articulosCarritos.map( x => {
            if (x.id === objCurso.id) {
                x.cantidad++;
                return x //retorna el obj actualizado
            }else{
                return x //retorna el obj no actualizado
            }
        });
        articulosCarritos = [...arrCurso]
    }else{
        //add al array articulosCarritos
        articulosCarritos = [...articulosCarritos, objCurso]
    }
    //articulosCarritos.push(objCurso)
    //console.log(curso.querySelector('img'));
    carritoHTML()
}

//muestra el carrito de compras en el html 
function carritoHTML(){
    //
    clearHtml()
    articulosCarritos.forEach(curso => {
        const { img, titulo, precio, cantidad, id } = curso
        const row = document.createElement('tr')
        row.innerHTML = `
            <td>
                <img src="${img}" width="100">
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}">X</a>
            </td>
        `
        //add el html del carrito al tbody
        contenedorCarrito.appendChild(row)
    })

    //agregar el carrito d compras al storage
    sincronizarStorage()    
}

function sincronizarStorage(){
    localStorage.setItem('carrito', JSON.stringify(articulosCarritos))
}

function clearHtml(){
    contenedorCarrito.innerHTML = ''

    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}