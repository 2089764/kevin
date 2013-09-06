/**
 * author: YangYongzhou
 */

var appName = 'useravtar';
var pic = null;
var dw = 300;
var dh = 360;

var PICWIDTH = 120;	//shadow 图片的宽度
var PICHEIGHT = 120;	//shadow 图片的高度

var top = 0;	//shadow 中心到图片顶端的距离
var left = 0;	//shadow 中心到图片左端的距离

var orgPicWidth = 0;
var orgPicHeight = 0;
var minRate = 0.0;		//滚动条最小时图片缩放的比例值

var SLIDE_MAX = 232;
var offsetZoom = 2;	

var latestRate = 1;		//上次缩放时的比例值

var submenualp = 40;
var picFormat ='|jpg|gif|png|bmp|jpeg|';

function isPicFile(fileName){
	a=fileName.lastIndexOf('.');
	var extName = fileName.substring(a + 1);
		
	return picFormat.indexOf('|' + extName.toLowerCase() + '|') > -1;
}

function uploadPic(){
	if(!isPicFile($('picture').value)){
		alert('请选择正确的图片,支持的格式包括,jpg、gif、png、bmp、jpeg!');
		return;
	}
	
	$('uploadMsg').style.display = 'block';
	var frm = $('uploadFrm');
	frm.action = './savefile.jsp';
	frm.encoding = 'multipart/form-data';
	frm.target = 'upload_iframe';
	
	frm.submit();
}

function cropPic(){
	var frm = $('uploadFrm');
	frm.action = './crop.jsp';
	frm.target = '_blank';
	frm.encoding = 'application/x-www-form-urlencoded';
	$('top').value = parseInt(top) - (PICHEIGHT / 2);
	$('left').value = parseInt(left) - (PICWIDTH / 2);
	$('rate').value = latestRate;

	frm.submit();
}
	
function changePic(picName, width, height){
	$('uploadMsg').style.display = 'none';
	switchView();
	
	var root = '/' +  appName + '/upload/';
	$('picName').value = picName;
	$('width').value = width;
	$('height').value = height;
	
	pic = $('pic');
	pic.src = root + picName;
	pic.width = width;
	pic.height = height;
	
	orgPicWidth = pic.width;
	orgPicHeight = pic.height;
	
	pic.style.filter="Alpha(opacity="+submenualp+")";
 	pic.style.opacity=submenualp/100;

	pic.style.left = (dw - orgPicWidth) / 2+ 'px';
	pic.style.top = (dh - orgPicHeight) / 2 + 'px';
	
	top = orgPicHeight / 2;
	left = orgPicWidth / 2;

	var tmpWidthRate = PICWIDTH / orgPicWidth;
	var tmpHeightRate = PICHEIGHT / orgPicHeight;
	minRate = (tmpWidthRate > tmpHeightRate) ? tmpWidthRate : tmpHeightRate;
	minRate = (minRate > 1) ? 1 : minRate;
	$('slideBlock').style.left = SLIDE_MAX + 'px';

	latestSlidePosition = SLIDE_MAX;
	latestRate = 1;
	showPrePic();
}

function switchView(){
	$('promptDiv1').style.display = 'none';
	$('promptDiv2').style.display = 'none';
	$('shadow').style.border = '1px solid #000000';
	$('slideDiv').style.display = 'block';
}

function clickSlide(ev){
	ev = ev || window.event;
	var target = ev.target || ev.srcElement;
	
	if(!target.id || target.id != 'slideBg'){		//点击非刻度条时，不做任何操作
		return;
	}	
	
	var left = ev.offsetX;

	if(!left){ //for firefox
		//left = getOffset(ev).offsetX;
		left = ev.layerX;
	}
	
	left -= 4;	//滑块的宽度为 8px，为了使滑块居中
	left = setSlideBlockLeft(left, $('slideBlock'));
}

function zoom(v){
	var left = $('slideBlock').offsetLeft;
	
	if(v > 0){
		left += offsetZoom;
	}else {
		left -= offsetZoom;
	}
	
	left = setSlideBlockLeft(left, $('slideBlock'));
}

var mouseDown = false;

function zooming(v){
	mouseDown = true;
	zoom(v);
	
	setTimeout('proccessZoom(' + v + ')', 100);
}

function proccessZoom(v){
	if(mouseDown){
		zoom(v);
		setTimeout('proccessZoom(' + v + ')', 100);
	}
}

