/**
 * zdsinfobox.js Document 消息提示窗口,可以作为对话框使用
 *
 * @author	DonYue Team
 * @version	$Revision: 0.01 $
 * @copyright	Copyright (C) 2006-2011 DonYue Team
 * @package	DonYue
 */

/**
 * 示例:
 * 
DYBOX.show('<img border="0" align="absmiddle" alt="loading..." src="images/loading.gif"> <span style="line-height:20px; color:blue; font-weight:bold;">数据处理中...</span>',{
	height:	20,
	width:	120,
	fixtype:2,
	top:	5,
	right:	20
});
 * 
 */
(function(){
	var DYBOX={};
	DYBOX.init=function(){
		DYBOX.arrayPageSize=getPageSize();
		DYBOX.arrayPageScroll=getPageScroll();
		if(!isdefbyid("zdsinfobox")){
			if(DYBOX.options.shield){
				DYBOX.initBG();
			}else{
				if(isdefbyid('zdsinfobg'))$('zdsinfobg').style.display="none";
			}
			
			DYBOX.dybox_body=document.createElement("div");
			DYBOX.dybox_body.className="zdsinfobox";
			DYBOX.dybox_body.id="zdsinfobox";
			document.body.appendChild(DYBOX.dybox_body);
		}else{
			if(DYBOX.options.shield)DYBOX.dybox_bg=$("zdsinfobg");
			DYBOX.dybox_body=$("zdsinfobox");
			
			if(DYBOX.options.shield){
				if(!isdefbyid('zdsinfobg')){
					DYBOX.initBG();
				}
			}else{
				if(isdefbyid('zdsinfobg')){
					$('zdsinfobg').style.display="none";
				}
			}
		}
		
		DYBOX.dybox_body.style.display="none";
		DYBOX.dybox_body.style.zIndex=DYBOX.options.zIndex;
		
		var html='<div class="zdsinfo_body"'+(!DYBOX.options.have_top&&!DYBOX.options.have_button?' style="width:'+DYBOX.options.width+(DYBOX.options.width!='auto'?'px':'')+';height:'+DYBOX.options.height+(DYBOX.options.height!='auto'?'px':'')+';"':'')+'>';
		html+=DYBOX.options.have_top?'<div class="zdsinfo_top" id="zdsinfo_top"'+(DYBOX.options.canDrag?' style="cursor:move;"':'')+'><div class="zdsinfo_title" id="zdsinfo_title" style="width:'+(DYBOX.options.width-24)+'px;">'+DYBOX.options.title+'</div><div class="zdsinfo_close" id="zdsinfo_close" title="关闭" alt="关闭"></div></div>':'';
		html+=(DYBOX.options.have_top||DYBOX.options.have_button)?'<div id="zdsinfo_content" class="zdsinfo_content" style="width:'+DYBOX.options.width+(DYBOX.options.width!='auto'?'px':'')+';height:'+DYBOX.options.height+(DYBOX.options.height!='auto'?'px':'')+';">'+DYBOX.content+'</div>':DYBOX.content;
		html+=DYBOX.options.have_button&&(DYBOX.options.OKButton||DYBOX.options.CancelButton)?('<div class="zdsinfo_button" id="zdsinfo_button" style="width:'+DYBOX.options.width+(DYBOX.options.width!='auto'?'px':'')+';">'+(DYBOX.options.OKButton?'<input type="button" id="zdsinfo_butok" value="'+DYBOX.options.OKButtonText+'">':'')+(DYBOX.options.CancelButton?'<input type="button" id="zdsinfo_butcancel" value="'+DYBOX.options.CancelButtonText+'">':'')+'</div>'):'';
		html+='</div>';
		DYBOX.dybox_body.innerHTML=html;
		if(DYBOX.options.have_top && is_ie)$("zdsinfo_top").style.width=DYBOX.options.width+"px";
		if(DYBOX.options.have_button && is_ie6)$("zdsinfo_button").style.width=DYBOX.options.width+"px";
		
		switch(DYBOX.options.fixtype){
			case 0:
				DYBOX.dybox_body.style.top = ((DYBOX.arrayPageSize[3] - DYBOX.options.height) / 2) + 'px';
				DYBOX.dybox_body.style.left = ((DYBOX.arrayPageSize[0] - DYBOX.options.width) / 2) + 'px';
				break;
			case 1:
				DYBOX.dybox_body.style.top = DYBOX.options.top + 'px';
				DYBOX.dybox_body.style.left = DYBOX.options.left + 'px';
				break;
			case 2:
				DYBOX.dybox_body.style.top = DYBOX.options.top + 'px';
				DYBOX.dybox_body.style.left = (DYBOX.arrayPageSize[0]-DYBOX.options.right-DYBOX.options.width) + 'px';
				break;
			case 3:
				DYBOX.dybox_body.style.top = (DYBOX.arrayPageSize[3]-DYBOX.options.height-DYBOX.options.bottom) + 'px';
				DYBOX.dybox_body.style.left = (DYBOX.arrayPageSize[0]-DYBOX.options.right-DYBOX.options.width) + 'px';
				break;
			case 4:
				DYBOX.dybox_body.style.top = (DYBOX.arrayPageSize[3]-DYBOX.options.height-DYBOX.options.bottom) + 'px';
				DYBOX.dybox_body.style.left = DYBOX.options.left + 'px';
				break;
		}
		
		if(DYBOX.options.have_top && DYBOX.options.canDrag)$("zdsinfo_top").onmousedown=DYBOX.options.onDragFun;
		if(DYBOX.options.have_top)$("zdsinfo_close").onclick=DYBOX.options.onCloseClick;
		if(DYBOX.options.have_button) {
			if(DYBOX.options.OKButton)$("zdsinfo_butok").onclick = DYBOX.options.onOKClick;
			if(DYBOX.options.CancelButton)$("zdsinfo_butcancel").onclick = DYBOX.options.onCancelClick;
		}
		if(DYBOX.options.clickOtherClose) DYBOX.addDocumentEvent();//document.body.onclick = DYBOX.options.onCancelClick;
		DYBOX.dybox_body.onclick = function(e){DYBOX.stopBubble(e)};
	};
	
	//初始化背景div
	DYBOX.initBG = function(){
		DYBOX.dybox_bg=document.createElement("div");
		DYBOX.dybox_bg.className="zdsinfobg";
		DYBOX.dybox_bg.id="zdsinfobg";
		DYBOX.dybox_bg.style.zIndex=DYBOX.options.zIndex-1;
		if(is_ie){
			DYBOX.dybox_bg.style.filter="alpha(opacity=30)";
			DYBOX.dybox_bg.style.zoom=1;
			if(is_ie6){
				DYBOX.dybox_bg.style.width=DYBOX.arrayPageSize[0];
				DYBOX.dybox_bg.style.height=DYBOX.arrayPageSize[1];
			}
		}else{
			DYBOX.dybox_bg.style.opacity=0.3;
		}
		
		//filter:alpha(opacity=60);  /*支持 IE 浏览器*/
		//-moz-opacity:0.60; /*支持 FireFox 浏览器*/
		//opacity:0.60;  /*支持 Chrome, Opera, Safari 等浏览器*/

		DYBOX.dybox_bg.style.display="none";
		document.body.appendChild(DYBOX.dybox_bg);
	};
	
	//设置默认属性
	DYBOX.SetOptions = function(options){
		DYBOX.options = {//默认值
			width:			340,//内容区域大小
			height:			130,
			top:			0,//定位
			bottom:			0,
			left:			200,
			right:			0,
			fixtype:		0,//0:center,1:top/left,2:top/right,3:bottom/right,4:bottom/left;
			autoClose:		0,//自动关闭窗口,0:不自动关闭,1~:开启自动关闭,自动关闭的时间(秒)
			zIndex:			999,
			have_top:		false,
			title:			'提示信息',
			have_button:	false,
			canDrag:		false,//能否移动窗口
			shield:			false,//背景屏蔽
			clickOtherClose:false,//点击浏览器窗口的其他地方关闭窗口
			OKButton:		true,//在have_button=true的情况下是否显示 "确定" 按钮
			OKButtonText:	'确定',
			CancelButton:	true,//在have_button=true的情况下是否显示 "取消" 按钮
			CancelButtonText:'取消',
			onCloseClick:	DYBOX.Close,//右上角的关闭按钮
			onCancelClick:	DYBOX.Close,
			onOKClick:		DYBOX.Close,
			onDragFun:		DYBOX.dragFun
		};
		DYBOX.Extend(DYBOX.options, options || {});
	};
	
	DYBOX.Extend = function(destination, source){
		for(var property in source){
			destination[property] = source[property];
		}
	};
	
	DYBOX.Close=function(){
		if(isUndefined(DYBOX.options))return;
		if(DYBOX.options.shield)DYBOX.dybox_bg.style.display="none";
		DYBOX.dybox_body.style.display="none";
		DYBOX.dybox_body.innerHTML="";
		if(DYBOX.options.clickOtherClose) DYBOX.rmDocumentEvent();//document.body.onclick = DYBOX.options.onCancelClick;
	};
	
	DYBOX.addDocumentEvent = function(){
		if(document.addEventListener){
			document.addEventListener("click", DYBOX.Close, false);
		}else if(document.attachEvent){
			document.attachEvent("onclick", DYBOX.Close);
		}
	};
	
	DYBOX.rmDocumentEvent = function(){
		if(document.removeEventListener){
			document.removeEventListener("click", DYBOX.Close, false);  
		}else if(document.detachEvent){  
			document.detachEvent("onclick", DYBOX.Close);  
		}
	};
	
	DYBOX.dragFun=function(e){
		var o=$("zdsinfobox");
		var d=document;
		if(!e)e=window.event;
		var X=e.pageX?e.pageX:e.clientX;
		var Y=e.pageY?e.pageY:e.clientY;
		if(o.setCapture) o.setCapture();
		else if(window.captureEvents) window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		var backData = {x : (X-parseInt(o.style.left)), y : (Y-parseInt(o.style.top))};
		d.onmousemove=function(e){
			if(!e)e=window.event;
			X=e.pageX?e.pageX:e.clientX;
			Y=e.pageY?e.pageY:e.clientY;
			o.style.left=(X-backData.x)+"px";
			o.style.top=(Y-backData.y)+"px";
		};
		d.onmouseup=function(e){
			if(!e)e=window.event;
			if(o.releaseCapture) o.releaseCapture();
			else if(window.captureEvents) window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
			d.onmousemove=null;
			d.onmouseup=null;
			X=e.pageX?e.pageX:e.clientX;
			Y=e.pageY?e.pageY:e.clientY;
			if(!document.body.pageWidth)document.body.pageWidth=document.body.clientWidth;
			if(!document.body.pageHeight)document.body.pageHeight=document.body.clientHeight;
			if(X < 1 || Y < 1 || X > document.body.pageWidth || Y > document.body.pageHeight){
				o.style.left=(X-backData.x)+"px";
				o.style.top=(Y-backData.y)+"px";
			}
		};
	};
	
	DYBOX.show=function(html,options){
		DYBOX.content=html;
		DYBOX.SetOptions(options);
		DYBOX.init();
		DYBOX.dybox_body.style.display="block";
		if(DYBOX.options.shield)DYBOX.dybox_bg.style.display="block";
		if(DYBOX.options.autoClose > 0)DYBOX.timer=setTimeout("DYBOX.Close();", DYBOX.options.autoClose*1000);
	};
	
	DYBOX.stopBubble=function(e){
		if(window.event) window.event.cancelBubble = true;
		else e.stopPropagation();
	};
	//刷新显示的内容
	DYBOX.SetContent=function(html){
		DYBOX.content=html;
		if(isdefbyid('zdsinfo_content'))$('zdsinfo_content').innerHTML=DYBOX.content;
	};
	
	DYBOX.SetShowTop=function(v){
		if(isdefbyid('zdsinfo_top'))$('zdsinfo_top').style.display = v ? '' : 'none';
	};
	
	DYBOX.SetShowButton=function(v){
		if(isdefbyid('zdsinfo_button'))$('zdsinfo_button').style.display = v ? '' : 'none';
	};
	
	//修改对话框的高度
	DYBOX.SetHeight=function(v){
		DYBOX.options.height=v;
		if(!isdefbyid('zdsinfo_content'))return;
		$('zdsinfo_content').style.height=v+"px";
		
		switch(DYBOX.options.fixtype){
			case 0:
				DYBOX.dybox_body.style.top = ((DYBOX.arrayPageSize[3] - DYBOX.options.height) / 2 + (is_ie6?DYBOX.arrayPageScroll[1]:0)) + 'px';
				break;
			case 1:
				DYBOX.dybox_body.style.top = DYBOX.options.top + 'px';
				break;
			case 2:
				DYBOX.dybox_body.style.top = DYBOX.options.top + 'px';
				break;
			case 3:
				DYBOX.dybox_body.style.top = (DYBOX.arrayPageSize[3]-DYBOX.options.height-DYBOX.options.bottom) + 'px';
				break;
			case 4:
				DYBOX.dybox_body.style.top = (DYBOX.arrayPageSize[3]-DYBOX.options.height-DYBOX.options.bottom) + 'px';
				break;
		}
	};
	//修改对话框的宽度
	DYBOX.SetWidth=function(v){
		DYBOX.options.width=v;
		if(!isdefbyid('zdsinfo_content'))return;
		$('zdsinfo_content').style.width=v+"px";
		$('zdsinfo_top').style.width=v+"px";
		if(DYBOX.options.have_button&&(DYBOX.options.OKButton||DYBOX.options.CancelButton))$('zdsinfo_button').style.width=v+"px";
		
		switch(DYBOX.options.fixtype){
			case 0:
				DYBOX.dybox_body.style.left = ((DYBOX.arrayPageSize[0] - DYBOX.options.width) / 2) + 'px';
				break;
			case 1:
				DYBOX.dybox_body.style.left = DYBOX.options.left + 'px';
				break;
			case 2:
				DYBOX.dybox_body.style.left = (DYBOX.arrayPageSize[0]-DYBOX.options.right-DYBOX.options.width) + 'px';
				break;
			case 3:
				DYBOX.dybox_body.style.left = (DYBOX.arrayPageSize[0]-DYBOX.options.right-DYBOX.options.width) + 'px';
				break;
			case 4:
				DYBOX.dybox_body.style.left = DYBOX.options.left + 'px';
				break;
		}
	};
	//修改标题
	DYBOX.SetTitle=function(v){
		DYBOX.options.title=v;
		if(DYBOX.options.have_top && isdefbyid('zdsinfo_title'))$('zdsinfo_title').innerHTML=v;
	};
	
	//设置"确定"按钮的文字与响应事件
	//en: DYBOX.SetOKButInfo('测试',function(){alert('bb');});
	DYBOX.SetOKButInfo=function(v,fun){
		b=$("zdsinfo_butok");
		if(v.length<=0)b.style.display='none';
		else{
			b.value=v;
			b.onclick = fun;
			b.style.display='';
		}
	};
	//设置"取消"按钮的文字与响应事
	DYBOX.SetCancelButInfo=function(v,fun){
		b=$("zdsinfo_butcancel");
		if(v.length<=0)b.style.display='none';
		else{
			b.value=v;
			b.onclick = fun;
			b.style.display='';
		}
	};
	
	if(window.DYBOX === undefined) window.DYBOX = DYBOX;
})();
