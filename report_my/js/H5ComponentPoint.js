// 散点图表组件对象

var H5ComponentPoint = function(name,config){
  var component = new H5ComponentBase(name, config);
  var base = config.data[0][1];  //以第一个数据的比例大小为100%
  $.each(config.data, function(index, item) {
    // 输出每一个point
    var point = $('<div class="point point_'+index+'" >');
    var per = (item[1] / base * 100) + '%';
    var name = $('<div class="name">' + item[0] + '</div>');
    var rate = $('<div class="per">' + (item[1]*100) +'%</div>');
   
    point.width(per).height(per);
    name.append(rate);
    point.append(name);

    if (item[2]) {
      point.css('background-color', item[2]);
    }
    if (item[3] !== undefined && item[4] !== undefined) {
      point.css('left', item[3]).css('top', item[4]);
    }

    component.append(point);
  });

  return component;
}
