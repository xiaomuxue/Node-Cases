var express = require('express');
var cookie = require('cookie-parser');
var session = require('express-session');
var bodyparser = require('body-parser');
var fs = require('fs');
var mysql = require('mysql');
var multer = require('multer');
var path = require('path');
var md5 = require('md5');
var app = express();

var referer = null;

app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true,
	cookie: {secure:false, maxAge:1000*60*120}
}));

var pool = mysql.createPool({
	host:'127.0.0.1',
	port:3306,
	database:'pandacate',
	user:'root',
	password:'aaaa',
	multipleStatements: true
});
var uploadfilePath = '/images/pic/';
var upload = multer({dest:'./public'+uploadfilePath});

app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'public'));
app.use(bodyparser.urlencoded({extended:false}));

app.all('/putpage/*', function(req,res,next) {
	if(req.session.currentLoginUser == undefined){
		res.redirect('/index.html');
	}else{
		next();
	}
});


//获取分类。全部分类、分类详情
app.get('/getAllClassify',function(req,res) { //获取大分类
	var resobj = {};
	pool.getConnection(function(err,conn){
		res.header('Content-Type','application/json');
		if(err){
			resobj.code = '0';
			resobj.text = '数据库连接错误';
			res.send(resobj);
		}else{
			conn.query('SELECT c.cname,s.* FROM classify c,subdivide s WHERE c.cid=s.cid;', function(err, result){
				conn.release();
				if(err){
					resobj.code = '0';
					resobj.text = '数据查询失败';
					res.send(resobj);
				}else{
					resobj.code = '1';
					resobj.json = result;
					res.send(resobj);
				}
			});
		}
	});
});
//当前分类信息下的全部菜谱信息
app.all('/showSubdivide/:id',function(req,res,next) {
	var resobj = {};
	var sid = req.params.id;
	pool.getConnection(function(err,conn) {
		if(err){
			console.log(err);
			resobj.code = '0';
			resobj.text = '数据库连接失败';
			res.render('classify-detail',resobj);
		}else{
			var sqlstr = 'SELECT u.uid,u.uname,u.icon,f.title,f.fid,f.imgs,f.visits FROM foodmenu f,users u WHERE f.kinds LIKE "%'+sid+'%" AND f.uid=u.uid;' +
				'select sname from subdivide where sid='+sid+';';
			conn.query(sqlstr,function(err, results) {
				conn.release();
				if(err) {
					console.log(err);
					resobj.code = '0';
					resobj.text = '数据查询失败';
					res.render('classify-detail',resobj);
				}else{
					resobj.code = '1';
					resobj.objs = results[0].map(function(data) {
						data.imgs = data.imgs.split(',')[0];
						return data;
					});
					resobj.name = results[1][0].sname;
					res.render('classify-detail',resobj);
				}
			});
		}
	});

});


