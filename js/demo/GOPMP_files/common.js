/**
 * common.js Document 
 *
 * @author	DonYue Team
 * @version	$Revision: 1.03 $
 * @copyright	Copyright (C) 2006-2011 DonYue Team
 * @package	DonYue
 */

var userAgent = navigator.userAgent.toLowerCase();
var is_opera = (userAgent.indexOf('opera') != -1);
var is_saf = ((userAgent.indexOf('applewebkit') != -1) || (navigator.vendor == 'Apple Computer, Inc.'));
var is_webtv = (userAgent.indexOf('webtv') != -1);
var is_chrome = (userAgent.indexOf('Chrome') != -1);
var is_ie = ((userAgent.indexOf('msie') != -1) && (!is_opera) && (!is_saf) && (!is_webtv) && (!is_chrome));
var is_ie4 = ((is_ie) && (userAgent.indexOf('msie 4.') != -1));
var is_ie6 = is_ie&&!window.XMLHttpRequest;
var is_ie9 = is_ie&&!!document.documentMode&&document.documentMode==9;
var is_ie8 = is_ie&&!!document.documentMode&&!is_ie9;
var is_ie7 = (is_ie&&!is_ie6&&!is_ie8&&!is_ie9)||(is_ie&&document.documentMode==7);
var is_moz = ((userAgent.indexOf('gecko')!=-1) && (!is_saf));
var is_kon = (userAgent.indexOf('konqueror') != -1);
var is_ns = ((userAgent.indexOf('compatible') == -1) && (userAgent.indexOf('mozilla') != -1) && (!is_opera) && (!is_webtv) && (!is_saf));
var is_ns4 = ((is_ns) && (parseInt(navigator.appVersion) == 4));
var is_mac = (userAgent.indexOf('mac') != -1);
//is_ie = !is_ie9 && is_ie;

function $(id){
	return (typeof id=='object')?id:document.getElementById(id);
}

function $n(name){
	return document.getElementsByName(name);
}

//parentobj 父标签,tag 标签类别
function $c(classname, parentobj, tag){
	var returns = [];
	parentobj = parentobj || document;
	tag = tag || '*';
	var classnames=classname.split(",");
	if(parentobj.getElementsByClassName){
		for(var j=0,L2=classnames.length;j<L2;j++){
			classname=classnames[j];
			var eles = parentobj.getElementsByClassName(classname);
			if(tag != '*'){
				for(var i = 0, L = eles.length; i < L; i++){
					if(eles[i].tagName.toLowerCase() == tag.toLowerCase()) returns.push(eles[i]);
				}
			}else{
				returns=arrayunion(returns,eles)
				//returns=eles;
			}
		}
	}else{
		eles = parentobj.getElementsByTagName(tag);
		for(var j=0,L2=classnames.length;j<L2;j++){
			classname=classnames[j];
			var pattern = new RegExp("(^|\\s)"+classname+"(\\s|$)");
			for(i = 0, L = eles.length; i < L; i++){
				if(pattern.test(eles[i].className)){
					returns.push(eles[i]);
				}
			}
		}
	}
	return returns;
}

//findtags('input','text');
function findtags(tag, type, parentobj){
	var v1=[], v2=[];
	if(isUndefined(parentobj)){
		v1=document.getElementsByTagName(tag);
	}else if(parentobj.all && parentobj.all.tags){
		v1=parentobj.all.tags(tag);
	}else if(typeof parentobj.getElementsByTagName != 'undefined'){
		v1=parentobj.getElementsByTagName(tag);
	}else{
		return null;
	}
	if(!isUndefined(type) && type!=null && type!=""){
		j=0;
		for(i=0;i<v1.length;i++) if(v1[i].type==type){v2[j]=v1[i];j++;}
		v1=v2;
	}
	return v1;
}

//判断obj对象的数据类型(Array/Number/String/HTMLCollection/HTMLInputElement/HTMLDivElement)
function is(obj, type){
	return (type === "Null" && obj === null) || 
	(type === "Undefined" && obj === void 0 ) || 
	(type === "Number" && isFinite(obj)) || 
	Object.prototype.toString.call(obj).slice(8, -1) === type; 
}

function isList(obj){
	type=Object.prototype.toString.call(obj).slice(8, -1);
	return type=='Array' || type=='HTMLCollection' || type=='NodeList';
}

function isdefbyid(id){
	a=$(id);
	if(a!=null && typeof a !='undefined') return true;
	else return false;
}

function isUndefined(variable){
	return variable == '' || variable == null || typeof variable == 'undefined' ? true : false;
}

