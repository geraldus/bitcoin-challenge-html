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
    var fixTrigger = $('.section-2 .div-block-65');
    var triggerOffset = fixTrigger.offset().top + 350;
    // 350px - это отступ до зримого края астероида от начала изображения
    if (s >= triggerOffset && scrollRem < triggerOffset) {
      $(document.body).removeClass('homescreen-fix');
    } else if (s < triggerOffset && scrollRem >= triggerOffset) {
      $(document.body).addClass('homescreen-fix');
    }
    scrollRem = s;
  }
  scrollFix();
  $(document).scroll(scrollFix);
});