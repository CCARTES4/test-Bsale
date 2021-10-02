const productList = document.querySelector('#product-grid');
const nav = document.querySelector('#ul');
let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
let categorySelect = document.querySelector('#category');
const resetSearch = document.querySelector('#resetSearch');
const searchInput = document.querySelector('#productSearch');


loadEventListeners()

/**
 * Esta función se encarga de cargar todos los metodos necesarios para el funcionamiento inicial de la aplicación, ya sea renderizado
 * de todos los productos, cambio según opcion seleccionada en el SELECT 
 */
function loadEventListeners() {
    renderCartQuantity()
    loadProducts();
    productList.addEventListener('click', addToCart)
    categorySelect.addEventListener('change', (e) => {
        let categoryId = categorySelect.options[categorySelect.selectedIndex].value;
        loadProducts(categoryId);
    });
    resetSearch.addEventListener('click', restoreSearch);
    searchInput.addEventListener('change',searchProduct);
}

/**
 * Está función se encarga de realizar la consulta a la API para retornar todos los productos disponibles. Como la API puede recibir un parámetro opcional, 
 * se realiza una validación en la cuál si se envía el parametro opcional, la url variará y de lo contrario, esta quedará como estaba definida en un principio.
 * @param {int} categoryId 
 */
function loadProducts(categoryId) {

    try {
        let url = `https://ccartes.000webhostapp.com/products.php`;

        categoryId !== undefined ? url = `https://ccartes.000webhostapp.com/products.php?categoria=${categoryId}` : url;

        fetch(url, {
            method: 'GET'
        })
        .then(result => result.json())
        .then(data => renderProducts(data));
        cleanHTML();
    } catch (error) {
        alert(`Oh no! Ha habido un problema al cargar los productos ${error}`)
    }
    
}

/**
 * Esta función se encarga de todo el renderizado de los productos recibidos en el llamado a la API
 * @param {array} products 
 */
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

/**
 * 
 * @param {event} e 
 */
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

function searchProduct(e){
    let search = e.target.value;
    try {
        let url = `https://ccartes.000webhostapp.com/products.php?nombre=${search}`;

        fetch(url, {
            method: 'GET'
        })
        .then(result => result.json())
        .then(data => renderProducts(data));
        cleanHTML();
    } catch (error) {
        alert(`Oh no! Ha habido un problema al cargar los productos ${error}`)
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

