//estado del carrito cuando se visualize en la pestaña
var carritoVisible = false;

//Esperar que los elementos de la página se carguen para continuar con el script
if(document.readyState=='loading') {
    document.addEventListener('DOMContentLoaded', ready)
}
else {
    ready();
}

//funcionalidad a los botones eliminar productos del carrito
function ready() {

    var botonesEliminar = document.getElementsByClassName('btn-eliminar');

    for(var i = 0; i < botonesEliminar.length; i++) {
        var button = botonesEliminar[i];
        button.addEventListener('click', eliminarItemCarrito);
    }

    //Agregar funcionalidad al boton de sumar cantidad
    var botonSumarCantidad = document.getElementsByClassName('sumar-cantidad');
    for(var i = 0; i < botonSumarCantidad.length; i++) {
        var button = botonSumarCantidad[i];
        button.addEventListener('click', sumarCantidad);
    }

    //Agregar funcionalidad al boton de restar cantidad
    var botonRestarCantidad = document.getElementsByClassName('restar-cantidad');
    for(var i = 0; i < botonRestarCantidad.length; i++) {
        var button = botonRestarCantidad[i];
        button.addEventListener('click', restarCantidad);
    }

    //Agregar funcionalidad a los botones de agregar al carrito
    var botonAgregarAlCarrito = document.getElementsByClassName('boton-item');
    for(var i = 0; i < botonAgregarAlCarrito.length; i++) {
        var button = botonAgregarAlCarrito[i];
        button.addEventListener('click', agregarAlCarrito);
    }

    //Agregar funcionalidad al boton pagar
    document.getElementsByClassName('btn-pagar')[0].addEventListener('click', pagarClicked);
}

//eliminar el item seleccionado del carrito
function eliminarItemCarrito(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();

    actualizarTotalCarrito();

    //Funcion que controla si hay elementos en el carrito una vez que se eliminó
    //Si no hay, se debe ocultar el carrito
    ocultarCarrito();
}

//Actualizar el total del carrito cuando se elimina un producto
function actualizarTotalCarrito() {
    var carritoContenedor = document.getElementsByClassName('carrito')[0];
    var carritoItems = carritoContenedor.getElementsByClassName('carrito-item');
    var total = 0;

    //hacemos un recorrido del carrito para actualizar el total
    for(var i = 0; i < carritoItems.length; i++) {
        var item = carritoItems[i];
        var precioElemento = item.getElementsByClassName('carrito-item-precio')[0];
        console.log(precioElemento);

        var precio = parseFloat(precioElemento.innerText.replace('$','').replace('.',''));
        console.log(precio);

        var cantidadItem = item.getElementsByClassName('carrito-item-cantidad')[0];
        var cantidad = cantidadItem.value;
        console.log(cantidad);
        
        total = total + (precio * cantidad);
    }

    total = Math.round(total*100)/100;

    document.getElementsByClassName('carrito-precio-total')[0].innerText = '$' + total.toLocaleString("es") + ',00';
} 

function ocultarCarrito() {
    var carritoItems = document.getElementsByClassName('carrito-items')[0];

    if(carritoItems.childElementCount == 0) {
        var carrito = document.getElementsByClassName('carrito')[0];
        carrito.style.marginRight = '-100%';
        carrito.style.opacity = '0';
        carritoVisible = false;

        //maximizar el contenedor de los elementos
        var items = document.getElementsByClassName('contenedor-items')[0];
        items.style.width = '100%';
    }
}

//Aumentar la cantidad de los productos seleccionados
function sumarCantidad(event) {
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    console.log(cantidadActual);
    cantidadActual++;
    selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
    actualizarTotalCarrito();
}

//restar la cantidad de los productos seleccionados
function restarCantidad(event) {
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    console.log(cantidadActual);
    cantidadActual--;

    if(cantidadActual >=1) {
        selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
        actualizarTotalCarrito();
    }
}

//Agregar productos al carrito
function agregarAlCarrito(event) {
    var button = event.target;
    var item = button.parentElement;
    var titulo = item.getElementsByClassName('titulo-item')[0].innerText;
    console.log(titulo);
    var precio = item.getElementsByClassName('precio-item')[0].innerText;
    var imagenSrc = item.getElementsByClassName('img-item')[0].src;
    console.log(precio + '\n' + imagenSrc);

    //Agregar productos al carrito. Le mandamos por parámetros los valores
    agregarItemAlCarrito(titulo, precio, imagenSrc);

    //Hacemos visible el carrito cuando se agrega un producto por primera vez
    hacerVisibleElCarrito();
}