function adjustSize(offset){
	var rate = minRate + ((1 - minRate) / SLIDE_MAX * offset);		//相对原始图片的缩放比率
	rate = (offset == SLIDE_MAX) ? 1 : rate;
	var relativeRate = (rate - latestRate) / latestRate;			//相对上一个状态，本次的缩放比例

	pic.width = orgPicWidth * rate;
	pic.height =orgPicHeight * rate;
	
	top *= (1 + relativeRate);
	left *= (1 + relativeRate);
	
	var tmpTop = dh / 2 - top;
	var tmpLeft = dw / 2 - left;
	
	var maxTop = dh / 2 - PICHEIGHT / 2;
	var minTop = dh / 2 + PICHEIGHT / 2 - pic.height;
	var maxLeft = dw / 2 - PICWIDTH / 2;
	var minLeft = dw / 2 + PICWIDTH / 2 - pic.width;
	
	if(tmpTop > maxTop){
		top = PICHEIGHT / 2;
	}
	
	if(tmpTop < minTop){
		top = pic.height - PICHEIGHT / 2;
	}
	
	if(tmpLeft > maxLeft){
		left = PICWIDTH / 2;
	}
	
	if(tmpLeft < minLeft){
		left = pic.width - PICWIDTH / 2;
	}

	
	pic.style.top = (dh / 2 - top) + 'px';
	pic.style.left =  (dw / 2 - left)+ 'px';

	latestRate = rate;
	
	showPrePic();
}

function setSlideBlockLeft(slideBlockleft, obj){
	slideBlockleft = slideBlockleft || 0;
	
	slideBlockleft = (slideBlockleft > SLIDE_MAX) ? SLIDE_MAX : slideBlockleft;
	slideBlockleft = (slideBlockleft < 0) ? 0 : slideBlockleft;
	
	if($('slideBlock').offsetLeft < slideBlockleft){		//放大的情况下可能造成图片完全不在预览框中，需要对其进行控制
		var maxRelativeRate = 0.0;		//可以相对上次的最大缩放比例	
	
		if(top > 0){			//图片的顶端在shadow的上面
			maxRelativeRate = (PICHEIGHT / 2 - 1) / (top - pic.height) - 1;		//可以相对上次的最大缩放比例	PICHEIGHT / 2 - 1 其中-1是防止图片的边缘跟shadow重合
		}else if(top < 0){
			maxRelativeRate = -(PICHEIGHT / 2 - 1) / top - 1;	
		}
		
		var rate = maxRelativeRate * latestRate + latestRate;					//相对于原始图片的放大比例，这样就可以计算滑块的距左端的最大的位置
		var maxLeft = (rate - minRate) * SLIDE_MAX / (1 - minRate);		//滑块的距左端的最大的位置
		
		slideBlockleft = (maxLeft > 0  && slideBlockleft > maxLeft) ? maxLeft : slideBlockleft;
		
		if(left > 0){			//图片的右端在shadow的左面
			maxRelativeRate = (PICWIDTH / 2 - 1) / (left - pic.width) - 1;	
		}else if(left < 0){
			maxRelativeRate= -(PICWIDTH / 2 - 1) / left - 1;	
		}
	
		rate = maxRelativeRate * latestRate + latestRate;					//相对于原始图片的放大比例，这样就可以计算滑块的距左端的最大的位置
		maxLeft = (rate - minRate) * SLIDE_MAX / (1 - minRate);		//滑块的距左端的最大的位置
			
		slideBlockleft = (maxLeft > 0 && slideBlockleft > maxLeft) ? maxLeft : slideBlockleft;
	}
	
	obj.style.left = slideBlockleft + 'px';
	
	adjustSize(slideBlockleft);
}

function resetPic(){
	changePic($('picName').value, $('width').value, $('height').value);
}

function showPrePic(){
	var imgId = $('imgId');
	imgId.src = pic.src;
	
	imgId.width = pic.width;
	imgId.height = pic.height;
	
	imgId.style.top = (-top + (PICHEIGHT / 2)) + 'px';
	imgId.style.left = (-left + (PICWIDTH / 2)) + 'px';
	
	imgId = $('shadowImg');
	imgId.src = pic.src;
	
	imgId.width = pic.width;
	imgId.height = pic.height;
	
	imgId.style.top = (-top + (PICHEIGHT / 2)) + 'px';
	imgId.style.left = (-left + (PICWIDTH / 2)) + 'px';
}

