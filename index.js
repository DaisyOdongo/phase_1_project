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

