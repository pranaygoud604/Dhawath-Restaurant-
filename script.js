// 📦 PLACE ORDER (NO WHATSAPP)
function placeOrder(){

  let table = document.getElementById("table").value;

  let total = 0;
  let filteredItems = {};

  // 🔥 FILTER ITEMS
  for(let key in cart){

    let item = cart[key];

    if(item.qty > 0){

      total += item.price * item.qty;

      filteredItems[key] = {
        name: item.name,
        qty: item.qty,
        price: item.price
      };
    }
  }

  // ❌ VALIDATION
  if(!table || total === 0){
    alert("Enter table & select items");
    return;
  }

  // 🔥 SAVE TO FIREBASE
  db.ref("orders").push({
    table: table,
    items: filteredItems,
    total: total,
    status: "pending",
    time: new Date().toLocaleString(),
    timestamp: Date.now()
  });

  // ✅ SUCCESS MESSAGE
  showToast("✅ Order Placed!");

  // 🧹 CLEAR CART AFTER ORDER
  for(let key in cart){
    cart[key].qty = 0;

    let el = document.getElementById("control-"+key);
    if(el){
      el.innerHTML = `<button class="add-btn" onclick="addItem('${key}')">ADD</button>`;
    }
  }

  // 🔄 RESET UI
  updateTotal();
}