var Drag = {
	"moveDiv":null,
	"dragObj":null,
	"draging":false,
	"srcTop":null,		//移动前(即鼠标按下左键时)，图片的top，
	"srcLeft":null,		//移动前(即鼠标按下左键时)，图片的left，
	"oldTop":null,		//移动前(即鼠标按下左键时)，shadow 中心到图片顶端的距离
	"oldLeft":null,		//移动前(即鼠标按下左键时)，shadow 中心到图片顶左端的距离
	"srcY":null,		//移动前(即鼠标按下左键时)，此时Y坐标值，移动时候通过这个值来参照Y方向移动的距离
	"srcX":null,		//移动前(即鼠标按下左键时)，此时X坐标值，移动时候通过这个值来参照X方向移动的距离
	
	"slideLeft":null,	//滑块的left
	
	"start":function(ev){
		Drag.dragObj = Utils.getTarget(ev);
		
		if(Drag.isdragable()){
			Drag.draging = true;
			Drag.dragObj = (Drag.dragObj.id == 'shadowImg') ? pic : Drag.dragObj;
			if(Drag.dragObj.id == 'pic'){						//移动图片
				Drag.srcY = (Utils.getPosition(ev)).top;
				Drag.srcX = (Utils.getPosition(ev)).left;
				Drag.srcTop = (Drag.dragObj.style.top).replace('px', '');
				Drag.srcLeft = (Drag.dragObj.style.left).replace('px', '');
				
				oldTop = top;
				oldLeft = left;

			}else if(Drag.dragObj.id == 'slideBlock'){		//移动滑动块
				Drag.slideLeft = (Drag.dragObj.style.left).replace('px', '');
				Drag.srcX = (Utils.getPosition(ev)).left;			
			}
		}
		
		return false;
  	},
  
	"draging":function(ev){
		if(!Drag.isdragable() || !Drag.draging){
			return;
		}
		
		var offsetTop = Drag.srcY - (Utils.getPosition(ev)).top;
		var offsetLeft = Drag.srcX - (Utils.getPosition(ev)).left;
		
		if(Drag.dragObj.id == 'pic'){						//移动图片
			var minTop = (dh + PICHEIGHT) / 2 - pic.height;
			var maxTop = (dh - PICHEIGHT) / 2;
			
			var minLeft = (dw + PICWIDTH) / 2 - pic.width;
			var maxLeft = (dw - PICWIDTH) / 2;

			if((Drag.srcTop - offsetTop) > minTop && (Drag.srcTop - offsetTop) < maxTop){
				Drag.dragObj.style.top = (Drag.srcTop - offsetTop) + 'px';
				top = oldTop + offsetTop;
			}
			
			if((Drag.srcLeft - offsetLeft) > minLeft && (Drag.srcLeft - offsetLeft) < maxLeft){
				Drag.dragObj.style.left = (Drag.srcLeft - offsetLeft) + 'px';
				left = oldLeft + offsetLeft;
			}
			
			showPrePic();
		}else if(Drag.dragObj.id == 'slideBlock'){		//移动滑动块
			setSlideBlockLeft((Drag.slideLeft - offsetLeft), Drag.dragObj);
		}
		
		return false;
	},
  
	"end":function(ev){
		Drag.dragObj = null;
		Drag.draging = false;
		mouseDown = false;
		return false;
	},
  
	"isdragable":function(){
  		return (Drag.dragObj != null && (Drag.dragObj.id == 'pic' || Drag.dragObj.id == 'shadowImg' || Drag.dragObj.id == 'slideBlock'));
  	}
}

var Utils = {
	"getTarget":function(ev){
		// 获得当前的目标源对象
		ev = ev || window.event;
		var tget = ev.target || ev.srcElement;
		return tget;
	},
	
	"getPosition":function(ev){
		// 设置坐标
		// 模拟一个鼠标跟随的效果
		ev = ev || window.event;
		return {
			top:document.documentElement.scrollTop + ev.clientY + 10,
			left:document.body.scrollLeft + ev.clientX + 10
		};
	}
}

document.onmousemove = Drag.draging;
document.onmouseup   = Drag.end;
document.onmousedown = Drag.start;

function $(){
	return document.getElementById(arguments[0]);
}