function mb_strlen(str){
	return (is_ie && str.indexOf('\n') != -1) ? str.replace(/\r?\n/g, '_').length : str.length;
}

function trim(str){
	return (str.replace(/(\s+)$/g, '')).replace(/^\s+/g, '');
}

//附加事件
function _attachEvent(obj, evt, func, eventobj){
	if(isList(obj)){//,is_ie?'Array':(is_opera||is_saf?'NodeList':'HTMLCollection')
		for(k=0; k<obj.length; k++){
			eventobj = !eventobj ? obj[k] : eventobj;
			if(obj[k].addEventListener)obj[k].addEventListener(evt, func, false);
			else if(eventobj.attachEvent)obj[k].attachEvent('on' + evt, func);
		}
	}else{
		eventobj = !eventobj ? obj : eventobj;
		if(obj.addEventListener)obj.addEventListener(evt, func, false);
		else if(eventobj.attachEvent)obj.attachEvent('on' + evt, func);
	}
}

//分离事件
function _detachEvent(obj, evt, func, eventobj){
	if(isList(obj)){//,is_ie?'Array':(is_opera||is_saf?'NodeList':'HTMLCollection')
		for(k=0; k<obj.length; k++){
			eventobj = !eventobj ? obj[k] : eventobj;
			if(obj[k].removeEventListener)obj[k].removeEventListener(evt, func, false);
			else if(eventobj.detachEvent)obj[k].detachEvent('on' + evt, func);
		}
	}else{
		eventobj = !eventobj ? obj : eventobj;
		if(obj.removeEventListener)obj.removeEventListener(evt, func, false);
		else if(eventobj.detachEvent)obj.detachEvent('on' + evt, func);
	}
}

function sprintf(){
	if(ret=arguments[0]){
		var reg=/%(-)?(\d+)?\.?(\d+)?(\w)/g;
		var i=0,l=0;
		while(arr=reg.exec(ret)){
			if(++i>arguments.length)return null;
			switch(arr[4]){
				case "x":tmp=arguments[i].toString(16);break;
				case "f":if(arr[3]){tmp=arguments[i].toFixed(arr[3]);break;}
				case "s":
				case "d":
				default:tmp=arguments[i].toString();
			}
			if((l=Number(arr[2])-tmp.length)>0)
				tmp=arr[1]?tmp+new Array(l+1).join(" "):new Array(l+1).join("   ")+tmp;
			ret=ret.replace(arr[0],tmp);
		}
		return ret;
	}
	return null;
}

/**
 * type HTML/XML/JSON
 */
function ajaxGetResult(url, type, id, resultHandle){
	if(typeof(eval('window.Ajaxs')) == 'undefined'){
		getScriptEx(getScriptPath() + 'ajax.js', function(){ajaxGetResult(url, type, id, resultHandle);});
		return false;
	}
	var x = new Ajax(type, id);
	x.get(url, resultHandle);
}

/**
 * type HTML/XML/JSON
 * postval action=aa&type=bag
 */
function ajaxPostResult(url, type, id, postval, resultHandle){
	if(typeof(eval('window.Ajaxs')) == 'undefined'){
		getScriptEx(getScriptPath() + 'ajax.js', function(){ajaxPostResult(url, type, id, postval, resultHandle);});
		return false;
	}
	var x = new Ajax(type, id);
	x.post(url, postval, resultHandle);
}

//设置cookies
//使用示例
//setCookie("name","hayden");
//alert(getCookie("name"));
function setCookie(name,value,sec){
	if(isUndefined(sec))sec=3600*24;
	var exp = new Date(); 
	exp.setTime(exp.getTime() + sec*1000);
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

//读取cookies
function getCookie(name){
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg)) return unescape(arr[2]);
	else return null;
}

