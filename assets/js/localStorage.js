
function setLocalstorage(shoppingCart) {
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
}

function clearLocalStorage() {
    localStorage.clear();
}

export {setLocalstorage, clearLocalStorage}; 