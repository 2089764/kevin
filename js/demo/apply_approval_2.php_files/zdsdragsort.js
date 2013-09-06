/**
 * zdsdragsort.js Document 拖拉排序控件
 *
 * @author	DonYue Team
 * @version	$Revision: 1.03 $
 * @copyright	Copyright (C) 2006-2011 DonYue Team
 * @package	DonYue
 */

/*
DYDRAGSORT.init($('dragsort'),{dragEndFun:setSort});
DYDRAGSORT.init([$('dragsort'),$('dragsort2')],{dragEndFun:setSort,dragBetween:true});
function setSort(){
	lo=findtags('li','',$('dragsort'));
	str='';
	for(i=0,l=lo.length;i<l;i++){
		str+=lo[i].attributes['sort'].value+',';
	}
	//alert(str);
}
*/
(function(){
	var DYDRAGSORT={};
	DYDRAGSORT.lists = [];
	DYDRAGSORT.list = null;

	//设置默认属性
	DYDRAGSORT.SetOptions = function(options){
		//默认值
		DYDRAGSORT.options = {
			dragBetween: false,//多个对象(序列)间进行排序
			dragEndFun:	function(){}
		};
		DYDRAGSORT.Extend(DYDRAGSORT.options, options || {});
	};
	DYDRAGSORT.Extend = function(destination, source){
		for(var property in source) destination[property] = source[property];
	};

	DYDRAGSORT.myinit = function(obj){
		var newList = {
			pos : [],
			lastPos : null,
			newObj : null,
			selObj : null,
			dragsort : null,
			backData : null,

			init : function(obj){
				this.dragsort=obj;
				for(var i=0,l=obj.children.length;i<l;i++){
					//obj.children[i].children[0].onmousedown = this.mouseDown;
					obj.children[i].children[0].style.cursor='pointer';
					_attachEvent(obj.children[i].children[0], 'mousedown', this.mouseDown);
				}
			},

			stopDefault : function(e){
				if (e && e.preventDefault) {//如果是FF下执行这个
					e.preventDefault();
				}else{
					window.event.returnValue = false;//如果是IE下执行这个
				}
				return false;
			},

			createPlaceHolder : function(){
				var obj = document.createElement('li');
				obj.innerHTML = '<div></div>';
				obj.className = 'placeHolder';
				obj.setAttribute('mytype','placeHolder');
				return obj;
			},

			createDropTargets: function() {
				if(!DYDRAGSORT.options.dragBetween)return;

				for(var i=0,l=DYDRAGSORT.lists.length;i<l;i++){
					o=DYDRAGSORT.lists[i];
					var ol = $c('placeHolder',o.dragsort,'li');
					var ph=dt=0;
					for(var j=0,l2=ol.length;j<l2;j++){
						if(ol[j].attributes['mytype'].value=='placeHolder')ph++
						else if(ol[j].attributes['mytype'].value=='dropTarget')dt++;
					}
					if(ph > 0 && dt > 0){
						for(var j=0,l2=ol.length;j<l2;j++)
							if(ol[j].attributes['mytype'].value=='dropTarget')ol[j].parentNode.removeChild(ol[j]);
					}else if(ph == 0 && dt == 0){
						tmp = o.createPlaceHolder();
						tmp.setAttribute('mytype','dropTarget');
						o.dragsort.appendChild(tmp);
					}
				}
			},

			buildPositionTable : function(){
				var pos = [];
				//html = '';
				//alert(this.dragsort.children.length);
				for(var i=0,j=0,l=this.dragsort.children.length;i<l;i++){
					var o = this.dragsort.children[i];
					if(o==DYDRAGSORT.list.newObj || o==DYDRAGSORT.list.selObj)continue;
					var point = getOffset(o);
					var loc = {'left':point.x,'top':point.y,'right':point.x+o.offsetWidth,'bottom':point.y+o.offsetHeight,'elm':o};
					pos[j++] = loc;
					//$('showmyinfobox').innerHTML+=point.x+'-'+point.y+'|';
				}
				this.pos = pos;
				//$('showmyinfobox').innerHTML = html;
			},

			findPos : function(x, y){
				for(var i = 0; i < this.pos.length; i++){
					if(this.pos[i].left < x && this.pos[i].right > x && this.pos[i].top < y && this.pos[i].bottom > y)
						return i;
				}
				return -1;
			},

			mouseDown : function(e){
				e = e ? e : window.event;
				o = is_ie ? e.srcElement : e.currentTarget;

				//DYDRAGSORT.list = DYDRAGSORT.lists[o.parentElement.parentElement.attributes['data-listidx'].value];
				var oi=null;
				while(o!=null){
					oi = DYDRAGSORT.inLists(o.parentElement);
					if(oi === false){
						o=o.parentElement;
						continue;
					}else{
						break;
					}
				}
				
				//oi = DYDRAGSORT.inLists(o.parentElement.parentElement);
				//if(oi === false)return;
				
				DYDRAGSORT.list = DYDRAGSORT.lists[oi];//findList(o.parentElement.parentElement);
				DYDRAGSORT.list.stopDefault(e);
				DYDRAGSORT.list.dragsort.children[0].onmousedown = function(){};
				//for(var i=0, l=DYDRAGSORT.list.dragsort.children.length; i<l; i++){
				//	_detachEvent(DYDRAGSORT.list.dragsort.children[0], 'mousedown', this.mouseDown);
				//}

				//o.style.cursor = 'move';
				DYDRAGSORT.list.selObj = o;//.parentElement;
				if(!DYDRAGSORT.list.selObj || DYDRAGSORT.list.selObj == null) return false;

				var item = this;
				var trigger = function(){
					DYDRAGSORT.list.startMove.call(item, e);
					DYDRAGSORT.list.dragsort.onmousemove = function(){};
					//$(list.container).unbind("mousemove", trigger);
				};
				DYDRAGSORT.list.dragsort.onmousemove = trigger;
				o.onmouseup = function(e){DYDRAGSORT.list.dragsort.onmousemove = function(){}};
				//document.onmousemove = DYDRAGSORT.list.startMove;
				//_attachEvent(document, 'mousemove', DYDRAGSORT.list.startMove);//
			},

			startMove : function(e){

				if(!DYDRAGSORT.list.selObj || DYDRAGSORT.list.selObj == null) return;
				DYDRAGSORT.list.selObj.children[0].style.cursor = 'move';

				DYDRAGSORT.list.newObj = DYDRAGSORT.list.createPlaceHolder();
				insertAfter(DYDRAGSORT.list.newObj, DYDRAGSORT.list.selObj);

				var point = getOffset(DYDRAGSORT.list.selObj);
				//DYDRAGSORT.list.showinfo.innerHTML = point1.x+'-'+point1.y+'-'+point.x+'-'+point.y;


				//DYDRAGSORT.list.showinfo.innerHTML=point['x']+'-'+point['y'];
				DYDRAGSORT.list.selObj.style.left=point['x']+'px';
				DYDRAGSORT.list.selObj.style.top=point['y']+'px';
				var X=e.pageX?e.pageX:e.clientX;
				var Y=e.pageY?e.pageY:e.clientY;

				DYDRAGSORT.list.backData = {x : (X-point.x), y : (Y-point.y)};
				//var backData = {x : (X-point['x']), y : (Y-point['y'])};

				DYDRAGSORT.list.selObj.style.position='absolute';
				DYDRAGSORT.list.selObj.style.zIndex=999;
				if(is_ie){
					DYDRAGSORT.list.selObj.style.filter='alpha(opacity=80)';
				}else{
					DYDRAGSORT.list.selObj.style.opacity=0.8;
				}

				DYDRAGSORT.list.createDropTargets();
				if(DYDRAGSORT.options.dragBetween){
					for(var i=0,l=DYDRAGSORT.lists.length;i<l;i++)DYDRAGSORT.lists[i].buildPositionTable();
				}else DYDRAGSORT.list.buildPositionTable();

				//document.onmousemove = DYDRAGSORT.list.mouseMove;
				//document.onmouseup = DYDRAGSORT.list.mouseUp;
				_detachEvent(document, 'mousemove', DYDRAGSORT.list.startMove);
				_attachEvent(document, 'mousemove', DYDRAGSORT.list.mouseMove);
				_attachEvent(document, 'mouseup', DYDRAGSORT.list.mouseUp);
			},

			mouseMove : function(e){
				if(!e)e=window.event;
				if(!DYDRAGSORT.list.selObj){
					DYDRAGSORT.list.mouseUp();
					return;
				}
				X=e.pageX?e.pageX:e.clientX;
				Y=e.pageY?e.pageY:e.clientY;
				selleft = (X-DYDRAGSORT.list.backData.x);
				seltop = (Y-DYDRAGSORT.list.backData.y);
				DYDRAGSORT.list.selObj.style.left=selleft+'px';
				DYDRAGSORT.list.selObj.style.top=seltop+'px';
				X=selleft+20;
				Y=seltop+5;

				var ei = DYDRAGSORT.list.findPos(X, Y);//
				var nlist = DYDRAGSORT.list;
				for(var i = 0; ei == -1 && DYDRAGSORT.options.dragBetween && i < DYDRAGSORT.lists.length; i++){
					ei = DYDRAGSORT.lists[i].findPos(X, Y);//
					nlist = DYDRAGSORT.lists[i];
				}
				//$('showmyinfobox2').innerHTML = X+'-'+Y+'|'+selleft+'-'+seltop;
				//$('showmyinfobox').innerHTML = selleft+'-'+seltop;
				//DYDRAGSORT.showinfo.innerHTML = ei;
				if(ei==-1)return false;

				//DYDRAGSORT.showinfo.innerHTML = ei;
				//$('showmyinfobox').innerHTML = ei;

				DYDRAGSORT.list.newObj.parentNode.removeChild(DYDRAGSORT.list.newObj);
				DYDRAGSORT.list.newObj = DYDRAGSORT.list.createPlaceHolder();

				//if(DYDRAGSORT.lastPos != null)DYDRAGSORT.showinfo.innerHTML = DYDRAGSORT.lastPos.top+'-'+seltop;
				if(DYDRAGSORT.list.lastPos == null || DYDRAGSORT.list.lastPos.top > seltop || DYDRAGSORT.list.lastPos.left > selleft)
					insertBefore(DYDRAGSORT.list.newObj, nlist.pos[ei].elm);//DYDRAGSORT.list
				else
					insertAfter(DYDRAGSORT.list.newObj, nlist.pos[ei].elm);//DYDRAGSORT.list

				DYDRAGSORT.list.createDropTargets();
				if(DYDRAGSORT.options.dragBetween){
					for(var i=0,l=DYDRAGSORT.lists.length;i<l;i++)DYDRAGSORT.lists[i].buildPositionTable();
				}else DYDRAGSORT.list.buildPositionTable();
				//DYDRAGSORT.list.buildPositionTable();
				DYDRAGSORT.list.lastPos = {'left':selleft, 'top':seltop};
				return false;
			},

			mouseUp : function(e){
				//alert('aa');!e ||
				//document.onmousemove=function(){};
				//document.onmouseup=function(){};
				_detachEvent(document,'mousemove', DYDRAGSORT.list.mouseMove);
				_detachEvent(document,'mouseup', DYDRAGSORT.list.mouseUp);
				if(!DYDRAGSORT.list.newObj || DYDRAGSORT.list.newObj==null)return false;
				//alert('aaa');
				DYDRAGSORT.list.newObj.innerHTML = DYDRAGSORT.list.selObj.innerHTML;
				DYDRAGSORT.list.selObj.parentNode.removeChild(DYDRAGSORT.list.selObj);
				o=DYDRAGSORT.list.newObj.children[0];
				o.onmousedown = DYDRAGSORT.list.mouseDown;
				//o.style.cursor='pointer';
				o.removeAttribute('style');

				DYDRAGSORT.list.newObj.removeAttribute('class');
				DYDRAGSORT.list.newObj.removeAttribute('mytype');
				DYDRAGSORT.list.newObj.removeAttribute('className');

				for(var i=0,l=DYDRAGSORT.list.selObj.attributes.length;i<l;i++){
					//hideFocus disabled tabIndex=0
					if(DYDRAGSORT.list.selObj.attributes[i].name.toLowerCase()=='style' || DYDRAGSORT.list.selObj.attributes[i].name=='disabled' || DYDRAGSORT.list.selObj.attributes[i].name=='hideFocus' || DYDRAGSORT.list.selObj.attributes[i].name=='tabIndex' || DYDRAGSORT.list.selObj.attributes[i].value==null || DYDRAGSORT.list.selObj.attributes[i].value=='null' || DYDRAGSORT.list.selObj.attributes[i].value=='')continue;
					DYDRAGSORT.list.newObj.setAttribute(DYDRAGSORT.list.selObj.attributes[i].name, DYDRAGSORT.list.selObj.attributes[i].value);
				}
				DYDRAGSORT.list.newObj.style.cursor='pointer';
				//DYDRAGSORT.newObj.createAttribute('sort');
				//DYDRAGSORT.newObj.setAttribute('sort', DYDRAGSORT.selObj.attributes['sort'].value);
				//DYDRAGSORT.newObj.attributes['sort'].value=DYDRAGSORT.selObj.attributes['sort'].value;

				ol = $c('placeHolder','','li');
				for(var j=0,l2=ol.length;j<l2;j++)ol[j].parentNode.removeChild(ol[j]);

				DYDRAGSORT.list.newObj=null;
				DYDRAGSORT.list.selObj=null;

				if(DYDRAGSORT.options.dragEndFun!=null)DYDRAGSORT.options.dragEndFun();
			}
		};
		newList.init(obj);
		DYDRAGSORT.lists.push(newList);
	};

	DYDRAGSORT.init = function(obj, options){
		DYDRAGSORT.SetOptions(options);
		if(obj == '' || obj == null || typeof obj == 'undefined') return;
		if(is(obj, 'Array')){
			for(var j=0,l=obj.length;j<l;j++){
				obj[j].setAttribute('data-listidx', j);
				DYDRAGSORT.myinit(obj[j]);
			}
		}else{
			obj.setAttribute('data-listidx', 0);
			DYDRAGSORT.myinit(obj);
		}
	};

	DYDRAGSORT.addObj = function(obj){
		obj.setAttribute('data-listidx', DYDRAGSORT.lists.length);
		DYDRAGSORT.myinit(obj);
	};
	
	DYDRAGSORT.addMoveObj = function(toobj, moveObj){
		if((oi = DYDRAGSORT.inLists(toobj)) === false) return false;
		
		toobj.appendChild(moveObj);
		_attachEvent(moveObj.children[0], 'mousedown', DYDRAGSORT.lists[oi].mouseDown);
	};

	// toobj 不提供,在移除obj时,里面的元素将不会
	DYDRAGSORT.delObj = function(obj, toobj){
		if((oi = DYDRAGSORT.inLists(obj)) === false) return false;

		if(isUndefined(toobj)){
			DYDRAGSORT.lists.splice(oi,1);//从数组中删除元素
			return true;
		}
		if((oi2 = DYDRAGSORT.inLists(toobj)) === false) return false;
		for(var i=obj.children.length-1,l=0;i>=l;i--){
			newNode = obj.children[i].cloneNode(true);
			toobj.appendChild(newNode);
			_attachEvent(newNode.children[0], 'mousedown', DYDRAGSORT.lists[oi2].mouseDown);
			obj.removeChild(obj.children[i]);
		}
		DYDRAGSORT.lists.splice(oi,1);
	};
	
	DYDRAGSORT.reBuildObj = function(obj){
		if((oi = DYDRAGSORT.inLists(obj)) === false) return false;
		DYDRAGSORT.lists[oi].init(obj);
	}

	//判断是否为列表中的对象,返回0~lists.length-1为找到,false标示非列表中的对象
	DYDRAGSORT.inLists = function(obj){
		if(obj==null || obj=='' || typeof obj=='undefined') return false
		for(var i=0,l=DYDRAGSORT.lists.length;i<l;i++){
			if(DYDRAGSORT.lists[i].dragsort == obj)return i;
		}
		return false;
	}

	if(window.DYDRAGSORT === undefined) window.DYDRAGSORT = DYDRAGSORT;
})();