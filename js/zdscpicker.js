/**
 * zdscpicker.js Document 
 *
 * @author	DonYue Team
 * @version	$Revision: 0.01 $
 * @copyright	Copyright (C) 2006-2011 DonYue Team
 * @package	DonYue
 * @date:	2007-9-1
 */

/*
	<script type="text/javascript" src="zdscpicker.js"></script>
	<input name="fontcolor" id="fontcolor" type="hidden" value="#ffffff" />
	<script language="javascript">
	var cp = new ZDSColorPicker("#ffffff");
	cp.render();
	cp.onSelect = function(colorstr){
		$("fontcolor").value=cp.get();
	}
	</script>
*/
/*
    <SCRIPT lang="JavaScript"><!--
	var cp = new ZDSColorPicker(defaultColor);
	cp.render();
	//--></SCRIPT>
   
	// or

	var cp = new ZDSColorPicker(defaultColor);
	str = cp.getHTML();
   
   
   ---------------------------------------------------
	var cp = new ZDSColorPicker(defaultColor);
   
	// Create new ColorPicker Object.
   
	str = cp.getHTML();			// get HTML for inserting this Pulldown;
	cp.render();				// equals to document.write(p.getHTML());
	cp.set(value);				// set value.
	cp.get();					// get value.
	cp.onSelect = function(colorstr){};		// invoked when selecting color. called when mouse clicked.
	cp.onChange = function(colorstr){};		// invoked when previewing color. called every time mouse moved.
   
   ---------------------------------------------------
*/
ZdsXPCOM.init = function(){
	if(ZdsXPCOM.inited) return;
	ZdsXPCOM.documentBodyOnClickOld = document.body.onclick;
	document.body.onclick = function(event){
		if(ZdsXPCOM.documentBodyOnClickOld) ZdsXPCOM.documentBodyOnClickOld();
		id="id5";
		if(ZdsXPCOM.popupblock == false && ZdsXPCOM.popup){
			ZdsXPCOM.popup.style.display = "none";
		}else{
			ZdsXPCOM.popupblock = false;
		}
	}
	ZdsXPCOM.inited = true;
}

ZdsXPCOM.popupblock;
ZdsXPCOM.onPopup = function(popup){
	if(popup){
		if(ZdsXPCOM.popup && ZdsXPCOM.popup != popup) ZdsXPCOM.popup.style.display = "none";
		ZdsXPCOM.popup = popup;
	}
	ZdsXPCOM.popupblock = true;
}

ZdsXPCOM.Enter		 = 13;
ZdsXPCOM.LeftArrow	 = 37;
ZdsXPCOM.UpArrow		 = 38;
ZdsXPCOM.RightArrow	 = 39;
ZdsXPCOM.DownArrow	 = 40;

function ZdsXPCOM(){}
function QrPoint(_x,_y){
	this.x = _x;
	this.y = _y;
}

function QrDimension(_width,_height){
	this.width = _width;
	this.height = _height;
}

ZdsXPCOM.isIE = function(){
	return window.ActiveXObject;
}

ZdsXPCOM.isImageFile = function(src){
	if(src.substring(src.lastIndexOf(".")).toLowerCase() == ".gif"
	  || src.substring(src.lastIndexOf(".")).toLowerCase() == ".jpg"
	  || src.substring(src.lastIndexOf(".")).toLowerCase() == ".bmp"
	  || src.substring(src.lastIndexOf(".")).toLowerCase() == ".jpeg"
	  || src.substring(src.lastIndexOf(".")).toLowerCase() == ".png"){
		return true;
	}else{
		return false;
	}
}

ZdsXPCOM.getEventKeyCode = function(e){
	if(ZdsXPCOM.isIE()){
		return event.keyCode;
	}else{
		return e.keyCode;
	}
}

ZdsXPCOM.onShift = function(e){
	if(ZdsXPCOM.isIE()) return event.shiftKey;
	else{
		return e.shiftKey;
	}
}


ZdsXPCOM.getMousePointForDrag = function(e){
	if(ZdsXPCOM.isIE()){
		return new QrPoint(event.clientX + document.body.scrollLeft,event.clientY + document.body.scrollTop);
	}else{
		return new QrPoint(e.clientX + document.body.scrollLeft,e.clientY + document.body.scrollTop);
	}
}

ZdsXPCOM.getMousePoint = function(e,div){
	if(div){
		var da = ZdsXPCOM.getMousePoint(e);
		var db = ZdsXPCOM.getDivPoint(div);
		return new QrPoint(da.x-db.x,da.y-db.y);
	}
	
	if(ZdsXPCOM.isIE()){
		var p = ZdsXPCOM.getDivPoint(event.srcElement);
		return new QrPoint(p.x+ event.offsetX,p.y + event.offsetY);
	}else{
		return new QrPoint(e.clientX + document.body.scrollLeft,e.clientY + document.body.scrollTop);
	}
}

ZdsXPCOM.setDivPoint = function(div, x, y){
	div.style.top  = y + "px";
	div.style.left = x + "px";
}

