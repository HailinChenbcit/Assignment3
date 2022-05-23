function deleteEntry() {
  $(this).parent().remove();
  $.ajax({
    url: `https://infinite-ravine-07325.herokuapp.com/timeline/remove/${this.id}`,
    type: "get",
    success: (e) => {
      console.log(e);
    },
  });
}

function intoOrder() {
  var id = $(this).attr("id");
  $.ajax({
    url: `https://infinite-ravine-07325.herokuapp.com/order/${id}`,
    type: "get",
    success: (e) => {
      console.log(e);
    },
  });
}

$(document).ready(function () {
  $("body").on("click", ".DeleteButton", deleteEntry);
  $("body").on("click", ".orderButton", intoOrder);
});
