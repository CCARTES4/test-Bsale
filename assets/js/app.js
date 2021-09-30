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

    fetch(url)
        .then(result => result.json())
        .then(data => renderProducts(data));
}

function renderProducts(products) {
    products.forEach(product => {

        const { id, name, url_image, price, discount, category } = product;

        productList.innerHTML += `
            <div class="col-md-3 col-sm-4 col-lg-3 mt-4">
                <div class="card">
                    <div class="card-body">
                        <div class="card-img-actions">
                            <img id="productImage" src="${url_image}" class="card-img img-fluid" width="96" height="350" alt="img_product">
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