//删除cookies
function delCookie(name){
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval=getCookie(name);
	if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

function MouseOver(obj){
	$(obj).style.cursor = is_ie ? 'hand' : 'pointer';
}

function KeyDown(v,e,fun){
	e = e?e:window.event;
	if(isUndefined(v))v=13;
	if(e.keyCode == v)fun();
}

//回车识别事件:
//en: onKeyDown="KeyDown('alert("bb");',event)"
/*function KeyDown(fun, e){
	e = e?e:window.event;
	if(e.keyCode == 13)eval(fun);
}*/

function testa(){
	if(event.srcElement.tagName=="DIV")
	event.srcElement.bgColor='red';
}
function testb(){
	if(event.srcElement.tagName=="div")
	event.srcElement.bgColor='blue'
}
//window.document.onmouseover=testa   
//window.document.onmouseout=testb   

function getPageScroll(){
	var yScroll;
	if(self.pageYOffset){
		yScroll = self.pageYOffset;
	}else if(document.documentElement && document.documentElement.scrollTop){
		yScroll = document.documentElement.scrollTop;
	}else if(document.body){
		yScroll = document.body.scrollTop;
	}
	arrayPageScroll = new Array('', yScroll);
	return arrayPageScroll;
}

function getPageSize(){
	var xScroll, yScroll;
	if(window.innerHeight && window.scrollMaxY){
		xScroll = document.body.scrollWidth;
		yScroll = window.innerHeight + window.scrollMaxY;
	}else if(document.body.scrollHeight > document.body.offsetHeight){
		xScroll = document.body.scrollWidth;
		yScroll = document.body.scrollHeight;
	}else{
		xScroll = document.body.offsetWidth;
		yScroll = document.body.offsetHeight;
	}
	var windowWidth, windowHeight;
	if(self.innerHeight){
		windowWidth = self.innerWidth;
		windowHeight = self.innerHeight;
	}else if(document.documentElement && document.documentElement.clientHeight){
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
	}else if(document.body){
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
	}
	if(yScroll < windowHeight){
		pageHeight = windowHeight;
	}else{
		pageHeight = yScroll;
	}
	if(xScroll < windowWidth){
		pageWidth = windowWidth;
	}else{
		pageWidth = xScroll;
	}
	arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight);
	return arrayPageSize;
}

//调用此函数停止事件冒泡
//在调用前需要传递e/event,或者在onclick="show()"的show函数中使用 e = window.event || arguments.callee.caller.arguments[0];
function stopBubble(e){
	//if(isUndefined(e))e = window.event || arguments.callee.caller.arguments[0];
	if(window.event) e.cancelBubble = true;
	else e.stopPropagation();
}

//unix时间,与php中的time()相同
function unixtime(){
	var ux = (new Date()).getTime()+'';
	return parseInt(ux.substr(0, 10));
}

function mktime(hour, minute, second, month, day, year){
	
}

function mb_substr(str, len, hasDot){
	var newLength = 0;
	var newStr = '';
	var chineseRegex = /[^\x00-\xff]/g;
	var singleChar = '';
	var strLength = str.replace(chineseRegex, '**').length;
	for(var i = 0;i < strLength;i++){
		singleChar = str.charAt(i).toString();
		if(singleChar.match(chineseRegex) != null){
			newLength += 2;
		}else{
			newLength++;
		}
		if(newLength > len) break;
		newStr += singleChar; 
	}
	if(isUndefined(hasDot))hasDot=true;
	if(hasDot && strLength > len){
		newStr += '...';
	}
	return newStr;
}

function set_focus(id){
	$(id).focus();
}

//复制到剪贴板
function copyToClipboard(txt){
	if(is_ie){
		window.clipboardData.clearData();
		window.clipboardData.setData('Text', txt);
	}else if(is_opera){
		window.location = txt;
	}else if(is_moz){
		try{
			netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
		}catch(e){
			alert("被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true'");
		}
		var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
		if(!clip)return;
		var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
		if(!trans)return;
		trans.addDataFlavor('text/unicode');
		var str = new Object();
		var len = new Object();
		var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
		var copytext = txt;
		str.data = copytext;
		trans.setTransferData("text/unicode", str, copytext.length*2);
		var clipid = Components.interfaces.nsIClipboard;
		if(!clip)return false;
		clip.setData(trans,null,clipid.kGlobalClipboard);
	}
}

/*
使用示例:
ready(function(){
	alert('aaa');
});
*/
(function(){
	var isReady=false;//判断onDOMReady方法是否已经被执行过
	var readyList= [];//把需要执行的方法先暂存在这个数组里
	var timer;//定时器句柄
	ready=function(fn){
		if(isReady) fn.call(document);
		else readyList.push( function(){return fn.call(this);});
		return this;
	}
	var onDOMReady=function(){
		for(var i=0;i<readyList.length;i++){
			readyList[i].apply(document);
		}
		readyList = null;
	}
	var bindReady = function(evt){
		if(isReady) return;
		isReady=true;
		onDOMReady.call(window);
		if(document.removeEventListener){
			document.removeEventListener("DOMContentLoaded", bindReady, false);
		}else if(document.attachEvent){
			document.detachEvent("onreadystatechange", bindReady);
			if(window == window.top){
				clearInterval(timer);
				timer = null;
			}
		}
	};
	if(document.addEventListener){
		document.addEventListener("DOMContentLoaded", bindReady, false);
	}else if(document.attachEvent){
		document.attachEvent("onreadystatechange", function(){
			if((/loaded|complete/).test(document.readyState))
			bindReady();
		});
		if(window == window.top){
			timer = setInterval(function(){
				try{
					isReady||document.documentElement.doScroll('left');//在IE下用能否执行doScroll判断 dom是否加载完毕
				}catch(e){
					return;
				}
				bindReady();
			},5);
		}
	}
})();