//登录注册相关
//检测用户是否登录
app.post('/checkLogin', function(req,res,next) {
	var resobj = {};
	res.header('Content-Type','application/json');
	if(req.session.currentLoginUser == undefined){
		resobj.code = '0';
		resobj.text = '用户未登录';
		res.send(resobj);
	} else {
		resobj.code = '1';
		resobj.text = '用户已登录';
		resobj.json = req.session.currentLoginUser;
		res.send(resobj);
	}
});
//退出登录
app.post('/exitLogin', function(req,res,next){
	if(req.body.uid == req.session.currentLoginUser.uid){
		delete req.session.currentLoginUser;
		res.send('ok');
	}else{
		res.send('error');
	}
});
//用户登录
app.all('/login.html', function(req,res,next) {
	var address = req.headers.referer||'http://127.0.0.1:8080';
	if(address != 'http://127.0.0.1:8080/login.html' && address != 'http://127.0.0.1:8080/register.html' && address != 'http://127.0.0.1:8080/userRegister'){
		referer = address;
	}else{
		referer = 'http://127.0.0.1:8080';
	}
	next();
});
app.post('/userLogin',function(req,res) {  //用户登录
	var resobj = {};
	var pwd = md5(req.body.pwd);
	pool.getConnection(function(err, conn) {
		res.header('Content-Type','application/json');
		if(err){
			resobj.code = '0';
			resobj.text = '数据库连接错误';
			res.send(resobj);
		}else{
			conn.query('SELECT uid,uname,icon FROM users WHERE (uname=? OR uid=?) AND PASSWORD=?;',[req.body.uname,req.body.uname,pwd],function(err,result){
				if(err){
					resobj.code = '0';
					resobj.text = '数据查询失败';
					res.send(resobj);
				}else{
					conn.release();
					if(result.length>0){
						req.session.currentLoginUser = result[0];
						resobj.code = '2';
						resobj.text = '登录成功';
						resobj.referer = referer;
						res.send(resobj);
					}else{
						resobj.code = '1';
						resobj.text = '用户名或密码错误';
						res.send(resobj);
					}
				}
			})
		}

	});
});
//用户注册
app.post('/userRegister',upload.single('userimg') ,function(req,res,next) {  //用户注册
	var resobj = {};
	pool.getConnection(function(err,conn) {
		if(err){
			resobj.code = '0';
			resobj.text = '数据库连接错误';
			res.render('reg_process',resobj);
		}else {
			var file = req.file;
			if( file !=undefined ) {
				var fileName = req.body.uname+/(.[a-zA-Z]{3,4})$/.exec(file.originalname)[0];
				fs.renameSync(file.path, __dirname+'/public'+uploadfilePath+fileName);
				var filePath = uploadfilePath+'/'+fileName;
			}else{
				var filePath = '/images/logo.png';
			}

			var sqlstr = 'insert into users (uname,password,telephone,email,sex,icon,birthday,kinds) values(?,md5(?),?,?,?,?,?,?)';
			var sqlarr = [req.body.uname,req.body.password,req.body.telephone,req.body.email,req.body.sex,filePath,req.body.birthday,req.body.kinds+''];
			conn.query(	sqlstr,sqlarr,function(err,result) {
				conn.release();
				if(err){
					resobj.code = '0';
					resobj.text = '数据插入失败';
					res.render('reg_process',resobj);
				}else{
					fs.mkdirSync(__dirname+'/public/images/menu/'+result.insertId);
					fs.mkdirSync(__dirname+'/public/images/mood/'+result.insertId);
					resobj.code = '1';
					resobj.text = '注册成功';
					resobj.id = result.insertId;
					res.render('reg_process',resobj);
				}
			});

		}
	});
});
//检测用户名是否存在
app.post('/checkUname', function(req,res) {
	var resobj = {};
	pool.getConnection(function (err,conn) {
		res.header('Content-Type','application/json');
		if(err){
			resobj.valid = false;
			res.send(resobj);
		}else{
			conn.query('select uid from users where uname=?',[req.body.uname], function(err, result){
				conn.release();
				if(err){
					resobj.valid = false;
					res.send(resobj);
				}else{
					if(result.length>0){
						resobj.valid = false;
						res.send(resobj);
					}else{
						resobj.valid = true;
						res.send(resobj);
					}

				}
			});
		}
	});
});
//修改密码
app.post('/updataPassword',function(req,res) {   //修改密码

});


