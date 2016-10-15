/*
SQLyog Ultimate v12.08 (64 bit)
MySQL - 5.7.10-log : Database - pandacate
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`pandacate` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `pandacate`;

/*Table structure for table `classify` */

DROP TABLE IF EXISTS `classify`;

CREATE TABLE `classify` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `cname` varchar(30) NOT NULL,
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

/*Data for the table `classify` */

insert  into `classify`(`cid`,`cname`) values (10,'菜式'),(11,'菜系'),(12,'主食'),(13,'口味'),(14,'场合');

/*Table structure for table `foodanswer` */

DROP TABLE IF EXISTS `foodanswer`;

CREATE TABLE `foodanswer` (
  `answerid` int(11) NOT NULL AUTO_INCREMENT,
  `questionid` int(11) DEFAULT NULL,
  `uid` int(11) DEFAULT NULL,
  `content` varchar(600) DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`answerid`),
  KEY `questionid` (`questionid`),
  KEY `uid` (`uid`),
  CONSTRAINT `foodanswer_ibfk_1` FOREIGN KEY (`questionid`) REFERENCES `foodquestion` (`questionid`),
  CONSTRAINT `foodanswer_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1000031 DEFAULT CHARSET=utf8;

/*Data for the table `foodanswer` */

insert  into `foodanswer`(`answerid`,`questionid`,`uid`,`content`,`time`) values (1000001,1000003,1000003,'我觉得你说得对','2016-10-05 19:08:22'),(1000002,1000002,1000003,'胡椒、花椒、辣椒、剁椒','2016-10-05 16:23:18'),(1000003,1000003,1000004,'一斤面粉放四到十克，根据气温来的，热天放四克，冬天要多放些','2016-10-05 16:37:58'),(1000004,1000003,1000003,'一斤面粉可以放三十克左右','2016-09-05 16:38:47'),(1000005,1000003,1000002,'你想放多少就放多少','2016-10-03 16:39:50'),(1000006,1000004,1000007,'是的','2016-08-09 16:40:26'),(1000007,1000002,1000006,'能吃','2016-10-05 21:25:15'),(1000008,1000004,1000005,'使用勺子弄出去，倒掉','2016-10-05 21:26:12'),(1000009,1000005,1000006,'鲫鱼','2016-10-05 21:26:58'),(1000010,1000006,1000006,'酱汁、耗油、鸡精等','2016-10-05 21:27:52'),(1000011,1000007,1000007,'最好能煮一下','2016-10-05 21:28:52'),(1000012,1000008,1000008,'可以呀!但是肯定没有糯米好吃','2016-10-05 21:29:39'),(1000013,1000009,1000009,'你觉得呢？','2016-10-05 21:30:31'),(1000014,1000010,1000010,'红枣、当归、枸杞','2016-10-05 21:31:16'),(1000015,1000011,1000011,'因为你放了发酵粉呀！是不是傻','2016-10-05 21:32:04'),(1000019,1000004,1000004,'最好小火炖一个小时','2016-10-09 16:33:28'),(1000020,1000008,1000002,'炖出金色的汤','2016-10-09 16:34:13'),(1000021,1000005,1000007,'最好能煮一下','2016-10-05 21:28:52'),(1000022,1000017,1000008,'可以呀!但是肯定没有糯米好吃','2016-10-05 21:29:39'),(1000023,1000019,1000009,'你觉得呢？','2016-10-05 21:30:31'),(1000024,1000016,1000010,'红枣、当归、枸杞','2016-10-05 21:31:16'),(1000025,1000018,1000011,'因为你放了发酵粉呀！是不是傻','2016-10-05 21:32:04'),(1000029,1000020,1000004,'最好小火炖一个小时','2016-10-09 16:33:28'),(1000030,1000020,1000002,'炖出金色的汤','2016-10-09 16:34:13');

/*Table structure for table `foodanswerlike` */

DROP TABLE IF EXISTS `foodanswerlike`;

CREATE TABLE `foodanswerlike` (
  `likeid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL,
  `id` int(11) DEFAULT NULL,
  PRIMARY KEY (`likeid`),
  KEY `uid` (`uid`),
  KEY `answerid` (`id`),
  CONSTRAINT `foodanswerlike_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`),
  CONSTRAINT `foodanswerlike_ibfk_2` FOREIGN KEY (`id`) REFERENCES `foodanswer` (`answerid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `foodanswerlike` */

/*Table structure for table `foodanswerreply` */

DROP TABLE IF EXISTS `foodanswerreply`;

CREATE TABLE `foodanswerreply` (
  `replyid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `answerid` int(11) DEFAULT NULL,
  `content` varchar(600) DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`replyid`),
  KEY `answerid` (`answerid`),
  KEY `uid` (`uid`),
  CONSTRAINT `foodanswerreply_ibfk_1` FOREIGN KEY (`answerid`) REFERENCES `foodanswer` (`answerid`),
  CONSTRAINT `foodanswerreply_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `foodanswerreply` */

/*Table structure for table `foodmenu` */

DROP TABLE IF EXISTS `foodmenu`;

CREATE TABLE `foodmenu` (
  `fid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `imgs` varchar(500) NOT NULL,
  `content` text NOT NULL,
  `kinds` varchar(500) NOT NULL,
  `material` varchar(500) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `visits` int(11) DEFAULT '0',
  `title` varchar(100) NOT NULL,
  `materialnum` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`fid`),
  KEY `uid` (`uid`),
  CONSTRAINT `foodmenu_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1000012 DEFAULT CHARSET=utf8;

/*Data for the table `foodmenu` */

insert  into `foodmenu`(`fid`,`uid`,`imgs`,`content`,`kinds`,`material`,`time`,`visits`,`title`,`materialnum`) values (1000004,1000011,'/images/menu/1000011/大螃蟹/大螃蟹0.jpg,/images/menu/1000011/大螃蟹/大螃蟹1.jpg,/images/menu/1000011/大螃蟹/大螃蟹2.jpg','啊啊啊啊啊啊啊啊啊，啊啊啊啊啊啊啊啊，啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊，啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊。|||哈哈哈哈哈哈哈哈哈，哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈。','114 家常菜,122 海鲜,100 湘菜,139 麻辣','螃蟹,水','2016-10-06 20:42:27',233,'大螃蟹','5只,适量'),(1000005,1000005,'/images/menu/1000005/葱油面/葱油面0.jpg,/images/menu/1000005/葱油面/葱油面1.jpg,/images/menu/1000005/葱油面/葱油面2.jpg,/images/menu/1000005/葱油面/葱油面3.jpg,/images/menu/1000005/葱油面/葱油面4.jpg','准备材料：香葱去掉葱白，留下青绿色的部分，把葱切段|||炒锅放油用小火炸葱段|||煮熟面条后捞起面条，沥水|||烧开水后下面条','132 面条,138 清淡,152 早餐','挂面,香葱,油,生抽','2016-10-09 14:22:54',4,'葱油面','250g,100g,100毫升,30毫克'),(1000006,1000002,'/images/menu/1000002/砂锅牛腩煲/砂锅牛腩煲0.jpg,/images/menu/1000002/砂锅牛腩煲/砂锅牛腩煲1.jpg,/images/menu/1000002/砂锅牛腩煲/砂锅牛腩煲2.jpg,/images/menu/1000002/砂锅牛腩煲/砂锅牛腩煲3.jpg,/images/menu/1000002/砂锅牛腩煲/砂锅牛腩煲4.jpg','捞出反复冲水，清洗干净。|||放入绰水后的牛腩，翻炒均匀。|||加入所有香料，继续翻炒至能够闻到香料的香气来。|||成品。','114 家常菜','牛腩,土豆,大蒜,姜','2016-10-09 19:30:43',31,'砂锅牛腩煲','500g,500g,3瓣,一小块'),(1000007,1000002,'/images/menu/1000002/懒人糖醋排骨/懒人糖醋排骨0.jpg,/images/menu/1000002/懒人糖醋排骨/懒人糖醋排骨1.jpg,/images/menu/1000002/懒人糖醋排骨/懒人糖醋排骨2.jpg,/images/menu/1000002/懒人糖醋排骨/懒人糖醋排骨3.jpg','排骨洗净放入锅中，加入姜蒜和没过排骨的水。|||大火煮开后转中小火，加盖焖煮。|||当锅中汁水快干时，开大火，快速翻炒收汁，即可出锅。焖煮过程大概要30分钟。','114 家常菜','排骨,料酒或米酒,酱油,白米醋或陈醋,生姜','2016-10-09 19:51:35',9,'懒人糖醋排骨','10-15小块,1汤匙,2汤匙,4汤匙,5片'),(1000008,1000002,'/images/menu/1000002/虾仁蒸蛋/虾仁蒸蛋0.jpg,/images/menu/1000002/虾仁蒸蛋/虾仁蒸蛋1.jpg,/images/menu/1000002/虾仁蒸蛋/虾仁蒸蛋2.jpg,/images/menu/1000002/虾仁蒸蛋/虾仁蒸蛋3.jpg,/images/menu/1000002/虾仁蒸蛋/虾仁蒸蛋4.jpg,/images/menu/1000002/虾仁蒸蛋/虾仁蒸蛋5.jpg','鲜虾和鸡蛋；|||虾取虾仁，去掉虾肠虾线，加少许盐腌制一会儿；|||鸡蛋打散在碗里，加适量盐和少许料酒搅拌均匀；|||蛋液稍凝固后找开保鲜膜，摆放虾仁再蒸5分钟就可以了。|||蒸好后调点酱油、香油淋上。','114 家常菜','鸡蛋,鲜虾,盐,料酒,酱油','2016-10-09 19:55:13',27,'虾仁蒸蛋','2个,5只,适量,适量,适量'),(1000009,1000011,'/images/menu/1000011/口水鸡/口水鸡0.jpg,/images/menu/1000011/口水鸡/口水鸡1.jpg,/images/menu/1000011/口水鸡/口水鸡2.jpg','1|||2','114 家常菜','aa,bb','2016-10-09 21:33:42',7,'口水鸡','11g,10g'),(1000010,1000010,'/images/menu/1000010/可乐鸡翅/可乐鸡翅0.jpg,/images/menu/1000010/可乐鸡翅/可乐鸡翅1.jpg,/images/menu/1000010/可乐鸡翅/可乐鸡翅2.jpg,/images/menu/1000010/可乐鸡翅/可乐鸡翅3.jpg,/images/menu/1000010/可乐鸡翅/可乐鸡翅4.jpg','准备食材。|||锅中少放一点点油，然后将鸡翅放锅中，小火煎至表面金黄。|||转大火收汁。收汁的时候要不停的用铲子翻动，直至鸡翅表面裹上焦糖色，锅中有明油渗出即可。|||装盘上桌即可。','114 家常菜,140 甜','鸡翅,可乐,姜,盐,酱油','2016-10-10 20:32:26',4,'可乐鸡翅','十只,300ml,一小块,3g,5ml'),(1000011,1000010,'/images/menu/1000010/宫保鸡丁/宫保鸡丁0.jpg,/images/menu/1000010/宫保鸡丁/宫保鸡丁1.jpg,/images/menu/1000010/宫保鸡丁/宫保鸡丁2.jpg,/images/menu/1000010/宫保鸡丁/宫保鸡丁3.jpg,/images/menu/1000010/宫保鸡丁/宫保鸡丁4.jpg','主要材料备齐；|||接着下鸡腿肉炒至断生；|||鸡腿剔骨，鸡肉在清水中泡一1小时去血水，中间换一次水；接着将鸡腿肉沥干水分切小块，放入盐3g、淀粉、料酒和蛋清拌匀，放冰箱保鲜柜腌2小时以上，隔夜更好；|||下黄瓜丁、剩下的葱丝、煸好的花生米炒匀后略微收汁即可。','114 家常菜,154 晚餐,158 朋友聚餐','整鸡腿,手剥花生米,嫩姜,蒜瓣,干辣椒,花椒,黄瓜','2016-10-10 20:37:07',3,'宫保鸡丁','2只,15g,1块,3瓣,4个	,8-10颗,1/3根');

/*Table structure for table `foodmood` */

DROP TABLE IF EXISTS `foodmood`;

CREATE TABLE `foodmood` (
  `moodid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL,
  `moodtitle` varchar(100) DEFAULT NULL,
  `moodcontent` varchar(100) DEFAULT NULL,
  `pic` varchar(100) DEFAULT NULL,
  `TIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `visits` int(11) DEFAULT '0',
  PRIMARY KEY (`moodid`),
  KEY `uid` (`uid`),
  CONSTRAINT `foodmood_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1000027 DEFAULT CHARSET=utf8;