/**
 * ClickBox 
 * sobj 需要显示或隐藏的对象
 * eg.: onClick="ClickBox(event, $('cmtFace'));"
 */
function ClickBox(e,sobj){
	function ShowClickBox(sobj){
		stopBubble(e);
		sobj.style.display='block';
		sobj.style.visibility="";
	};
	function HiddenClickBox(){
		sobj.style.display="none";
		sobj.style.visibility="hidden";
		_detachEvent(document,'click',function(){HiddenClickBox()});
	}
	_attachEvent(document,'click',function(){HiddenClickBox()});
	ShowClickBox(sobj);
};

function insertText(o,txt){
	o.focus();
	if(!isUndefined(o.selectionStart)){
		o.value = o.value.substr(0, o.selectionStart) + txt + o.value.substr(o.selectionEnd);
	}else if(document.selection && document.selection.createRange){
		var sel = document.selection.createRange();
		sel.text = txt.replace(/\r?\n/g, '\r\n');
		if(!isUndefined(movestart)){
			sel.moveStart('character', -mb_strlen(txt) +movestart);
			sel.moveEnd('character', -moveend);
		}else if(movestart !== false){
			sel.moveStart('character', -mb_strlen(txt));
		}
		sel.select();
	}else{
		o.value += txt;
	}
	o.focus();
}

//判断needle是否在数组haystack中
function in_array(needle, haystack){
	if(typeof needle == 'string'){
		for(var i in haystack){
			if(haystack[i] == needle) return true;
		}
	}
	return false;
}

// 判断val元素在数组a中的位置
function array_indexOf(a, val){
	for(var i = 0; i < a.length; i++){
		if(a[i] == val){
			return i;
		}
	}
	return -1;
}

// 从数组a中移除元素val
function array_removeVal(a, val){
	var index = array_indexOf(a, val);
	if(index > -1){
		a.splice(index, 1);
	}
}

//向数组a中压入一个元素
function arraypush(a, value){
	a[a.length] = value;
	return a.length;
}

//从数组a中取出最后一个元素,并且a的元素个数减一
function arraypop(a){
	if(typeof a != 'object' || !a.length){
		return null;
	}else{
		var response = a[a.length - 1];
		a.length--;
		return response;
	}
}

//从数组a中取出第一个元素,也就是第一个压人数组的元素
function arrayshift(a){
	if(typeof a != 'object' || !a.length){
		return null;
	}else{
		var response = a[0];
		for(var i=0;i<a.length-1;i++){
			a[i]=a[i+1];
		}
		a.length--;
		return response;
	}
}

//a1/a2为要合并的两个数组
function arrayunion(a1, a2){
	var ai = a1.concat([]);//防止a1被改变
	for(i = 0; i < a2.length; i++){
		if(!in_array(a2[i], ai)){
			ai.push(a2[i]);
		}
	}
	return ai;
}

function getPoint(obj){
	var x=obj.offsetLeft;
	var y=obj.offsetTop+obj.offsetHeight;
	while(obj=obj.offsetParent){
		x+=obj.offsetLeft;
		y+=obj.offsetTop;
	}
	return new Array(x,y);
}

//载入js文件,jsurl为js文件的url,fCallback为js文件载入完成后的回调函数
function getScriptEx(jsurl, fCallback){
	var head = document.getElementsByTagName("head")[0];
	var script = document.createElement("script");
	script.src = jsurl;
	script.charset = "utf-8";
	var done = false;
	script.onload = script.onreadystatechange = function(){
		if(!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")){
			done = true;
			if(fCallback!=null)fCallback();
			head.removeChild(script);
		}
	};
	head.appendChild(script);
}

//产生指定位数的随机数
function randNum(n){
	n=isUndefined(n)?6:n;
	var rnd="";
	for(var i=0;i<n;i++)rnd += Math.floor(Math.random()*10);
	return rnd;
}

