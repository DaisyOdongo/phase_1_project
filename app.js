const cartContainer=document.querySelector('.cart-container');
const productList=document.querySelector('.product-list');
const cartList=document.querySelector('.cart-list');
const cartTotalValue=document.getElementById('cart-total-value');
const cartCountInfo=document.getElementById('cart-count-info');
let cartItemID=1;

eventListeners();

function eventListeners(){
    window.addEventListener('DOMContentLoaded', () => {
        loadJSON();
        loadCart();
    });

    document.querySelector('.navbar-toggler').addEventListener('click', () => {
        document.querySelector('.navbar-collapse').classList.toggle('show-navbar');
    });
    
     document.getElementById('cart-btn').addEventListener('click', () => {
        cartContainer.classList.toggle('show-cart-container');
    });
    productList.addEventListener('click', purchaseProduct);

    cartList.addEventListener('click', deleteProduct);

}
function loadJSON(){
    fetch('db.json')
    .then(response => response.json())
    .then(data => {
        let html='';

        data.forEach(product=>{
            html +=`<div class="product-item"> <div class="product-img"> <image src="${product.imgScr}" alt=""></div> <div class="product-content"> <h4 class="product-name">${product.name}<p class="product-category">${product.category} <p class="product-description">${product.description} <h5 class="product-price">${product.price} <button type="button" class="add-to-cart-btn" > <i class="fas fa-shopping-cart"></i> Add To Cart </button> </div> </div> `;
            });
            productList.innerHTML=html;

        }).catch(error => {
            alert(`User live sever or local server`);
        })
    }
    function purchaseProduct(e) {
    if(e.target.classList.contains('add-to-cart-btn')) {
        let product=e.target.parentElement.parentElement;
        getProductInfo(product);
    }
}  

function getProductInfo(product) {
    let productInfo= {
        id: cartItemID,
            imgSrc: product.querySelector('.product-img img').src,
            name: product.querySelector('.product-name').textContent,
            category: product.querySelector('.product-category').textContent,
            description:product.querySelector('.product-description').textContent,
            price: product.querySelector('.product-price').textContent
    }


    cartItemID++;
    addToCartList(productInfo);
    saveProductInStorage(productInfo);
}

function addToCartList(product) {
    const cartItem=document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.setAttribute('data-id', `${product.id}`);
    cartItem.innerHTML=` <img src="${product.imgSrc}" alt="product image"><div class="cart-item-info"><h3 class="cart-item-name">${product.name}</h3><span class="cart-item-category">${product.category}</span><span class="cart-item-price">${product.price}</span></div><button type="button" class="cart-item-del-btn"><i class="fas fa-times"></i></button>`;
    cartList.appendChild(cartItem);
}
function saveProductInStorage(item) {
    let products=getProductFromStorage();
    products.push(item);
    localStorage.setItem('products', JSON.stringify(products));
    updateCartInfo();
}

function getProductFromStorage() {
    return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')): [];
}
function loadCart() {
    let products=getProductFromStorage();

    if(products.length < 1) {
        cartItemID=1; // if there is no any product in the local storage
    }

    else {
        cartItemID=products[products.length - 1].id;
        cartItemID++;
        // else get the id of the last product and increase it by 1
    }
    products.forEach(product=> addToCartList(product));
 
    updateCartInfo();
}

function findCartInfo() {
    let products=getProductFromStorage();

    let total=products.reduce((acc, product)=> {
            let price=parseFloat(product.price.substr(1)); // removing Ksh.
            return acc +=price;
        }

        , 0); // adding all the prices

    return {
        total: total.toFixed(2),
            productCount: products.length
    }
}
function deleteProduct(e) {
    let cartItem;

    if(e.target.tagName==="BUTTON") {
        cartItem=e.target.parentElement;
        cartItem.remove(); // this removes from the DOM only
    }

    else if(e.target.tagName==="I") {
        cartItem=e.target.parentElement.parentElement;
        cartItem.remove(); // this removes from the DOM only
    }

    let products=getProductFromStorage();

    let updatedProducts=products.filter(product=> {
            return product.id !==parseInt(cartItem.dataset.id);
        });
    localStorage.setItem('products', JSON.stringify(updatedProducts)); // updating the product list after the deletion
    updateCartInfo();
}

