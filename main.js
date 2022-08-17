// Menu Desplegable
const hamIcon = document.getElementById('ham-icon');
const showMenu = document.getElementById('menu');

//Mostar Carrito
const iconCart = document.getElementById('icon-cart');
const showCart = document.getElementById('table');
const contador = document.getElementById('contador');

// Carrito de compras

const cards = document.getElementById('cards');
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templatedCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();
let carrito = {};

// Eventos
    // Mostrar  Menu
hamIcon.addEventListener('click', () => {
    showMenu.classList.toggle('show-menu');
});
// Mostar Carrito
iconCart.addEventListener('click', () => {
    showCart.classList.toggle('show-cart');
})

document.addEventListener('DOMContentLoaded', () => {
     fetchData();
     if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'));
        mostrarCarrito();
     }
})
cards.addEventListener('click', e => {
    addCarrito(e);
})
items.addEventListener('click', e => {
    btnAccion(e);
})

const fetchData = async () => {
    try {
        const res = await fetch('api.json');
        const data = await res.json();
        mostrarCards(data);
    } catch (error) {
        console.log(error);
    }
}

const mostrarCards = data => {
    data.forEach(producto => {
        templatedCard.getElementById("img-producto").setAttribute("src", producto.img)
        templatedCard.getElementById('nombTorta').textContent = producto.nombre;
        templatedCard.getElementById('desc').textContent = producto.desc;
        templatedCard.getElementById('precio').textContent = producto.precio.mediana;
        templatedCard.getElementById('btn-comprar').dataset.id = producto.id;

        const clone = templatedCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment);
}

const addCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement);
    }
    e.stopPropagation();
}

const setCarrito = objeto => {
    const producto =  {
        id: objeto.querySelector('.btn-dark').dataset.id,
        nombre: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('#precio').textContent,
        cantidad: 1
    }
    if(carrito.hasOwnProperty(producto.id)){ 
        producto.cantidad++;
    }
    carrito[producto.id] = {...producto};
    mostrarCarrito();
}

const mostrarCarrito = () => {
    items.innerHTML = "";
    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelector('th').textContent = producto.id;
        templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre;
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio;

        //Botones
        templateCarrito.querySelector('.btn-info').dataset.id =  producto.id;
        templateCarrito.querySelector('.btn-danger').dataset.id =  producto.id;

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);

    })
    items.appendChild(fragment);

    mostrarFooter();

    // Guardar en el localStorage lo que se almacena en el carrito
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

const mostrarFooter = () => {
    footer.innerHTML = '';
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío comienza a comprar...</th>
        `
        return
    }
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0 );
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0);
    
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    contador.innerText = nCantidad;
        
    const btnVaciar = document.getElementById('vaciar-carrito');
    btnVaciar.addEventListener('click', () => {
        carrito ={};
        swal('Productos eliminados del carrito','','success');
        mostrarCarrito();
    })
    // contador.innerText = nCantidad;
}

const btnAccion = e => {
    console.log(e.target)
    if(e.target.classList.contains('btn-info')) {
        console.log(carrito[e.target.dataset.id]);

        const producto = carrito[e.target.dataset.id];
        producto.cantidad++;
        carrito[e.target.dataset.id] = {...producto};
        mostrarCarrito();
    }
    if(e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--;
        if (producto.cantidad === 0){
            delete carrito[e.target.dataset.id];
        }
        mostrarCarrito()
    }

    e.stopPropagation()
}
