/* Global variables */
let codCopies = 0;
let pubgCopies = 0;
let acCopies = 0;
let nosCopies = 0;
let trCopies = 0;
let userName = "";
let orderNumber = 1;
let orderTotal = 0;
let totalAmount = 0;
let orderQuantities = "";
let orderDetails = "";

/*Constants */
const companyName = "EPIC GAMES";
const gstString = "GST@";
const gstConst = 0.13;
const gstValue = "13%";
const codRate = 20;
const pubgRate = 15;
const acRate = 35;
const nosRate = 25;
const trRate = 20;

/*Method to add Item To an order and Update Order Details*/
function addToOrder(clicked_id) {
  let numOfCopies = parseInt(prompt("How many copies do you want to buy?"));
  if (numOfCopies == null || numOfCopies == undefined || numOfCopies <= 0 || (Number.isNaN(numOfCopies))) {
    alert("Please enter a valid Number");
  } else if (clicked_id != null) {
    if (clicked_id == "CODButton") {
      codCopies = numOfCopies;
    }
    else if (clicked_id == "PUBGButton") {
      pubgCopies = numOfCopies;
    }
    else if (clicked_id == "ACButton") {
      acCopies = numOfCopies;
    }
    else if (clicked_id == "NOSButton") {
      nosCopies = numOfCopies;
    }
    else if (clicked_id == "TRButton") {
      trCopies = numOfCopies;
    }
  }

  orderQuantities = calcItems();
  orderTotal = calcOrderTotal();
  totalAmount = calcTotalAmt(orderTotal);

  orderDetails = `KIOSK: ${companyName} <br>
                   Order Number: ${orderNumber} <br>
                   Order Details: <br>
                   ${orderQuantities} <br>
                   Order Total: $${orderTotal} <br>
                   Tax : ${gstString}: ${gstValue} <br>
                   Total Amount: $${totalAmount} 
`
  document.getElementById("orderInfo").innerHTML = orderDetails;
}

/* Function to calculate the Order Details section*/
function calcItems() {

  let orderQuantities = "";
  if (codCopies > 0) {
    orderQuantities = `COD x ${codCopies} @${codRate}$CAD<br>`;
  }
  if (pubgCopies > 0) {
    orderQuantities = orderQuantities + `PUBG x ${pubgCopies} @${pubgRate}$CAD<br>`;
  }
  if (acCopies > 0) {
    orderQuantities = orderQuantities + `AC x ${acCopies} @${acRate}$CAD<br>`;
  }
  if (nosCopies > 0) {
    orderQuantities = orderQuantities + `NOS x ${nosCopies} @${nosRate}$CAD<br>`;
  }
  if (trCopies > 0) {
    orderQuantities = orderQuantities + `TR x ${trCopies} @${trRate}$CAD<br>`;
  }
  return orderQuantities;
}

/*Funtion to calculate order Total without the Taxes */
function calcOrderTotal() {
  let orderTotal = 0;
  if (codCopies > 0) {
    orderTotal = orderTotal + (codCopies * codRate);
  }
  if (pubgCopies > 0) {
    orderTotal = orderTotal + (pubgCopies * pubgRate);
  }
  if (acCopies > 0) {
    orderTotal = orderTotal + (acCopies * acRate);
  }
  if (nosCopies > 0) {
    orderTotal = orderTotal + (nosCopies * nosRate);
  }
  if (trCopies > 0) {
    orderTotal = orderTotal + (trCopies * trRate);
  }
  return orderTotal;
}

/* Function to calculate Total Amount with Taxes */
function calcTotalAmt(orderTotal) {
  let totalAmount = 0;
  let ot = parseFloat(orderTotal);
  let gst = parseFloat(gstConst);
  totalAmount = ot + (ot * gst);
  return totalAmount;
}

/*Function to Checkout and Print the Receipt
Performs Validations for username and item quantity */
function checkout() {
  userName = prompt("Please Enter Your Name to Place the Order");
  userName = userName.trim();
  let nameRegex = /^[a-zA-Z\s]+$/;
  let valid = nameRegex.test(userName);
  if (userName == null || userName == undefined || userName.length <= 0) {
    alert("User Name is mandatory for checkout")
  } else if (valid === false) {
    alert("Name can only contain alphabets and space.")
  } else if (!isItemSelected()) {
    alert("No ITEM selected.")
  }
  else {
    checkoutWindow = window.open("", "", 'width=400,height=400');
    checkoutWindow.document.write(`*******Print Receipt*******<br><div class="orderDetails">
    <p>${orderDetails}<br>Name:${userName}<br>*******End Of Receipt*******<br></p></div>`);
  }
}

/*Function to check if any items are selected. */
function isItemSelected() {
  let isItemSelected = false;
  if (codCopies > 0 || pubgCopies > 0 || acCopies > 0 || nosCopies > 0 || trCopies > 0) {
    isItemSelected = true;
  }
  return isItemSelected;
}

/*Function resets the Self-Order Kiosk */
function resetKiosk(clicked_id) {
  codCopies = 0;
  pubgCopies = 0;
  acCopies = 0;
  nosCopies = 0;
  trCopies = 0;
  userName = "";
  orderNumber = 1;
  orderTotal = 0;
  totalAmount = 0;
  orderQuantities = "";
  location.reload();
}