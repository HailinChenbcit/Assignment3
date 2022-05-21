function updateCartTotal() {
  var carSubs = document.getElementsByClassName("cart-sub");
  var totals = 0;
  var taxes = 0;
  var subtotals = 0;

  for (var i = 0; i < carSubs.length; i++) {
    var cartSub = parseInt(carSubs[i].innerHTML);
    subtotals += cartSub;
  }
  taxes = (0.12 * subtotals).toFixed(2);
  totals = subtotals + taxes;
  $("#total").append("$" + totals);
  $("#tax").append("$" + taxes);
  $("#subtotal").append("$" + subtotals);
}

async function deleteItem() {
  var itemID = $(this).attr("id");
  $(this).parent().parent().remove();
  await $.ajax({
    url: `http://localhost:8000/shoppingcart/remove/${itemID}`,
    type: "delete",
    success: (e) => {
      console.log(e);
    },
  });
}

$(document).ready(() => {
  updateCartTotal();
  $(document).on("click", ".delete-single", deleteItem);
});
