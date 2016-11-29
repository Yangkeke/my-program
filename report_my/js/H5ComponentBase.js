// 基本图文组件对象

var H5ComponentBase = function(name,config){
    var config = config || {};
    var id = ( 'h5_c_' + Math.random() ).replace(".", "_"); 
    var cls = " h5_component_" + config.type;
    var component = $('<div class="h5_component '+ cls + ' h5_component_name_' + name +' " id="'+id+'">');

    config.text && component.text(config.text);
    config.width && component.width(config.width / 2);
    config.height && component.height(config.height / 2);
    config.css && component.css(config.css);
    config.bg && component.css('backgroundImage', 'url('+config.bg+')');

    if (config.center === true) {
      component.css({
        marginLeft: (config.width / 4 * -1) + 'px',
        left: '50%'
      })
    }

    // ...很多自定义的参数
    
    component.on('onLoad', function() {
      component.removeClass(cls + '_leave')
               .addClass(cls + '_load');

      config.animateIn && component.animate(config.animateIn);

      return false;
    });
    component.on('onLeave', function() {
      component.removeClass(cls + '_load')
               .addClass(cls + '_leave');

      config.animateOut && component.animate(config.animateOut);

      return false;
    });

    return component;
}
