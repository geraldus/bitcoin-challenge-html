var selector = 'form', form_ids = [], cur_id = '';
$(selector).each(function(){
	cur_id = $(this).attr('id');
	if($(this).attr('action') === undefined) {
	$(this).attr('action', '/').attr('method', 'post');
	if(form_ids.indexOf(cur_id) !== -1){
		cur_id = cur_id+form_ids.length;
		$(this).attr('id', cur_id);
	}
	form_ids.push(cur_id);
}});
$(function() {
  $(selector + '[action = "/"]').submit(function(e) {

    hide = 0; // 1 - прятать форму после отправки (0 - не прятать)
    hide_lbox = 0; // 1 - прятать лайтбокс вместе с уведомлением (0 - не прятать)
    delay = 3000; // задержка исчезновения сообщения в миллисекундах (0 - не скрывать)
    success_msg = "Ваше сообщение отправлено!"; // сообщение об успешной отправке
    error_msg = "Ошибка отправки! Попробуйте позже."; // сообщение об ошибке
    wait_msg = 'Идет отправка...'; // сообщение об отправке (оставить пустым чтоб не показывать)
    redirect = ''; // страница, на котороую перейти после отправки (оставить пустым чтоб никуда не переходить)
    action = $('[src $= mail\\.js]').attr('src').replace('js', 'php'); // путь к скрипту отправки почты

    cur_id = '#' + $(this).attr('id');
    if ($(cur_id).attr('data-hide') !== undefined) {
      hide = parseInt($(cur_id).attr('data-hide'));
    }
    
    if ($(cur_id).attr('data-delay') !== undefined) {
      delay = parseInt($(cur_id).attr('data-delay'));
    }
    
    cur_success = $(cur_id).siblings('.w-form-done').text().trim();
    if (cur_success === 'Thank you! Your submission has been received!') {
      $(cur_id).parent().find('.w-form-done div,.w-form-done p').text(success_msg);
    }
    
    cur_error = $(cur_id).siblings('.w-form-fail').text().trim();
    if (cur_error === 'Oops! Something went wrong while submitting the form') {
      $(cur_id).parent().find('.w-form-fail div,.w-form-fail p').text(error_msg);
    }
    
    cur_wait = $(cur_id).find('[data-wait]').attr('data-wait');
    if (cur_wait !== 'Please wait...') {
      wait_msg = cur_wait;
    }
    
    cur_redirect = $(cur_id).attr('data-redirect');
    if (cur_redirect !== undefined) {
      redirect = cur_redirect;
    }
    
    cur_action = $(cur_id).attr('action');
    if (cur_action !== '/') {
      action = cur_action;
    }
    
    submit_div = $(cur_id).find('[type = submit]');
    submit_txt = submit_div.attr('value');
    if (wait_msg !== '') {
      submit_div.attr('value', wait_msg);
    }
    
    if ($(cur_id).attr('data-send') !== undefined) {
      $('<input type="hidden" name="sendto" value="' + $(cur_id).attr('data-send') + '">').prependTo(cur_id);
    }
    
    if($(cur_id+' [name=Форма]').is('input')){
      $(cur_id).find('[name=Форма]').val($(cur_id).attr('data-name'));
    } else {
      $('<input type="hidden" data-name="Форма" name="Форма" value="' + $(cur_id).attr('data-name') + '">').prependTo(cur_id);
    }
    
    if($(cur_id+' [name=Запрос]').is('input')){
      $(cur_id).find('[name=Запрос]').val(document.location.search);
    } else {
      $('<input type="hidden" data-name="Запрос" name="Запрос" value="' + document.location.search + '">').prependTo(cur_id);
    }
    
    if($(cur_id+' [name=Заголовок]').is('input')){
      $(cur_id).find('[name=Заголовок]').val(document.title);
    } else {
      $('<input type="hidden" data-name="Заголовок" name="Заголовок" value="' + document.title + '">').prependTo(cur_id);
    }
    
    if($(cur_id+' [name=Страница]').is('input')){
      $(cur_id).find('[name=Страница]').val(document.location.origin + document.location.pathname);
    } else {
      $('<input type="hidden" data-name="Страница" name="Страница" value="' + document.location.origin + document.location.pathname + '">').prependTo(cur_id);
    }
    
    $('<input type="hidden" name="required_fields">').prependTo(cur_id);
    required_fields = '';
    
    required_fields = '';
    $(cur_id).find('[required=required]').each(function() {
      required_fields = required_fields + ',' + $(this).attr('name');
    });
    if(required_fields !== '') { $(cur_id).find('[name=required_fields]').val(required_fields); }
    
    e.preventDefault();
    var formData = new FormData($(cur_id)[0]);
    $.ajax({
        url: action,
        type: 'POST',
        processData: false,
        contentType: false,
        data: formData
      })
      .done(function(result) {
        if (result.trim() == 'success') {
          if (redirect !== '' && redirect !== '/-') {
            document.location.href = redirect;
            return (true);
          }
          $(cur_id).siblings('.w-form-fail').hide();
          replay_class = '.w-form-done';
          replay_msg = success_msg;
        } else {
          $(cur_id).siblings('.w-form-done').hide();
          if (result === 'ERROR_REQUIRED') {
            replay_msg = 'Не заполнено обязательное поле!'
          } else {
            replay_msg = error_msg;
            console.log(result);
          }
          replay_class = '.w-form-fail';
        }
        replay_div = $(cur_id).siblings(replay_class);
        replay_div.show();
        if (hide) {
          $(cur_id).hide();
        }
        submit_div.attr('value', submit_txt);
        if(delay !== 0) {
          if(hide_lbox === 1 && result == 'success') {
            $('.lbox').delay(delay).fadeOut();
          }
          replay_div.delay(delay).fadeOut();
          $(cur_id).delay(delay+1000).fadeIn();
        }
        if (result == 'success') {
          $(cur_id).trigger("reset");
          $(this).siblings('div[for]').text('');
          $(this).find('textarea').val('');
        }
      });
    if($(cur_id).attr('data-gform') !== undefined){
      $(cur_id).find('[data-gfield]').each(function(indx) {
        $(this).attr('name', $(this).attr('data-gfield'));
      });
      $.ajax({
        type: 'post',
        url: $(cur_id).attr('data-gform'),
        data: $(this).serialize(),
        dataType: "xml",
      });
      $(cur_id).find('[data-gfield]').each(function(indx) {
        $(this).attr('name', $(this).attr('data-name'));
      });
    }
  });
});
$('textarea').each(function(){if($(this).val().trim() === '') $(this).val('');});
$('textarea').focus(function(){if($(this).val().trim() === '') $(this).val('');});
$('.w-form [data-name]').each(function(indx) {
  $(this).attr('name', $(this).attr('data-name'));
});
$('label[for^=file]').each(function() {
  file_id = $(this).attr('for');
  $(this).after('<input name="file[]" type="file" id="' + file_id + '" multiple style="display:none;">');
  $('input#' + file_id).change(function() {
    $(this).siblings('div[for]').text('Файлы прикреплены.');
  });
});