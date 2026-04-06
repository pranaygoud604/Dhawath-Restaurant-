let cart = {
  noodles:{name:"Noodles",price:120,qty:0},
  burger:{name:"Burger",price:100,qty:0},
  shawarma:{name:"Shawarma",price:130,qty:0},
  tandoori:{name:"Tandoori Chicken",price:220,qty:0},
  paneer:{name:"Paneer Tikka",price:160,qty:0},
  drinks:{name:"Cool Drinks",price:40,qty:0}
};

function changeQty(item, change){
  cart[item].qty += change;
  if(cart[item].qty < 0) cart[item].qty = 0;

  document.getElementById("qty-"+item).innerText = cart[item].qty;
  updateTotal();
}

function updateTotal(){
  let total = 0;
  let html = "";

  for(let key in cart){
    if(cart[key].qty > 0){
      let itemTotal = cart[key].price * cart[key].qty;
      total += itemTotal;

      html += `<div class="order-item">
        <span>${cart[key].name} x ${cart[key].qty}</span>
        <span>₹${itemTotal}</span>
      </div>`;
    }
  }

  document.getElementById("total").innerText = total;
  document.getElementById("orderList").innerHTML = html || "No items selected";
}

function sendWhatsApp(){
  let table = document.getElementById("table").value;

  let text="";
  let total=0;

  for(let key in cart){
    if(cart[key].qty>0){
      text += cart[key].name+" x "+cart[key].qty+"%0A";
      total += cart[key].price * cart[key].qty;
    }
  }

  if(!table || text===""){
    alert("Enter table & select items");
    return;
  }

  let orderId = "ORD" + Math.floor(Math.random()*10000);

  alert("✅ Order Placed!\nOrder ID: " + orderId);

  let finalText = "Order ID: "+orderId+"%0A"
                + "Table: "+table+"%0A"
                + text
                + "Total: ₹"+total;

  window.open("https://wa.me/91XXXXXXXXXX?text="+finalText);

  clearCart();
}

function payUPI(){
  let total=0;
  for(let key in cart){
    total += cart[key].price * cart[key].qty;
  }

  if(total===0){
    alert("Add items first");
    return;
  }

  window.location.href="upi://pay?pa=yourupi@upi&pn=Dhawath&am="+total+"&cu=INR";
}

function clearCart(){
  for(let key in cart){
    cart[key].qty=0;
    document.getElementById("qty-"+key).innerText=0;
  }
  updateTotal();
  document.getElementById("orderList").innerHTML = "No items selected";
}
