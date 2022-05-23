function deleteEntry() {
  $(this).parent().remove();
  $.ajax({
    url: `http://localhost:8000/timeline/remove/${this.id}`,
    type: "get",
    success: (e) => {
      console.log(e);
    },
  });
}

function intoOrder() {
  var id = $(this).attr("id");
  $.ajax({
    url: `http://localhost:8000/order/${id}`,
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
