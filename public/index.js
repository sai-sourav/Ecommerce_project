const cartbutton = document.getElementById('cartbtn');
const cancelbutton = document.getElementById('cancelbtn');
const nav = document.getElementById('cartnav');
const musicdiv = document.getElementById('music-content');

var openedcartpage = 1;

const IP = "18.143.190.26";

cartbutton.addEventListener("click", ()=>{
    getcartproducts(1);
    nav.classList.toggle('active');
})

cancelbutton.addEventListener("click", ()=>{
    nav.classList.toggle('active');
})

document.addEventListener("DOMContentLoaded", async ()=>{
    const page = 1;
    const response = await axios.get(`http://${IP}:4000/store?page=${page}`);
    showproducts(response.data.products);
    showpages(response.data);
});

function showproducts(products){
    musicdiv.innerHTML = "";
    for(i=0; i<products.length; i++){
        const productele = document.createElement('div');
        let product = products[i];
        productele.id=`${product.id}`
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
}

function showpages(
    {
        currentpage,
        hasnextpage,
        haspreviouspage,
        nextpage,
        previouspage
    }
){
    const pages = document.getElementById('pages');
    pages.innerHTML = ""
    
    if(haspreviouspage){
        const prevbtn = document.createElement('button');
        prevbtn.innerHTML = previouspage;
        prevbtn.classList.add('btn');
        prevbtn.addEventListener('click', ()=>getproducts(previouspage));
        pages.appendChild(prevbtn);
    }
    const currbtn = document.createElement('button');
    currbtn.innerHTML = `<h3>${currentpage}</h3>`;
    currbtn.classList.add('active');
    currbtn.classList.add('btn');
    currbtn.addEventListener('click', ()=>getproducts(currentpage));
    pages.appendChild(currbtn);

    if(hasnextpage){
        const nextbtn = document.createElement('button');
        nextbtn.innerHTML = nextpage;
        nextbtn.classList.add('btn');
        nextbtn.addEventListener('click', ()=>getproducts(nextpage));
        pages.appendChild(nextbtn);
    }
}

async function getproducts(page) {
    const response = await axios.get(`http://${IP}:4000/store?page=${page}`);
    showproducts(response.data.products);
    showpages(response.data);
}

async function getcartproducts(cartpage){
    openedcartpage = cartpage;
    const response = await axios.get(`http://${IP}:4000/cart?page=${cartpage}`);
    console.log(response);
    showcartproducts(response.data.products);
    showcartpages(response.data);
}

function showcartpages(
    {
        currentpage,
        hasnextpage,
        haspreviouspage,
        nextpage,
        previouspage
    }
){
    const pages = document.getElementById('cartpages');
    pages.innerHTML = ""
    
    if(haspreviouspage){
        const prevbtn = document.createElement('button');
        prevbtn.innerHTML = previouspage;
        prevbtn.addEventListener('click', ()=>getcartproducts(previouspage));
        pages.appendChild(prevbtn);
    }
    const currbtn = document.createElement('button');
    currbtn.innerHTML = `<h3>${currentpage}</h3>`;
    currbtn.classList.add('active');
    currbtn.addEventListener('click', ()=>getcartproducts(currentpage));
    pages.appendChild(currbtn);

    if(hasnextpage){
        const nextbtn = document.createElement('button');
        nextbtn.innerHTML = nextpage;
        nextbtn.addEventListener('click', ()=>getcartproducts(nextpage));
        pages.appendChild(nextbtn);
    }
}

function showcartproducts(cartproducts){
    const cart_items = document.querySelector('.cart-items');
    cart_items.innerHTML = "";
    document.getElementById('total-value').innerText = "";
    let cartproduct;
    let total_price = document.getElementById('total-value').innerText;
    total_price = 0;
    for(i=0; i<cartproducts.length; i++){
        cartproduct = cartproducts[i];
        const cartitem = document.createElement('div');
        total_price = parseFloat(total_price) + parseFloat(cartproduct.price);
        cartitem.id = cartproduct.id;
        cartitem.className = "cart-row";
        cartitem.innerHTML = `<span id='cart-item-${cartproduct.id}' class='cart-item cart-column'>
                                    <img class='cart-img' src="${cartproduct.imageUrl}" alt="">
                                    <span>${cartproduct.title}</span>
                                </span>
                                <span class='cart-price cart-column'>$${cartproduct.price}</span>
                                <span class='cart-quantity cart-column'>
                                    <input type="text" value="${cartproduct.cartitem.quantity}" readonly>
                                    <button class="remove-cart-product">X</button>
                                </span>`
        cart_items.appendChild(cartitem);
        document.getElementById('total-value').innerText = parseFloat(total_price).toFixed(2);
    }
}

const parentContainer = document.getElementById('EcommerceContainer');
parentContainer.addEventListener('click', async (e)=>{
    /// add to cart event
    if (e.target.className === "shop-item-button"){
        const id = e.target.parentNode.parentNode.id
        try{
            const response = await axios.post(`http://${IP}:4000/cart`,{
                productid : id
            })

            const container = document.getElementById('container');

            const notif = document.createElement('div');
            notif.classList.add('toast');
            
            notif.innerHTML = `<h4>Your Product : <span>${id}</span> is added to the cart<h4>`;
            container.appendChild(notif);

            setTimeout(() => {
                notif.remove();
            }, 1000);

            getcartproducts(openedcartpage);

        }catch(err){
            if (err){
                console.log(err);
            }
        }

    }
    // remove cart item
    if (e.target.className === "remove-cart-product"){
        const id = e.target.parentNode.parentNode.id;
        console.log(id);
        try{
            const response = await axios.post(`http://${IP}:4000/cart/delete`,{
                productid : id
            })
            getcartproducts(openedcartpage);
        }catch(err){
            if (err){
                console.log(err);
            }
        }
    }
    /// cart to orders and clear cart
    if (e.target.className === "purchase-btn"){
        try{
            const response = await axios.get(`http://${IP}:4000/carttoorder`);
            nav.classList.remove('active');
            const container = document.getElementById('container');

            const notif = document.createElement('div');
            notif.classList.add('toast');
            
            notif.innerHTML = `<h4> Order sucessfully placed with order id = <span>${response.data.orderid}</span><h4>`;
            container.appendChild(notif);

            setTimeout(() => {
                notif.remove();
            }, 1000);

        }catch(err){
            if (err){
                console.log(err);
            }
        }
    }

})

// const btns = document.getElementsByClassName("btn");

// console.log(btns[0]);