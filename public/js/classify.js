$.get('/getAllClassify',null,function(data) {
    if(data.code=='0'){
        console.log(data.text);
    }else{
        var currentCid = '';
        var $currentUl;
        var $classifycontent = $('#classify-content');
        $.each(data.json,function(index,item) {
            if( item.cid != currentCid ) {
                currentCid = item.cid;
                $classifycontent.append('<div id="C'+item.cid+'">' +
                                    '<h4>'+item.cname+'</h4>' +
                                    '<ul class="subdivide-content" id="ulc'+item.cid+'"></ul>' +
                                    '</div>');
                $currentUl = $('#ulc'+currentCid);
            }
            $currentUl.append('<li><a href="/showSubdivide/' + item.sid + '">' + item.sname + '</a></li>');

        });
    }
},'json');