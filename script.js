// 🔥 Firebase config (FIXED)
const firebaseConfig = {
  apiKey: "AIzaSyAUV8uk7hdxJKh75SlHukoohTtQ1Wd_qLk",
  authDomain: "dhawath-restaurant.firebaseapp.com",
  databaseURL: "https://dhawath-restaurant-default-rtdb.firebaseio.com",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🛒 Cart Data
let cart = {
  noodles:{name:"Noodles",price:120,qty:0},
  burger:{name:"Burger",price:100,qty:0},
  shawarma:{name:"Shawarma",price:130,qty:0},
  tandoori:{name:"Tandoori Chicken",price:220,qty:0},
  paneer:{name:"Paneer Tikka",price:160,qty:0},
  drinks:{name:"Cool Drinks",price:40,qty:0}
};

// ➕➖ Quantity
function changeQty(item, change){
  cart[item].qty += change;
  if(cart[item].qty < 0) cart[item].qty = 0;

  document.getElementById("qty-"+item).innerText = cart[item].qty;
  updateTotal();
}

// 💰 Total
function updateTotal(){
  let total = 0;
  let html = "";

  for(let key in cart){
    if(cart[key].qty > 0){
      let itemTotal = cart[key].price * cart[key].qty;
      total += itemTotal;

      html += `
        <div class="order-item">
          <span>${cart[key].name} x ${cart[key].qty}</span>
          <span>₹${itemTotal}</span>
        </div>`;
    }
  }

  document.getElementById("total").innerText = total;
  document.getElementById("orderList").innerHTML = html || "No items selected";
}

// 📦 Order
function sendWhatsApp(){
  let table = document.getElementById("table").value;

  let total = 0;
  let items = [];
  let text = "";

  for(let key in cart){
    if(cart[key].qty > 0){
      total += cart[key].price * cart[key].qty;

      items.push({
        name: cart[key].name,
        qty: cart[key].qty
      });

      text += cart[key].name + " x " + cart[key].qty + "%0A";
    }
  }

  if(!table || items.length === 0){
    alert("Enter table & select items");
    return;
  }

  let orderId = "ORD" + Math.floor(Math.random()*10000);

  // 🔥 SAVE TO FIREBASE (NOW WILL WORK)
  db.ref("orders").push({
    orderId,
    table,
    items,
    total,
    status: "pending",
    time: new Date().toLocaleString(),
    date: new Date().toLocaleDateString()
  });

  alert("✅ Order Placed!\nOrder ID: " + orderId);

  let finalText = "Order ID: "+orderId+"%0A"
                + "Table: "+table+"%0A"
                + text
                + "Total: ₹"+total;

  window.open("https://wa.me/917330100133?text="+finalText);

  clearCart();
}

// 💳 UPI FIXED
function payUPI(){
  let total = 0;

  for(let key in cart){
    total += cart[key].price * cart[key].qty;
  }

  if(total === 0){
    alert("Add items first");
    return;
  }

  window.location.href =
    "upi://pay?pa=vickysiris2@ybl&pn=Dhawath&am="+total+"&cu=INR";
}

// 🧹 Clear
function clearCart(){
  for(let key in cart){
    cart[key].qty = 0;
    document.getElementById("qty-"+key).innerText = 0;
  }

  updateTotal();
  document.getElementById("orderList").innerHTML = "No items selected";
}

// 📊 Dashboard
function openDashboard(){
  window.open("admin.html", "_blank");
}
