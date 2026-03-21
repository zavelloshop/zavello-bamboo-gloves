// --- Global Mobile Menu Injector ---
document.head.insertAdjacentHTML('beforeend', `
<style>
.mobile-menu-btn { display: none; background: none; border: none; font-size: 28px; color: #fff; cursor: pointer; padding: 0; }
@media (max-width: 768px) {
    .mobile-menu-btn { display: block; }
    .nav-container { flex-wrap: nowrap !important; justify-content: space-between !important; padding: 15px 20px !important; position: relative !important; }
    .logo { position: absolute !important; left: 50% !important; transform: translateX(-50%) !important; }
    .nav-links { 
        display: none !important; position: absolute !important; top: 100% !important; right: 0; width: 100%; 
        background: #FFFFFF !important; flex-direction: column !important; align-items: center; 
        padding: 20px 0 !important; gap: 20px !important; z-index: 999; border-top: none !important; 
        box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
    }
    .nav-links a { color: #2C3527 !important; font-weight: 600 !important; font-size: 16px !important; }
    .nav-links.active { display: flex !important; }
}
</style>
`);

function toggleMobileMenu() {
    const nav = document.querySelector('.nav-links');
    if (nav) nav.classList.toggle('active');
}

let localCartState = JSON.parse(localStorage.getItem('zavelloCart')) || [];

function saveCart() {
    localStorage.setItem('zavelloCart', JSON.stringify(localCartState));
}

function pushToMockCart() {
    const activeOpt = document.querySelector('.upsell-option.active');
    if (!activeOpt) return;
    const packType = activeOpt.querySelector('.upsell-title').innerText;
    const rawPrice = activeOpt.querySelector('.upsell-price').innerText;
    const drops = activeOpt.querySelectorAll('select.size-select');
    let pickedSizes = [];
    drops.forEach(d => pickedSizes.push(d.value));

    const newItem = {
        title: "כפפות דחיסה Zavello",
        bundle: packType,
        priceStr: rawPrice,
        sizesArr: pickedSizes.join(' <br> '),
        imgURL: "videos/Gloves_imitating_bamboo_202603190057.jpeg"
    };

    localCartState.push(newItem);
    saveCart();
    renderCustomCart();
    const cartEl = document.getElementById('custom-cart') || document.getElementById('main-cart');
    if (cartEl) cartEl.showModal();
}

function renderCustomCart() {
    const box = document.getElementById('cart-items');
    const headBtn = document.getElementById('head-cart-btn');
    const totalHTML = document.getElementById('cart-total');
    
    if (!box || !totalHTML) return;

    box.innerHTML = '';
    let sum = 0;
    
    if (localCartState.length === 0) {
        box.innerHTML = '<p style="text-align:center; color:#888; margin-top:50px;">העגלה שלך ריקה</p>';
    } else {
        localCartState.forEach((item, i) => {
            const parsedNum = parseFloat(item.priceStr.replace(/[^\d.]/g, ''));
            sum += parsedNum;
            box.innerHTML += `
                <div style="display:flex; gap:20px; border-bottom:1px solid #F8F8F8; padding-bottom:20px;">
                    <img src="${item.imgURL}" style="width:90px; height:90px; border-radius:12px; object-fit:cover;">
                    <div style="flex:1;">
                        <div style="font-weight:700; font-size:16px; color:#000;">${item.title}</div>
                        <div style="color:#666; font-size:14px; margin-top:4px;">${item.bundle}</div>
                        <div style="color:#000000; font-size:13px; font-weight:600; margin-top:8px; line-height:1.6; padding:8px; background:#F2F7F2; border-radius:6px; border:1px solid rgba(106,142,97,0.2);">${item.sizesArr}</div>
                        <div style="margin-top:12px; display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-weight:700; font-size:16px; color:#000;">${item.priceStr}</span>
                            <span style="font-size:13px; color:#E02424; cursor:pointer; text-decoration:underline;" onclick="removeFromMock(${i})">הסר</span>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    totalHTML.innerText = "₪" + sum.toFixed(2);
    if (headBtn) {
        const badge = headBtn.querySelector('.cart-badge');
        if (badge) {
            badge.innerText = localCartState.length;
            badge.style.display = localCartState.length > 0 ? 'flex' : 'none';
        } else {
            headBtn.innerText = `עגלה (${localCartState.length})`;
        }
    }
}

function removeFromMock(i) {
    localCartState.splice(i, 1);
    saveCart();
    renderCustomCart();
}

document.addEventListener('DOMContentLoaded', renderCustomCart);