ZdsXPCOM.getDivPoint = function(div){
	if(div.style && (div.style.position == "absolute" || div.style.position == "relative")){
		return new QrPoint(div.offsetLeft+1, div.offsetTop+1);
	}else if(div.offsetParent){
		var d = ZdsXPCOM.getDivPoint(div.offsetParent);
		return new QrPoint(d.x+div.offsetLeft, d.y+div.offsetTop);
	}else{
		return new QrPoint(0,0);
	}
}

ZdsXPCOM.getDivSize = function(div){
	if(ZdsXPCOM.isIE()){
		return new QrDimension(div.offsetWidth,div.offsetHeight);
	}else{
		return new QrDimension(div.offsetWidth-2,div.offsetHeight-2);
	}
}

ZdsXPCOM.setDivSize = function(div, x, y){
	div.style.width  = x + "px";
	div.style.height = y + "px";
}

ZdsXPCOM.getBodySize = function(){
	return new QrDimension(document.body.clientWidth,document.body.clientHeight);
}

function ZDSColorPicker(_defaultColor){
	if(!_defaultColor) _defaultColor = "#FFFFFF";
	
	ZdsXPCOM.init();
	this.id = ZDSColorPicker.lastid++;
	this.defaultColor = _defaultColor;
	ZDSColorPicker.instanceMap["ZDSColorPicker"+this.id] = this;
}

ZDSColorPicker.prototype.getHTML = function(){
	var html = "<span class=\"QrComponent\" id=\"$pickerId\" onclick=\"javascript:void(ZDSColorPicker.popupPicker('$pickerId'));\"><img src=\"images/transparentpixel.gif\" width=\"1\" height=\"1\" align=\"absmiddle\" id=\"$pickerId#color\" style=\"width:36px;height:18px;border:1px inset gray;background-color:$defaultColor;cursor:pointer;\"/><a href=\"javascript:void('ZDSColorPicker$pickerId');\"><span id=\"$pickerId#text\">$defaultColor</span></a></span><div style=\"display:none; position:absolute; border:solid 1px gray;background-color:white;z-index:2;\" id=\"$pickerId#menu\" onmouseout=\"javascript:ZDSColorPicker.restoreColor('$pickerId');\" onclick=\"javascript:ZdsXPCOM.onPopup();\"><nobr><img src=\"images/colorpicker.jpg\" naturalsizeflag=\"3\" border=\"0\" onmousemove=\"javascript:ZDSColorPicker.setColor(event,'$pickerId');\" onclick=\"javascript:ZDSColorPicker.selectColor(event,'$pickerId');\" style=\"cursor:crosshair\" width=\"192\" height=\"128\" align=\"bottom\"></nobr><br><nobr><img src=\"images/graybar.jpg\" naturalsizeflag=\"3\" border=\"0\" onmousemove=\"javascript:ZDSColorPicker.setColor(event,'$pickerId');\" onclick=\"javascript:ZDSColorPicker.selectColor(event,'$pickerId');\" style=\"cursor:crosshair\" width=\"192\" height=\"8\" align=\"BOTTOM\"><img src=\"images/blank.jpg\" naturalsizeflag=\"3\" border=\"0\" width=\"16\" height=\"8\" align=\"BOTTOM\"></nobr><nobr><input type=\"text\" size=\"8\" id=\"$pickerId#input\" style=\"border:solid 1px gray;font-size:12pt;margin:1px;\" onkeyup=\"ZDSColorPicker.keyColor('$pickerId')\" value=\"$defaultColor\"/><a href=\"javascript:ZDSColorPicker.transparent('$pickerId');\"><img src=\"images/grid.gif\" style=\"height:20px; width:20px;\" align=\"absmiddle\" border=\"0\">透明</a></nobr></div>";
	return html.replace(/\$pickerId/g,"ZDSColorPicker"+this.id).replace(/\$defaultColor/g,this.defaultColor);
}

ZDSColorPicker.prototype.render = function(){
	document.write(this.getHTML());
}

ZDSColorPicker.prototype.set = function(color){
	if(ZDSColorPicker.instanceMap["ZDSColorPicker"+this.id].onChange){
		ZDSColorPicker.instanceMap["ZDSColorPicker"+this.id].onChange(color);
	}
	if(color == "") color = "transparent";
	document.getElementById("ZDSColorPicker"+this.id+"#input").value = color;
	document.getElementById("ZDSColorPicker"+this.id+"#text").innerHTML = color;
	document.getElementById("ZDSColorPicker"+this.id+"#color").style.background = color;
}

ZDSColorPicker.prototype.get = function(){
	return document.getElementById("ZDSColorPicker"+this.id+"#input").value;
}

ZDSColorPicker.lastid = 0;

ZDSColorPicker.instanceMap = new Array;
ZDSColorPicker.restorePool = new Array;

ZDSColorPicker.transparent= function(id){
	ZDSColorPicker.instanceMap[id].set("transparent");//transparent
	document.getElementById(id+"#menu").style.display = "none";
	if(ZDSColorPicker.instanceMap[id].onChange){
		ZDSColorPicker.instanceMap[id].onChange("透明");//transparent
	}
}

