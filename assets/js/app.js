const productList = document.querySelector('#product-grid');
const nav = document.querySelector('#ul');
let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
let categorySelect = document.querySelector('#category');
const resetSearch = document.querySelector('#resetSearch');


loadEventListeners()


function loadEventListeners() {
    renderCartQuantity()
    loadProducts();
    productList.addEventListener('click', addToCart)
    categorySelect.addEventListener('change', (e) => {
        let categoryId = categorySelect.options[categorySelect.selectedIndex].value;
        loadProducts(categoryId);
    });
    resetSearch.addEventListener('click', restoreSearch);
}

function loadProducts(categoryId) {

    let url = `https://ccartes.000webhostapp.com/product.php`;

    categoryId !== undefined ? url = `https://ccartes.000webhostapp.com/product.php?id=${categoryId}` : url;

    fetch(url, {
        method: 'GET'
    })
    .then(result => result.json())
    .then(data => renderProducts(data));
    cleanHTML();
    console.log(categoryId);

}

function renderProducts(products) {
    products.forEach(product => {

        const { id, name, url_image, price, discount, category } = product;
        const noImage = './assets/img/noImage.jpg'
        productList.innerHTML += `
            <div class="col-12 col-md-4 col-sm-4 col-lg-3 mt-4">
                <div class="card">
                    <div class="card-body">
                        <div class="card-img-actions">
                            <img id="productImage" src="${url_image ? url_image : noImage}" class="card-img img-fluid" alt="img_product">
                        </div>
                    </div>
                    <div class="card-body bg-light text-center">
                        <div class="mb-2">
                            <h6 class="font-weight-semibold mb-2">
                                <input id="cod" hidden="true" value="${id}"> </input> 
                                <input id="discount" hidden="true" value="${discount}"> </input> 
                                <input id="category" hidden="true" value="${category}"> </input>
                                <a id="name" href="#" class="text-default mb-2" data-abc="true">${name}</a>
                            </h6>
                        </div>
                        <h3 id="price" class="mb-0 font-weight-semibold">$${price}</h3>
                        <button id="bg-carrito" type="button" class="btn bg-cart">Añadir al carrito</button>
                    </div>
                </div>
            </div>
        `;
    });
}

function addToCart(e) {
    e.preventDefault();

    if (e.target.classList.contains('bg-cart')) {
        const selectedProduct = e.target.parentElement.parentElement;
        readProductData(selectedProduct);
    }
}

function readProductData(product) {

    const products = {
        id: product.querySelector('#cod').value,
        name: product.querySelector('#name').textContent,
        url_image: product.querySelector('#productImage').src,
        price: product.querySelector('#price').textContent,
        discount: product.querySelector('#discount').value,
        category: product.querySelector('#category').value,
        quantity: 1
    }

    const exist = shoppingCart.some(product => product.id === products.id);

    if (exist) {
        const updatedProduct = shoppingCart.map(product => {
            if (product.id === products.id) {
                product.quantity++;
                return product;
            } else {
                return product;
            }
        })
        shoppingCart = [...updatedProduct]
    } else {
        shoppingCart = [...shoppingCart, products];
        
    }
    renderCartQuantity();
    setLocalstorage();
    
}

function renderCartQuantity(){
    const exist = document.querySelector('#acc');

    const list = document.createElement('li');
    const acc = document.createElement('a');

    if (exist) {
        exist.innerText = shoppingCart.length;
    } else {
        acc.classList.add('btn', 'btn-danger', 'carQuantity');
        list.classList.add('nav-item');
        acc.setAttribute('id', 'acc');
        acc.innerText = shoppingCart.length;
        list.appendChild(acc);
        nav.appendChild(list);
    }
}

function cleanHTML() {
    while (productList.firstChild) {
        productList.removeChild(productList.firstChild);
    }
}

function setLocalstorage() {
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
}

function restoreSearch() {
    categorySelect.selectedIndex = 0;
    loadProducts();
}