function agregarItemAlCarrito(titulo, precio, imagenSrc) {
    var item = document.createElement('div')
    item.classList.add = 'item';
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Producto agregado.',
        showConfirmButton: false,
        timer: 1300
      })
    var itemsCarrito = document.getElementsByClassName('carrito-items')[0];

    //comprobar que el item que se está ingresando, no se encuentre dentro del carrito
    var nombresItemsCarrito = itemsCarrito.getElementsByClassName('carrito-item-titulo');
    for(var i = 0; i < nombresItemsCarrito.length; i++) {
        if(nombresItemsCarrito[i].innerText == titulo) {
            Swal.fire(
                '¡Error!',
                'El producto ya está en el carrito.',
                'warning'
              )
            return;
        }
    }

    var itemCarritoContenido = 
    `
    <div class="carrito-item">
        <img src="${imagenSrc}" alt="itemProducto" width="80px">
        <div class="carrito-item-detalles">
            <span class="carrito-item-titulo">${titulo}</span>
            <div class="selector-cantidad">
                <i class="fa-solid fa-minus restar-cantidad"></i>
                <input type="text" value="1" class="carrito-item-cantidad" disabled required>
                <i class="fa-solid fa-plus sumar-cantidad"></i>
            </div>
            <span class="carrito-item-precio">${precio}</span>
        </div>
        <span class="btn-eliminar">
            <i class="fa-solid fa-trash-can"></i>
        </span>
    </div>
    `

    item.innerHTML = itemCarritoContenido;
    itemsCarrito.append(item);

    //Agregamos la funcionalidad de eliminar el nuevo item
    item.getElementsByClassName('btn-eliminar')[0].addEventListener('click', eliminarItemCarrito);

    //Agregamos la funcionalidad de sumar el nuevo item
    var botonSumarCantidad = item.getElementsByClassName('sumar-cantidad')[0];
    botonSumarCantidad.addEventListener('click', sumarCantidad);

    //Agregamos la funcionalidad de restar el nuevo item
    var botonRestarCantidad = item.getElementsByClassName('restar-cantidad')[0];
    botonRestarCantidad.addEventListener('click', restarCantidad);
}

function pagarClicked(event) {
    Swal.fire({
        title: '¿Estás seguro de continuar?',
        text: "¡Si confirmas la compra no se podrá revertir!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: true,
        cancelButtonColor: '#d33',
        confirmButtonText: 'Comprar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            '¡Compra confirmada!',
            'Muchas gracias por su compra.',
            'success'
          )
        }
    })

    //elimina todos los elementos del carrito
    var carritoItems = document.getElementsByClassName('carrito-items')[0];

    while(carritoItems.hasChildNodes()) {
        carritoItems.removeChild(carritoItems.firstChild);
    }

    actualizarTotalCarrito();

    //funcion que oculta el carrito
    ocultarCarrito();
}

function hacerVisibleElCarrito() {
    carritoVisible = true;

    var carrito = document.getElementsByClassName('carrito')[0];
    carrito.style.marginRight = '0';
    carrito.style.opacity = '1';

    var items = document.getElementsByClassName('contenedor-items')[0];
    items.style.width = '60%';
}

//scroll up
// document.getElementById('boton-up').addEventListener('click', scrollUp);

// function scrollUp() {

//     var currentScroll = document.documentElement.scrollTop;
    
//     if(currentScroll > 0) {
//         window.requestAnimationFrame(scrollUp);
//         window.scrollTo (0, currentScroll - (currentScroll / 10));
//         botonUp.style.transform = 'scale(0)';
//     }
// }

// botonUp = document.getElementById('boton-up');

// window.onscroll = function() {

//     var scroll = document.documentElement.scrollTop;

//     if(scroll > 300) {
//         botonUp.style.transform = 'scale(1)';
//     }
//     else if (scroll < 300) {
//         botonUp.style.transform = 'scale(0)';
//     }
// }