/*Data for the table `foodmood` */

insert  into `foodmood`(`moodid`,`uid`,`moodtitle`,`moodcontent`,`pic`,`TIME`,`visits`) values (1000007,1000005,'糖醋排骨','很好吃','/images/mood/1000005/糖醋排骨/糖醋排骨.jpg','2016-10-08 16:25:42',0),(1000008,1000005,'拔丝肉块','美美哒','/images/mood/1000005/拔丝肉块/拔丝肉块.jpg','2016-10-08 17:30:31',0),(1000009,1000005,'河虾','好吃','/images/mood/1000005/河虾/河虾.jpg','2016-10-08 17:31:25',0),(1000010,1000005,'靓汤','今天做了一道美味汤','/images/mood/1000005/靓汤/靓汤.jpg','2016-10-08 17:32:12',0),(1000011,1000005,'一道朴实的菜','很简单的家常菜','/images/mood/1000005/一道朴实的菜/一道朴实的菜.jpg','2016-10-08 17:32:56',0),(1000012,1000005,'酱香肉块','nice','/images/mood/1000005/酱香肉块/酱香肉块.jpg','2016-10-08 17:33:40',0),(1000013,1000005,'绿茶饼','甜甜的','/images/mood/1000005/绿茶饼/绿茶饼.jpg','2016-10-08 17:34:13',0),(1000014,1000002,'美味肉夹馍','好开心','/images/mood/1000002/美味肉夹馍/美味肉夹馍.jpg','2016-10-08 21:41:56',0),(1000015,1000002,'甜品','nice','/images/mood/1000002/甜品/甜品.jpg','2016-10-08 21:43:00',0),(1000016,1000002,'吐司卷','^-^','/images/mood/1000002/吐司卷/吐司卷.jpg','2016-10-08 21:43:33',0),(1000017,1000002,'椰丝球','good','/images/mood/1000002/椰丝球/椰丝球.jpg','2016-10-08 21:43:53',0),(1000018,1000006,'豆豆鱼','好好吃','/images/mood/1000006/豆豆鱼/豆豆鱼.jpg','2016-10-09 15:09:13',0),(1000019,1000007,'小酥饼','香香脆脆','/images/mood/1000007/小酥饼/小酥饼.jpg','2016-10-09 15:14:47',0),(1000020,1000007,'面包条','首创','/images/mood/1000007/面包条/面包条.jpg','2016-10-09 15:16:29',0),(1000021,1000007,'大盘虾','就是爱虾','/images/mood/1000007/大盘虾/大盘虾.jpg','2016-10-09 15:17:03',0),(1000022,1000008,'香炖豆干','行家呀','/images/mood/1000008/香炖豆干/香炖豆干.jpg','2016-10-09 19:30:00',0),(1000023,1000009,'香酥炸鸡翅','爱美食','/images/mood/1000009/香酥炸鸡翅/香酥炸鸡翅.jpg','2016-10-09 19:33:06',0),(1000024,1000009,'桃酥','很棒','/images/mood/1000009/桃酥/桃酥.png','2016-10-09 19:35:39',0),(1000025,1000010,'豆腐蛋花汤','清淡美味','/images/mood/1000010/豆腐蛋花汤/豆腐蛋花汤.jpg','2016-10-09 19:36:56',0),(1000026,1000011,'日常饺子','偶尔下个馆子','/images/mood/1000011/日常饺子/日常饺子.jpg','2016-10-09 19:40:39',0);

