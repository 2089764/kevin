/**
 * zdshint.js Document 鼠标提示框控件
 *
 * @author	DonYue Team
 * @version	$Revision: 1.03 $
 * @copyright	Copyright (C) 2006-2011 DonYue Team
 * @package	DonYue
 */

//<a href="#" class="dyhint" hint="my hint" hintwidth="100px" hintheight="50px">show hint</a>
//DYHINT.init();

(function(){
	var DYHINT={};
	var iecompattest = (document.compatMode && document.compatMode!="BackCompat") ? document.documentElement : document.body;
	DYHINT.scrollTop = is_ie6||is_ie7?iecompattest.scrollTop:0;
	DYHINT.scrollLeft = is_ie6||is_ie7?iecompattest.scrollLeft:0;
		
	function $(id){
		return (typeof id=='object')?id:document.getElementById(id);
	}

	DYHINT.init=function(options){
		DYHINT.initHint();
		DYHINT.SetOptions(options);
		ol=$c(DYHINT.options.showHintClass);
		for(k=0,l=ol.length; k<l; k++){
			ol[k].onmouseover=DYHINT.ShowHint;
			ol[k].onmouseout=DYHINT.HideHint;
			if(DYHINT.options.moveWithMouse)ol[k].onmousemove=DYHINT.moveWithMouse;
		}
	};
	DYHINT.moveWithMouse=function(e){
		var o=MouseX=MouseY=null;
		if(e){
			o = e.target
			MouseX=e.pageX;
			MouseY=e.pageY;
		}else{
			o = window.event.srcElement
			MouseX=event.x;
			MouseY=event.y;
		}
		DYHINT.divblock.style.left=((DYHINT.w-DYHINT.scrollLeft-MouseX>DYHINT.divblock.offsetWidth)?(MouseX+DYHINT.options.horizontal_offset+DYHINT.scrollLeft):(MouseX-DYHINT.options.horizontal_offset+DYHINT.scrollLeft-DYHINT.divblock.offsetWidth))+'px';
		DYHINT.divblock.style.top=((DYHINT.h-DYHINT.scrollTop-MouseY>DYHINT.divblock.offsetHeight)?(MouseY+DYHINT.options.vertical_offset+DYHINT.scrollTop):(MouseY-DYHINT.options.vertical_offset+DYHINT.scrollTop-DYHINT.divblock.offsetHeight))+'px';
	}
	
	DYHINT.getWH=function(obj){
		DYHINT.w=DYHINT.h=0;
		if(document.all && !window.opera){
			DYHINT.w=iecompattest.scrollLeft+iecompattest.clientWidth-30;
			DYHINT.h=iecompattest.scrollTop+iecompattest.clientHeight-15;
		}else{
			DYHINT.w=window.pageXOffset+window.innerWidth-40;
			DYHINT.h=window.pageYOffset+window.innerHeight-18;
		}
	}
	
	DYHINT.setPoint=function(obj){
		tmp_obj=obj;
		var x=tmp_obj.offsetLeft;
		var y=tmp_obj.offsetTop;
		while(tmp_obj=tmp_obj.offsetParent){
			x+=tmp_obj.offsetLeft;
			y+=tmp_obj.offsetTop;
		}
		DYHINT.divblock.style.left=((DYHINT.w-x-obj.offsetWidth>DYHINT.divblock.offsetWidth)?(x+obj.offsetWidth+DYHINT.options.horizontal_offset):(x-DYHINT.divblock.offsetWidth-DYHINT.options.horizontal_offset))+'px';
		DYHINT.divblock.style.top=((DYHINT.h-y>DYHINT.divblock.offsetHeight)?y+DYHINT.options.vertical_offset:(y+obj.offsetHeight-DYHINT.divblock.offsetHeight-DYHINT.options.vertical_offset))+'px';
	}
	
	//隐藏
	DYHINT.HideHint = function(e){
		DYHINT.divblock.innerHTML='';
		DYHINT.divblock.style.display='none';
	};
	
	//显示
	DYHINT.ShowHint = function(e){
		e = e || window.event;
		o = e.target || e.srcElement;
		hint = o.getAttribute('hint');
		if(hint==null || hint=='')return false;
		width=o.getAttribute('hintwidth');
		if(width!=null && width!=''){
			DYHINT.divblock.style.width=width;
		}else{
			DYHINT.divblock.style.width='100px';
		}
		height=o.getAttribute('hintheight');
		if(height!=null && height!=''){
			DYHINT.divblock.style.height=height;
		}
		DYHINT.divblock.innerHTML=hint;
		DYHINT.getWH();
		DYHINT.scrollTop = is_ie6||is_ie7?iecompattest.scrollTop:0;
		DYHINT.scrollLeft = is_ie6||is_ie7?iecompattest.scrollLeft:0;
		DYHINT.divblock.style.display='';

		if(!DYHINT.options.moveWithMouse)DYHINT.setPoint(o);
	};
	
	DYHINT.initHint = function(){
		DYHINT.divblock=document.createElement("div");
		DYHINT.divblock.setAttribute("id", "dyhint_box");
		DYHINT.divblock.style.display='none';
		document.body.appendChild(DYHINT.divblock);
	};
	
	//设置默认属性
	DYHINT.SetOptions = function(options){
		DYHINT.options = {//默认值
			moveWithMouse		:true,//鼠标跟随
			showHintClass		:'dyhint',//显示提示信息的类名
			horizontal_offset	:5,//横向间隔
			vertical_offset		:5,//纵向间隔
			fun					:null//回调函数
		};
		DYHINT.Extend(DYHINT.options, options || {});
	};
	
	DYHINT.Extend = function(destination, source){
		for(var property in source){
			destination[property] = source[property];
		}
	};

	if(window.DYHINT === undefined) window.DYHINT = DYHINT;
})();