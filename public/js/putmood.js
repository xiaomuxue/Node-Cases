/**
 * Created by lenovo on 2016/10/6.
 */
//获取所有的

$('#myimg').on('change',function(){
    var file = this.files[0];
    var reader=new FileReader();
    if(/image\/\w+/.test(file.type)){
        reader.readAsDataURL(file);
        reader.onload=function(){
            var result=this.result;
            $("#pic").css('background-image','url('+result+')')
                .css('background-size','cover')
                .find('h4').text('修改美食图片');
        }
    }
});