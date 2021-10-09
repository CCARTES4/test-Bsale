/**Importación de funciones para guardar/limpiar localStorage */
import {setLocalstorage, clearLocalStorage} from './localStorage.js';

document.addEventListener('DOMContentLoaded',() =>{

    //Creación de variables que serán utilizadas de manera global por más de una función
    const productList = document.querySelector('#product-grid');
    let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    let categorySelect = document.querySelector('#category');
    const resetSearch = document.querySelector('#resetSearch');
    const searchInput = document.querySelector('#productSearch');
    const searchForm = document.querySelector('#SearchForm');


    //Inicio de función que carga todos los listeners(eventos) de la aplicación;
    loadEventListeners()

    /**
     * Esta función se encarga de cargar todos los metodos necesarios para el funcionamiento inicial de la aplicación, ya sea renderizado
     * de todos los productos, cambio según opcion seleccionada en el SELECT 
     */
    function loadEventListeners() {
        getCategories();
        renderCartQuantity()
        loadProducts();
        productList.addEventListener('click', addToCart)
        categorySelect.addEventListener('change', (e) => {
            let categoryId = categorySelect.options[categorySelect.selectedIndex].value;
            loadProducts(categoryId);
        });
        resetSearch.addEventListener('click', () => {
            restoreSearch();
            loadProducts();  
            searchInput.value = '';
        } );
        // searchInput.addEventListener('change',searchProduct);
        searchForm.addEventListener('submit', e => {
            
            e.preventDefault();
            searchProduct(searchInput.value);
        })
        
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
     * Esta función se encarga de todo el renderizado de los productos recibidos en el llamado a la API. 
     * @param {array} products 
     */
    function renderProducts(products) {
        products.forEach(product => {

            const { id, name, url_image, price, discount, category } = product;
            const noImage = './assets/img/noImage.jpg';
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
     * Esta función se encarga de guardar el producto seleccionado por el cliente dentro de un array y posteriormente, realizar la validación de si el producto ya existe 
     * o no dentro del mismo, en caso de existir, actualiza la cantidad de este y de lo contrario, lo agrega al arreglo. 
     * @param {array} product 
     */
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
        setLocalstorage(shoppingCart);
    }

    /**
     * Esta función se encarga de ir actualizando el contador de productos. Es un indicador visual para el usuario saber cuántos productos tiene agregados en su carrito. 
     */
     function renderCartQuantity(){
        const counter = document.querySelector('#acc');
        counter.innerText = shoppingCart.length;
    }

    /**
     * Seleccionamos el elemento padre que contiene todos los div tipo card y capturamos el evento para luego, enviarle lo seleccionado al método readProductData().
     * @param {event} e 
     */
    function addToCart(e) {
        e.preventDefault();

        if (e.target.classList.contains('bg-cart')) {
            const selectedProduct = e.target.parentElement.parentElement;
            readProductData(selectedProduct);
        }
    }


    /**
     * Esta función se encarga de retornar los productos que contengan en su nombre los caracteres indicados por el usuario en el input de buscar.
     * Realiza una consulta a la API y va retornado los productos según correspondan. 
     * @param {event} e 
     */
    function searchProduct(productName){
        console.log('entré');
        try {
            let url = `https://ccartes.000webhostapp.com/products.php?nombre=${productName}`;

            fetch(url, {
                method: 'GET'
            })
            .then(result => result.json())
            .then(data => renderProducts(data));
            restoreSearch();
            cleanHTML();
        } catch (error) {
            alert(`Oh no! Ha habido un problema al cargar los productos ${error}`)
        }
    }

    /**
     * Esta función se encarga de remover los productos del HTML, en caso de que el usuario realice la acción de buscar, ya sea según categoría o nombre
     */
    function cleanHTML() {
        while (productList.firstChild) {
            productList.removeChild(productList.firstChild);
        }
    }


    /**
     * Cuando el usuario realiza una búsqueda ya sea por categoría o por nombre, pero posterior a ello desea volver a ver todos los productos, esta función se encarga de
     * retornar el listado completo.
     */
    function restoreSearch() {
        categorySelect.selectedIndex = 0;
    }

    /**
     * Esta función permite cargar el select de categorias dinamicamente, es decir, realiza una consulta a la API y posteriormente, realiza un llamado a la 
     * función insertCategories
     */
    function getCategories() {
        
        try {
            const url = `https://ccartes.000webhostapp.com/categories.php?categorias`;

            fetch(url, {
                method: 'GET'
            } )
            .then(result => result.json())
            .then(data => insertCategories(data))
        } catch (error) {
            alert(alert(`Uh, Houston, tuvimos un problema al cargar las categorías. Por favor, recarga la página. ${error}`)  );
        }
    }

    /**
     * Se encarga de crear, asignar valor, texto y renderizar los elementos option por cada resultado que retorne la API  
     * @param {array} categories 
     */
    function insertCategories(categories) {
        categories.forEach( category => {
            const {id, name } = category;

            let option = document.createElement('option');
            option.value = id;
            option.innerText = name;
            categorySelect.appendChild(option);
        })
    }

})