/* Фиксация главного экрана и его отключение при пролистывании */
$(document).ready(function () {
  var se = document.scrollingElement;
  function getTriggerOffset () {
    var fixTrigger = $('.section-2 .div-block-65');
    return fixTrigger.offset().top + 350;
  }
  var scrollRem = se.scrollTop;
  if (scrollRem >= getTriggerOffset()) {
    $(document.body).removeClass('homescreen-fix');
  }
  function scrollFix () {
    /* main screen fix */
    var s = se.scrollTop;
    var t = getTriggerOffset();
    // 350px - это отступ до зримого края астероида от начала изображения
    if (s >= t && scrollRem < t) {
      $(document.body).removeClass('homescreen-fix');
    } else if (s < t && scrollRem >= t) {
      $(document.body).addClass('homescreen-fix');
    }
    scrollRem = s;
  }
  scrollFix();
  $(document).scroll(scrollFix);
});