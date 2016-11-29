// 柱图组件对象

var H5ComponentBar = function(name,config){
  var component = new H5ComponentBase(name, config);
  
  $.each(config.data, function(index, item) {
    console.log(item);

    var line = $('<div class="line">'),
        name = $('<div class="name">'),
        rate = $('<div class="rate">'),
        per = $('<div class="per">'),
        width = item[1]*100 + '%';

    var bgStyle = '';    
    if (item[2]) {
      bgStyle = 'style="background-color: '+item[2]+'"';
    }

    rate.html('<div class="bg" '+ bgStyle +'></div>');
    rate.css('width', width);

    name.text(item[0]);

    per.text(width);

    line.append(name)
        .append(rate)
        .append(per);

    component.append(line);

  });


  return component;
}
