<script>
const firebaseConfig = {
  apiKey: "AIzaSyAUV8uk7hdxJKh75SlHukoohTtQ1Wd_qLk",
  authDomain: "dhawath-restaurant.firebaseapp.com",
  databaseURL: "https://dhawath-restaurant-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

db.ref("orders").on("value", snapshot => {

  let data = snapshot.val();
  let html = "";

  if(!data){
    document.getElementById("orders").innerHTML = "No orders";
    return;
  }

  // 🔥 Convert to array + sort latest first
  let orders = Object.entries(data).sort((a,b)=>{
    return (b[1].timestamp || 0) - (a[1].timestamp || 0);
  });

  orders.forEach(([id, order]) => {

    let statusClass = "pending";
    if(order.status==="cooking") statusClass="cooking";
    if(order.status==="done") statusClass="done";

    // 🔥 ITEMS DISPLAY
    let itemsHTML = "";
    if(order.items){
      for(let key in order.items){
        let item = order.items[key];
        if(item.qty > 0){
          itemsHTML += `<div class="item">${item.name} x ${item.qty}</div>`;
        }
      }
    }

    html += `
    <div class="card">
      <div class="table">Table ${order.table}</div>

      <div>${order.time || ""}</div>

      ${itemsHTML}

      <div class="total">₹${order.total}</div>

      <div class="status ${statusClass}">
        ${order.status}
      </div>

      <div class="buttons">
        <button class="accept" onclick="updateStatus('${id}','cooking')">Cooking</button>
        <button class="doneBtn" onclick="updateStatus('${id}','done')">Done</button>
        <button class="delete" onclick="deleteOrder('${id}')">Delete</button>
      </div>
    </div>`;
  });

  document.getElementById("orders").innerHTML = html;
});

// UPDATE STATUS
function updateStatus(id, status){
  db.ref("orders/"+id).update({ status });
}

// DELETE
function deleteOrder(id){
  db.ref("orders/"+id).remove();
}
</script>
