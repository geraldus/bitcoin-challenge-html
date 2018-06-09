/** Управление отображением происходит в main.js.
 * Именно там нужно производить исправления
 */
function Counter(config) {
  this.defaults = {
    hostElement: null,  // элемент счётчика (который содержит текст)
    value: null, // начальное значение (по умолчанию считывает из элемента)
    startValue: null, // начальное значение
    startTime: null,  // начальное время (когда было установлено startValue)
    targetTime: null, // конечное значение
    targetValue: null,
    // время, к которому значение должно стать равным targetValue
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

  this.init = function() {
    if (this.hostElement) {
      this.requestId = null;
      this.setValue(this.readHostValue());
      this.requestId = requestAnimationFrame(this.render);
      setTimeout(this.updateValue, this.updateDelay);
    } else {
      console.error('Wrong host element', this.host);
    }
  }

  this.readHostValue = function() {
    if (this.hostElement) {
      var pval = parseInt(this.hostElement.text());
      if (isNaN(pval)) {
        console.warn('Can\'t parse initial value, defaulting to 0');
      }
    } else {
      console.warn('No host element, defaulting to 0');
      pval = 0;
    }
    return pval;
  }

  this.setValue = function (v) {
    this.value = v;
  }

  this.setTarget = function(value, time) {
    this.startValue = this.value || this.readHostValue();
    this.targetValue = value;
    this.startTime = (new Date()).getTime();
    this.targetTime = this.startTime + time;
  }

  this.updateValue = function () {
    var t0 = (new Date()).getTime();
    var tX = Math.min(t0, self.targetTime);
    var value = self.value;
    if (tX !== self.targetTime) {
      var timeDiff = self.targetTime - self.startTime;
      var valDiff = self.targetValue - self.startValue;
      if (timeDiff > 0) {
        var k = valDiff/timeDiff;
        value = self.targetValue - Math.round(k * (self.targetTime - tX));
      }
    }
    self.value = value;
    setTimeout(self.updateValue, self.updateDelay);
  }

  this.render = function() {
    self.hostElement.text(self.value);
    if (!window.DISABLE_ANIMATION) {
      self.requestId = requestAnimationFrame(self.render);
    }
  }

  this.init();
}
