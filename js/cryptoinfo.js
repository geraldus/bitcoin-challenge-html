/** Управление отображением происходит в main.js.
 * Именно там нужно производить исправления
 */
function PlanetaryIG (config) {
  this.defaults = {
    hostElement: null, // элемент, содержащий блоки с планетами
    planetIds: [],  // Id блоков-планет
    rotationTime: 60*1000, // полный оборот планеты за 60 секунд
    updateDelay: 17 // частота обновления данных, миллисекунд
  };
  // Properties initialization
  for (var k in this.defaults) {
    this[k] = this.defaults[k];
  }
  // Configuration read
  if (config && config.constructor === Object) {
    for (var k in config) {
      if (this.defaults.hasOwnProperty(k)) {
        this[k] = config[k];
      }
    }
  }
  var self = this;

  this.init = function () {
    this.planets = [];
    this.timeCheckPoint = (new Date()).getTime() + this.rotationTime;
    if (this.hostElement) {
      if (this.checkPlanetsConfig()) {
        this.hostElement.addClass('CryptoInfo');
        this.update();
        this.render();
      }
    }
  }

  this.checkPlanetsConfig = function () {
    if (this.planetIds.length === 0) {
      return false;
    }
    for (var i = 0; i < this.planetIds.length; i++) {
      var tpi = this.planetIds[i];
      var pe = $('#' + tpi.id);
      if (!pe.length) {
        return false;
      }
      this.planets.push(new CryptoInfo({
        planetElementId: tpi.id,
        hintElementId: tpi.id + '-hint',
        position: i
      }));
    }
    return true;
  }

  this.update = function () {
    var planetMaxSize = parseInt(self.__getPlanetCSSSize(), 10);
    var v = 360 / self.rotationTime;
    var t = (new Date()).getTime();
    var angularOffset = 360 / self.planets.length;
    if (t >= self.timeCheckPoint) {
      self.timeCheckPoint += self.rotationTime;
    }
    var tDiff = self.timeCheckPoint - t;
    var host = self.hostElement;
    var hostH = $(host).height();
    var hostW = $(host).width();
    var cX = hostW  / 2;
    var cY = hostH  / 2;
    var planetRadius = planetMaxSize / 2;
    var solarRadius = Math.min(hostW, hostH) / 2 - planetRadius;
    var hintH = self.planets[0].hint.host.height();
    for (var i=0; i < self.planets.length; i++) {
      var planet = self.planets[i];
      planet.angle = ((angularOffset * i + v * tDiff)*1000 % 360000)/1000;
      var x = cX + angleRadius2X(planet.angle, solarRadius);
      var y = cY - angleRadius2Y(planet.angle, solarRadius);
      planet.x = x;
      planet.y = y;
      planet.hint.x = x;
      planet.hint.y = y;
      var scaleTDiff = Math.max(0, planet.targetTimestamp - t);
      var scaleTimeout = planet.targetTimestamp - planet.startTimestamp;
      var scaleValDiff = planet.targetScale - planet.startScale;
      planet.scale = planet.targetScale - (scaleValDiff * scaleTDiff / scaleTimeout || 0);
    }
    if (!window.DISABLE_ANIMATION) {
      setTimeout(self.update, self.updateDelay);
    }
  }

  this.render = function () {
    var totalScale = 0;
    for (var i = 0; i < self.planets.length; i++) {
      totalScale += self.planets[i].scale;
    }
    var scaleFactor = totalScale / 100;
    for (var i = 0; i < self.planets.length; i++) {
      var planet = self.planets[i];
      var s = planet.scale;
      var transformHint, transformWrap;
      transformHint = 'translate(' + planet.hint.x + 'px, ' + planet.hint.y + 'px)';
      transformWrap = 'translate(' + planet.x + 'px, ' + planet.y + 'px)';
      planet.wrap.css('transform', transformWrap);
      var scale = 'translate(-50%, -50%) scale(' + s + ')';
      planet.planetHost.css('transform', scale);
      var percent = (s / scaleFactor);
      var percentT = percent.toLocaleString(
        ['ru-RU', 'en-US'],
        {
          maximumFractionDigits: 3,
          minimumFractionDigits: 3
        }
      );
      var hint = percentT + '%';
      planet.setHintValue(hint);
    }
    if (!window.DISABLE_ANIMATION) {
      requestAnimationFrame(self.render);
    }
    window.__PlanetaryIG_redraw = function () {
      self.update();
      requestAnimationFrame(self.render);
    }
  }

  this.__getPlanetCSSSize = function () {
    if (self.planets.length) {
      return self.planets[0].planetHost.css('width');
    } else {
      return 0;
    }
  }

  function angleRadius2X(a, r) {
    var rad = Math.PI / 180 * a;
    return Math.cos(rad) * r;
  }
  function angleRadius2Y(a, r) {
    var rad = Math.PI / 180 * a;
    return Math.sin(rad) * r;
  }

  this.init();
}

function CryptoInfo (config) {
  this.defaults = {
    planetElementId: null,
    hintElementId: null
  };
  // Properties initialization
  for (var k in this.defaults) {
    this[k] = this.defaults[k];
  }
  // Configuration read
  if (config && config.constructor === Object) {
    for (var k in config) {
      if (this.defaults.hasOwnProperty(k)) {
        this[k] = config[k];
      }
    }
  }

  var self = this;

  this.init = function () {
    this.scale = 1;
    this.angle = 0;
    var t = (new Date()).getTime();
    this.startTimestamp = t;
    this.targetTimestamp = t;
    this.startScale = 1;
    this.targetScale = 1;
    this.wrapElements();
    this.name = '';
  }

  this.wrapElements = function () {
    var pe = $('#' + this.planetElementId);
    var he = $('<div></div>')
      .attr('id', this.planetElementId + '-hint')
      .addClass('hint-wrap')
      .append(
        $('<div></div>')
          .addClass('hint-leg'))
      .append(
        $('<div></div>')
          .addClass('hint-plane')
        .append(
          $('<div></div>')
            .addClass('hint-value')))
      .insertAfter(pe);
    var we = $('<div class="wrap"></div>')
                .insertBefore(pe)
                .append(pe, he);
    this.planetHost = pe;
    this.hint = {
      x: null,
      y: null,
      host: he
    };
    this.wrap = we;
  }

  this.setName = function (text) {
    this.name = text;
  }

  this.setHintValue = function (text) {
    var ht = this.name + ': ' + text;
    $('.hint-value', this.hint.host).text(ht);
  }

  this.setScale = function (s, t) {
    var tnow = (new Date()).getTime();
    self.startScale = self.scale;
    self.startTimestamp = tnow;
    p.targetScale = s;
    p.targetTimestamp = tnow + t;
  }

  self.init();
}