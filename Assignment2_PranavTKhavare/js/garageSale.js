/* Global variables */
var posterQuantity = 0;
var cookieQuantity = 0;
var paintingsQuantity = 0;
var chipsQuantity = 0;
var frameQuantity = 0;

const posterRate = 10;
const cookieRate = 15;
const paintingRate = 40;
const chipsRate = 15;
const frameRate = 25;
const minDonation = 10;
const donationFactor = 0.10;
var userName = "";
var userEmail = "";
const saleName = "Old Age Fundraiser Sale";
const orderNum = 1;


function addQuantity(clicked_id) {
    if (clicked_id != null) {
        if (clicked_id == "posterAddButton") {
            posterQuantity++;
            document.getElementById("posterQ").value = parseInt(posterQuantity);
        }
        else if (clicked_id == "cookieAddButton") {
            cookieQuantity++;
            document.getElementById("cookieQ").value = parseInt(cookieQuantity);
        }
        else if (clicked_id == "paintingsAddButton") {
            paintingsQuantity++;
            document.getElementById("paintingQ").value = parseInt(paintingsQuantity);
        }
        else if (clicked_id == "chipsAddButton") {
            chipsQuantity++;
            document.getElementById("chipsQ").value = parseInt(chipsQuantity);
        }
        else if (clicked_id == "frameAddButton") {
            frameQuantity++;
            document.getElementById("framesQ").value = parseInt(frameQuantity);
        }
    }
}

function removeQuantity(clicked_id) {
    if (clicked_id != null) {
        if (clicked_id == "posterRemoveButton") {
            if (posterQuantity > 0) {
                posterQuantity--;
            } else {
                posterQuantity = 0;
            }
            document.getElementById("posterQ").value = parseInt(posterQuantity);
        }
        else if (clicked_id == "cookieRemoveButton") {
            if (cookieQuantity > 0) {
                cookieQuantity--;
            } else {
                cookieQuantity = 0;
            }
            document.getElementById("cookieQ").value = parseInt(cookieQuantity);
        }
        else if (clicked_id == "paintingsRemoveButton") {
            if (paintingsQuantity > 0) {
                paintingsQuantity--;
            } else {
                paintingsQuantity = 0;
            }
            document.getElementById("paintingQ").value = parseInt(paintingsQuantity);
        }
        else if (clicked_id == "chipsRemoveButton") {
            if (chipsQuantity > 0) {
                chipsQuantity--;
            }
            else {
                chipsQuantity = 0;
            }
            document.getElementById("chipsQ").value = parseInt(chipsQuantity);
        }
        else if (clicked_id == "frameRemoveButton") {
            if (frameQuantity > 0) {
                frameQuantity--;
            } else {
                frameQuantity = 0;
            }
            document.getElementById("framesQ").value = parseInt(frameQuantity);
        }
    }
}

function formSubmit() {
    var errorPresent = false;
    var name = document.getElementById("name");
    var email = document.getElementById("email");
    var ccNum = document.getElementById("ccNum");
    var ccMnth = document.getElementById("ccMonth");
    var ccYear = document.getElementById("ccYear");
    var posterQ = document.getElementById("posterQ");
    var cookieQ = document.getElementById("cookieQ");
    var paintingQ = document.getElementById("paintingQ");
    var chipsQ = document.getElementById("chipsQ");
    var framesQ = document.getElementById("framesQ");

    document.getElementById("nameError").innerHTML = "";
    document.getElementById("emailError").innerHTML = "";
    document.getElementById("ccNumError").innerHTML = "";
    document.getElementById("ccMonthError").innerHTML = "";
    document.getElementById("ccYearError").innerHTML = "";
    document.getElementById("quantityError").innerHTML = "";
    document.getElementById("posterError").innerHTML = "";
    document.getElementById("cookieError").innerHTML = "";
    document.getElementById("paintingError").innerHTML = "";
    document.getElementById("chipsError").innerHTML = "";
    document.getElementById("framesError").innerHTML = "";

    if (isStringValueEmpty(name.value)) {
        document.getElementById("nameError").innerHTML = "Name is Mandatory";
        errorPresent = true;
    }
    if (isStringValueEmpty(email.value)) {
        document.getElementById("emailError").innerHTML = "Email is Mandatory";
        errorPresent = true;
    }
    if (isStringValueEmpty(ccNum.value)) {
        document.getElementById("ccNumError").innerHTML = "Credit Card Number is Mandatory";
        errorPresent = true;
    } else {
        var ccNumRegex = /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/;
        var valid = ccNumRegex.test(ccNum.value);
        if (valid === false) {
            document.getElementById("ccNumError").innerHTML = "Credit Card Number should be in xxxx-xxxx-xxxx-xxxx format e.g 1111-1111-1111-1111";
            errorPresent = true;
        }
    }
    if (isStringValueEmpty(ccMnth.value)) {
        document.getElementById("ccMonthError").innerHTML = "Credit Card Month is Mandatory";
        errorPresent = true;
    } else {
        var ccMonthRegex = /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)$/;
        var valid = ccMonthRegex.test(ccMnth.value);
        if (valid === false) {
            document.getElementById("ccMonthError").innerHTML = "Credit Card Month should be in MMM format e.g NOV";
            errorPresent = true;
        }

    }
    if (isStringValueEmpty(ccYear.value)) {
        document.getElementById("ccYearError").innerHTML = "Credit Card Year is Mandatory";
        errorPresent = true;
    } else {
        var ccYearRegex = /^(20)[2-9]{1}[2-9]{1}$/;
        var valid = ccYearRegex.test(ccYear.value);
        if (valid === false) {
            document.getElementById("ccYearError").innerHTML = "Credit Card Year should be in yyyy format e.g 2022";
            errorPresent = true;
        }
    }
    if (checkIntValue(posterQ) && checkIntValue(cookieQ) &&
        checkIntValue(paintingQ) && checkIntValue(chipsQ) && checkIntValue(framesQ)) {
        document.getElementById("quantityError").innerHTML = "Atleast one item should be selected";
        errorPresent = true;
    } else {
        checkQuantityAsNumber(posterQ, cookieQ, paintingQ, chipsQ, framesQ);
    }
    if (errorPresent === true) {
        return false;
    } else {
        var donationAmt = calculateDonation();
        var orderQuantities = calcItems();
        var orderTotal = calcOrderTotal();
        var orderDetails = `Name: ${saleName} <br>
        Order Number: ${orderNum} <br>
        Order Details: <br>
        ${orderQuantities} <br>
        Order Total: $${orderTotal} <br>
        Congrats You donated : $${donationAmt} to the cause!<br>
        `
        generateReceipt(orderDetails);
        return true;
    }
}

