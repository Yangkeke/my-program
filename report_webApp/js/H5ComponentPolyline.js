// 折线图表组件对象

var H5ComponentPolyline = function(name,config){
  var component = new H5ComponentBase(name, config);
  
  // 绘制网格线
  var w = config.width,
      h = config.height,
      step = 10;
      canvas = document.createElement('canvas'),
      context = canvas.getContext('2d');

  // 加入一个canvas画布（网格线背景）
  canvas.width = context.width = w;
  canvas.height = context.height = h;

  // 水平网格线 100份 -> 10份  
  context.beginPath();
  context.lineWidth = 1;
  context.strokeStyle = "#aaa";

  window.context = context;
  for (var i = 0, step = 11; i < step; i++) {
    var y = (h / step) * i;
    
    context.moveTo(0, y);
    context.lineTo(w, y);    
  }

  // 垂直网格线，根据项目的个数来分的
  step = config.data.length + 1;
  for (var i = 0; i < step + 1; i++) {
    var x = (w / step) * i;
    context.moveTo(x, 0);
    context.lineTo(x, h);  
  }

  context.stroke();
  component.append(canvas);

  return component;
}
