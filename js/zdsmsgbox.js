/**
 * zdsmsgbox.js Document 右下角浮动窗口
 *
 * @author	DonYue Team
 * @version	$Revision: 0.01 $
 * @copyright	Copyright (C) 2006-2011 DonYue Team
 * @package	DonYue
 */


/**
 * 示例:
 * 
DYMSGBOX.Show('<img border="0" align="absmiddle" alt="loading..." src="images/loading.gif"> <span style="line-height:20px; color:blue; font-weight:bold;">数据处理中...</span>',{
	title:'版本信息'
});
 * 
 */
(function(){
	var DYMSGBOX={};
	
	//初始化
	DYMSGBOX.init=function(){
		if(!isdefbyid("zdsmsgbox")){
			DYMSGBOX.dybox_body=document.createElement("div");
			DYMSGBOX.dybox_body.id="zdsmsgbox";
			document.body.appendChild(DYMSGBOX.dybox_body);
		}else{
			DYMSGBOX.dybox_body=$("zdsmsgbox");
		}
		DYMSGBOX.dybox_body.style.display="none";
		DYMSGBOX.dybox_body.style.zIndex=DYMSGBOX.options.zIndex;
		
		var html='<div class="msgHead"><div class="msgTitle" id="msgTitle">'+DYMSGBOX.options.title+'</div><div class="msgButton" id="msgTop"><span class="msgBtn msgClose" id="msgClosevod"></span><span class="msgBtn msgShow" id="msgShowvod" style="display:none"></span><span class="msgBtn msgHide" id="msgHidevod"></span></div></div><div class="msgContent" id="msgContent">'+DYMSGBOX.content+'</div></div>';
		DYMSGBOX.dybox_body.innerHTML=html;
		
		$('msgShowvod').onclick = DYMSGBOX.Display;
		$('msgHidevod').onclick = DYMSGBOX.Hide;
		$('msgClosevod').onclick = DYMSGBOX.Close;
	};
	
	//设置默认属性
	DYMSGBOX.SetOptions = function(options){
		//默认值
		DYMSGBOX.options = {
			closeTime:	8,//自动最小化的时间(s), 为0时将不再自动关闭
			zIndex:		999,
			title:		'提示信息'
		};
		DYMSGBOX.Extend(DYMSGBOX.options, options || {});
	};
	DYMSGBOX.Extend = function(destination, source){
		for(var property in source) destination[property] = source[property];
	};
	
	//关闭窗口
	DYMSGBOX.Close=function(){
		DYMSGBOX.dybox_body.style.display = 'none';
	};
	
	//最小化
	DYMSGBOX.Hide=function(){
		DYMSGBOX.dybox_body.style.width = 218+'px';
		DYMSGBOX.dybox_body.style.height = 29+'px';
		DYMSGBOX.dybox_body.className = 'zdsmsgbox zdsmsgbox_hide';
		$('msgHidevod').style.display = 'none';
		$('msgShowvod').style.display = '';
		$('msgContent').style.display = 'none';
	}
	
	//最大化
	DYMSGBOX.Display=function(){
		DYMSGBOX.dybox_body.style.width = 342+'px';
		DYMSGBOX.dybox_body.style.height = 229+'px';
		DYMSGBOX.dybox_body.className = 'zdsmsgbox zdsmsgbox_show';
		$('msgShowvod').style.display = 'none';
		$('msgHidevod').style.display = '';
		$('msgContent').style.display = '';
		DYMSGBOX.dybox_body.style.display = '';
	};
	
	DYMSGBOX.Show=function(html, options){
		DYMSGBOX.content=html;
		DYMSGBOX.SetOptions(options);
		DYMSGBOX.init();
		DYMSGBOX.Display();
		if(DYMSGBOX.options.closeTime > 0) setTimeout('DYMSGBOX.Hide()', DYMSGBOX.options.closeTime*1000);
	};
	
	//修改标题
	DYMSGBOX.SetTitle=function(v){
		DYMSGBOX.options.title=v;
		if(DYMSGBOX.options.have_top && isdefbyid('msgTitle')) $('msgTitle').innerHTML=v;
	};
	
	//刷新显示的内容
	DYMSGBOX.SetContent=function(html){
		DYMSGBOX.content=html;
		if(isdefbyid('msgContent')) $('msgContent').innerHTML=DYMSGBOX.content;
	};
	
	$=function(id){
		return document.getElementById(id);
	};
	if(window.DYMSGBOX === undefined) window.DYMSGBOX = DYMSGBOX;
})();