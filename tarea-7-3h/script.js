let inventario = [
    { id: 1, nombre: "Bleu de Chanel", categoria: "Amaderada", cantidad: 14, precio: 135.00, agotado: false },
    { id: 2, nombre: "Dior Sauvage Elixir", categoria: "Fougère", cantidad: 8, precio: 165.50, agotado: false },
    { id: 3, nombre: "Acqua di Giò Profondo", categoria: "Cítrica", cantidad: 20, precio: 110.00, agotado: false },
    { id: 4, nombre: "Creed Aventus", categoria: "Amaderada", cantidad: 0, precio: 320.00, agotado: true },
    { id: 5, nombre: "Versace Eros Flame", categoria: "Cítrica", cantidad: 25, precio: 95.00, agotado: false },
    { id: 6, nombre: "Tom Ford Lost Cherry", categoria: "Dulce / Oriental", cantidad: 5, precio: 395.00, agotado: false },
    { id: 7, nombre: "Yves Saint Laurent Y EDP", categoria: "Fougère", cantidad: 18, precio: 120.00, agotado: false },
    { id: 8, nombre: "Baccarat Rouge 540", categoria: "Dulce / Oriental", cantidad: 0, precio: 325.00, agotado: true }
];

const cuerpoInventario = document.getElementById("cuerpo-inventario");

const filtroCategoria = document.getElementById("filtro-categoria");

const formularioProducto = document.getElementById("formulario-producto");

const mensajeError = document.getElementById("mensaje-error");

const mensajeVacio = document.getElementById("mensaje-vacio");

const totalProductosElement = document.getElementById("total-productos");

const totalUnidadesElement = document.getElementById("total-unidades");

const valorTotalElement = document.getElementById("valor-total");

const totalAgotadosElement = document.getElementById("total-agotados");

let generarId;


function crearGeneradorId() {
    let contador = 100; 
    return function() {
        contador++;
        return contador;
    };
}

function calcularValorTotal(items) {
    let suma = 0;
    for (let i = 0; i < items.length; i++) {
        suma += items[i].cantidad * items[i].precio;
    }
    return suma;
}

function contarUnidades(items) {
    let suma = 0;
    for (let i = 0; i < items.length; i++) {
        suma += items[i].cantidad;
    }
    return suma;
}

function contarPorCategoria(items) {
    let conteo = {};
    for (let i = 0; i < items.length; i++) {
        let cat = items[i].categoria;
        if (conteo[cat] === undefined) {
            conteo[cat] = 1;
        } else {
            conteo[cat]++;
        }
    }
    return conteo;
}

function crearCelda(texto) {
    const td = document.createElement("td");
    td.textContent = texto;
    return td;
}

function crearFila(item) {
    const tr = document.createElement("tr");
        
    if (item.agotado) {
        tr.classList.add("fila-agotado");
    }

    tr.appendChild(crearCelda(item.id));

    tr.appendChild(crearCelda(item.nombre));

    tr.appendChild(crearCelda(item.categoria));

    tr.appendChild(crearCelda(item.cantidad));

    tr.appendChild(crearCelda("$" + item.precio.toFixed(2)));
    
    let subtotalValue = item.cantidad * item.precio;

    tr.appendChild(crearCelda("$" + subtotalValue.toFixed(2)));    

    tr.appendChild(crearCelda(item.agotado ? "Agotado " : "En Stock "));

    const tdAcciones = document.createElement("td");

    const btnEstado = document.createElement("button");

    btnEstado.textContent = item.agotado ? "Reabastecer" : "Agotar";

    btnEstado.classList.add("btn-estado");

    btnEstado.setAttribute("data-id", item.id);

    const btnEliminar = document.createElement("button");

    btnEliminar.textContent = "Eliminar";

    btnEliminar.classList.add("btn-eliminar");

    btnEliminar.setAttribute("data-id", item.id);

    tdAcciones.appendChild(btnEstado);

    tdAcciones.appendChild(btnEliminar);

    tr.appendChild(tdAcciones);

    return tr;
}

function renderizar(items) {
    
    while (cuerpoInventario.firstChild) {

        cuerpoInventario.removeChild(cuerpoInventario.firstChild);
    }


    if (items.length === 0) {
        mensajeVacio.classList.remove("oculto");
    } else {
        mensajeVacio.classList.add("oculto");
       
        for (let i = 0; i < items.length; i++) {

            let fila = crearFila(items[i]);

            cuerpoInventario.appendChild(fila);
        }
    }

   
    let totalProductos = items.length;

    let totalUnidades = contarUnidades(items);

    let valorTotal = calcularValorTotal(items);
    
    let totalAgotados = 0;
    for (let i = 0; i < items.length; i++) {
        if (items[i].agotado) {
            totalAgotados++;
        }
    }

    totalProductosElement.textContent = totalProductos;

    totalUnidadesElement.textContent = totalUnidades;

    valorTotalElement.textContent = "$" + valorTotal.toFixed(2);

    totalAgotadosElement.textContent = totalAgotados;
}

function filtrarPorCategoria(categoria) {
    let resultadoFiltrado = [];
    for (let i = 0; i < inventario.length; i++) {
        if (inventario[i].categoria === categoria) {
            resultadoFiltrado.push(inventario[i]);
        }
    }
    return resultadoFiltrado;
}

