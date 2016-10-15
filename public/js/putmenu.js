$(function(){
    $.get('/getAllClassify',null,function(data) {
        if(data.code=='0'){
            console.log(data.text);
        }else{
            var currentCid = '';
            var $checkContent;
            var $Classify = $('#classify');
            var $Subdivide = $('#subdivide');
            $.each(data.json,function(index,item) {
                if( item.cid != currentCid ) {
                    currentCid = item.cid;
                    var classifystr = index==0
                        ? '<li class="active"><a href="#checkC'+currentCid+'" data-toggle="tab">'+item.cname+'</a></li>'
                        :'<li><a href="#checkC'+currentCid+'" data-toggle="tab">'+item.cname+'</a></li>';
                    $Classify.append(classifystr);
                    var subdividestr = index==0
                        ? '<li id="checkC'+currentCid+'" class="tab-pane active"><div id="Content'+currentCid+'" data-toggle="buttons"></div></li>'
                        : '<li id="checkC'+currentCid+'" class="tab-pane"><div id="Content'+currentCid+'" data-toggle="buttons"></div></li>';
                    $Subdivide.append(subdividestr);
                    $checkContent = $('#Content'+currentCid);
                }
                $checkContent.append('<label for="s'+item.sid+'" class="btn btn-default"> ' +
                    '<input id="s'+item.sid+'" value="'+item.sid+' '+item.sname+'" name="kinds" type="checkbox">' +
                    item.sname+
                    '</label>');
            });
        }
    },'json');

    if(location.hash == '#0'){
        $.popup.alert({
            'position':'middle',
            'title': '提示信息',
            'msg': '数据库连接失败',
            'okmsg': '重新填写'
        });
    }else if(location.hash == '#1'){
        $.popup.alert({
            'position':'middle',
            'title': '提示信息',
            'msg': '数据插入失败',
            'okmsg': '重新填写'
        });
    }
});

function showImg(ele) {
    var file = ele.files[0];
    var reader=new FileReader();
    var $imgcontainer = $(ele).prev();
    var text = $imgcontainer.find('p').text().replace('添加','修改');
    if(/image\/\w+/.test(file.type)){
        reader.readAsDataURL(file);
        reader.onload=function(){
            var result=this.result;
            $imgcontainer.css('background-image','url('+result+')')
                .css('background-size','cover')
                .find('p').text(text);
        }
    }
}

function removeThis(ele){
    $(ele).parent().remove();
}

function addMaterial(ele) {
    var str = '<div class="row shicai" style="position: relative;margin-bottom: 10px;">'
            +'<input required type="text" name="material[]" class="col-lg-8 col-md-8 col-sm-8 col-xs-8" placeholder="如：五花肉"style="margin-left: 5px;"/>'
            +'<input required type="text" name="materialnum[]" class="col-lg-3 col-md-3 col-sm-2 col-xs-3"placeholder="如：200g" style="margin-left: 5px;"/>'
            +'<span onclick="removeThis(this)" class="glyphicon glyphicon-remove col-lg-1 col-md-1 col-sm-1 col-xs-1" style="position: absolute;right:0px; top:6px;cursor: pointer"></span>'
            +'</div>';
    $(ele).before(str);
}

function addStep(ele) {
    var len = $('textarea').length
    var str = '<div class="row" style="margin-left: 18px;margin-top: 10px" >'
        +'<div class="col-lg-3 col-md-3 col-sm-3 col-xs-4 text-center" style="height: 80px;background-color:#C7B8A3;margin-bottom: 20px;border-radius: 1em;">'
        +'<label for="steppic_'+len+'">'
        +'<span class="glyphicon glyphicon-plus"style="color: #ffffff;font-size: 20px;padding-top: 10px"></span>'
        +'<p title="添加步骤图">添加步骤图</p>'
        +'</label>'
        +'</div>'
        +'<input onchange="showImg(this)" required id="steppic_'+len+'" type="file" name="img" style="display: none"/>'
        +'<div class="col-lg-9 col-md-9 col-sm-9 col-xs-8"><textarea style="border: 1px solid #cccccc;width: 100%;height: 80px;" name="step[]"></textarea></div>'
        +'</div>';

    $(ele).parent().before(str);
}

