// 🔥 SAFE FIREBASE INIT
let db = null;

try {
  const firebaseConfig = {
    apiKey: "AIzaSyAUV8uk7hdxJKh75SlHukoohTtQ1Wd_qLk",
    authDomain: "dhawath-restaurant.firebaseapp.com",
    databaseURL: "https://dhawath-restaurant-default-rtdb.firebaseio.com"
  };

  firebase.initializeApp(firebaseConfig);
  db = firebase.database();

} catch (e) {
  console.log("Firebase error:", e);
}

// 🛒 CART
let cart = {
  biryani:{name:"Chicken Biryani",price:180,qty:0},
  mutton:{name:"Mutton Biryani",price:250,qty:0},
  noodles:{name:"Noodles",price:120,qty:0},
  burger:{name:"Burger",price:100,qty:0},
  rice:{name:"Fried Rice",price:140,qty:0},
  shawarma:{name:"Shawarma",price:130,qty:0}
};

function showToast(msg){
  let t=document.getElementById("toast");
  if(!t) return;
  t.innerText=msg;
  t.style.display="block";
  setTimeout(()=>t.style.display="none",2000);
}

function addItem(item){
  cart[item].qty=1;
  updateControls(item);
  updateTotal();
  showToast("Added "+cart[item].name);
}

function changeQty(item,change){
  cart[item].qty+=change;

  if(cart[item].qty<=0){
    cart[item].qty=0;
    document.getElementById("control-"+item).innerHTML =
      `<button class="add-btn" onclick="addItem('${item}')">ADD</button>`;
  } else {
    updateControls(item);
  }

  updateTotal();
}

function updateControls(item){
  let q=cart[item].qty;

  document.getElementById("control-"+item).innerHTML=`
    <div class="qty-control">
      <button onclick="changeQty('${item}',-1)">−</button>
      <span>${q}</span>
      <button onclick="changeQty('${item}',1)">+</button>
    </div>`;
}

function updateTotal(){
  let total=0,count=0;

  for(let k in cart){
    total+=cart[k].price*cart[k].qty;
    count+=cart[k].qty;
  }

  document.getElementById("total").innerText=total;
  document.getElementById("cartCount").innerText=count+" items";

  document.getElementById("cartBar").style.display =
    count>0 ? "flex" : "none";
}

// 📦 PLACE ORDER
function placeOrder(){

  let table=document.getElementById("table").value;

  let total=0;
  let filteredItems={};

  for(let key in cart){
    let item=cart[key];

    if(item.qty>0){
      total+=item.price*item.qty;

      filteredItems[key]={
        name:item.name,
        qty:item.qty,
        price:item.price
      };
    }
  }

  if(!table || total===0){
    alert("Enter table & select items");
    return;
  }

  if(db){
    db.ref("orders").push({
  table,
  items: filteredItems,
  total,
  status: "pending",
  payment: "unpaid",   // 👈 ADD THIS
  time: new Date().toLocaleString(),
  timestamp: Date.now()
    });
  }

  showToast("Order Placed!");

  for(let key in cart){
    cart[key].qty=0;
    document.getElementById("control-"+key).innerHTML =
      `<button class="add-btn" onclick="addItem('${key}')">ADD</button>`;
  }

  updateTotal();
}
