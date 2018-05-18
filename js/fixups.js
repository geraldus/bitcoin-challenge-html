/* Фиксация главного экрана и его отключение при пролистывании */
$(document).ready(function () {
  var se = document.scrollingElement;
  var scrollRem = se.scrollTop;
  if (scrollRem >= 3000) {
    $(document.body).removeClass('homescreen-fix');
  }
  function scrollFix () {
    /* main screen fix */
    var s = se.scrollTop;
    if (s >= 3000 && scrollRem < 3000) {
      $(document.body).removeClass('homescreen-fix');
    } else if (s < 3000 && scrollRem >= 3000) {
      $(document.body).addClass('homescreen-fix');
    }
    scrollRem = s;
  }
  scrollFix();
  $(document).scroll(scrollFix);
});