//将一个新元素插入另一个元素后面 
//参  数：newElement - 新元素; targetElement - 目标元素 
function insertAfter(newElement, targetElement){  
	var parent = targetElement.parentNode;
	if(parent.lastChild == targetElement){
		parent.appendChild(newElement);
	}else{
		parent.insertBefore(newElement,targetElement.nextSibling);
	}
}

//将一个新元素插入另一个元素前面
//参  数：newElement - 新元素; targetElement - 目标元素
function insertBefore(newElement, targetElement){
	var parent = targetElement.parentNode;
	parent.insertBefore(newElement,targetElement);
}

function rmElement(element){
	element.parentNode.removeChild(element);
}

function bodyOffset( body ) {
	var top = body.offsetTop, left = body.offsetLeft;
	if(body.offsetTop !== 1){
		top  += parseFloat(body.style.marginTop) || 0;
		left += parseFloat(body.style.marginLeft) || 0;
	}
	return {x:top, y:left};
}

function getOffset(elem){
	var box, docElem, body, win, clientTop, clientLeft, scrollTop, scrollLeft, top, left,
		doc = elem && elem.ownerDocument;
	if(!doc)return;
	
	if((body = doc.body) === elem ){
		return bodyOffset( elem );
	}
	docElem = doc.documentElement;

	box = elem.getBoundingClientRect();
	win = getWindow( doc );
	clientTop  = docElem.clientTop  || body.clientTop  || 0;
	clientLeft = docElem.clientLeft || body.clientLeft || 0;
	scrollTop  = win.pageYOffset || docElem.scrollTop;
	scrollLeft = win.pageXOffset || docElem.scrollLeft;
	top  = box.top  + scrollTop  - clientTop;
	left = box.left + scrollLeft - clientLeft;

	return {x: left, y: top};
}

function getWindow( elem ){
	return (elem != null && elem == elem.window) ? elem : elem.nodeType === 9 ? elem.defaultView || elem.parentWindow : false;
}

function getScriptPath(){
	var js = document.scripts;
	for(var i = js.length -1; i >= 0; i--){
		if(js[i].src.indexOf('common.js')>-1)
			return js[i].src.substring(0,js[i].src.lastIndexOf('/')+1);
	}
	return '';
}

function date(a, s){
	var d = new Date(), f;
	if(s){
		f = s*1000;
		d.setTime(f);
	}else{
		f = d.getTime();
	}
	return ('' + a).replace( /a|A|d|D|F|g|G|h|H|i|I|j|l|L|m|M|n|s|S|t|T|U|w|y|Y|z|Z/g, function(a){
		switch(a){
			case 'a': return d.getHours() > 11 ? 'pm' : 'am';
			case 'A': return d.getHours() > 11 ? 'PM' : 'AM';
			case 'd': return ('0' + d.getDate()).slice(-2);
			case 'D': return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ][d.getDay()];
			case 'F': return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];
			case 'g': return (s = (d.getHours() || 12)) > 12 ? s - 12 : s;
			case 'G': return d.getHours();
			case 'h': return ('0' + (( s = d.getHours() || 12) > 12 ? s - 12 : s)).slice(-2);
			case 'H': return ('0' + d.getHours()).slice(-2);
			case 'i': return ('0' + d.getMinutes()).slice(-2);
			case 'I': return (function(){d.setDate(1); d.setMonth(0); s = [d.getTimezoneOffset()]; d.setMonth(6); s[1] = d.getTimezoneOffset(); d.setTime(f); return s[0] == s[1] ? 0 : 1;})();
			case 'j': return d.getDate();
			case 'l': return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
			case 'L': return (s = d.getFullYear()) % 4 == 0 && (s % 100 != 0 || s % 400 == 0) ? 1 : 0;
			case 'm': return ('0' + (d.getMonth() + 1)).slice(-2);
			case 'M': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
			case 'n': return d.getMonth() + 1;
			case 's': return ('0' + d.getSeconds()).slice(-2);
			case 'S': return ['th', 'st', 'nd', 'rd'][(s = d.getDate()) < 4 ? s : 0];
			case 't': return (function(){d.setDate(32); s = 32 - d.getDate(); d.setTime(f); return s;})();
			case 'T': return 'UTC';
			case 'U': return ('' + f).slice(0, -3);
			case 'w': return d.getDay();
			case 'y': return ('' + d.getFullYear()).slice(-2);
			case 'Y': return d.getFullYear();
			case 'z': return (function(){d.setMonth(0); return d.setTime(f - d.setDate(1)) / 86400000;})();
			default : return -d.getTimezoneOffset() * 60;
		};
	});
};
