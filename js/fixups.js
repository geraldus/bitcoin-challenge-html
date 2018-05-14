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
    /* modal positioning */
    requestAnimationFrame(function () {
      $('.modal').each(function () {
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        var val = se.scrollTop + h * 0.5;
        $(this).css('top', val.toString() + 'px');
      });
    });
    if (__modal) {
      $(__modal).fadeOut();
      __modal = null;
    }
  }
  scrollFix();
  $(document).scroll(scrollFix);
  /* Modal activation */
  var __modal = null;
  var buttons = $('.profile-button-wrap');
  buttons.each(function () {
    $(this).click(function(e) {
      __modal = $('#contacts-modal-wrap');
    /**
     * В этот момент нужно получить данные с сервера и заполнить
     * или заменить содержимое модального окна
     */
      $(__modal).fadeIn();
      e.preventDefault();
      return false;
    });
  });
});