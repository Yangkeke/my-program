var lis = $("#list li");

for (var i = 0; i < lis.length; i++) {
  lis[i].onclick = function() {
    for (var j = 0; j < lis.length; j++) {
      lis[j].className = "";
    }
    this.className = 'selected';
    load("/media/" + this.title);
  }
}

var xhr = new XMLHttpRequest();
/* 开始创建 获取音频数据 */
var ac = new (Window.AudioContext || window.webkitAudioContext)();
/* 创建gainNode对象控制音量大小 */
var gainNode = ac[ac.createGain ? "createGain" : "createGainNode"]();
gainNode.connect(ac.destination);

var analyser = ac.createAnalyser();
analyser.fftSize = 512;
analyser.connect(gainNode);

var source = null;
var count = 0;
// source count两变量 都为解决切换播放时的bug
function load(url) {
  var n = ++count;
  /* 每次读取前先判断是否在播放，如有则停止 */
  source && source[source.stop ? "stop" : "noteOff"]();

  xhr.abort();  // 停止请求
  xhr.open("GET", url);
  // 服务端返回的音频数据会以二进制数据形式返回
  xhr.responseType = "arraybuffer";
  xhr.onload = function() {
    if (n != count) return;
    // console.log(xhr.response);
    ac.decodeAudioData(xhr.response, function(buffer) {
      if (n != count) return;

      var bufferSource = ac.createBufferSource();

      bufferSource.buffer = buffer;
      bufferSource.connect(analyser);
      // bufferSource.connect(gainNode);
      // bufferSource.connect(ac.destination);
      bufferSource[bufferSource.start ? "start" : "noteOn"](0);
      source = bufferSource;
    }, function(err) {
      console.log(err);
    });
  }
  xhr.send();
}

/**
 * [$ query选择器]
 */
function $(s) {
  return document.querySelectorAll(s);
}

function visualizer() {
  var arr = new Uint8Array(analyser.frequencyBinCount)
}

/**
 * [changeVolume 改变音量]
 * 通过 range 的value值来改变音量大小
 */
function changeVolume(percent) {
  gainNode.gain.value = percent;
}

$("#volume")[0].onchange = function() {
  changeVolume(this.value / this.max);
}

$("#volume")[0].onchange();