// 🔥 Firebase (ADD THIS FIRST)
const firebaseConfig = {
 apiKey: "AIzaSyAUV8uk7hdxJKh75SlHukoohTtQ1Wd_qLk",
 authDomain: "dhawath-restaurant.firebaseapp.com",
 databaseURL: "https://dhawath-restaurant-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🛒 CART
let cart = {
 biryani:{name:"Chicken Biryani",price:180,qty:0},
 mutton:{name:"Mutton Biryani",price:250,qty:0},
 noodles:{name:"Noodles",price:120,qty:0},
 burger:{name:"Burger",price:100,qty:0},
 rice:{name:"Fried Rice",price:140,qty:0},
 shawarma:{name:"Shawarma",price:130,qty:0}
};

// 🔔 TOAST SAFE
function showToast(msg){
 let t=document.getElementById("toast");
 if(!t) return; // prevent crash

 t.innerText=msg;
t.style.display="block";

 setTimeout(()=>t.style.display="none",2000);
}

// ➕ ADD ITEM
function addItem(item){
 cart[item].qty=1;
 updateControls(item);
 updateTotal();
 showToast("Added "+cart[item].name);
}

// ➖➕ CHANGE QTY
function changeQty(item,change){
 cart[item].qty+=change;

 if(cart[item].qty<=0){
 cart[item].qty=0;

 let el=document.getElementById("control-"+item);
 if(el){
 el.innerHTML =
 `<button class="add-btn" onclick="addItem('${item}')">ADD</button>`;
 }

 } else {
 updateControls(item);
 }

 updateTotal();
}

// 🔄 UPDATE CONTROL UI SAFE
function updateControls(item){
 let el=document.getElementById("control-"+item);
 if(!el) return;

 let q=cart[item].qty;

 el.innerHTML = `
 <div class="qty-control">
 <button onclick="changeQty('${item}',-1)">−</button>
 <span>${q}</span>
 <button onclick="changeQty('${item}',1)">+</button>
 </div>
 `;
}

// 💰 TOTAL SAFE
function updateTotal(){
 let total=0,count=0;

 for(let k in cart){
 total+=cart[k].price*cart[k].qty;
 count+=cart[k].qty;
 }

 let totalEl=document.getElementById("total");
 let countEl=document.getElementById("cartCount");
 let cartBar=document.getElementById("cartBar");

 if(totalEl) totalEl.innerText=total;
 if(countEl) countEl.innerText=count+" items";

 if(cartBar){
cartBar.style.display = count>0 ? "flex" : "none";
 }
}

// 📦 ORDER
function sendWhatsApp(){
 let table=document.getElementById("table").value;

 let total=0,text="";

 for(let k in cart){
 if(cart[k].qty>0){
 let itemTotal=cart[k].price*cart[k].qty;
 total+=itemTotal;
 text+=cart[k].name+" - ₹"+itemTotal+"%0A";
 }
 }

 if(!table || total===0){
 alert("Enter table & select items");
 return;
 }

 // SAVE FIREBASE
 db.ref("orders").push({
  table,
  items: cart,
  total,
  status: "pending",
  time: new Date().toLocaleString(),
  timestamp: Date.now()
});

 let msg =
 "🍽️ *Table "+table+" Order*%0A%0A"+
 text+
 "%0ATotal: ₹"+total;

window.open("https://wa.me/917330100133?text="+msg);
}