function validarProducto(datos) {

    let nombreLimpio = datos.nombre.trim();

    let categoriaLimpia = datos.categoria.trim();

    if (nombreLimpio === "") {
        throw new Error("El campo 'Fragancia / Marca' no puede estar vacío.");
    }
    if (categoriaLimpia === "") {
        throw new Error("El campo 'Familia Olfativa' no puede estar vacío.");
    }
    
    let cantidadEntera = Number(datos.cantidad);
    if (isNaN(cantidadEntera) || !Number.isInteger(cantidadEntera) || cantidadEntera < 0) {
        throw new Error("La cantidad de frascos debe ser un número entero mayor o igual a cero.");
    }

    
    let precioNumerico = Number(datos.precio);
    if (isNaN(precioNumerico) || precioNumerico < 0) {
        throw new Error("El precio debe ser un número válido mayor o igual a cero.");
    }
}

function agregarProducto(event) {
    event.preventDefault(); 
    
    mensajeError.classList.add("oculto");

    mensajeError.textContent = "";

    
    let datosFormulario = {
        nombre: document.getElementById("nombre").value,

        categoria: document.getElementById("categoria").value,

        cantidad: document.getElementById("cantidad").value,

        precio: document.getElementById("precio").value
    };

    try {
        
        validarProducto(datosFormulario);

        let cantidadFormateada = parseInt(datosFormulario.cantidad);
        
        
        let nuevoProducto = {
            id: generarId(),
            nombre: datosFormulario.nombre.trim(),
            categoria: datosFormulario.categoria.trim(),
            cantidad: cantidadFormateada,
            precio: parseFloat(datosFormulario.precio),
            agotado: cantidadFormateada === 0 ? true : false
        };

        
        inventario.push(nuevoProducto);

        console.log("Alta de fragancia exitosa:", nuevoProducto);

       
        actualizarSelectorCategorias();
        ejecutarFiltradoActual();
        
        // Limpieza del formulario
        formularioProducto.reset();

    } catch (error) {
        //
        console.error(" Error de Validación Interna:", error.message);
        mensajeError.textContent = error.message;
        mensajeError.classList.remove("oculto");
    }
}

function eliminarProducto(id) {
    let nuevoArray = [];
    for (let i = 0; i < inventario.length; i++) {
        if (inventario[i].id !== id) {
            nuevoArray.push(inventario[i]);
        }
    }
    return nuevoArray;
}

function cambiarEstado(id) {
    for (let i = 0; i < inventario.length; i++) {
        if (inventario[i].id === id) {
          
            inventario[i].agotado = !inventario[i].agotado;
            
           
            if (!inventario[i].agotado && inventario[i].cantidad === 0) {
                inventario[i].cantidad = 1;
            } else if (inventario[i].agotado) {
                inventario[i].cantidad = 0;
            }
            console.log("🔄 Cambio de estado en perfume ID " + id + ": Agotado = " + inventario[i].agotado);
            break;
        }
    }
}



function actualizarSelectorCategorias() {
    let categoriasExistentes = contarPorCategoria(inventario);
    

let valorSeleccionadoAnterior = filtroCategoria.value;

while (filtroCategoria.options.length > 1) {

filtroCategoria.remove(1);

}

/*
for (let claveCat in categoriasExistentes) {
    
        let opcion = document.createElement("option");

        opcion.value = claveCat;

        opcion.textContent = claveCat;

        filtroCategoria.appendChild(opcion);
}
*/
if (categoriasExistentes[valorSeleccionadoAnterior] !== undefined) {

filtroCategoria.value = valorSeleccionadoAnterior;

} else {
filtroCategoria.value = "todas";
}
}
function ejecutarFiltradoActual() {

let categoriaSeleccionada = filtroCategoria.value;

if (categoriaSeleccionada === "todas") {
renderizar(inventario);
} else {
let inventarioFiltrado = filtrarPorCategoria(categoriaSeleccionada);
renderizar(inventarioFiltrado);
}
}

generarId = crearGeneradorId();

formularioProducto.addEventListener("submit", agregarProducto);

filtroCategoria.addEventListener("change", ejecutarFiltradoActual);

cuerpoInventario.addEventListener("click", (event) => {
    
const elementoClickeado = event.target;
let esBtnEstado = elementoClickeado.classList.contains("btn-estado");

let esBtnEliminar = elementoClickeado.classList.contains("btn-eliminar");

if (esBtnEstado || esBtnEliminar) {

let idProducto = parseInt(elementoClickeado.getAttribute("data-id"));

if (esBtnEstado) {

cambiarEstado(idProducto);

} else if (esBtnEliminar) {

inventario = eliminarProducto(idProducto);

console.log(" Baja de producto. ID eliminado:", idProducto);

actualizarSelectorCategorias();

}
ejecutarFiltradoActual();
}
});
console.log("--- INVENTARIO INICIAL DE PERFUMES ---");

console.table(inventario);

console.log("--- CONTEO INICIAL POR FAMILIAS OLFATIVAS ---");

console.table(contarPorCategoria(inventario));

actualizarSelectorCategorias();

renderizar(inventario);