//菜谱相关。 提交菜谱，菜谱评论，菜谱详情
//上传菜谱
app.post('/putMenu',upload.array('img'), function(req,res,next) {
	res.header('Content-Type','application/json');
	var uid = req.session.currentLoginUser.uid;
	var filePath = '';
	if(req.files!=undefined){
		fs.mkdirSync(__dirname+'/public/images/menu/'+uid+'/'+req.body.title);
		for(var i=0;i<req.files.length;i++){
			var file = req.files[i];
			if( file != undefined ) {
				var fileName = req.body.title+i+/(.[a-zA-Z]{3,4})$/.exec(file.originalname)[0];
				fs.renameSync(file.path, __dirname+'/public/images/menu/'+uid+'/'+req.body.title+'/'+fileName);
				var path = '/images/menu/'+uid+'/'+req.body.title+'/'+fileName;
			}else{
				var path = '/images/menu/nopicture.png';
			}
			if(filePath != ''){
				filePath += ',';
			}
			filePath += path;
		}
	}
	pool.getConnection(function(err,conn) {
		if(err){
			res.redirect('putpage/putmenu.html#'+0);
		}else {
			var sqlstr = 'insert into foodmenu (uid,title,imgs,content,material,materialnum,kinds) values(?,?,?,?,?,?,?)';
			var sqlarr = [uid,req.body.title,filePath,req.body.step.join('|||'),req.body.material+'',req.body.materialnum+'',req.body.kinds+''];
			conn.query(	sqlstr,sqlarr,function(err,result) {
				conn.release();
				if(err){
					res.redirect('putpage/putmenu.html#'+1);
				}else{
					res.redirect('showMenu/'+result.insertId);
				}
			});
		}
	});

});
//添加菜品评论
app.post('/addMenuComment', function(req,res,next) {
	var resobj = {};
	var uid = req.session.currentLoginUser.uid;
	res.header('Content-Type','application/json');
	pool.getConnection(function(err,conn) {
		if(err){
			resobj.code = '0';
			resobj.text = '数据库连接错误';
			res.send(resobj);
		}else {
			var sqlstr = 'insert menucomment (uid,fid,content) values(?,?,?)';
			var sqlarr = [uid,req.body.fid,req.body.content];
			conn.query(	sqlstr,sqlarr,function(err,result) {
				conn.release();
				if(err){
					resobj.code = '0';
					resobj.text = '数据插入失败';
					res.send(resobj);
				}else{
					resobj.code = '1';
					resobj.text = '评论成功';
					resobj.id = result.insertId;
					res.send(resobj);
				}
			});

		}
	});
});
//添加评论回复
app.post('/addMenuReply', function(req,res,next) {
	var resobj = {};
	var uid = req.session.currentLoginUser.uid;
	res.header('Content-Type','application/json');
	pool.getConnection(function(err,conn) {
		if(err){
			resobj.code = '0';
			resobj.text = '数据库连接错误';
			res.send(resobj);
		}else {
			var sqlstr = 'insert menureply (uid,commentid,content) values(?,?,?)';
			var sqlarr = [uid,req.body.commentid,req.body.content];
			conn.query(	sqlstr,sqlarr,function(err,result) {
				conn.release();
				if(err){
					resobj.code = '0';
					resobj.text = '数据插入失败';
					res.send(resobj);
				}else{
					resobj.code = '1';
					resobj.text = '评论成功';
					resobj.id = result.insertId;
					res.send(resobj);
				}
			});

		}
	});
});
//获取菜品评论和分页
app.post('/getMenuComment', function(req,res,next) {
	var resobj = {};
	var fid = req.body.fid;
	var pageNo = req.body.pageNo;
	var pageSize = req.body.pageSize;
	if(pageNo<0){
		pageNo=1;
	}
	if(pageSize<0){
		pageSize=5;
	}
	res.header('Content-Type','application/json');
	pool.getConnection(function(err,conn) {
		if(err){
			resobj.code = '0';
			resobj.text = '数据库连接失败';
			res.send(resobj);
		}else{
			var sqlstr = 'SELECT c.*,u.uname,u.icon FROM menucomment c,users u WHERE c.uid=u.uid AND fid='+fid+' ORDER BY TIME DESC limit '+(pageNo-1)*pageSize+','+pageSize+
						';SELECT COUNT(*) count FROM menucomment WHERE fid='+fid+';';
			conn.query(sqlstr,function(err,results) {
				conn.release();
				if(err) {
					resobj.code = '0';
					resobj.text = '数据查询失败';
					res.send(resobj);
				}else{
					resobj.code = '1';
					resobj.count = results[1][0].count;
					resobj.json = results[0].map(function(data){
						var d = new Date(data.time);
						data.time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
						return data;
					});
					res.send(resobj);
				}
			});
		}
	});
});
//显示菜谱详情
app.all('/showMenu/:id',function(req,res,next) {
	var resobj = {};
	var fid = req.params.id;
	pool.getConnection(function(err,conn) {
		if(err){
			console.log(err);
			resobj.code = '0';
			resobj.text = '数据库连接失败';
			res.render('foodmenu',resobj);
		}else{
			var sqlstr = 'select f.*,u.uname,u.icon from foodmenu f,users u where u.uid=f.uid and fid='+fid+
				'; UPDATE foodmenu SET visits=visits+1 where fid='+fid+';';
			conn.query(sqlstr,function(err, results) {
				conn.release();
				if(err) {
					console.log(err);
					resobj.code = '0';
					resobj.text = '数据查询失败';
					res.render('foodmenu',resobj);
				}else{
					var result = results[0];
					if(result.length>0) {
						resobj.code = '1';
						resobj.obj = result[0];
						resobj.obj.imgs=resobj.obj.imgs.split(',');
						resobj.obj.material=resobj.obj.material.split(',');
						resobj.obj.materialnum=resobj.obj.materialnum.split(',');
						resobj.obj.content=resobj.obj.content.split('|||');
						resobj.obj.mainimg = resobj.obj.imgs.shift();
						resobj.obj.kinds=resobj.obj.kinds.split(',').map(function(data) {
							return data.split(' ');
						});
						res.render('foodmenu',resobj);
					}else{
						resobj.code = '0';
						resobj.text = '找不到菜谱';
						res.render('foodmenu',resobj);
					}
				}
			});
		}
	});
});
//热门菜谱
app.post('/getHotMenu',function(req,res) {
	var resobj = {};
	res.header('Content-Type','application/json');
	pool.getConnection(function(err,conn) {
		if(err){
			resobj.code = '0';
			resobj.text = '数据库连接失败';
			res.send(resobj);
		}else{
			var sqlstr = 'SELECT fid,title FROM foodmenu ORDER BY visits DESC LIMIT 0,5;';
			conn.query(sqlstr,function(err,result) {
				conn.release();
				if(err) {
					resobj.code = '0';
					resobj.text = '数据查询失败';
					res.send(resobj);
				}else{
					resobj.code = '1';
					resobj.json = result;
					res.send(resobj);
				}
			});
		}
	});
});
//热门问题
app.post('/getHotQuestion',function(req,res) {
	var resobj = {};
	res.header('Content-Type','application/json');
	pool.getConnection(function(err,conn) {
		if(err){
			resobj.code = '0';
			resobj.text = '数据库连接失败';
			res.send(resobj);
		}else{
			var sqlstr = 'SELECT questionid,content FROM foodquestion ORDER BY visits DESC LIMIT 0,5;';
			conn.query(sqlstr,function(err,result) {
				conn.release();
				if(err) {
					resobj.code = '0';
					resobj.text = '数据查询失败';
					res.send(resobj);
				}else{
					resobj.code = '1';
					resobj.json = result;
					res.send(resobj);
				}
			});
		}
	});
});




