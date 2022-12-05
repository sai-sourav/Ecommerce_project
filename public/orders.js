const orderslist = document.getElementById('orderslist');
const nav = document.getElementById('nav');
const cancelbutton = document.getElementById('cancelbtn');

let active_button;

const IP = "13.229.142.253";

document.addEventListener("DOMContentLoaded", getorders);

async function getorders(){
    orderslist.innerHTML = "";
    const orders = await axios.get(`http://${IP}:4000/orders`);
    let orders_list = orders.data;
    if (orders_list.length > 0){
        for(i=0; i<orders_list.length; i++){
            let order = orders_list[i];
            const orderdiv = document.createElement('div');
            orderdiv.id = order.id;
            orderdiv.className = "order-item";
            orderdiv.innerHTML = `<h3> Orderno: ${order.id}</h3>
            <button class="cancel-order-button" type='button'>Cancel order</button>
            <button id="show" class="show-products-button" type='button'>Show details ⋗</button>`
            orderslist.appendChild(orderdiv);
            const breake = document.createElement('br');
            orderslist.appendChild(breake);
        } 
    }else {
        const noorders = document.createElement('h1');
        noorders.innerText = "No orders to show";
        orderslist.appendChild(noorders);
    } 
}

let previousbutton = document.createElement('button');
orderslist.addEventListener("click", async (e) => {
    if(e.target.className === "show-products-button"){
        const orderid = e.target.parentNode.id;
        getproducts(1,orderid);
        if (previousbutton !== e.target){
            previousbutton.classList.remove('active');
            previousbutton = e.target;
        }
        nav.classList.add('active');
        e.target.classList.add('active');
        active_button = e.target;
    }
    if(e.target.className === "cancel-order-button"){
        const orderid = e.target.parentNode.id;
        console.log("delete",orderid);
        const response = await axios.get(`http://${IP}:4000/deleteorder/${orderid}`);
        // console.log(response);
        getorders();
    }
})

cancelbutton.addEventListener("click", ()=>{
    nav.classList.remove('active');
    active_button.classList.remove('active');
})

async function getproducts(page,id){
    const response = await axios.get(`http://${IP}:4000/orderdetails/${id}?page=${page}`);
    // console.log(response);
    showproducts(response.data.products);
    showpages(response.data,id);
}

function showpages(
    {
        currentpage,
        hasnextpage,
        haspreviouspage,
        nextpage,
        previouspage
    },
    id
){
    const pages = document.getElementById('pages');
    pages.innerHTML = "";
    
    if(haspreviouspage){
        const prevbtn = document.createElement('button');
        prevbtn.innerHTML = previouspage;
        prevbtn.addEventListener('click', ()=>getproducts(previouspage,id));
        pages.appendChild(prevbtn);
    }
    const currbtn = document.createElement('button');
    currbtn.innerHTML = `<h3>${currentpage}</h3>`;
    currbtn.classList.add('active');
    currbtn.addEventListener('click', ()=>getproducts(currentpage,id));
    pages.appendChild(currbtn);

    if(hasnextpage){
        const nextbtn = document.createElement('button');
        nextbtn.innerHTML = nextpage;
        nextbtn.addEventListener('click', ()=>getproducts(nextpage,id));
        pages.appendChild(nextbtn);
    }
}

function showproducts(products){
    const items = document.querySelector('.cart-items');
    items.innerHTML = "";
    document.getElementById('total-value').innerText = "";
    let product;
    let total_price = document.getElementById('total-value').innerText;
    total_price = 0;
    for(i=0; i<products.length; i++){
        product = products[i];
        const item = document.createElement('div');
        total_price = parseFloat(total_price) + parseFloat(product.price);
        item.id = product.id;
        item.className = "cart-row";
        item.innerHTML = `<span id='cart-item-${product.id}' class='cart-item cart-column'>
                                    <img class='cart-img' src="${product.imageUrl}" alt="">
                                    <span>${product.title}</span>
                                </span>
                                <span class='cart-price cart-column'>$${product.price}</span>
                                <span class='cart-quantity cart-column'>
                                    <input type="text" value="${product.Orderitem.quantity}" readonly>
                                </span>`
        items.appendChild(item);
        document.getElementById('total-value').innerText = parseFloat(total_price).toFixed(2);
    }
}