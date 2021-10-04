const shoppingCartList = document.querySelector('#shoppingCartList tbody');

function deleteProduct(shoppingCartList, shoppingCart) {
    if (shoppingCartList.target.classList.contains('deleteProduct')) {
        const productId = (e.target.getAttribute('data-id'));

        shoppingCart = shoppingCart.filter( product => product.id !== productId)

        clearLocalStorage();
        setLocalstorage(shoppingCart);
        renderShoppingCart()
    }
}

export{deleteProduct}