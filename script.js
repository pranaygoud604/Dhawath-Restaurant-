// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAUV8uk7hdxJKh75SlHukoohTtQ1Wd_qLk",
  authDomain: "dhawath-restaurant.firebaseapp.com",
  databaseURL: "https://dhawath-restaurant-default-rtdb.firebaseio.com",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// CART
let cart = {
  biryani:{name:"Chicken Biryani",price:180,qty:0},
  mutton:{name:"Mutton Biryani",price:250,qty:0},
  noodles:{name:"Noodles",price:120,qty:0},
  burger:{name:"Burger",price:100,qty:0},
  rice:{name:"Fried Rice",price:140,qty:0},
  shawarma:{name:"Shawarma",price:130,qty:0}
};

// CHANGE QTY
function changeQty(item, change){
  cart[item].qty += change;
  if(cart[item].qty < 0) cart[item].qty = 0;

  document.getElementById("qty-"+item).innerText = cart[item].qty;
  updateTotal();
}

// TOTAL
function updateTotal(){
  let total = 0;

  for(let key in cart){
    total += cart[key].price * cart[key].qty;
  }

  document.getElementById("total").innerText = total;
}

// ORDER
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

  db.ref("orders").push({
    table,
    total,
    status: "pending",
    time: new Date().toLocaleString()
  });

  let msg =
    "🍽️ *Table " + table + " Order*%0A%0A" +
    text +
    "%0ATotal: ₹" + total;

  window.open("https://wa.me/917330100133?text=" + msg);
}
