function updateCartTotal() {
  var carSubs = document.getElementsByClassName("cart-sub");
  var totals = 0;
  var taxes = 0;
  var subtotals = 0;

  for (var i = 0; i < carSubs.length; i++) {
    var cartSub = parseInt(carSubs[i].innerHTML);
    subtotals += cartSub;
  }
  taxes = 0.12 * subtotals
  totals = subtotals + taxes;
  $("#total").append("$" + totals);
  $("#tax").append("$" + taxes);
  $("#subtotal").append("$" + subtotals);
}

$(document).ready(() => {
  updateCartTotal();
});
