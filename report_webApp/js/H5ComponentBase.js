// 基本图文组件对象

var H5ComponentBase = function(name,config){
    var config = config || {};
    var id = ( 'h5_c_' + Math.random() ).replace(".", "_"); 
    var cls = "h5_component_" + config.type + ' h5_component_name_'+name;
    var component = $('<div class="h5_component '+ cls +'" id="'+id+'">');

    config.text && component.text(config.text);
    config.width && component.width(config.width / 2);
    config.height && component.height(config.height / 2);
    return component;
}
