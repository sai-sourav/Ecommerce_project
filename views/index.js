const cartbutton = document.getElementById('cartbtn');
const cancelbutton = document.getElementById('cancelbtn');
const nav = document.getElementById('cartnav');
const musicdiv = document.getElementById('music-content');

cartbutton.addEventListener("click", ()=>{
    getcartproducts(1);
    nav.classList.toggle('active');
})

cancelbutton.addEventListener("click", ()=>{
    nav.classList.toggle('active');
})

document.addEventListener("DOMContentLoaded", async ()=>{
    const page = 1;
    const response = await axios.get(`http://localhost:4000/store?page=${page}`);
    showproducts(response.data.products);
    showpages(response.data);
});

function showproducts(products){
    musicdiv.innerHTML = "";
    for(i=0; i<products.length; i++){
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
        prevbtn.addEventListener('click', ()=>getproducts(previouspage));
        pages.appendChild(prevbtn);
    }
    const currbtn = document.createElement('button');
    currbtn.innerHTML = `<h3>${currentpage}</h3>`;
    currbtn.classList.add('active');
    currbtn.addEventListener('click', ()=>getproducts(currentpage));
    pages.appendChild(currbtn);

    if(hasnextpage){
        const nextbtn = document.createElement('button');
        nextbtn.innerHTML = nextpage;
        nextbtn.addEventListener('click', ()=>getproducts(nextpage));
        pages.appendChild(nextbtn);
    }
}

async function getproducts(page) {
    const response = await axios.get(`http://localhost:4000/store?page=${page}`);
    showproducts(response.data.products);
    showpages(response.data);
}

async function getcartproducts(cartpage){
    const response = await axios.get(`http://localhost:4000/cart?page=${cartpage}`);
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
        total_price = parseFloat(total_price) + parseFloat(cartproduct.productprice);
        cartitem.id = cartproduct.productid;
        cartitem.className = "cart-row";
        cartitem.innerHTML = `<span id='cart-item-${cartproduct.productid}' class='cart-item cart-column'>
                                    <img class='cart-img' src="${cartproduct.productimg}" alt="">
                                    <span>${cartproduct.productname}</span>
                                </span>
                                <span class='cart-price cart-column'>$${cartproduct.productprice}</span>
                                <span class='cart-quantity cart-column'>
                                    <input type="text" value="1">
                                    <button>REMOVE</button>
                                </span>`
        cart_items.appendChild(cartitem);
        document.getElementById('total-value').innerText = parseFloat(total_price).toFixed(2);
    }
}

/// add to cart event
const parentContainer = document.getElementById('EcommerceContainer');
parentContainer.addEventListener('click', async (e)=>{

    if (e.target.className === "shop-item-button"){
        const id = e.target.parentNode.parentNode.id
        const name = document.querySelector(`#${id} h3`).innerText;
        const img_src = document.querySelector(`#${id} img`).src;
        const price = e.target.parentNode.firstElementChild.firstElementChild.innerText;

        // if (document.querySelector(`#cart-item-${id}`)){
        //     alert('This item is already added to the cart');
        //     return new Promise((resolve,reject) => {
        //         resolve("");
        //     });
        // }

        try{

            const response = await axios.post("http://localhost:4000/cart",{
                productid : id,
                productname : name,
                productimg : img_src,
                productprice : price
            })

            const container = document.getElementById('container');

            const notif = document.createElement('div');
            notif.classList.add('toast');
            
            notif.innerHTML = `<h4>Your Product : <span>${name}</span> is added to the cart<h4>`;
            container.appendChild(notif);

            setTimeout(() => {
                notif.remove();
            }, 1000)
            getcartproducts(1);
        }catch(err){
            if (err){
                console.log(err);
            }
        }

    }

})