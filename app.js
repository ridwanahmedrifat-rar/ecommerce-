const products = [
  {id:1,name:"Everyday Backpack",category:"Fashion",price:1450,emoji:"🎒"},
  {id:2,name:"Classic Sneakers",category:"Fashion",price:2200,emoji:"👟"},
  {id:3,name:"Wireless Headphones",category:"Tech",price:1850,emoji:"🎧"},
  {id:4,name:"Smart Watch",category:"Tech",price:2750,emoji:"⌚"},
  {id:5,name:"Desk Lamp",category:"Lifestyle",price:950,emoji:"💡"},
  {id:6,name:"Travel Bottle",category:"Lifestyle",price:450,emoji:"🧴"},
  {id:7,name:"Cotton T-shirt",category:"Fashion",price:650,emoji:"👕"},
  {id:8,name:"Mini Speaker",category:"Tech",price:1250,emoji:"🔊"}
];
let category="All", cart={};
const $=id=>document.getElementById(id);
const money=n=>"৳"+n.toLocaleString("en-BD");
function renderProducts(){
  const q=$("searchInput").value.trim().toLowerCase();
  const list=products.filter(p=>(category==="All"||p.category===category)&&p.name.toLowerCase().includes(q));
  $("resultCount").textContent=`${list.length} products`;
  $("productGrid").innerHTML=list.length?list.map(p=>`
    <article class="product-card">
      <div class="product-art" aria-hidden="true">${p.emoji}</div>
      <div class="product-info"><span class="product-category">${p.category.toUpperCase()}</span>
        <h3>${p.name}</h3><div class="product-foot"><span class="price">${money(p.price)}</span>
        <button class="add-button" data-add="${p.id}">Add to cart</button></div></div>
    </article>`).join(""):`<p class="empty">No products found. Try another search.</p>`;
}
function renderCart(){
  const entries=Object.entries(cart).filter(([,qty])=>qty>0);
  const count=entries.reduce((sum,[,qty])=>sum+qty,0);
  const total=entries.reduce((sum,[id,qty])=>sum+products.find(p=>p.id===Number(id)).price*qty,0);
  $("cartCount").textContent=count;$("cartTotal").textContent=money(total);
  $("cartItems").innerHTML=entries.length?entries.map(([id,qty])=>{
    const p=products.find(x=>x.id===Number(id));
    return `<div class="cart-row"><div class="cart-emoji">${p.emoji}</div><div class="cart-row-info"><strong>${p.name}</strong><small>${money(p.price)} each</small></div><div class="qty"><button data-qty="${id}" data-change="-1" aria-label="Decrease ${p.name}">−</button><span>${qty}</span><button data-qty="${id}" data-change="1" aria-label="Increase ${p.name}">+</button></div></div>`;
  }).join(""):`<p class="empty">Your cart is empty.<br>Add a product to get started.</p>`;
  $("checkoutButton").disabled=!entries.length;
}
function openCart(){ $("cartPanel").classList.add("open");$("overlay").classList.add("show");$("cartPanel").setAttribute("aria-hidden","false");}
function closeCart(){ $("cartPanel").classList.remove("open");$("overlay").classList.remove("show");$("cartPanel").setAttribute("aria-hidden","true");}
$("productGrid").addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(!b)return;const id=b.dataset.add;cart[id]=(cart[id]||0)+1;renderCart();b.textContent="Added ✓";setTimeout(()=>b.textContent="Add to cart",800);});
$("cartItems").addEventListener("click",e=>{const b=e.target.closest("[data-qty]");if(!b)return;const id=b.dataset.qty;cart[id]=(cart[id]||0)+Number(b.dataset.change);if(cart[id]<=0)delete cart[id];renderCart();});
$("filters").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;category=b.dataset.category;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts();});
$("searchInput").addEventListener("input",renderProducts);
$("searchForm").addEventListener("submit",e=>{e.preventDefault();renderProducts();});
$("cartToggle").addEventListener("click",openCart);$("closeCart").addEventListener("click",closeCart);$("overlay").addEventListener("click",closeCart);
$("checkoutButton").addEventListener("click",()=>{$("checkoutDialog").showModal();});
$("checkoutForm").addEventListener("submit",e=>{e.preventDefault();alert("Thanks! This is a demo checkout. No order or payment was sent.");cart={};renderCart();$("checkoutDialog").close();closeCart();e.target.reset();});
$("year").textContent=new Date().getFullYear();
renderProducts();renderCart();