//心情日记。
//上传心情日记
app.post('/putMood',upload.single('img'), function(req,res,next) {
	console.info(req.body);
	res.header('Content-Type','application/json');
	var uid = req.session.currentLoginUser.uid;
	var filePath = '';
	var file = req.file;
	fs.mkdirSync(__dirname+'/public/images/mood/'+uid+'/'+req.body.title);//__dirname获取当前模块文件所在的完整绝对路径
	if( file !=undefined ){
		console.info(file);
		var fileName = req.body.title+/(.[a-zA-Z]{3,4})$/.exec(file.originalname)[0];
		fs.renameSync(file.path, __dirname+'/public/images/mood/'+uid+'/'+req.body.title+'/'+fileName);
		var path = '/images/mood/'+uid+'/'+req.body.title+'/'+fileName;
		console.info(path);
	}else{
		var path = '/images/logo.png';
	}
	if(filePath != ''){
		filePath += ',';
	}
	filePath += path;

	pool.getConnection(function(err,conn) {
		if(err){
			//res.redirect('putpage/putmenu.html#'+0);
			res.redirect('public/putmood.html');
		}else {
			var sqlstr = 'insert into foodmood(uid,moodtitle,moodcontent,pic) values(?,?,?,?)';
			var sqlarr = [uid,req.body.title,req.body.content,filePath];
			conn.query(	sqlstr,sqlarr,function(err,result) {
				conn.release();
				if(err){
					res.redirect('putpage/putmood.html#'+1);
					console.log(err);
				}else{
					res.redirect('foodmood.html');
				}
			});
		}
	});
});
//日记上传排名
app.post('/rankMood',function(req,res){
	pool.getConnection(function(err,conn){
		res.header('Content-Type','application/json');
		if(err){
			res.send("数据库连接失败。。。");
		}else{
			conn.query('select fd.*,count(fd.uid),us.uname,us.icon from foodmood fd,users us where fd.uid=us.uid group by fd.uid;',function(err,result){
				if(err){
					res.code='0';
					res.text("数据查询失败....");
					res.send({"err":"0"});
				}else{
					res.code = '1';
					res.send(result);
				}
			});
		}
	});
});
//日记全部内容并分页
app.post("/getmoodInfoByPage",function(req,res){
	var pageNo=req.body.pageNo;//获取页数
	var pageSize=req.body.pageSize;//获取每页的数据条数
	if(pageNo<0){
		pageNo=1;
	}
	if(pageSize<0){
		pageSize=5;
	}
	pool.getConnection(function(err,conn){
		res.header("Content-Type","application/json");
		if(err){
			res.send("{'err':'0'}");
		}else{//第1页-7条  索引0-7=>第1条到第8条
			// 1-7         0-7  ,2-7 7-7,3-7 14-7    (pageNo-1)*pageSize
			conn.query("select * from foodmood,users where foodmood.uid=users.uid order by TIME desc limit "+(pageNo-1)*pageSize+","+pageSize,function(err,result){
				conn.release();
				if(err){
					console.info(err+"=============Page 268");
					res.send("{'err':'0'}");
				}else{
					res.send(result);
				}
			});
		}
	});
});
app.post("/getmoodInfoByPageOne",function(req,res){
	var pageNo=req.body.pageNo;//获取页数
	var pageSize=req.body.pageSize;//获取每页的数据条数
	if(pageNo<0){
		pageNo=1;
	}
	if(pageSize<0){
		pageSize=5;
	}
	pool.getConnection(function(err,conn){
		res.header("Content-Type","application/json");
		if(err){
			res.send("{'err':'0'}");
			console.log("数据库连接失败。。。。");
		}else{//第1页-7条  索引0-7=>第1条到第8条
			// 1-7         0-7  ,2-7 7-7,3-7 14-7    (pageNo-1)*pageSize
			conn.query("select * from foodmood,users where foodmood.uid=users.uid order by TIME desc limit 0,5",function(err,result){
				if(err){
					res.send("{'err':'0'}");
				}else{
					var obj={json:result};//手动创建一个包含result数据的对象
					conn.query("select count(moodid) as total from foodmood",function(err,result){
						conn.release();
						var total=0;
						if(err){
							total=0;
						}else{
							total=result[0].total;//获取foodmood中的数据总数
						}
						obj.total=total;//手动拼接数据总数到对象obj的total键中=>{objs:{},total:9}
						res.send(obj);
					});
				}
			});
		}
	});
});
//最受欢迎的日记
app.post('/foodMood',function(req,res){
	pool.getConnection(function(err,conn){
		res.header('Content-Type','application/json');
		if(err){
			res.send("数据库连接失败。。。");
		}else{
			conn.query('select f.*,FROM_UNIXTIME(UNIX_TIMESTAMP(f.TIME), "%Y-%m-%d %H:%i:%s") mytime,u.uname,u.icon,(SELECT count(moodid) from foodmood where uid=?) total,(SELECT count(uid) from moodlike where moodid=?) likenum from foodmood f,users u where moodid=? and f.uid=u.uid',[req.body.uid,req.body.moodid,req.body.moodid],function(err,result){
				if(err){
					res.code='0';
					res.text("数据查询失败....");
					res.send({"err":"0"});
				}else{
					res.code = '1';
					res.send(result[0]);
				}
			});
		}
	});
})
//最新日记
app.post('/foodMoodtwo',function(req,res){
	pool.getConnection(function(err,conn){
		res.header('Content-Type','application/json');
		if(err){
			res.send("数据库连接失败。。。");
		}else{
			conn.query('select * from foodmood where uid=? group by TIME DESC;',[req.body.uid],function(err,result){
				if(err){
					res.code='0';
					res.text("数据查询失败....");
					res.send({"err":"0"});
				}else{
					res.code = '1';
					res.send(result);
				}
			});
		}
	});
})