ZDSColorPicker.popupPicker= function(id){
	var pop = document.getElementById(id);
	var p = ZdsXPCOM.getDivPoint(pop);
	ZdsXPCOM.setDivPoint(document.getElementById(id+"#menu"), p.x, p.y+ 20);
	
	document.getElementById(id+"#menu").style.display = "";
	ZdsXPCOM.onPopup(document.getElementById(id+"#menu"));
}

ZDSColorPicker.setColor = function(event,id){
	if(!ZDSColorPicker.restorePool[id]) ZDSColorPicker.restorePool[id] = document.getElementById(id+"#input").value;
	
	var d = ZdsXPCOM.getMousePoint(event,document.getElementById(id+"#menu"));
	var picked = ZDSColorPicker.colorpicker(d.x,d.y).toUpperCase();
	
	document.getElementById(id+"#input").value = picked;
	document.getElementById(id+"#text").innerHTML = picked;
	document.getElementById(id+"#color").style.background = picked;
	if(ZDSColorPicker.instanceMap[id].onChange){
		ZDSColorPicker.instanceMap[id].onChange(picked);
	}
	return picked;
};


ZDSColorPicker.keyColor = function(id){
	try{
		document.getElementById(id+"#color").style.background = document.getElementById(id+"#input").value;
		ZDSColorPicker.restorePool[id] = document.getElementById(id+"#input").value;
		document.getElementById(id+"#text").innerHTML = ZDSColorPicker.restorePool[id];
	}catch(e){}
};


ZDSColorPicker.selectColor = function(event,id){
	var picked = ZDSColorPicker.setColor(event,id);
	
	document.getElementById(id+"#menu").style.display = "none";
	ZDSColorPicker.restorePool[id] = picked;
	if(ZDSColorPicker.instanceMap[id].onSelect){
		ZDSColorPicker.instanceMap[id].onSelect(picked);
	}
};

ZDSColorPicker.restoreColor = function(id){
	if(ZDSColorPicker.restorePool[id]){
		document.getElementById(id+"#input").value = ZDSColorPicker.restorePool[id];
		document.getElementById(id+"#text").innerHTML = ZDSColorPicker.restorePool[id];
		document.getElementById(id+"#color").style.background = ZDSColorPicker.restorePool[id];
		if(ZDSColorPicker.instanceMap[id].onChange){
			ZDSColorPicker.instanceMap[id].onChange(ZDSColorPicker.restorePool[id]);
		}
		ZDSColorPicker.restorePool[id] = null;
	}
};

ZDSColorPicker.colorpicker = function(prtX,prtY){
	var colorR = 0;
	var colorG = 0;
	var colorB = 0;
	
	if(prtX < 32){
		colorR = 256;
		colorG = prtX * 8;
		colorB = 1;
	}
	if(prtX >= 32 && prtX < 64){
		colorR = 256 - (prtX - 32 ) * 8;
		colorG = 256;
		colorB = 1;
	}
	if(prtX >= 64 && prtX < 96){
		colorR = 1;
		colorG = 256;
		colorB = (prtX - 64) * 8;
	}
	if(prtX >= 96 && prtX < 128){
		colorR = 1;
		colorG = 256 - (prtX - 96) * 8;
		colorB = 256;
	}
	if(prtX >= 128 && prtX < 160){
		colorR = (prtX - 128) * 8;
		colorG = 1;
		colorB = 256;
	}
	if(prtX >= 160){
		colorR = 256;
		colorG = 1;
		colorB = 256 - (prtX - 160) * 8;
	}
	
	if(prtY < 64){
		colorR = colorR + (256 - colorR) * (64 - prtY) / 64;
		colorG = colorG + (256 - colorG) * (64 - prtY) / 64;
		colorB = colorB + (256 - colorB) * (64 - prtY) / 64;
	}
	if(prtY > 64 && prtY <= 128){
		colorR = colorR - colorR * (prtY - 64) / 64;
		colorG = colorG - colorG * (prtY - 64) / 64;
		colorB = colorB - colorB * (prtY - 64) / 64;
	}
	if(prtY > 128){
		colorR = 256 - ( prtX / 192 * 256 );
		colorG = 256 - ( prtX / 192 * 256 );
		colorB = 256 - ( prtX / 192 * 256 );
	}
	
	colorR = parseInt(colorR);
	colorG = parseInt(colorG);
	colorB = parseInt(colorB);
	
	if(colorR >= 256){
		colorR = 255;
	}
	if(colorG >= 256){
		colorG = 255;
	}
	if(colorB >= 256){
		colorB = 255;
	}
	
	colorR = colorR.toString(16);
	colorG = colorG.toString(16);
	colorB = colorB.toString(16);
	
	if(colorR.length < 2){
		colorR = 0 + colorR;
	}
	if(colorG.length < 2){
		colorG = 0 + colorG;
	}
	if(colorB.length < 2){
		colorB = 0 + colorB;
	}
	
	return "#" + colorR + colorG + colorB;
}