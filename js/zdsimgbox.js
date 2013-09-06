/**
 * zdsimgbox.js Document 图片轮显
 *
 * @author	DonYue Team
 * @version	$Revision: 0.01 $
 * @copyright	Copyright (C) 2006-2011 DonYue Team
 * @package	DonYue
 */

/**
 * 示例:
 * 
DYIMGBOX.show({
	imgSrc:"upload/small/5_110114134820_1.png|upload/small/002.jpg|upload/small/003.jpg",
	imgLink:"views.php?id=1|views.php?id=1|views.php?id=1",
	imgTitle:"标题1|标题2|标题"
});
 * 
 */
(function(){
	var DYIMGBOX={};
	DYIMGBOX.init=function(){
		document.write('<div id="DYIMGBOX" style="position:absolute;width:'+DYIMGBOX.options.width+'px; height:'+DYIMGBOX.options.height+'px;overflow:hidden;"><div id="DYIMG_Pic" style="text-align:center;"></div><div id="DYIMG_Title" style=" position:absolute; left:'+DYIMGBOX.options.titleLeft+'px;bottom:'+DYIMGBOX.options.titleBottom+'px;"></div><div id="DYIMG_Link" style=" position:absolute; right:'+DYIMGBOX.options.btnBoxRight+'px; bottom:'+DYIMGBOX.options.btnBoxBottom+'px;"></div></div>');
		DYIMGBOX.imgsIndex=-1;
		DYIMGBOX.gc=null;
		DYIMGBOX.sPo=null;
		DYIMGBOX.gi=0;
		DYIMGBOX.objImgBox=$("DYIMG_Pic");
		DYIMGBOX.objLink=$("DYIMG_Link");
		DYIMGBOX.allImgs=DYIMGBOX.options.imgSrc.split("|");
		DYIMGBOX.imgLinks=DYIMGBOX.options.imgLink.split("|");
		DYIMGBOX.imgTitles=DYIMGBOX.options.imgTitle.split("|");
		DYIMGBOX.imgsCount=DYIMGBOX.allImgs.length;
		//根据图片数量初始化按钮
		for(i=0;i<DYIMGBOX.imgsCount;i++){
			DYIMGBOX.objLink.innerHTML+='<a id="DYIMG_a_'+i+'" style="float:left; font-family:Arial;font-size:'+DYIMGBOX.options.btnFontSize+'px;margin-left:2px; color:'+DYIMGBOX.options.btnFontColor+';text-decoration:none;width:'+DYIMGBOX.options.btnWidth+'px;height:'+DYIMGBOX.options.btnHeight+'px; text-align:center;line-height:'+DYIMGBOX.options.btnHeight+'px;" href="javascript:void(0);">'+(i+1)+'</a>'; //background:url(images/seicon.png) on-repeat;background-color:'+DYIMGBOX.options.btnBgColor+'; border:#efefef 1px solid;
		}
		for(i=0;i<DYIMGBOX.imgsCount;i++){
			var o=$("DYIMG_a_"+i);
			o.onmouseover=function(){
				v=parseInt(this.innerHTML)-1;
				if(v!=DYIMGBOX.imgsIndex){
					DYIMGBOX.imgsIndex=v;
					DYIMGBOX.rColorBtn();
					DYIMGBOX.sImg();
				}
				clearInterval(DYIMGBOX.gc); 
			};
			if(DYIMGBOX.imgsCount>1)o.onmouseout=function(){DYIMGBOX.gc=setInterval(DYIMGBOX.changeImg, DYIMGBOX.options.changeTime*1000)};
		}
	};
	
	DYIMGBOX.changeImg=function(){
		DYIMGBOX.imgsIndex++;
		if(DYIMGBOX.imgsIndex==DYIMGBOX.imgsCount)DYIMGBOX.imgsIndex=0;
		DYIMGBOX.rColorBtn();
		DYIMGBOX.sImg();
	}
	DYIMGBOX.rColorBtn=function(){
		for(i=0;i<DYIMGBOX.imgsCount;i++){
			b=$("DYIMG_a_"+i);
			//b.style.backgroundColor=DYIMGBOX.options.btnBgColor;
			//b.style.color=DYIMGBOX.options.btnFontColor;
			b.style.backgroundImage = "url(images/seicon.png)";// on-repeat
		}
		c=$("DYIMG_a_"+DYIMGBOX.imgsIndex);
		//c.style.backgroundColor=DYIMGBOX.options.btnMouseOverBgColor;
		//c.style.color=DYIMGBOX.options.btnMouseOverFontColor;
		c.style.backgroundImage = "url(images/goicon.png)";// on-repeat
		
		$("DYIMG_Title").innerHTML=(DYIMGBOX.imgTitles[DYIMGBOX.imgsIndex])?DYIMGBOX.imgTitles[DYIMGBOX.imgsIndex]:"";
	}
	DYIMGBOX.sImg=function(){
		if(DYIMGBOX.sPo!=null)try{clearInterval(DYIMGBOX.sPo)}catch(e){};
		//此处可添加图片预加载的程序来处理图片下载慢时显示相关提示
		if(DYIMGBOX.imgLinks.length>0 && DYIMGBOX.imgsIndex<DYIMGBOX.imgLinks.length && DYIMGBOX.imgLinks[DYIMGBOX.imgsIndex]!=""){
			DYIMGBOX.objImgBox.innerHTML="<a href='"+DYIMGBOX.imgLinks[DYIMGBOX.imgsIndex]+"' target='_blank'><img style='border:none;'"+(DYIMGBOX.options.pullingImg?" width='"+DYIMGBOX.options.width+"' height='"+DYIMGBOX.options.height+"'":"")+" src='"+DYIMGBOX.allImgs[DYIMGBOX.imgsIndex]+"' /></a>";
		}else{
			DYIMGBOX.objImgBox.innerHTML="<img style='border:none;'"+(DYIMGBOX.options.pullingImg?" width='"+DYIMGBOX.options.width+"' height='"+DYIMGBOX.options.height+"'":"")+" src='"+DYIMGBOX.allImgs[DYIMGBOX.imgsIndex]+"' />";
		} 
		DYIMGBOX.sPo=setInterval(DYIMGBOX.gPo,50);
	}
	DYIMGBOX.gPo=function (){
		DYIMGBOX.gi+=5;
		if(DYIMGBOX.gi==100){
			DYIMGBOX.gi=10;
			clearInterval(DYIMGBOX.sPo);
			DYIMGBOX.sPo=null;
		}else{
			DYIMGBOX.objImgBox.style.filter="alpha(opacity="+DYIMGBOX.gi+");";
			DYIMGBOX.objImgBox.style.opacity=DYIMGBOX.gi/100;
		}
	}
	//设置默认属性
	DYIMGBOX.SetOptions = function(options){
		DYIMGBOX.options = {//默认值
			imgSrc:					"",
			imgLink:				"",
			imgTitle:				"",
			width:					300,//内容区域大小
			height:					206,
			changeTime:				5,//自动切换图片(s)
			pullingImg:				true,//拉伸图片
			titleLeft:				5,
			titleBottom:			10,
			btnWidth:				25,
			btnHeight:				22,
			btnBoxRight:			10,
			btnBoxBottom:			10,
			btnFontSize:			10,
			btnBgColor:				"#666",
			btnMouseOverBgColor:	"#939",
			btnFontColor:			"#fff",
			btnMouseOverFontColor:	"#fff"
		};
		DYIMGBOX.Extend(DYIMGBOX.options, options || {});
	};
	
	DYIMGBOX.Extend = function(destination, source){
		for(var property in source){
			destination[property] = source[property];
		}
	};
	
	DYIMGBOX.show=function(options){
		DYIMGBOX.SetOptions(options);
		DYIMGBOX.init();
		DYIMGBOX.changeImg();
		if(DYIMGBOX.imgsCount>1)DYIMGBOX.gc=setInterval(DYIMGBOX.changeImg, DYIMGBOX.options.changeTime*1000);
	};
	if(window.DYIMGBOX === undefined) window.DYIMGBOX = DYIMGBOX;
})();