//问题(饮食问答)
//获取当页问题
app.post('/getFoodsInfoByPage',function(req,res){
	var pageNo=req.body.pageNo;
	var pageSize=req.body.pageSize;
	if(pageNo<0){      //pageNo小于0时，取1
		pageNo=1;
	}
	if(pageSize<0){
		pageSize=12;
	}

	pool.getConnection(function(err,conn){
		res.header("Content-Type","application/json");
		if(err){
			res.send('{"err":"0"}');
		}else{   //     (pageNo-1)*pageSize     page-1：表示第几页   pageSize:表示一页有多少条数据
			var sql="select fq.content as qcontent,fa.content as acontent,fq.TIME,t.* from foodquestion fq,foodanswer fa,";
			sql+="(select q.questionid,count(q.questionid)as count,min(a.answerid) as aid from foodquestion q,foodanswer a ",
				sql+="where q.questionid=a.questionid group by questionid) t where fq.questionid=fa.questionid and t.aid=fa.answerid and fq.questionid=t.questionid limit "
					+(pageNo-1)*pageSize +","+pageSize;
			conn.query(sql,function(err,result){
				if(err){
					res.send('{"err":"0"}');
				}else{
					res.send(result);
				}
			});
		}
	});
});
//获取当页问题处理前台的第一次分页查询请求
app.post("/getFoodsInfoByPageOne",function(req,res){
	var pageNo=req.body.pageNo;
	var pageSize=req.body.pageSize;
	if(pageNo<0){
		pageNo=1;
	}
	if(pageSize<0){
		pageSize=12;
	}
	pool.getConnection(function(err,conn){
		res.header("Content-Type","application/json");
		if(err){
			res.send('{"err":"0"}');
		}else{    //1-7   0-7   2-7   3-7  4-7  5-7     14-7     (pageNo-1)*pageSize     page-1：表示第几页   pageSize:表示一页有多少条数据
			var sql="select fq.content as qcontent,fa.content as acontent,fq.TIME,t.* from foodquestion fq,foodanswer fa,";
			sql+="(select q.questionid,count(q.questionid)as count,min(a.answerid) as aid from foodquestion q,foodanswer a ",
				sql+="where q.questionid=a.questionid group by questionid) t where fq.questionid=fa.questionid and t.aid=fa.answerid and fq.questionid=t.questionid limit "
					+(pageNo-1)*pageSize +","+pageSize;    //page-1：表示第几页   pageSize:表示一页有多少条数据
			conn.query(sql,function(err,result){
				if(err){
					console.info(err);
					res.send('{"err":"0"}');
				}else{
					var obj={objs:result};
					conn.query("select count(questionid) as total from foodanswer GROUP BY questionid;",function(err,result){
						conn.release();     //释放连接池
						var total=0;
						if(err){
							total=0;
						}else{
							total=result[0].total;
						}
						obj.total=total;     //{objs:[],total:9}
						res.send(obj);
					});
				}
			});
		}
	});
});
//提问
app.post('/askQuestion',function(req,res){
	resobj = {};
	pool.getConnection(function(err,conn){
		res.header('Content-Type','application/json');
		if(err){
			resobj.code = '0';
			resobj.text = '数据库连接错误';
			res.send(resobj);
		}else{
			conn.query('INSERT INTO foodquestion VALUES(0,?,?,CURRENT_TIMESTAMP,0);',[req.body.questionid,req.body.uid,req.body.content], function(err, result){
				conn.release();
				if(err){
					console.log(err);
					resobj.code = '0';
					resobj.text = '数据插入失败';
					res.render('reg_process',resobj);
				}else{
					resobj.code = '1';
					resobj.text = '注册成功';
					resobj.id = result.insertId;
					res.render('reg_process',resobj);
				}
			});
		}
	});
});
//获取未回答的问题
app.get('/Notanswer',function(req,res){
	resobj={};
	pool.getConnection(function(err,conn){
		res.header('Content-Type','application/json');
		if(err){
			resobj.code='0';
			resobj.text='数据库连接失败';
			res.send(resobj);
		}else{
			conn.query('SELECT * FROM foodquestion t1 WHERE NOT EXISTS (SELECT * FROM foodanswer t2 WHERE t1.questionid=t2.questionid)',function(err,result){
				if(err){
					resobj.code = '0';
					resobj.text = '数据查询失败';
					res.send(resobj);
				}else{
					resobj.code = '1';
					resobj.json = result;
					res.send(resobj);
				}
			});
		}
	});
});
//答题排行榜
app.get('/answerlist',function(req,res){
	resobj={};
	pool.getConnection(function(err,conn){
		res.header('Content-Type','application/json');
		if(err){
			resobj.code='0';
			resobj.text='数据库连接失败';
			res.send(resobj);
		}else{
			conn.query('select us.uname,us.icon,count(questionid) as count from users us,foodanswer fa where us.uid=fa.uid GROUP BY uname order by count desc;',function(err,result){
				if(err){
					resobj.code = '0';
					resobj.text = '数据查询失败';
					res.send(resobj);
				}else{
					resobj.code = '1';
					resobj.json = result;
					res.send(resobj);
				}
			});
		}
	});
});
//回复页面的接口
app.post('/replayanswer/:id',function(req,res){
	resobj = {};
	questionid=req.params.id;
	pool.getConnection(function(err,conn){
		res.header('Content-Type','application/json');
		if(err){
			resobj.code = '0';
			resobj.text = '数据库连接错误';
			res.send(resobj);
		}else{
			conn.query('select u.icon,u.uname,q.* from users u,foodquestion q where u.uid=q.uid and questionid='+questionid+';' +
				'update foodquestion set visits=visits+1 where questionid='+questionid+';',function(err, result){
				conn.release();
				if(err){
					resobj.code = '0';
					resobj.text = '数据查询失败';
					res.send(resobj);
				}else{
					resobj.code = '1';
					resobj.json = result[0];
					res.send(resobj);
				}
			});
		}
	});
});
//提交答案的接口
app.post('/submitanswer',function(req,res){
	resobj = {};
	pool.getConnection(function(err,conn){
		res.header('Content-Type','application/json');
		if(err){
			resobj.code = '0';
			resobj.text = '数据库连接错误';
			res.send(resobj);
		}else{
			conn.query('INSERT INTO foodanswer VALUES(0,?,?,?,CURRENT_TIMESTAMP);',[req.body.questionid,req.body.uid,req.body.content], function(err, result){
				conn.release();
				if(err){
					resobj.code = '0';
					resobj.text = '数据插入失败';
					res.render('reg_process',resobj);    //render是express框架里面的一个渲染机制
				}else{
					resobj.code = '1';
					resobj.text = '注册成功';
					resobj.id = result.insertId;
					res.render('reg_process',resobj);
				}
			});
		}
	});
});
//回复框的接口
app.post('/replay',function(req,res){
	resobj={};
	pool.getConnection(function(err,conn){
		res.header("Content-Type","applition/json");
		if(err){
			resobj.code='0';
			resobj.text="数据库连接失败"
			res.send();
		}else{
			conn.query('select us.uname,fa.TIME,fa.content,count(fa.questionid) as count from users us,foodanswer fa where us.uid=fa.uid group by fa.questionid='+questionid+';',function(err,result){
				conn.release();
				if(err){
					resobj.code='0';
					resobj.text='数据查询失败';
					res.send(resobj);
				}else{
					resobj.code='0';
					resobj.json=result;
					res.send(resobj);
				}
			});
		}
	});
});



