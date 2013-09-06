/**
 * autoComplete.js Document 消息提示窗口,可以作为对话框使用
 *
 * @author	DonYue Team
 * @version	$Revision: 0.01 $
 * @copyright	Copyright (C) 2006-2012 DonYue Team
 * @package	DonYue
 */

/**
 * 示例:(记得引入zdsjs.css)
 *
<input type="text" name="textfield" id="textfield" />

DYAUTOCOMPLETE.Init($('textfield'),{
	data:'http://localhost/gopmp/allBusinesses.php?action=autoComplete&keyword=',
	type:'AJAX',
	fun:function(v){alert(v);}
});

DYAUTOCOMPLETE.Init($('textfield'),{
	data:['广东','广西','湖南','湖北','上海','北京'],
	type:'DATA',
	fun:function(v){alert(v);}
});
 *
 */
(function(){
	var DYAUTOCOMPLETE={};

	DYAUTOCOMPLETE.lists = [];
	DYAUTOCOMPLETE.list = null;
	DYAUTOCOMPLETE.dyHint = null;
	
	DYAUTOCOMPLETE.myinit = function(obj, options){
		var newList = {
			obj : null,
			hasRegEve : false,
			val_fix : -1,
			searchStr : '',
			val_count : 0,
			options : [],
			
			init : function(obj, options){
				this.obj=obj;
				this.SetOptions(options);
				//this.initHint();
				obj.onblur=this.OnBlur;
				obj.onfocus=this.OnFocus;
				obj.onkeydown=this.OnKeyDown;
				obj.onkeyup=this.OnKeyUp;
				//alert(obj.offsetWidth);
				if(obj.value=='') obj.value = this.options.defWords;
			},
			
			//设置默认属性
			SetOptions : function(options){
				this.options = {//默认值
					defWords	:'Key words...',
					data		:'',// AJAX时为url, DATA方式时data为数据数组
					type		:'AJAX',// AJAX/DATA 数据来源为ajax方式,数据来源为url指明
					showCount	:6,//
					lineHeight	:22,
					fun			:null//回调函数
				};
				this.Extend(this.options, options || {});
			},
			
			Extend : function(destination, source){
				for(var property in source){
					destination[property] = source[property];
				}
			},
			
			OnBlur : function(e){
				//o=this.obj;
				e = e ? e : window.event;
				o = is_ie ? e.srcElement : e.currentTarget;
				
				DYAUTOCOMPLETE.list = DYAUTOCOMPLETE.getList(o);
				//DYAUTOCOMPLETE.list.stopDefault(e);

				if(o.value=='') o.value = DYAUTOCOMPLETE.list.options.defWords;
			},
			
			OnFocus : function(e){
				//o=this.obj;
				e = e ? e : window.event;
				o = is_ie ? e.srcElement : e.currentTarget;
				DYAUTOCOMPLETE.list = DYAUTOCOMPLETE.getList(o);
				//DYAUTOCOMPLETE.list.stopDefault(e);
				if(o.value==DYAUTOCOMPLETE.list.options.defWords) o.value="";
				else o.select();
				if(!DYAUTOCOMPLETE.list.hasRegEve){
					if(document.addEventListener){
						document.addEventListener("click", DYAUTOCOMPLETE.list.hideHint, false);
					}else if(document.attachEvent){
						document.attachEvent("onclick", DYAUTOCOMPLETE.list.hideHint);
					}
					DYAUTOCOMPLETE.list.hasRegEve=true;
				}
			},
			
			OnKeyDown : function(e){
				e = e?e:window.event;
				v = e.keyCode;
				var o = is_ie ? e.srcElement : e.currentTarget;
				DYAUTOCOMPLETE.list = DYAUTOCOMPLETE.getList(o);
				
				//return;
				
				//DYAUTOCOMPLETE.list.stopDefault(e);
				//$('mytag').innerHTML = DYAUTOCOMPLETE.list.val_fix;
				if(v==13 && DYAUTOCOMPLETE.list.val_fix>=0 && DYAUTOCOMPLETE.list.val_fix<DYAUTOCOMPLETE.list.val_count && isdefbyid('sugest_'+DYAUTOCOMPLETE.list.val_fix)){
					//$('mytag').innerHTML = 'bbb';
					DYAUTOCOMPLETE.list.setSearch();//$('sugest_'+DYAUTOCOMPLETE.list.val_fix).innerHTML
					return;
				}else if(v==13 && (DYAUTOCOMPLETE.list.val_fix<=0 || DYAUTOCOMPLETE.list.val_fix>=DYAUTOCOMPLETE.list.val_count)){
					//$('mytag').innerHTML = 'aaa';
					DYAUTOCOMPLETE.list.postSearchVal();
					return;
				}
				if(v!=38 && v!=40)return;
				for(i=0;i<DYAUTOCOMPLETE.list.val_count;i++)$('sugest_'+i).className = 'suggest_link';
				if(v==38 && DYAUTOCOMPLETE.list.val_fix>0){
					DYAUTOCOMPLETE.list.val_fix--;
				}else if(v==40 && DYAUTOCOMPLETE.list.val_fix<DYAUTOCOMPLETE.list.val_count-1){
					DYAUTOCOMPLETE.list.val_fix++;
				}
				
				if((v==38 || v==40) && DYAUTOCOMPLETE.list.val_count>DYAUTOCOMPLETE.list.options.showCount){
					//移动滚动条
					o=$('sugest_'+DYAUTOCOMPLETE.list.val_fix);
					if(v==40 && DYAUTOCOMPLETE.list.val_fix+1>=DYAUTOCOMPLETE.list.options.showCount){
						DYAUTOCOMPLETE.dyHint.scrollTop = o.offsetTop+o.offsetHeight-DYAUTOCOMPLETE.list.options.showCount*DYAUTOCOMPLETE.list.options.lineHeight;
						//DYAUTOCOMPLETE.dyHint.scrollTop = DYAUTOCOMPLETE.list.options.lineHeight*(DYAUTOCOMPLETE.list.val_fix-DYAUTOCOMPLETE.list.options.showCount+1);
					}else if(v==38){
						if(o.offsetTop<DYAUTOCOMPLETE.dyHint.scrollTop)DYAUTOCOMPLETE.dyHint.scrollTop=o.offsetTop;
					}
				}
				
				if(DYAUTOCOMPLETE.list.val_fix>=0 && DYAUTOCOMPLETE.list.val_fix<DYAUTOCOMPLETE.list.val_count){
					$('sugest_'+DYAUTOCOMPLETE.list.val_fix).className = 'suggest_link over';
					//DYAUTOCOMPLETE.list.mouseOver();
				}
			},
			
			OnKeyUp : function(e){
				//o=this.obj;
				e = e ? e : window.event;
				var o = is_ie ? e.srcElement : e.currentTarget;
				value=trim(o.value);
				
				DYAUTOCOMPLETE.list = DYAUTOCOMPLETE.getList(o);
				//DYAUTOCOMPLETE.list.stopDefault(e);
				
				if(DYAUTOCOMPLETE.list.options.defWords==value || DYAUTOCOMPLETE.list.searchStr==value)return;
				if(!DYAUTOCOMPLETE.list.checkKeyword(value)){
					DYAUTOCOMPLETE.list.hideHint();
					return;
				}
				DYAUTOCOMPLETE.list.searchStr=value;
				if(DYAUTOCOMPLETE.list.options.type == 'AJAX'){
					//数据来源为AJAX
					//url='http://localhost/gopmp/allBusinesses.php?action=autoComplete&keyword='+escape(value);
					url=DYAUTOCOMPLETE.list.options.data+encodeURIComponent(value);
					ajaxGetResult(url,'JSON','',function(v){DYAUTOCOMPLETE.list.showHint(v,DYAUTOCOMPLETE.list)});
				}else if(DYAUTOCOMPLETE.list.options.type == 'DATA'){
					//数据来源为数组DATA
					items = DYAUTOCOMPLETE.list.matcher(DYAUTOCOMPLETE.list.options.data, value);
					items = DYAUTOCOMPLETE.list.sorter(items, value);
					DYAUTOCOMPLETE.list.showHint(items,DYAUTOCOMPLETE.list);
				}
			},
			
			stopDefault : function(e){
				if(e && e.preventDefault){//如果是FF下执行这个
					e.preventDefault();
				}else{
					window.event.returnValue = false;//如果是IE下执行这个
				}
				return false;
			},
			
			setSearch : function(e){
				e = e ? e : window.event;
				if(!isUndefined(e))o = is_ie ? e.srcElement : e.currentTarget;
				o = !isUndefined(o)?o:(isdefbyid('sugest_'+this.val_fix)?$('sugest_'+this.val_fix):null);
				if(o.tagName.toLowerCase() == 'b') o = o.parentNode;
				if(o == null)return;// || o.tagName.toLowerCase() != 'li'
				
				DYAUTOCOMPLETE.list = DYAUTOCOMPLETE.getList(o);
				var v='';
				if(isUndefined(DYAUTOCOMPLETE.list)){
					DYAUTOCOMPLETE.list = DYAUTOCOMPLETE.getList($(o.getAttribute('partab')));
					v = trim(o.innerHTML);
				}else{
					v = trim($('sugest_' + DYAUTOCOMPLETE.list.val_fix).innerHTML);
				}
				v = v.replace(/<[\/]?b>/ig,'');
				DYAUTOCOMPLETE.list.searchStr = v;
				if(!DYAUTOCOMPLETE.list.checkKeyword(v))return;
				DYAUTOCOMPLETE.list.obj.value = v;
				DYAUTOCOMPLETE.list.postSearchVal(v);
			},
			
			matcher : function(data, search){
				var ret = [];
				for(var i in data){
					v = data[i].toLowerCase().indexOf(search.toLowerCase());
					if((!!~v)!==false){
						ret.push(data[i]);
					}
				}
				return ret;
			},
		
			sorter : function(items, search){
				var beginswith = [], caseSensitive = [], caseInsensitive = [], item;
				while(item = items.shift()){
					tmp_item = this.highlighter(item, search);
					if(!item.toLowerCase().indexOf(search.toLowerCase())) beginswith.push(tmp_item);
					else if(~item.indexOf(search)) caseSensitive.push(tmp_item);
					else caseInsensitive.push(tmp_item);
				}
				return beginswith.concat(caseSensitive, caseInsensitive);
			},
		
			highlighter : function(item, search){
				var query = search.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
				return item.replace(new RegExp('(' + query + ')', 'ig'), function($1, match){
					return '<b>' + match + '</b>'
				})
			},
		
			checkKeyword : function(v){
				if(v.length<=0 || v==this.options.defWords) return false;
				return true;
			},
			
			hideHint : function(){
				DYAUTOCOMPLETE.dyHint.innerHTML='';
				DYAUTOCOMPLETE.dyHint.style.display='none';
			},
			
			showHint : function(v,o){
				DYAUTOCOMPLETE.list = o;
				DYAUTOCOMPLETE.list.val_fix=-1;
				DYAUTOCOMPLETE.list.val_count = v.length;
				if(DYAUTOCOMPLETE.list.val_count<=0){
					DYAUTOCOMPLETE.list.hideHint();
					return;
				}
				DYAUTOCOMPLETE.dyHint.innerHTML='';
				html = '<ul>';
				for(i=0; i < DYAUTOCOMPLETE.list.val_count; i++){
					html += '<li id="sugest_'+i+'" tabindex="'+i+'" class="suggest_link" partab="'+DYAUTOCOMPLETE.list.obj.id+'">'+v[i]+'</li>';
				}
				html += '</ul>';
				DYAUTOCOMPLETE.dyHint.innerHTML=html;
				DYAUTOCOMPLETE.dyHint.style.display='';
				
				var ol = $c('suggest_link');
				_attachEvent(ol, 'click', DYAUTOCOMPLETE.list.setSearch);
				_attachEvent(ol, 'mouseover', function(e){
					e = e ? e : window.event;
					var o = null;
					if(!isUndefined(e)) o = is_ie ? e.srcElement : e.currentTarget;
					o = !isUndefined(o) ? o : (isdefbyid('sugest_'+this.val_fix) ? $('sugest_' + this.val_fix) : null);
					if(o.tagName.toLowerCase() == 'b') o = o.parentNode;
					if(o == null || o.tagName.toLowerCase() != 'li')return;
					DYAUTOCOMPLETE.list = DYAUTOCOMPLETE.getList($(o.getAttribute('partab')));
					for(i = 0; i < DYAUTOCOMPLETE.list.val_count; i++) $('sugest_'+i).className = 'suggest_link';
					o.className = 'suggest_link over';
					DYAUTOCOMPLETE.list.val_fix = o.getAttribute('tabindex');
				});
				
				_attachEvent(ol, 'mouseout', function(e){
					e = e ? e : window.event;
					if(!isUndefined(e)) o = is_ie ? e.srcElement : e.currentTarget;
					o = !isUndefined(o) ? o : (isdefbyid('sugest_'+this.val_fix) ? $('sugest_'+this.val_fix) : null);
					if(o.tagName.toLowerCase() == 'b') o = o.parentNode;
					if(o == null || o.tagName.toLowerCase() != 'li')return;
					o.className = 'suggest_link';
				});
				
				if(this.val_count > this.options.showCount){
					//显示滚动条
					DYAUTOCOMPLETE.dyHint.style.overflow = 'auto';
					DYAUTOCOMPLETE.dyHint.style.height = this.options.lineHeight * this.options.showCount + 'px';
					DYAUTOCOMPLETE.dyHint.scrollTop = 0 + 'px';
				}else{
					DYAUTOCOMPLETE.dyHint.style.overflow = '';
					DYAUTOCOMPLETE.dyHint.style.height = '';
				}
				DYAUTOCOMPLETE.list.setPoint();
				
				//显示宽度
				DYAUTOCOMPLETE.dyHint.style.width = (DYAUTOCOMPLETE.list.obj.offsetWidth-2) + 'px';
			},
			
			setPoint : function(){
				tmp_obj=this.obj;
				var x=tmp_obj.offsetLeft;
				var y=tmp_obj.offsetTop;
				while(tmp_obj=tmp_obj.offsetParent){
					x+=tmp_obj.offsetLeft;
					y+=tmp_obj.offsetTop;
				}
				y+=this.obj.offsetHeight;
				DYAUTOCOMPLETE.dyHint.style.left = x+"px";
				DYAUTOCOMPLETE.dyHint.style.top = y+"px";
			},
			
			postSearchVal : function(v){
				this.hideHint();
				v = !isUndefined(v) ? v : (this.obj.value);
				if(this.options.fun != null) this.options.fun(v);
			}			
		};
		
		newList.init(obj, options);
		DYAUTOCOMPLETE.lists.push(newList);
	};
	
	DYAUTOCOMPLETE.Init = function(obj,options){
		DYAUTOCOMPLETE.initHint();
		DYAUTOCOMPLETE.myinit(obj, options);
	};
	
	DYAUTOCOMPLETE.initHint = function (){
		if(DYAUTOCOMPLETE.dyHint!=null)return;
		DYAUTOCOMPLETE.dyHint=document.createElement('div');
		DYAUTOCOMPLETE.dyHint.setAttribute('id', 'divHint_box');
		DYAUTOCOMPLETE.dyHint.style.display='none';
		DYAUTOCOMPLETE.dyHint.style.zIndex = 1000;
		DYAUTOCOMPLETE.dyHint.style.position = 'absolute';
		document.body.appendChild(DYAUTOCOMPLETE.dyHint);
	};
	
	//判断是否为列表中的对象,返回0~lists.length-1为找到,false标示非列表中的对象
	DYAUTOCOMPLETE.inLists = function(obj){
		if(obj==null || obj=='' || typeof obj=='undefined') return false
		for(var i=0,l=DYAUTOCOMPLETE.lists.length;i<l;i++){
			if(DYAUTOCOMPLETE.lists[i].obj == obj)return i;
		}
		return false;
	};
	
	DYAUTOCOMPLETE.getList = function(o){
		var oi = DYAUTOCOMPLETE.inLists(o);
		DYAUTOCOMPLETE.list = DYAUTOCOMPLETE.lists[oi];//findList(o.parentElement.parentElement);
		return DYAUTOCOMPLETE.list;
	};
	
	if(window.DYAUTOCOMPLETE === undefined) window.DYAUTOCOMPLETE = DYAUTOCOMPLETE;
})();