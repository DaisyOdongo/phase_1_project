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
    }  
     document.getElementById('cart-btn').addEventListener('click', () => {
        cartContainer.classList.toggle('show-cart-container');
    });
    productList.addEventListener('click', purchaseProduct);

    cartList.addEventListener('click', deleteProduct);


 function loadJSON(name, category, description, price, imag_url) {
    const info = { name, category, description, price, imag_url };
    fetch(`https://whispering-hamlet-94712.herokuapp.com/groceries`)
   .then(response => response.json())
    .then(data => {
        let html='';

         data.forEach(product=>{
            html +=
            `<div class = "product-item">
                <div class = "product-img">
                    <img src="https://static9.depositphotos.com/1002351/1132/i/450/depositphotos_11323739-stock-photo-broccoli-vegetable.jpg"
                        alt="product image">
                    <button type = "button" class = "add-to-cart-btn">
                    <i class = "fas fa-shopping-cart"></i>Add To Cart
                    </button>
                </div>
                <div class="product-content">
                    <h3 class="product-name">Broccoli</h3>
                    <span class="product-category">Vegetable</span>
                    <span class="product-description">Fresh broccoli</span>
                    <p class="product-price">Ksh. 90.00</p>
                </div> 
            </div> `;
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
    cartItem.innerHTML=` <div class = "cart-item">
                                    <img src="https://st2.depositphotos.com/1526816/5854/v/600/depositphotos_58547269-stock-illustration-nutritious-carrots.jpg">
                                      <div class = "cart-item-info">
                                        <h3 class = "cart-item-name">Carrot</h3>
                                        <span class = "cart-item-category">Vegetable</span>
                                        <span class="cart-item-description">Farm fresh carrots</span>
                                        <span class = "cart-item-price">Ksh.150.00</span>
                                      </div>
                                      <button type = "button" class = "cart-item-del-btn">
                                        <i class = "fas fa-times"></i>
                                      </button>
                                    </div> `;
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
        cartItem.remove(); 
    }

    else if(e.target.tagName==="I") {
        cartItem=e.target.parentElement.parentElement;
        cartItem.remove(); 
    }

    let products=getProductFromStorage();

    let updatedProducts=products.filter(product=> {
            return product.id !==parseInt(cartItem.dataset.id);
        });
    localStorage.setItem('products', JSON.stringify(updatedProducts)); // updating the product list after the deletion
    updateCartInfo();
}