//点赞。
app.post('/getLinkinfo', function(req,res) {
	var resobj = {};
	var id = req.body.id;
	var tablename = req.body.tablename;
	res.header('Content-Type','application/json');
	pool.getConnection(function(err,conn) {
		if(err){
			resobj.code = '0';
			resobj.text = '数据库连接失败';
			res.send(resobj);
		}else{
			var sqlstr = 'select count(*) total from '+tablename+' where id='+id;
			if(req.session.currentLoginUser!=undefined){
				var uid = req.session.currentLoginUser.uid;
				sqlstr += ';select * from '+tablename+' where id='+id+' and uid='+uid;
			}
			conn.query(sqlstr,function(err,result) {
				conn.release();
				if(err) {
					resobj.code = '0';
					resobj.text = '数据查询失败';
					res.send(resobj);
				}else{
					resobj.code = '1';
					if(result[1] && result[1].length>0){
						resobj.total = result[0][0].total;
						resobj.haslike = true;
					}else if(result[1] != undefined) {
						resobj.total = result[0][0].total;
						resobj.haslike = false;
					}else{
						resobj.total = result[0].total;
						resobj.haslike = false;
					}
					res.send(resobj);
				}
			});
		}
	});
});
app.post('/likeIt', function(req,res,next) {
	var resobj = {};
	var uid = req.session.currentLoginUser.uid;
	res.header('Content-Type','application/json');
	pool.getConnection(function(err,conn) {
		if(err){
			resobj.code = '0';
			resobj.text = '数据库连接错误';
			res.send(resobj);
		}else {
			var sqlstr = 'insert into '+req.body.tablename+' (uid,id) values(?,?)';
			var sqlarr = [uid,req.body.id];
			conn.query(	sqlstr,sqlarr,function(err,result) {
				console.log(result);
				conn.release();
				if(err){
					resobj.code = '0';
					resobj.text = '点赞失败';
					res.send(resobj);
				}else{
					resobj.code = '1';
					resobj.text = '点赞成功';
					resobj.id = result.insertId;
					res.send(resobj);
				}
			});

		}
	});
});
app.post('/unlikeIt', function(req,res,next) {
	var resobj = {};
	var uid = req.session.currentLoginUser.uid;
	res.header('Content-Type','application/json');
	pool.getConnection(function(err,conn) {
		if(err){
			resobj.code = '0';
			resobj.text = '数据库连接错误';
			res.send(resobj);
		}else {
			var sqlstr = 'delete from '+req.body.tablename+' where uid=? and id=?;';
			var sqlarr = [uid,req.body.id];
			conn.query(	sqlstr,sqlarr,function(err,result) {
				conn.release();
				if(err){
					resobj.code = '0';
					resobj.text = '取赞失败';
					res.send(resobj);
				}else{
					resobj.code = '1';
					resobj.text = '取赞成功';
					resobj.id = result.insertId;
					res.send(resobj);
				}
			});

		}
	});
});


