$(function() {
  $("#modal-open").click(function() {
    $("body").append('<div id=modal-bg></div>');

    modalResize();

    $("#modal-bg,#modal-main").fadeIn("slow");

    $("#modal-bg,#modal-main").click(function() {
      $("#modal-main,#modal-bg").fadeOut("slow",function() {
        $("modal-bg").remove();
      });
    });

    $(window).resize(modalResize);
    function modalResize() {
      var w = $(window).width();
      var h = $(window).heigth();

      var cw = $("#modal-main").outerWidth();
      var ch = $("#modal-main").outerHeight();

      $("#modal-main").css({
        "left": ((w-cw)/2) + "px",
        "top": ((h-ch)/2) + "px"
      });
    }  
  });
});
