function oneMonth(){
    var oneMonthTotalPrice = document.getElementById("oneMonthPrice").textContent;
    var promptOneMonth = document.getElementById("totalPrices");
    promptOneMonth.innerHTML = "$"+oneMonthTotalPrice;

    var textMonth = document.getElementById("1month").textContent;
    var totalMonth = document.getElementById("totalMonth");
    totalMonth.innerHTML = textMonth;

    var discount = document.getElementById("discount");
    discount.innerHTML = "$0";

    var total = document.getElementById("total");
    total.innerHTML = "$"+oneMonthTotalPrice;
}

function oneMonth2(){
    var oneMonthTotalPrice = document.getElementById("oneMonthPrice2").textContent;
    var originPrice = document.getElementById("originPrice").textContent;
    var promptOneMonth = document.getElementById("totalPrices");

    var originTotPrice = Number(originPrice) * 12;
    promptOneMonth.innerHTML = "$"+originTotPrice;
    
    var textMonth = document.getElementById("12months").textContent;
    var totalMonth = document.getElementById("totalMonth");
    totalMonth.innerHTML = textMonth;

    var total = document.getElementById("total");
    var discountTotal = Number(oneMonthTotalPrice) * 12;
    total.innerHTML = "$"+discountTotal;
    
    var discount = document.getElementById("discount");
    discount.innerHTML = "$"+(originTotPrice - discountTotal);
}

function oneMonth3(){
    var oneMonthTotalPrice = document.getElementById("oneMonthPrice3").textContent;
    var promptOneMonth = document.getElementById("totalPrices");
    
    var textMonth = document.getElementById("24months").textContent;
    var totalMonth = document.getElementById("totalMonth");
    totalMonth.innerHTML = textMonth;

    var originPrice = document.getElementById("originPrice").textContent;
    var originTotPrice = Number(originPrice) * 24;
    promptOneMonth.innerHTML = "$"+originTotPrice;

   var total = document.getElementById("total");
   var discountTotal = Number(oneMonthTotalPrice) * 24;
   total.innerHTML = "$"+discountTotal.toFixed(2);

   var discount = document.getElementById("discount");
   discount.innerHTML = "$"+(originTotPrice - discountTotal).toFixed(2);
}

function oneMonth4(){
    var oneMonthTotalPrice = document.getElementById("oneMonthPrice4").textContent;
    var promptOneMonth = document.getElementById("totalPrices");

    var textMonth = document.getElementById("36months").textContent;
    var totalMonth = document.getElementById("totalMonth");
    totalMonth.innerHTML = textMonth;

    var originPrice = document.getElementById("originPrice").textContent;
    var originTotPrice = Number(originPrice) * 36;
    promptOneMonth.innerHTML = "$"+originTotPrice;

    var total = document.getElementById("total");
    var discountTotal = Number(oneMonthTotalPrice) * 36;
    total.innerHTML = "$"+discountTotal.toFixed(2);
    
    var discount = document.getElementById("discount");
    discount.innerHTML = "$"+(originTotPrice - discountTotal).toFixed(2);
}