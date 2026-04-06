console.log("JS Loaded ✅");

let cart = {
  biryani:{name:"Chicken Biryani",price:180,qty:0},
  mutton:{name:"Mutton Biryani",price:250,qty:0},
  noodles:{name:"Noodles",price:120,qty:0},
  burger:{name:"Burger",price:100,qty:0},
  rice:{name:"Fried Rice",price:140,qty:0},
  shawarma:{name:"Shawarma",price:130,qty:0}
};

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAUV8uk7hdxJKh75SlHukoohTtQ1Wd_qLk",
  authDomain: "dhawath-restaurant.firebaseapp.com",
  databaseURL: "https://dhawath-restaurant-default-rtdb.firebaseio.com",
  projectId: "dhawath-restaurant"
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

// ➕➖ Change Quantity
function changeQty(item, change){
  if(!cart[item]) return;

  cart[item].qty += change;
  if(cart[item].qty < 0) cart[item].qty = 0;

  const el = document.getElementById("qty-"+item);
  if(el) el.innerText = cart[item].qty;

  updateTotal();
}

// 💰 Update Total + Order List
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
  document.getElementById("orderList").innerHTML =
    html || "No items selected";
}

// 📦 Place Order
function sendWhatsApp(){
  let table = document.getElementById("table").value;

  let total = 0;
  let text = "";

  for(let key in cart){
    if(cart[key].qty > 0){
      let itemTotal = cart[key].price * cart[key].qty;
      total += itemTotal;

      text += cart[key].name + " - ₹" + itemTotal + "%0A";
    }
  }

  if(!table || total === 0){
    alert("Enter table & select items");
    return;
  }

  // 🔥 Save to Firebase
  db.ref("orders").push({
    table: table,
    total: total,
    status: "pending",
    time: new Date().toLocaleString()
  });

  // 📱 WhatsApp Message (Styled)
  let finalText =
    "🍽️ Table " + table + " Order%0A%0A" +
    text + "%0A" +
    "Total: ₹" + total;

  window.open("https://wa.me/917330100133?text=" + finalText);

  alert("✅ Order Sent for Table " + table);

  clearCart();

}

// 💳 UPI Payment
function payUPI(){
  let total = 0;

  for(let key in cart){
    total += cart[key].price * cart[key].qty;
  }

  if(total === 0){
    alert("Add items first");
    return;
  }

  let upiUrl = "upi://pay?pa=vickysiris2@ybl&pn=DhawathRestaurant&am="+total+"&cu=INR";

  window.location.href = upiUrl;
}

// 🧹 Clear Cart
function clearCart(){
  for(let key in cart){
    cart[key].qty = 0;

    const el = document.getElementById("qty-"+key);
    if(el) el.innerText = 0;
  }

  updateTotal();
  document.getElementById("orderList").innerHTML = "No items selected";
}

// 📊 Open Dashboard
function openDashboard(){
  window.open("admin.html", "_blank");
}
