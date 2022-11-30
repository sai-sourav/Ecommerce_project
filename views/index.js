const cart_items = document.querySelector('.cart-items');

const cartbutton = document.getElementById('cartbtn');
const cancelbutton = document.getElementById('cancelbtn');
const nav = document.getElementById('cartnav');

const musicdiv = document.getElementById('music-content');
const merchdiv = document.getElementById('merch-content');

document.addEventListener("DOMContentLoaded", async () => {
    try{
    const productres = await axios.get("http://localhost:4000/store");
    const products = productres.data;
    let product;
    for(i=0; i<4; i++){
        const productele = document.createElement('div');
        product = products[i];
        productele.id=`album${product.id}`
        productele.innerHTML = `  <h3>${product.title}</h3>
                                    <div class="image-container">
                                        <img class="prod-images" src="${product.imageUrl}" alt="">
                                    </div>
                                    <div class="prod-details">
                                        <span>$<span>${product.price}</span></span>
                                        <button class="shop-item-button" type='button'>ADD TO CART</button>
                                    </div> `;
        musicdiv.appendChild(productele);
    }
    for(i=4; i<6; i++){
        const productele = document.createElement('div');
        product = products[i];
        productele.id=`album${product.id}`
        productele.innerHTML = `  <h3>${product.title}</h3>
                                    <div class="image-container">
                                        <img class="prod-images" src="${product.imageUrl}" alt="">
                                    </div>
                                    <div class="prod-details">
                                        <span>$<span>${product.price}</span></span>
                                        <button class="shop-item-button" type='button'>ADD TO CART</button>
                                    </div> `;
        merchdiv.appendChild(productele);
    }
    } catch(err){
        if(err){
            console.log(err);
        }
    }
    
                        
})

cartbutton.addEventListener("click", ()=>{
    nav.classList.toggle('active');
})

cancelbutton.addEventListener("click", ()=>{
    nav.classList.toggle('active');
})


const parentContainer = document.getElementById('EcommerceContainer');
parentContainer.addEventListener('click',(e)=>{

    if (e.target.className === "shop-item-button"){
        const id = e.target.parentNode.parentNode.id
        const name = document.querySelector(`#${id} h3`).innerText;
        const img_src = document.querySelector(`#${id} img`).src;
        const price = e.target.parentNode.firstElementChild.firstElementChild.innerText;
        let total_price = document.getElementById('total-value').innerText;

        total_price = parseFloat(total_price) + parseFloat(price);

        if (document.getElementById(`in-cart-${id}`)){
            alert('This item is already added to the cart');
            return
        }

        const div = document.createElement('div');
        div.className = "cart-row";
        div.id = `in-cart-${id}`

        div.innerHTML = `
        <span class='cart-item cart-column'>
        <img class='cart-img' src="${img_src}" alt="">
            <span>${name}</span>
        </span>
        <span class='cart-price cart-column'>${price}</span>
        <span class='cart-quantity cart-column'>
            <input type="text" value="1">
            <button>REMOVE</button>
        </span>`

        cart_items.appendChild(div);

        document.getElementById('total-value').innerText = parseFloat(total_price).toFixed(2);

        const container = document.getElementById('container');

        const notif = document.createElement('div');
        notif.classList.add('toast');
        
        notif.innerHTML = `<h4>Your Product : <span>${name}</span> is added to the cart<h4>`;
        container.appendChild(notif);

        setTimeout(() => {
            notif.remove();
        }, 1000)

    }

})

