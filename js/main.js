var DISABLE_ANIMATION = false;
// DISABLE_ANIMATION = true;

$(document).ready(function() {
  /** СЧЁТЧИКИ */
  // Создаём счётчики в нужных блоках
  var host1 = $('#trades-counter-value');
  var host2 = $('#members-counter-value');
  var c1 = new Counter({ hostElement: host1 });
  var c2 = new Counter({ hostElement: host2 });
  /* Далее идёт фукция, обновляющая данные счётчика.  В примере
     данные обновляются каждую секунду, получая произвольный прирост
     значения.
     Этот кусок кода нужно заменить на периодическое получение
     новых значений AJAX'ом.  После того, как данные полученны и
     обработаны, следует установить целевое значение счётчика с
     помощью метода счётчика .setTarget(ЗНАЧ, ИНТ).
     Первый аргумент (ЗНАЧ) -- это значение, которое должен принять
     счётчик.  Второе (ИНТ) -- это интервал времени в миллисекундах,
     через который счётчик должен принять устанавливаемое значение.
     Пример:
       c1.setTarget(999, 10000);
       Запустит анимацию счётчика так, что через 10 секунд он примет
       значение 999 и остановится.
  */
  var updateInterval = 1000;
  var min = 100;
  var max = 1000;
  setInterval(function() {
    /* Здесь, соответсвенно нужнно загружать данные с сервера AJAX'ом
       вместо генерации случайного прироста.
    */
    var delta1 = Math.floor(Math.random() * (max - min)) + min;
    var delta2 = Math.floor(Math.random() * (max - min)) + min;
    c1.setTarget(c1.value + delta1, updateInterval);
    c2.setTarget(c2.value + delta2, updateInterval);
  }, updateInterval);

  /** ИНФОГРАФИКА */
  var h = $('#planets');
  var pg = new PlanetaryIG({
    hostElement: h,
    planetIds: [
      { id: "p1" },
      { id: "p2" },
      { id: "p3" },
      { id: "p4" },
      { id: "p5" }
    ]
  });

  /* Этот список носит вспомогательный характер.  Используется для
     установки значений при обновлении демонстрационных данных.
     В рабочем варианте названия криптовалют будут получены при каждом
     обновлении значений. */
  var currencies = [
    'BTC/USD',
    'ETH/RUR',
    'LTC/BTC',
    'USD/EUR',
    'RUR/LTC'
  ];
  // Устанавливаем имена валют.  В примере они не будут меняться, в
  // реальных условиях возможно менять.
  for (var i = 0; i < currencies.length; i++) {
    pg.planets[i].setName(currencies[i]);
  }
  /** Далее идёт демонстрационное обновление значений.
      Каждые 10 секунд задаются нужные значения. В примере значения
      объём торгов распределяется произвольным образом.
   */
  var timeout = 10000;
  function feedVals () {
    var vals = [];
    var max = 0;
    // Генерируем произольные данные
    for (var i = 0; i < pg.planets.length; i++) {
      var randval = Math.floor(Math.random()*100);
      vals.push(randval);
      max = Math.max(max, randval);
    }
    // Нормализуем до общего объёма и устанавливаем коэффициент
    // масштабирования для каждой планеты.
    for (var i = 0; i < pg.planets.length; i++) {
      p = pg.planets[i];
      p.setScale(vals[i]/max, timeout);
    }
    /** В рабочем варианте не нужно генерировать данные, просто
        считать их AJAX'ом и установить нужные значения.
        Если нужно изменить название планеты применить метод
        .setName(ИМЯ).  Чтобы корректно отобразить объёмы торгов нужно
        использовать метод .setScale(ЗНАЧ, ИНТ). Показатели будут
        изменяться равномерно так, что через промежуток времени
        ИНТ (миллисекунды) счётчик будет отображать целевое
        значение ЗНАЧ.
          Примеры:
            pg.planets[0].setName('BTC').
            Установит имя первой планеты как "BTC".
            pg.planets[0].setScale(0.5, 1000)
            Запустит анимацию размера планеты и её подсказки так, что
            через секунду размер планеты будет равен половине
            максимального размера.
        (!!!) Примечание о том, как соотносятся размеры планет и о том,
          как правильно их устанавливать.
          В ситуации, когда все валюты занимают равные доли рынка, все
          планеты будут отоброжаться максимальным размером, их масштаб
          должен в данном случае быть равен 1 для каждой.
          В противном случае, когда доли валют разные, наибольший
          размер будет иметь планета с максимальной долей, остальные
          станут меньше.  Таким образом, наиболее торгуемая
          валюта-планета всегда имеет масштаб 1.  Остальные размеры
          нужно расчитать в соответсвии с их долями и общим кол-вом
          планет-валют.  Рассмотрим на примере 5 валют.
          Распределение рынка таково: 30% 10% 5% 42% 3%.
          В данном случае валюта #4 должна иметь масштаб 1, так как
          занимает большую часть рынка (42%).  Соответсвенно, остальные
          валюты будут иметь следующий масштаб:
          42           = 1     // p4.setScale(1,     updTime)
          30% -> 30/42 = 0.714 // p1.setScale(0.714, updTime)
          10% -> 10/42 = 0.238 // p2.setScale(0.238, updTime)
          5%  ->  5/42 = 0.119 // p3.setScale(0.119, updTime)
          3%  ->  3/42 = 0.071 // p5.setScale(0.071, updTime)
          Скрипт сам переведёт масштабы в проценты и отобразит данные.
     */
  }
  feedVals();
  setInterval(feedVals, timeout);

  const homescreen = $('#homescreen');
  const stats = $('#main-asteroid-wrap');
  const homescreenButton = $('#first-cta-button');

  let viewPortHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  let parallaxTrigger = homescreenButton.offset().top - 0.5 * viewPortHeight;
  let parallaxState = $(document).scrollTop() > parallaxTrigger;

  function parallaxDetection () {
    viewPortHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    parallaxTrigger = homescreenButton.offset().top - 0.5 * viewPortHeight;
    let scrollHeight = $(document).scrollTop();
    if (scrollHeight > parallaxTrigger && scrollHeight > 0) {
      if (!parallaxState) {
        parallaxState = true
        $(document.body).addClass('parallax')
      }
    } else {
      if (parallaxState) {
        parallaxState = false;
        $(document.body).removeClass('parallax')
      }
    }
  }

  parallaxDetection();

  $(document).scroll(parallaxDetection)
  $(document).resize(parallaxDetection)
})


