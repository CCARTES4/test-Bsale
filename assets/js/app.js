const productList = document.querySelector('#product-grid');
const nav = document.querySelector('#ul');
let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];


loadEventListeners()


function loadEventListeners() {
    loadProducts();
    productList.addEventListener('click', addToCart)
}

function loadProducts() {

    const url = 'https://ccartes.000webhostapp.com/product';
    try {
        fetch(url)
        .then(result => result.json())
        .then(data => renderProducts(data));
    } catch (error) {
        alert(`there is a problem loading products ${error}`)
    }
    
}

function renderProducts(products) {
    products.forEach(product => {

        const { id, name, url_image, price, discount, category } = product;

        productList.innerHTML += `
            <div class="col-md-3 col-sm-4 col-lg-3 mt-4">
                <div class="card">
                    <div class="card-body">
                        <div class="card-img-actions">
                            <img id="productImage" src="${url_image}" class="card-img img-fluid" height="20px" alt="img_product">
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

    setLocalstorage();
    
}


function setLocalstorage() {
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
}