//显示个人主页
app.all('/showHomePage/:id',function(req,res,next) {
	var resobj = {};
	var uid = req.params.id;
	pool.getConnection(function(err,conn) {
		if(err){
			console.log(err);
			resobj.code = '0';
			resobj.text = '数据库连接失败';
			res.render('personPage',resobj);
		}else{
			var sqlstr = 'SELECT uid,uname,userinfo,icon,birthday,kinds,sex FROM users WHERE uid='+uid+
				';SELECT fid,imgs,title,(SELECT COUNT(commentid) FROM menucomment WHERE fid=f.fid) commentnum,(SELECT COUNT(likeid) FROM menulike WHERE id=f.fid) likenum FROM foodmenu f WHERE uid='+uid+' LIMIT 0,4;' +
				'SELECT questionid,content FROM foodquestion WHERE uid='+uid+' LIMIT 0,5;' +
				'SELECT moodid,pic,moodtitle,(SELECT COUNT(likeid) FROM moodlike WHERE id=m.moodid) likenum FROM foodmood m WHERE uid=1000011 LIMIT 0,4;';
			conn.query(sqlstr,function(err, results) {
				conn.release();
				if(err) {
					console.log(err);
					resobj.code = '0';
					resobj.text = '数据查询失败';
					res.render('personPage',resobj);
				}else{
					if(results[0].length>0) {
						resobj.code = '1';
						resobj.obj = results[0][0];
						var d = new Date(resobj.obj.birthday);
						resobj.obj.birthday = (d.getMonth() + 1) + '月' + d.getDate() + '日';
						resobj.obj.kinds = resobj.obj.kinds.split(',').map(function(data){
							return data.split(' ');
						});
						resobj.menu = results[1];
						resobj.menu.map(function(data) {
							data.imgs = data.imgs.split(',')[0];
							return data;
						});
						resobj.question = results[2];
						resobj.mood = results[3];
						console.log(resobj);
						res.render('personPage',resobj);
					}else{
						resobj.code = '0';
						resobj.text = '用户不存在';
						res.render('personPage',resobj);
					}
				}
			});
		}
	});
});

app.use(express.static(__dirname+'/public'));

app.use('/',function(req, res) {  //返回404
	res.status(404);
	res.sendFile(path.join(__dirname + '/public', '404.html'));
});

app.listen(8080,function(err) {
	if(err){
		console.log('服务器启动失败');
	}else{
		console.log('服务器启动成功');
	}
});