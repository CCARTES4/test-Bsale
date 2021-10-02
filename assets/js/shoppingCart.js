document.addEventListener('DOMContentLoaded',() => {
    

    /**
     * Creación de selectores que serán utilizados posteriormente.
     */
    let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart'));
    const shoppingCartList = document.querySelector('#shoppingCartList tbody');
    const shoppingTable = document.querySelector('#shoppingCartList');

    /**
     * Carga de listeners
     */
    loadEventListeners();

    /**
     * Creación de listeners
     */
    function loadEventListeners() {
        renderShoppingCart();
        shoppingTable.addEventListener('click', deleteProduct);
    }

    /**
     * Esta función se encarga de limpiar el carro de compras en caso de que se hagan cambios
     * en el array que contiene los productos agregados a este.
     */
    function restoreCart(){

        while (shoppingCartList.firstChild) {
            shoppingCartList.removeChild(shoppingCartList.firstChild);
        }
    }

    /**
     * Esta función se encarga de recorrer nuestro arreglo del carrito de compras para posteriormente, renderizarlo en forma de HTML
     * para la visualización de estos. 
     */
    function renderShoppingCart() {
        const noImage = './assets/img/noImage.jpg'
        restoreCart()

        shoppingCart.forEach( product => {
            const { id, name, url_image, price, discount, category, quantity } = product;
            const row = document.createElement('tr');
            row.innerHTML = `
            <td> 
                <img src="${url_image ? url_image : noImage}" width="60" height="60" >
            </td>
            <td> 
                ${name}
            </td>
            <td> 
                ${price}
            </td>
            <td> 
                ${quantity}
            </td>
            <td> 
                <a href="#" class="btn btn-danger deleteProduct" data-id=${id}> Quitar producto </a>
            </td>
            `;
            shoppingCartList.appendChild(row);
        })
    }

    /**
     * Esta función se encarga de eliminar un producto de nuestro array de carrito de compras.
     * Realiza una comprobación para detectar si el producto seleccionado se encuentra dentro de este.
     * Una vez que lo encuentra, limpia el localStorage para posteriormente guardarlo nuevamente y volver a renderizar el nuevo carrito de compras
     * @param {event} e 
     */
    function deleteProduct(e) {
        if (e.target.classList.contains('deleteProduct')) {
            const productId = (e.target.getAttribute('data-id'));

            shoppingCart = shoppingCart.filter( product => product.id !== productId)

            clearLocalStorage();
            setLocalstorage();
            renderShoppingCart()
        }
        
    }

    function setLocalstorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
    }

    function clearLocalStorage() {
        localStorage.clear();
    }
})