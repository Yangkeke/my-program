function MusicVisualizer(obj) {
  this.source = null;
  this.count = 0;

  this.analyser = MusicVisualizer.ac.createAnalyser();
  this.size = obj.size;
  this.analyser.fftSize = this.size * 2;

  this.gainNode = MusicVisualizer.ac[MusicVisualizer.ac.createGain ? "createGain" : "createGainNode"]();
  this.gainNode.connect(MusicVisualizer.ac.destination);

  this.analyser.connect(this.gainNode);

  this.xhr = new XMLHttpRequest();

  this.visualizer = obj.visualizer;

  this.visualize();
}

MusicVisualizer.ac = new (window.AudioContext || window.webkitAudioContext)();

MusicVisualizer.prototype.load = function(url, fn) {
  this.xhr.abort();
  this.xhr.open("GET", url);
  this.xhr.responseType = "arraybuffer";
  var _this = this;
  this.xhr.onload = function() {
    fn(_this.xhr.response);
  }
  this.xhr.send();
}

MusicVisualizer.prototype.decode = function(arraybuffer, fn) {
  MusicVisualizer.ac.decodeAudioData(arraybuffer, function(buffer) {
    fn(buffer);
  }, function(err) {
    console.log(err);
  });
}

MusicVisualizer.prototype.play = function(url) {
  var n = ++this.count;
  var _this = this;

  this.source && this.stop();

  this.load(url, function(arraybuffer) {
    if (n !== _this.count) return;

    _this.decode(arraybuffer, function(buffer) {
      if (n !== _this.count) return;

      var bs = MusicVisualizer.ac.createBufferSource();
      bs.connect(_this.analyser);
      bs.buffer = buffer;
      bs[bs.start ? "start" : "noteOn"](0);

      _this.source = bs;
    })
  });
}

MusicVisualizer.prototype.stop = function() {
  this.source[this.source.stop ? "stop" : "noteOff"](0);
}

MusicVisualizer.prototype.changeVolume = function(percent) {
  this.gainNode.gain.value = percent * percent;
}

MusicVisualizer.prototype.visualize = function() {
  var arr = new Uint8Array(this.analyser.frequencyBinCount);

  requestAnimationFrame = window.requestAnimationFrame ||
                          window.webkitRequestAnimationFrame ||
                          window.mozRequestAnimationFrame;

  var _this = this;
  function v() {
    _this.analyser.getByteFrequencyData(arr);

    _this.visualizer(arr);
    requestAnimationFrame(v);
  }
  requestAnimationFrame(v);
}