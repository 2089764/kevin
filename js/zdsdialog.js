/**
 * zdsdialog.js Document 
 *
 * @author	DonYue Team
 * @version	$Revision: 0.01 $
 * @copyright	Copyright (C) 2006-2011 DonYue Team
 * @package	DonYue
 */

/*
function test(){
	dybox=new ZdsDialog(
		"<form name=\"form1\" id=\"form1\" method=\"POST\" action=\"upload.php\" target=\"post_frame\" enctype=\"multipart/form-data\">\
      <iframe name=\"post_frame\" id=\"post_frame\" style=\"display:none;\" mce_style=\"display:none;\"></iframe>\
      <input type=\"file\" name=\"fileToUpload\" id=\"fileToUpload\">\
      <span id=\"fileToUploadTips\"></span>\
	  </form>",{
		width:			340,
		height:			130,
		onOKClick:		function(){$("form1").submit();},
		onCancelClick:	function(){dybox.Close();},
		onCloseClick:	function(){dybox.Close();},
		onDragFun:		function(event){dybox.dragFun(event)}
	});
	dybox.Show();
}
*/
function ZdsDialog(content, options){
	this.content=content;
	this.arrayPageSize = getPageSize();
	this.init=function(){
		if(!isdefbyid("dywinbox")){
			this.dybox_bg=document.createElement("div");
			this.dybox_bg.className="jxbg";
			this.dybox_bg.id="dywinby";
			this.dybox_bg.style.zIndex=998;
			if(is_ie){
				this.dybox_bg.style.filter="alpha(opacity=30)";
				this.dybox_bg.style.zoom=1;
				if(is_ie6){
					this.dybox_bg.style.width=this.arrayPageSize[0];
					this.dybox_bg.style.height=this.arrayPageSize[1];
				}
			}else{
				this.dybox_bg.style.opacity=0.3;
			}
			this.dybox_bg.style.display="none";
			document.body.appendChild(this.dybox_bg);
			
			this.dybox_body=document.createElement("div");
			this.dybox_body.className="jxbox";
			this.dybox_body.id="dywinbox";
			this.dybox_body.style.zIndex=999;
			this.dybox_body.style.display="none";
			this.dybox_body.style.width=(this.options.width+10)+"px";
			this.dybox_body.style.height=(this.options.height+48)+"px";
			document.body.appendChild(this.dybox_body);
		}else{
			this.dybox_bg=$("dywinby");
			this.dybox_body=$("dywinbox");
		}

		var html="\
<div class=\"border\" id=\"winborder\">\
  <div class=\"title\" id=\"wintitle\""+(this.options.drag?" unselectable=\"on\" style=\"-moz-user-select: none; cursor:move;\"":"")+">文件上传</div>\
  <span class=\"close\" title=\"关闭\" id=\"winclose\"></span>\
  <div class=\"upload\" id=\"wincontent\">"+this.content+"</div>\
  <div class=\"btndiv\">\
    <input type=\"button\" id=\"butok\" value=\"确定\">\
    <input type=\"button\" id=\"butcancel\" value=\"取消\">\
  </div>\
</div>";
  
		this.dybox_body.innerHTML=html;
		this.dybox_body.style.top = ((this.arrayPageSize[3] - this.options.height) / 2) + 'px';
		this.dybox_body.style.left = ((this.arrayPageSize[0] - this.options.width) / 2) + 'px';
		this.wincontent=$("wincontent");
		this.wincontent.style.height=this.options.height+"px";
		this.wincontent.style.width=this.options.width+"px";
		$("winclose").onclick=this.options.onCloseClick;
		$("butcancel").onclick=this.options.onCancelClick;
		$("butok").onclick=this.options.onOKClick;
		if(this.options.drag)$("wintitle").onmousedown=this.options.onDragFun;
	}
	this.Show=function(){
		this.dybox_bg.style.display="block";
		this.dybox_body.style.display="block";
	}
	this.Close=function(){
		this.dybox_bg.style.display="none";
		this.dybox_body.style.display="none";
		this.dybox_body.innerHTML="";
	};
	
	//设置默认属性
	this.SetOptions = function(options){
		this.options = {//默认值
			width:			300,//内容区域大小
			height:			120,
			drag:			true,//是否能够拖拉移动
			onOKClick:		function(){},
			onCancelClick:	function(){},
			onCloseClick:	function(){},//右上角的关闭按钮
			onDragFun:		function(){}//实现拖动的响应函数
		};
		Extend(this.options, options || {});
	};
	
	this.dragFun=function(a){
		var o=$("dywinbox");
		var d=document;
		if(!a)a=window.event;
		var X=a.pageX?a.pageX:a.clientX;
		var Y=a.pageY?a.pageY:a.clientY;
		if(o.setCapture) o.setCapture();
		else if(window.captureEvents) window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		var backData = {x : (X-parseInt(o.style.left)), y : (Y-parseInt(o.style.top))};
		d.onmousemove=function(a){
			if(!a)a=window.event;
			X=a.pageX?a.pageX:a.clientX;
			Y=a.pageY?a.pageY:a.clientY;
			o.style.left=(X-backData.x)+"px";
			o.style.top=(Y-backData.y)+"px";
		};
		d.onmouseup=function(a){
			if(!a)a=window.event;
			if(o.releaseCapture) o.releaseCapture();
			else if(window.captureEvents) window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
			d.onmousemove=null;
			d.onmouseup=null;
			X=a.pageX?a.pageX:a.clientX;
			Y=a.pageY?a.pageY:a.clientY;
			if(!document.body.pageWidth)document.body.pageWidth=document.body.clientWidth;
			if(!document.body.pageHeight)document.body.pageHeight=document.body.clientHeight;
			if(X < 1 || Y < 1 || X > document.body.pageWidth || Y > document.body.pageHeight){
				o.style.left=(X-backData.x)+"px";
				o.style.top=(Y-backData.y)+"px";
			}
		};
	};
	Extend = function(destination, source){
		for(var property in source){
			destination[property] = source[property];
		}
	};
	this.SetOptions(options);
	this.init();
}