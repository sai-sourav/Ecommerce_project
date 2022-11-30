const cart_items = document.querySelector('#cart .cart-items');


const parentContainer = document.getElementById('EcommerceContainer');
parentContainer.addEventListener('click',(e)=>{

    if (e.target.className=='cart-btn-bottom' || e.target.className=='cart-bottom' || e.target.className=='cart-holder'){
        document.querySelector('#cart').style = "display:block;"
    }
    if (e.target.className=='cancel'){
        document.querySelector('#cart').style = "display:none;"
    }

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

        // const span_img = document.createElement('span');
        // span_img.className = "cart-item cart-column";
        // const img = document.createElement('img');
        // img.src = img_src;
        // img.classList.Add = "cart-img";
        // img.alt = "";
        // span_img.appendChild(img);
        // const span = document.createElement('span');
        // span.innerText = name;
        // span_img.appendChild(span);
        // div.appendChild(span_img);

        // const span_price = document.createElement('span');
        // span_price.className = "cart-price cart-column";
        // span_price.innerText= price;
        // div.appendChild(span_price);

        // const span_quantity = document.createElement('span');
        // span_quantity.className = "cart-quantity cart-column";
        // const inputele = document.createElement('input');
        // inputele.type = "text"
        // span_quantity.appendChild(inputele);
        
        // const removebutton = document.createElement('button');
        // removebutton.innerText = "Remove";
        // span_quantity.appendChild(removebutton);

        // div.appendChild(span_quantity);

        cart_items.appendChild(div);

        document.getElementById('total-value').innerText = total_price;

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

