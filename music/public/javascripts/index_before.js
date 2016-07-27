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

/* 绘制canvas 创建全局对象 其值为数据长度 */
var analyser = ac.createAnalyser();
var size = 128;
analyser.fftSize = size * 2;
analyser.connect(gainNode);

/* source count两变量 都为解决切换播放时的bug */
var source = null;
var count = 0;

/* -------------- 绘制canvas -------------- */
var box = $("#box")[0],
    width, height,    
    canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d");

box.appendChild(canvas);

/* 创建存放圆点的数组 */
var Dots = [];

function random(m, n) {
  return Math.round(Math.random() * (n - m) + m);
}

function getDots() {
  Dots = [];
  for(var i = 0; i < size; i++) {
    var x = random(0, width),
        y = random(0, height),
        color =  "rgb("+random(0, 255)+","+random(0, 255)+","+random(0, 255)+")";

    Dots.push({
      x: x,
      y: y,
      color: color
    });
     
  }
}

var line;
function resize() {
  width = box.clientWidth;
  height = box.clientHeight;

  canvas.width = width;
  canvas.height = height;

  // var line = ctx.createLinearGradient(x0, y0, x1, y1);
  line = ctx.createLinearGradient(0,0,0,height);
  line.addColorStop(0, "red");
  line.addColorStop(0.5, "yellow");
  line.addColorStop(1, "green");
  
  getDots();
}
resize();

window.onresize = resize;

function draw(arr) {
  // 创建出来的小块没有过度，应该清掉之前存在的值
  ctx.clearRect(0, 0, width, height);

  var w = width / size;
  ctx.fillStyle = line;

  for (var i = 0; i < size; i++) {
    if(draw.type === "column") {
      var h = arr[i] / 256 * height;
      ctx.fillRect(w * i, height - h, w * 0.6, h);      
    } else if (draw.type === "dot") {
      // 每次开始绘制前先完成绘制… 这样不会出现连续的线
      ctx.beginPath();

      var o = Dots[i],
          r = arr[i] / 256 * 50;
      ctx.arc(o.x, o.y, r, 0, Math.PI * 2, true);

      // var g = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
      var g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r);
      g.addColorStop(0, "#fff");
      g.addColorStop(1, o.color);
      ctx.fillStyle = g;
      ctx.fill();
      // ctx.strokeStyle = "#fff";
      // ctx.stroke();
    }
  }
}

/* -------------- 绘制canvas -------------- */

/* 点击选中 Dot Column 的切换 */

draw.type = "column";
var types = $("#type li");

for (var i = 0; i< types.length; i++) {
  types[i].onclick = function() {
    for (var j = 0; j < types.length; j++) {
      types[j].className = "";
    }
    this.className = "selected";
    draw.type = this.getAttribute("data-type");
  }
}


/* -------------------------- */

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
      // visualizer(); 这里每次播放都会调用，是会有性能问题的
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
  var arr = new Uint8Array(analyser.frequencyBinCount);  

  requestAnimationFrame = window.requestAnimationFrame || 
                          window.webkitRequestAnimationFrame ||
                          window.mozRequestAnimationFrame;

  function v() {
    analyser.getByteFrequencyData(arr);
    // console.log(arr);
    
    draw(arr);

    requestAnimationFrame(v);
  }
  /* 这里实时得到音频分析的数据 */
  requestAnimationFrame(v);
}
/* 自己单独调用 */
visualizer();


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