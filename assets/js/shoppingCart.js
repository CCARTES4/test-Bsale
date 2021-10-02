let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart'));
const shoppingCartList = document.querySelector('#shoppingCartList tbody');
const shoppingTable = document.querySelector('#shoppingCartList');


loadEventListeners();

function loadEventListeners() {
    renderShoppingCart();
    shoppingTable.addEventListener('click', deleteProduct);
}

function restoreCart(){

    while (shoppingCartList.firstChild) {
        shoppingCartList.removeChild(shoppingCartList.firstChild);
    }
}

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