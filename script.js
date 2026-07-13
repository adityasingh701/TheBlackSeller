// ================================
// REPUTATION GROWTH - SCRIPT.JS
// ================================

const orderForm = document.getElementById("orderForm");
const orderIdInput = document.getElementById("orderId");

const platformSelect = document.getElementById("platform");
const quantitySelect = document.getElementById("quantity");
const customBox = document.getElementById("customBox");
const customQuantity = document.getElementById("customQuantity");
const wishTypeSelect = document.getElementById("wishType");

const totalPriceElement = document.getElementById("totalPrice");

const couponInput = document.getElementById("couponCode");
const couponMessage = document.getElementById("couponMessage");
const applyCouponBtn = document.getElementById("applyCouponBtn");

let discountPercent = 0;
let couponApplied = false;


// ================================
// ORDER ID GENERATOR
// ================================

function generateOrderId(platform = "GEN") {

    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const random = Math.floor(100 + Math.random() * 900);

    return `RG-${platform}-${year}${month}${day}-${random}`;
}

orderIdInput.value = generateOrderId();


// ================================
// COUPON SYSTEM
// ================================

applyCouponBtn.addEventListener("click", () => {

    const code = couponInput.value
        .trim()
        .toUpperCase();

    if (couponApplied) {
        couponMessage.innerHTML =
            "✅ Coupon already applied";
        couponMessage.style.color = "green";
        return;
    }

    if (code === "SOMU10") {

        discountPercent = 10;
        couponApplied = true;

        couponMessage.innerHTML =
            "🎉 Code Applied Successfully! 10% Discount Activated";

        couponMessage.style.color = "green";

        calculatePrice();
    }

    else {

        couponMessage.innerHTML =
            "❌ Invalid Coupon Code";

        couponMessage.style.color = "red";
    }
});

// ================================
// CUSTOM QUANTITY TOGGLE
// ================================

quantitySelect.addEventListener("change", () => {

    if (quantitySelect.value === "custom") {
        customBox.classList.remove("hidden");
    } else {
        customBox.classList.add("hidden");
        customQuantity.value = "";
    }

    calculatePrice();
});


// ================================
// PLATFORM CHANGE
// ================================

platformSelect.addEventListener("change", () => {

    let code = "GEN";

    if (platformSelect.value === "map") code = "GM";
    if (platformSelect.value === "5best") code = "FB";
    if (platformSelect.value === "justdial") code = "JD";

    orderIdInput.value = generateOrderId(code);

    calculatePrice();
});


wishTypeSelect.addEventListener("change", calculatePrice);
customQuantity.addEventListener("input", calculatePrice);


// ================================
// PRICE CALCULATION
// ================================

function calculatePrice() {

    const platform = platformSelect.value;
    const wishType = wishTypeSelect.value;

    let quantity = 0;

    if (quantitySelect.value === "custom") {
        quantity = parseInt(customQuantity.value) || 0;
    } else {
        quantity = parseInt(quantitySelect.value) || 0;
    }

    let rate = 0;

    // Google Maps
    if (platform === "map") {
        if (wishType === "1") rate = 30;
        if (wishType === "2") rate = 35;
        
    }

    // 5BestInCity
    if (platform === "5best") {
        if (wishType === "1") rate = 20;
        if (wishType === "2") rate = 25;
        
    }

    // Justdial
    if (platform === "justdial") {
        if (wishType === "1") rate = 30;
        if (wishType === "2") rate = 35;
        
    }

    let total = quantity * rate;

    if (discountPercent > 0) {
        total = total - ((total * discountPercent) / 100);
    }

    totalPriceElement.innerText =
        `₹${Math.round(total)}`;
}

orderForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const whatsapp = document.getElementById("whatsapp").value.trim();
    const businessLink = document.getElementById("businessLink").value.trim();
    const language = document.getElementById("language").value;
    const notes = document.getElementById("notes").value.trim();

    let platform = "";

    if (platformSelect.value === "map") platform = "Google Maps";
    if (platformSelect.value === "5best") platform = "5BestInCity";
    if (platformSelect.value === "justdial") platform = "Justdial";

    const wishType =
    wishTypeSelect.value === "1"
        ? "1 Line"
        : "2 Line";
    

    const quantity =
        quantitySelect.value === "custom"
            ? customQuantity.value
            : quantitySelect.value;

    const totalPrice = totalPriceElement.innerText;

    if (name.length < 2) {
        alert("Please enter valid name.");
        return;
    }

    if (!/^[6-9]\d{9}$/.test(whatsapp)) {
        alert("Please enter valid WhatsApp number.");
        return;
    }

    const submitBtn =
        document.querySelector(".submit-btn");

    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting...";

   const formData = {
    orderId: orderIdInput.value,
    name: name,
    whatsapp: `+91${whatsapp}`,
    platform: platform,
    businessLink: businessLink,
    quantity: quantity,
    wishType: wishType,
    language: language,
    notes: notes,
    totalPrice: totalPrice,
    couponCode: couponApplied
        ? couponInput.value.toUpperCase()
        : "No Coupon",
    status: "New Lead",
    source: "Website"
};

    try {

        await fetch(
            "https://script.google.com/macros/s/AKfycbyX0YbTlVonuFSCDRvKbj5eZwUxbu2lU52pmMA_4PsFw0g_oOBhYyhYPZTOT5Ll3MLcFA/exec",
            {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            }
        );

        const now = new Date();

const orderDate = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
});

const orderTime = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
});

document.getElementById(
    "successDetails"
).innerHTML = `
    <b>🆔Order ID:</b> ${formData.orderId}<br>
    <b>📅Order Date:</b> ${orderDate}<br>
    <b>⏰Order Time:</b> ${orderTime}<br>
    <b>🌐Platform:</b> ${platform}<br>
    <b>📦Quantity:</b> ${quantity}<br>
    <b>💬Wish Type:</b> ${wishType}<br>
    <b>💰Total Amount:</b> ${totalPrice}<br><br>

    Our team will contact you on WhatsApp shortly.
`;

        document.getElementById(
            "successModal"
        ).style.display = "flex";

        orderForm.reset();

        totalPriceElement.innerText = "₹0";

        customBox.classList.add("hidden");

        discountPercent = 0;
        couponApplied = false;

        couponInput.value = "";
        couponMessage.innerHTML = "";

        orderIdInput.value =
            generateOrderId();

    }

    catch (error) {

        alert(
            "Something went wrong."
        );

        console.log(error);
    }

    finally {

        submitBtn.disabled = false;
        submitBtn.innerText = "Place Order";
    }
});


// ================================
// SUCCESS MODAL CLOSE
// ================================

function closeSuccessModal() {
    document.getElementById(
        "successModal"
    ).style.display = "none";
}

// FAQ Toggle

const faqItems =
document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const question =
    item.querySelector(".faq-question");

    question.addEventListener("click", () => {

        item.classList.toggle("active");

    });

});

function downloadReceipt(){

    const receipt =
        document.getElementById(
            "receiptCard"
        );

    const buttons =
        document.querySelector(
            ".popup-buttons"
        );

    buttons.style.display = "none";

    html2canvas(receipt,{
        scale:2,
        useCORS:true
    }).then(canvas=>{

        const link =
            document.createElement("a");

        link.download =
            `${orderIdInput.value}.png`;

        link.href =
            canvas.toDataURL(
                "image/png"
            );

        link.click();

        buttons.style.display =
            "flex";
    });
}

