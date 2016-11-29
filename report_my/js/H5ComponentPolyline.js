// 折线图表组件对象

var H5ComponentPolyline = function(name,config){
  var component = new H5ComponentBase(name, config);
  
  // 绘制网格线
  var w = config.width,
      h = config.height,
      step = 10;
      canvas = document.createElement('canvas'),
      context = canvas.getContext('2d');

  // 加入一个canvas画布 - 网格线背景
  canvas.width = context.width = w;
  canvas.height = context.height = h;
  component.append(canvas);

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

  /* ------------------------------------------ */
  // 加入画布 - 数据层
  var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d');

  canvas.width = context.width = w;
  canvas.height = context.height = h;
  component.append(canvas);

  // 绘制折线数据
  context.beginPath();
  context.lineWidth = 3;
  context.strokeStyle = "#ff8878";

  var x = 0;
  var y = 0;
  var row_w = w / (config.data.length + 1);

  step = config.data.length + 1;

  // 画点
  for (i in config.data) {
    var item = config.data[i];

    x = row_w * i + row_w;
    y = h * (1 - item[1]);

    context.moveTo(x, y);
    context.arc(x, y, 5, 0, 2*Math.PI);

    console.log(item);
  }

  // 连线

  context.stroke();


  return component;
}