/*Table structure for table `foodquestion` */

DROP TABLE IF EXISTS `foodquestion`;

CREATE TABLE `foodquestion` (
  `questionid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL,
  `content` varchar(300) DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `visits` int(11) DEFAULT '0',
  PRIMARY KEY (`questionid`),
  KEY `uid` (`uid`),
  CONSTRAINT `foodquestion_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1000025 DEFAULT CHARSET=utf8;

/*Data for the table `foodquestion` */

insert  into `foodquestion`(`questionid`,`uid`,`content`,`time`,`visits`) values (1000001,1000003,'怎么烤鱼','2016-10-05 19:06:36',0),(1000002,1000002,'我想知道怎么鱼怎么红烧','2016-10-05 19:07:18',0),(1000003,1000002,'螃蟹好吃吗','2016-10-05 19:07:37',0),(1000004,1000003,'做包子一斤面粉要放多少干酵母','2016-10-05 19:48:49',0),(1000005,1000003,'海蛎子什么季节吃最肥？','2016-10-05 19:49:00',0),(1000006,1000003,'萱衣草可以当作花茶来喝么？','2016-10-05 19:55:38',0),(1000007,1000003,'你的菜品是使用什么调料？','2016-10-05 20:13:09',0),(1000008,1000008,'南瓜饼用面粉可以吗？','2016-10-05 16:01:08',5),(1000009,1000009,'排骨汤可以放香菇、莲藕、土豆一起炖吗','2016-10-05 16:01:53',5),(1000010,1000010,'煲猪骨汤加什么中药可以补血益气?','2016-10-05 16:02:29',5),(1000011,1000011,'蒸出的馒头为什么会收缩塌陷，表皮起泡？','2016-10-05 16:02:56',5),(1000016,1000002,'面包什么味道说明它过期了？','2016-10-06 20:10:55',5),(1000017,1000003,'秋葵要怎么煮？','2016-10-06 20:12:28',5),(1000018,1000005,'土豆和黄瓜可以和什么一起煮？','2016-10-06 20:13:58',5),(1000019,1000002,'三杯鸡怎么做？','2016-10-06 20:15:22',5),(1000020,1000005,'白箩卜和胡箩卜可以炖鸡肉吗？','2016-10-06 20:15:47',5),(1000021,1000003,'牛奶炖香菇可以治鼻炎吗？','2016-10-06 20:16:30',5),(1000022,1000002,'大虾和瘦肉可以一起做粥吗','2016-10-06 20:16:59',5),(1000024,1000003,'鸡汤要炖多久？','2016-10-09 16:32:17',5);

/*Table structure for table `menucomment` */

DROP TABLE IF EXISTS `menucomment`;

CREATE TABLE `menucomment` (
  `commentid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `fid` int(11) DEFAULT NULL,
  `content` varchar(600) DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`commentid`),
  KEY `fid` (`fid`),
  KEY `uid` (`uid`),
  CONSTRAINT `menucomment_ibfk_1` FOREIGN KEY (`fid`) REFERENCES `foodmenu` (`fid`),
  CONSTRAINT `menucomment_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1000015 DEFAULT CHARSET=utf8;

/*Data for the table `menucomment` */

insert  into `menucomment`(`commentid`,`uid`,`fid`,`content`,`time`) values (1000001,1000011,1000004,'好好吃','2016-10-07 10:53:09'),(1000002,1000005,1000004,'看起来不错','2016-10-07 15:07:33'),(1000003,1000008,1000004,'确实啊','2016-10-01 15:07:37'),(1000004,1000008,1000004,'哈哈哈哈哈哈','2016-10-07 19:48:54'),(1000005,1000008,1000004,'啦啦啦','2016-10-07 20:01:45'),(1000006,1000008,1000004,'大螃蟹好肥','2016-10-07 20:04:32'),(1000007,1000005,1000005,'欢迎评论我的葱油面','2016-10-09 14:23:17'),(1000008,1000005,1000005,'欢迎评论我的葱油面','2016-10-09 14:23:23'),(1000009,1000005,1000005,'哈哈哈','2016-10-09 14:27:02'),(1000010,1000005,1000005,'啦啦啦啦','2016-10-09 14:29:57'),(1000011,1000005,1000005,'评论一次','2016-10-09 14:30:56'),(1000012,1000002,1000006,'看起来好好吃','2016-10-09 19:41:14'),(1000013,1000011,1000009,'你好','2016-10-09 21:33:51'),(1000014,1000011,1000008,'哈哈啊哈','2016-10-11 19:57:32');

/*Table structure for table `menulike` */

DROP TABLE IF EXISTS `menulike`;

CREATE TABLE `menulike` (
  `likeid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL,
  `id` int(11) DEFAULT NULL,
  PRIMARY KEY (`likeid`),
  KEY `uid` (`uid`),
  KEY `fid` (`id`),
  CONSTRAINT `menulike_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`),
  CONSTRAINT `menulike_ibfk_2` FOREIGN KEY (`id`) REFERENCES `foodmenu` (`fid`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

/*Data for the table `menulike` */

insert  into `menulike`(`likeid`,`uid`,`id`) values (5,1000008,1000004),(6,1000002,1000007),(9,1000011,1000009),(12,1000011,1000008),(24,1000011,1000004);

/*Table structure for table `menureply` */

DROP TABLE IF EXISTS `menureply`;

CREATE TABLE `menureply` (
  `replyid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `commentid` int(11) DEFAULT NULL,
  `content` varchar(600) DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`replyid`),
  KEY `commentid` (`commentid`),
  KEY `uid` (`uid`),
  CONSTRAINT `menureply_ibfk_1` FOREIGN KEY (`commentid`) REFERENCES `menucomment` (`commentid`),
  CONSTRAINT `menureply_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `menureply` */

insert  into `menureply`(`replyid`,`uid`,`commentid`,`content`,`time`) values (1,1000005,1000006,'哈哈哈','2016-10-11 21:14:36'),(2,1000005,1000002,'6666','2016-10-11 21:15:24'),(3,1000005,1000001,'真的吗','2016-10-11 21:15:36'),(4,1000005,1000006,'我也想吃','2016-10-11 21:15:58'),(5,1000005,1000006,'啊阿里','2016-10-11 21:18:23'),(6,1000005,1000004,'六六六','2016-10-11 21:18:30');

/*Table structure for table `moodanswer` */

DROP TABLE IF EXISTS `moodanswer`;

CREATE TABLE `moodanswer` (
  `answerid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL,
  `moodid` int(11) DEFAULT NULL,
  `answer` varchar(100) DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`answerid`),
  KEY `uid` (`uid`),
  KEY `moodid` (`moodid`),
  CONSTRAINT `moodanswer_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`),
  CONSTRAINT `moodanswer_ibfk_2` FOREIGN KEY (`moodid`) REFERENCES `foodmood` (`moodid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `moodanswer` */

/*Table structure for table `moodlike` */

DROP TABLE IF EXISTS `moodlike`;

CREATE TABLE `moodlike` (
  `likeid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL,
  `id` int(11) DEFAULT NULL,
  PRIMARY KEY (`likeid`),
  KEY `uid` (`uid`),
  KEY `moodid` (`id`),
  CONSTRAINT `moodlike_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`),
  CONSTRAINT `moodlike_ibfk_2` FOREIGN KEY (`id`) REFERENCES `foodmood` (`moodid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `moodlike` */

/*Table structure for table `subdivide` */

DROP TABLE IF EXISTS `subdivide`;

CREATE TABLE `subdivide` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `sname` varchar(30) NOT NULL,
  PRIMARY KEY (`sid`),
  KEY `cid` (`cid`),
  CONSTRAINT `subdivide_ibfk_1` FOREIGN KEY (`cid`) REFERENCES `classify` (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=162 DEFAULT CHARSET=utf8;

/*Data for the table `subdivide` */

insert  into `subdivide`(`sid`,`cid`,`sname`) values (100,11,'湘菜'),(101,11,'川菜'),(102,11,'粤菜'),(103,11,'浙菜'),(104,11,'鲁菜'),(105,11,'东北菜'),(106,11,'香港美食'),(107,11,'澳门美食'),(108,11,'台湾美食'),(109,11,'西北菜'),(110,11,'泰国菜'),(111,11,'英国菜'),(112,11,'意大利菜'),(113,11,'法国菜'),(114,10,'家常菜'),(115,10,'素菜'),(116,10,'凉菜'),(117,10,'下饭菜'),(118,10,'面食'),(119,10,'粥'),(120,10,'糕点'),(121,10,'甜点'),(122,10,'海鲜'),(123,10,'荤菜'),(124,10,'私房菜'),(125,10,'汤'),(126,10,'腌制'),(127,12,'饼'),(128,12,'馒头'),(129,12,'包子'),(130,12,'炒饭'),(131,12,'盖浇饭'),(132,12,'面条'),(133,12,'汉堡'),(134,12,'汤圆'),(135,12,'米线'),(136,12,'饺子'),(137,12,'煲仔饭'),(138,13,'清淡'),(139,13,'麻辣'),(140,13,'甜'),(141,13,'酸辣'),(142,13,'咸鲜'),(143,13,'孜然'),(144,13,'糖醋'),(145,13,'五香'),(146,13,'芝士'),(147,13,'番茄'),(148,13,'酸甜'),(149,13,'剁椒'),(150,13,'酸'),(151,13,'饼果味'),(152,14,'早餐'),(153,14,'中餐'),(154,14,'晚餐'),(155,14,'下午茶'),(156,14,'宵夜'),(157,14,'早午餐'),(158,14,'朋友聚餐'),(159,14,'二人世界'),(160,14,'深夜食堂'),(161,14,'单身菜谱');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `uname` varchar(20) NOT NULL,
  `telephone` varchar(11) NOT NULL,
  `password` varchar(100) NOT NULL,
  `sex` varchar(20) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `icon` varchar(100) DEFAULT 'images/logo.png',
  `userinfo` varchar(300) DEFAULT '个人简介暂无',
  `birthday` date NOT NULL,
  `kinds` varchar(500) NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `uname` (`uname`),
  UNIQUE KEY `telephone` (`telephone`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1000015 DEFAULT CHARSET=utf8;

/*Data for the table `users` */

insert  into `users`(`uid`,`uname`,`telephone`,`password`,`sex`,`email`,`icon`,`userinfo`,`birthday`,`kinds`) values (1000002,'熊猫哥哥','18673079459','e10adc3949ba59abbe56e057f20f883e','男','472646376@qq.com','/images/pic//熊猫哥哥.jpg','个人简介暂无','1995-12-14','114 家常菜,100 湘菜'),(1000003,'123123','13211111112','4297f44b13955235245b2497399d7a93','男','111@qq.com','/images/pic//123123.jpg','个人简介暂无','2016-10-03','114 家常菜,100 湘菜'),(1000004,'12312','13278945612','4297f44b13955235245b2497399d7a93','男','4572@qq.com','/images/pic/12312.jpg','个人简介暂无','1995-12-14','114 家常菜,100 湘菜'),(1000005,'熊猫大叔','13278945789','4297f44b13955235245b2497399d7a93','男','asdf@qq.com','/images/pic/熊猫大叔.jpg','个人简介暂无','1995-12-14','114 家常菜,100 湘菜'),(1000006,'熊猫大哥','13278941234','200820e3227815ed1756a6b531e7e0d2','女','zxcv@qq.com','/images/pic/熊猫大哥.jpg','个人简介暂无','1995-12-12','114 家常菜,100 湘菜'),(1000007,'熊猫叔叔','13278941231','4297f44b13955235245b2497399d7a93','男','wwcv@qq.com','/images/pic/熊猫叔叔.jpg','个人简介暂无','1995-12-13','114 家常菜,100 湘菜'),(1000008,'qq123','18673014569','e10adc3949ba59abbe56e057f20f883e','男','qwesd@qq.com','/images/pic/qq123.png','个人简介暂无','2016-10-01','114 家常菜,100 湘菜'),(1000009,'qwezxc','18612347895','4297f44b13955235245b2497399d7a93','男','jkl@qq.com','/images/logo.png','个人简介暂无','2016-10-01','114 家常菜,100 湘菜'),(1000010,'098','15578953215','e10adc3949ba59abbe56e057f20f883e','男','yui@qq.com','/images/pic/098.jpg','个人简介暂无','1998-12-11','114 家常菜,100 湘菜'),(1000011,'123','13578961254','e10adc3949ba59abbe56e057f20f883e','男','455p@qq.com','/images/logo.png','个人简介暂无','2016-10-01','114 家常菜,100 湘菜'),(1000014,'sfq','18621345678','4297f44b13955235245b2497399d7a93','男','qwesdfxcvb@11.com','/images/pic//sfq.jpg','个人简介暂无','1995-12-14','114 家常菜,100 湘菜');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