function calcItems() {
    posterQuantity = parseInt(document.getElementById("posterQ").value);
    cookieQuantity = parseInt(document.getElementById("cookieQ").value);
    paintingsQuantity = parseInt(document.getElementById("paintingQ").value);
    chipsQuantity = parseInt(document.getElementById("chipsQ").value);
    frameQuantity = parseInt(document.getElementById("framesQ").value);

    let orderQuantities = "";
    if (posterQuantity > 0) {
        orderQuantities = `Posters x ${posterQuantity} @${posterRate}$CAD<br>`;
    }
    if (cookieQuantity > 0) {
        orderQuantities = orderQuantities + `Cookie Box x ${cookieQuantity} @${cookieRate}$CAD<br>`;
    }
    if (paintingsQuantity > 0) {
        orderQuantities = orderQuantities + `Paintings x ${paintingsQuantity} @${paintingRate}$CAD<br>`;
    }
    if (chipsQuantity > 0) {
        orderQuantities = orderQuantities + `Homemade Chips x ${chipsQuantity} @${chipsRate}$CAD<br>`;
    }
    if (frameQuantity > 0) {
        orderQuantities = orderQuantities + `Photo Frame x ${frameQuantity} @${frameRate}$CAD<br>`;
    }
    return orderQuantities;
}

function generateReceipt(orderDetails) {
    var userName = document.getElementById("name").value;
    var userEmail = document.getElementById("email").value;
    var creditCardNum = document.getElementById("ccNum").value;
    var hiddenCreditNum = creditCardNum.replace(creditCardNum.substring(0,14),"****-****-****");

    checkoutWindow = window.open("", "", 'width=400,height=400');
    checkoutWindow.document.write(
    `*******Print Receipt*******<br>
    <div class="orderDetails">
    <p>
    ${orderDetails}<br>
    Name:${userName}<br>
    Email:${userEmail}<br>
    Credit Card Charged:${hiddenCreditNum}<br>
    <br>
    *******End Of Receipt*******<br>
    </p>
    </div>
    `);

}

function calculateDonation() {
    posterQuantity = parseInt(document.getElementById("posterQ").value);
    cookieQuantity = parseInt(document.getElementById("cookieQ").value);
    paintingsQuantity = parseInt(document.getElementById("paintingQ").value);
    chipsQuantity = parseInt(document.getElementById("chipsQ").value);
    frameQuantity = parseInt(document.getElementById("framesQ").value);

    var  calculatedAmt = 0;
    var orderTotal = calcOrderTotal();

    if (orderTotal > minDonation) {
        calculatedAmt = (orderTotal * donationFactor);
    } 
    if(calculatedAmt > minDonation){
        return calculatedAmt;
    }else{
        return minDonation;
    }
}

function calcOrderTotal() {
    var orderTotal = 0;
    if (posterQuantity > 0) {
        orderTotal = orderTotal + (posterQuantity * posterRate);
    }
    if (cookieQuantity > 0) {
        orderTotal = orderTotal + (cookieQuantity * cookieRate);
    }
    if (paintingsQuantity > 0) {
        orderTotal = orderTotal + (paintingsQuantity * paintingRate);
    }
    if (chipsQuantity > 0) {
        orderTotal = orderTotal + (chipsQuantity * chipsRate);
    }
    if (frameQuantity > 0) {
        orderTotal = orderTotal + (frameQuantity * frameRate);
    }
    return orderTotal;
}


function checkQuantityAsNumber(posterQ, cookieQ, paintingQ, chipsQ, framesQ) {
    if (!checkIfInt(posterQ.value)) {
        document.getElementById("posterError").innerHTML = "Quantity should be a whole Number";
    }
    if (!checkIfInt(cookieQ.value)) {
        document.getElementById("cookieError").innerHTML = "Quantity should be a whole Number";
    }
    if (!checkIfInt(paintingQ.value)) {
        document.getElementById("paintingError").innerHTML = "Quantity should be a whole Number";
    }
    if (!checkIfInt(chipsQ.value)) {
        document.getElementById("chipsError").innerHTML = "Quantity should be a whole Number";
    }
    if (!checkIfInt(framesQ.value)) {
        document.getElementById("framesError").innerHTML = "Quantity should be a whole Number";
    }
}


function checkIfInt(value) {
    var numRegex = /^\d+$/;
    var valid = numRegex.test(value);
    if (valid === false) {
        return false;
    } else {
        return true;
    }
}


function checkIntValue(value) {
    if (value.value <= 0 || value.value == null ||
        value.value == undefined || value.value === '' || value.value.trim() === '') {
        return true;
    } else {
        return false;
    }
}

function isStringValueEmpty(value) {
    if (value == null || value == undefined ||
        value === '' || value.trim() === '') {
        return true;
    }
    else {
        return false;
    }
}

