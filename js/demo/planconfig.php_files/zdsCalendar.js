/**
 * zdsCalendar.js Document 日历弹出窗口
 *
 * @author	DonYue Team
 * @version	$Revision: 0.01 $
 * @copyright	Copyright (C) 2006-2011 DonYue Team
 * @package	DonYue
 */

/**
 * 示例:(记得引入zdsjs.css与背景图片calendar.png)
 * 为了防止点击后马上就关闭(快的几乎看不到显示),应在点击事件中加上 stopBubble(e) 的调用
1:
<input type="text" name="dateInput" id="dateInput" onFocus="DonYue_Calendar('dateInput');" class="calendar" />

2:第二个参数为回调函数,如果回调函数的返回值为false,则日期不会被修改
DonYue_Calendar('',function(d){alert(d);return false;});

3:第三个参数为默认日期
DonYue_Calendar('',function(d){alert(d);},'2012-03-30');

4:参数x,y,直接定位
DonYue_Calendar('',function(d){alert(d);},'2012-03-30',10,10);

5:参数fixtype,设置浮动方式,可以设置为absolute(默认)/fixed(不随滚动条滚动)等
DonYue_Calendar('',function(d){alert(d);},'2012-03-30',null,null,'fixed');

6:日期限制
DonYue_Calendar('',function(d){alert(d);},'2012-03-30',null,null,'','2012-03-3','2012-04-30');

 * 
 */

function DonYue_Calendar(obj_id,finishFun,def,x,y,fixtype,dmin,dmax){
	e = window.event || arguments.callee.caller.arguments[0];
	//alert(typeof e);
	if(e!=''&&e!=null)stopBubble(e);
	var months = new Array('一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月');
	var days = new Array('日', '一', '二', '三', '四', '五', '六');
	var daysInMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	var tmpClass='';
	var curr_year, curr_month, curr_day;//当前显示的年月日
	var input_year, input_month, input_day;

	var seldate = '';
	
	var inputBox = isUndefined(obj_id)?null:$(obj_id);
	var finishFun = isUndefined(finishFun)?function(){}:finishFun;
	var def_date = isUndefined(def) ? '' : (isDate(def)?def:'');
	
	var min_date = isUndefined(dmin)?'':(isDate(dmin)?dmin:'');
	var max_date = isUndefined(dmax)?'':(isDate(dmax)?dmax:'');
	if(isDate(min_date) && isDate(max_date)){
		d1 = new Date(min_date.replace(/\-/g, "\/"));
		d2 = new Date(max_date.replace(/\-/g, "\/"));
		if(d2<d1){
			alert('最大时间与最小时间限制出错!');
			return false;
		}
		dd = new Date(def_date.replace(/\-/g, "\/"));
		if(dd>d2 || dd<d1) def_date = '';
	}
	
	var X = isUndefined(x) ? null : x;
	var Y = isUndefined(y) ? null : y;
	var fixtype = isUndefined(fixtype) ? 'absolute' : fixtype;
	
	var datearray = null;//日历数据
	var datePat = /^(\d{4})(\-)(\d{1,2})(\-)(\d{1,2})$/;

	function $(id){
		return (typeof id == 'object') ? id : document.getElementById(id);
	}
	
	function trim(str){
		return (str.replace(/(\s+)$/g, '')).replace(/^\s+/g, '');
	}
	
	function isUndefined(variable){
		return variable=='' || variable==null || typeof variable == 'undefined' ? true : false;
	}
	
	function stopBubble(e){
		if(isUndefined(e)) e = window.event || arguments.callee.caller.arguments[0];
		if(window.event) e.cancelBubble = true;
		else e.stopPropagation();
	}

	function getToday(){
		this.now = new Date();
		this.year = this.now.getFullYear();
		this.month = this.now.getMonth();
		this.day = this.now.getDate();
	}

	function getStringDay(str){
		var str = str.split('-');
		this.now = new Date(parseFloat(str[0]), parseFloat(str[1])-1, parseFloat(str[2]));
		this.year = this.now.getFullYear();
		this.month = this.now.getMonth();
		this.day = this.now.getDate();
	}

	function getDays(year, month){
		if(1 == month) return ((0 == year % 4) && (0 != (year % 100))) || (0 == year % 400) ? 29 : 28;
		else return daysInMonth[month];
	}

	function isDate(dateStr){
		if(dateStr.length<=0)return false;
		var matchArray = dateStr.match(datePat);
		if(matchArray == null) return false;
		var month = matchArray[3];
		var day = matchArray[5];
		var year = matchArray[1];
		if(month < 1 || month > 12) return false;
		if(day < 1 || day > 31) return false;
		if((month==4 || month==6 || month==9 || month==11) && day==31) return false;
		if(month == 2){
			var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
			if (day > 29 || (day==29 && !isleap)) return false;
		}
		return true;
	}

	function datesStruct(year, month, day){
		if(isUndefined(day))day = 0;
		var newCal = new Date(year, month, 1);
		var datearray = new Array();
		var count = getDays(year, month);
		var startDay = newCal.getDay();
		if(startDay==0) startDay=7;
		var year1 = year, month1 = month-1;
		if(month1<0){
			year1--;
			month1 = 11;
		}
		var count2 = getDays(year1, month1);
		var year2 = year, month2 = month+1;
		if(month2 > 11){
			month2 = 0;
			year2++;
		}
		var style=0, year3=0, month3=0;
		for(var i=0, type=0, j=count2-startDay; i<42; i++){
			j++;
			switch(type){
				case 0:
					if(j>count2){
						j=1;
						style=1;//选定月份
						type++;
						year3=year;
						month3=month;
					}else{
						style=0;//还没到选定月份
						year3=year1;
						month3=month1;
					}
					break;
				case 1:
					if(j>count){
						j=1;
						style=3;//月份超过
						type++;
						year3=year2;
						month3=month2;
					}else{
						style=1;//选定月份
						year3=year;
						month3=month;
					}
					break;
				case 2:
					style=3;//月份超过
					year3=year2;
					month3=month2;
					break;
			}
			if(year3==input_year && month3==input_month && j==input_day)style=2;//被选中的日期
			datearray[i]=[year3, month3+1, j, style];
		}
		return datearray;
	}

	function createMyElement(){
		var a=document.createElement('div');
		a.style.visibility = 'hidden';
		a.style.display = 'none';
		a.style.zIndex = 1000;
		a.style.position = fixtype;//'absolute';
		a.id = 'calendar_container';
		a.className = 'zds_calendar';
		document.body.appendChild(a);
	}

	function ShowCalendar(){
		var x=0;
		var y=0;
		var today = '';
		if(inputBox!=null){
			//用于定位
			obj=inputBox;
			x=obj.offsetLeft;
			y=obj.offsetTop+obj.offsetHeight;
			while(obj=obj.offsetParent){
				x+=obj.offsetLeft;
				y+=obj.offsetTop;
			}
			
			if(inputBox.tagName.toUpperCase() == 'INPUT' && inputBox.type.toUpperCase() == 'TEXT'){
				//inputBox.onclick=function(e){stopBubble(e)};
				if(document.addEventListener){
					inputBox.addEventListener('click', function(e){stopBubble(e)}, false);
					//增加回车事件
					inputBox.addEventListener('keydown', function(e){keydown(e);}, false);
				}else{
					inputBox.attachEvent('onclick', function(e){stopBubble(e)});
					//增加回车事件
					inputBox.attachEvent('onkeydown', function(e){keydown(e);});
				}
				if(inputBox.value!='undefined'&&inputBox.value!=null&&typeof inputBox.value!='undefined')today = inputBox.value;
			}else{
				inputBox = null;
			}
		}
		if(X!=null)x=X;
		if(Y!=null)y=Y;
		
		var container=$('calendar_container');
		if(typeof(container)=='undefined' || container==null){
			createMyElement();
			container=$('calendar_container');
		}
		container.onclick=function(e){stopBubble(e)};
		
		if(def_date != '' && isDate(def_date)) today = def_date;
		if(isDate(today)) today = new getStringDay(today);
		else today = new getToday();
		
		var dd = new Date(today.year+'/'+(today.month+1)+'/'+today.day);
		if(min_date.length>0){
			d1 = new Date(min_date.replace(/\-/g, "\/"));
			if(dd<d1) today = new getStringDay(min_date);
		}
		if(max_date.length>0){
			d2 = new Date(max_date.replace(/\-/g, "\/"));
			if(dd>d2) today = new getStringDay(max_date);
		}
		
		input_year = curr_year = today.year;
		input_month = curr_month = today.month;
		input_day = curr_day = today.day;
		
		seldate = input_year+'-'+(input_month+1)+'-'+input_day;

		var html = '<div id="popupdiv" class="container"><div id="header" class="header"><div id="prevArrow" class="prev" mode="prev"></div><div id="ctitle" class="ctitle"><div id="year_title" class="title1">'+curr_year+'</div><div id="month_title" class="title1">'+months[curr_month]+'</div></div><div id="nextArrow" class="next" mode="next"></div></div>';
		html+='  <div id="body" class="body">';
		html+=setDayTable(curr_month, curr_day);
		html+='  </div>';
		var tmptoday = new getToday();
		html+='  <div id="today" class="today">今天: '+tmptoday.year+'-'+format(tmptoday.month+1)+'-'+format(tmptoday.day)+'</div></div>';//<div class="footer today"> </div>
		container.innerHTML=html;

		//计算显示位置
		container.style.left = x+'px';
		container.style.top = y+'px';
		container.style.display='block';
		container.style.visibility = '';
		//container.onSelectStart=function(){return false;};
		addDayEvent();
	}
	
	function format(v,l){
		l=(isUndefined(l))?2:l;
		v=v.toString();
		if(v.length<l){
			l-=v.length;
			for(i=0;i<l;i++)v='0'+v;
		}
		return v;
	}
	
	function formatDate(d){
		var matchArray = d.match(datePat);
		if(matchArray == null) return false;
		var year = matchArray[1];
		var month = matchArray[3];
		var day = matchArray[5];
		return year+'-'+format(month)+'-'+format(day);
	}
	
	function setDayTable(month,day){
		curr_month=month;
		curr_day = day>=0 ? day : curr_day;
		var html ='<table id="daysTable" border=0 cellSpacing=0 cellPadding=0><thead><tr>';
		for(week in days) html+='<td><div class="dayname">'+days[week]+'</div></td>';
		html+='</tr></thead><tbody id="daysBody">'+formDays(curr_year, curr_month, curr_day)+'</tbody></table>';
		return html;
	}
	
	function addDocumentEvent(){
		if(document.addEventListener){
			document.addEventListener('click', clickDocumentFun, false);//HiddenCalendar//
		}else if(document.attachEvent){
			document.attachEvent('onclick', clickDocumentFun);//HiddenCalendar//clickDocumentFun
		}
	}
	
	function rmDocumentEvent(){
		if(document.removeEventListener){
			document.removeEventListener('click', clickDocumentFun, false);//HiddenCalendar//clickDocumentFun
		}else if(document.detachEvent){  
			document.detachEvent('onclick', clickDocumentFun);//HiddenCalendar//clickDocumentFun
		}
	}
		
	//按键处理事件
	function keydown(e){
		if(isUndefined(e)) e = window.event || arguments.callee.caller.arguments[0];
		if(e.keyCode==13){
			clickDocumentFun();
			inputBox.blur();
		}
	}
	
	function clickDocumentFun(){
		seldate = '';
		//if(inputBox!=null && inputBox.value!='undefined' && inputBox.value!=null && typeof inputBox.value!='undefined'){
		if(inputBox!=null && inputBox!='undefined' && typeof inputBox!='undefined' && inputBox!=''){
			
			seldate = checkResultDate(inputBox.value);//inputBox.value
			
			result = finishFun(seldate);
			if(result == false)return;
			inputBox.value=seldate;
		}
		HiddenCalendar();
	}
	
	function formDays(year, month, day){
		if(isUndefined(day))day=0;
		var tmpstr='';
		var html='';
		datearray = datesStruct(year, month, day);
		month+=1;
		for(var row=0,i=0; row<6; row++){
			html+='<tr>';
			for(var col=0; col<7; col++, i++){
				switch(datearray[i][3]){
					case 0:
					case 3:
						tmpstr=' class="other"';
						break;
					case 1:
						tmpstr='';
						break;
					case 2:
						if(day == 0) tmpstr=' class="active"';
						break;
				}
				if(day > 0 && day == datearray[i][2] && month == datearray[i][1] && year == datearray[i][0]) tmpstr=' class="active"';
				html+='<td'+tmpstr+'><div id="day_'+row+'_'+col+'" class="day" title="'+datearray[i][0]+'-'+format(datearray[i][1])+'-'+format(datearray[i][2])+'">' + datearray[i][2] + '</div></td>';
			}
			html+='</tr>';
		}
		//alert(html);
		return html;
	}

	function addDayEvent(){
		var min_year = max_year = min_mon = max_mon = min_day = max_day = 0;
		if(min_date.length>0){
			min_day = new Date(min_date.replace(/\-/g, "\/"));
			matchArray = min_date.match(datePat);
			if(matchArray != null){
				min_year = Number(matchArray[1]);
				min_mon = Number(matchArray[3]);
			}
		}
		if(max_date.length>0){
			max_day = new Date(max_date.replace(/\-/g, "\/"));
			matchArray = max_date.match(datePat);
			if(matchArray != null){
				max_year = Number(matchArray[1]);
				max_mon = Number(matchArray[3]);
			}
		}

		var table_obj=$('daysBody');
		for(var i=0; i<table_obj.rows.length; i++){
			var tr_obj=table_obj.rows[i];
			for(var j=0; j<tr_obj.cells.length; j++){
				var td_obj=tr_obj.cells[j];
				tmp_day = new Date(td_obj.firstChild.getAttribute('title').replace(/\-/g, "\/"));
				if(min_day != 0 && tmp_day<min_day || max_day!=0 && tmp_day>max_day){
					td_obj.className = 'nosel';
					continue;
				}
				td_obj.onmouseover=function(e){tmpClass=this.className;this.className='hover';};
				td_obj.onmouseout=function(e){this.className=tmpClass;};
				td_obj.onclick=function(e){seldate=this.childNodes[0].title; setValue();};
			}
		}
		var tmpd = new getToday();
		var td = new Date(tmpd.year,tmpd.month,tmpd.day);
		var today_obj=$('today');
		today_obj.onmouseover=function(e){this.className='todayhover';};
		today_obj.onmouseout=function(e){this.className='today';};
		if((min_day==0 && max_day==0) || (min_day!=0 && max_day!=0 && min_day<=td && td<=max_day) || (min_day!=0 && max_day==0 && min_day<=td) || (min_day==0 && max_day!=0 && td<=max_day))
			today_obj.onclick=function(e){var tmptoday = new getToday();seldate=tmptoday.year+'-'+format(tmptoday.month+1)+'-'+format(tmptoday.day); setValue();};
		
		var year_title_obj = $('year_title');
		var month_title_obj = $('month_title');
		year_title_obj.onmouseover=function(e){this.className = 'hover_title1';};
		year_title_obj.onmouseout=function(e){this.className = 'title1';};
		month_title_obj.onmouseover=function(e){this.className = 'hover_title1';};
		month_title_obj.onmouseout=function(e){this.className = 'title1';};

		
		if(min_year==0 || min_mon==0 || (min_year>0 && min_mon>0 && (min_year < curr_year || (min_year == curr_year &&　min_mon-1 < curr_month)))) $('prevArrow').onclick = function(e){prevArrow(1);};
		else $('prevArrow').onclick=function(e){};
		if(max_year==0 || max_mon==0 || max_year > curr_year || (max_year == curr_year &&　max_mon-1 > curr_month)) $('nextArrow').onclick = function(e){nextArrow(1);};
		else $('nextArrow').onclick=function(e){};
		$('year_title').onclick=function(e){showYear();};
		$('month_title').onclick=function(e){showMonth();};
	}
	
	function showYear(){
		html ='  <table style="MARGIN:auto" id="yearsTable" border=0 cellSpacing=0 cellPadding=0>';
		html+='    <tbody id="yearsBody">';
		html+='      <tr>';
		html+='        <td class="other"><div id="year_0_0" class="year"></div></td>';
		html+='        <td><div id="year_0_1" class="year"></div></td>';
		html+='        <td><div id="year_0_2" class="year"></div></td>';
		html+='        <td><div id="year_0_3" class="year"></div></td>';
		html+='      </tr>';
		html+='      <tr>';
		html+='        <td><div id="year_1_0" class="year"></div></td>';
		html+='        <td><div id="year_1_1" class="year"></div></td>';
		html+='        <td><div id="year_1_2" class="year"></div></td>';
		html+='        <td><div id="year_1_3" class="year"></div></td>';
		html+='      </tr>';
		html+='      <tr>';
		html+='        <td><div id="year_2_0" class="year"></div></td>';
		html+='        <td><div id="year_2_1" class="year"></div></td>';
		html+='        <td><div id="year_2_2" class="year"></div></td>';
		html+='        <td class="other"><div id="year_2_3" class="year"></div></td>';
		html+='      </tr>';
		html+='    </tbody>';
		html+='  </table>';
		$('body').innerHTML=html;
		curr_year=(parseInt(curr_year/10))*10;
		$('ctitle').innerHTML='<div id="title" class="mtitle">'+curr_year+'-'+(curr_year+9)+'</div>';
		addYearEvent();
	}

	function addYearEvent(){
		var min_year = max_year = 0;
		if(min_date.length>0){
			matchArray = min_date.match(datePat);
			if(matchArray != null){
				min_year = Number(matchArray[1]);
			}
		}
		if(max_date.length>0){
			matchArray = max_date.match(datePat);
			if(matchArray != null){
				max_year = Number(matchArray[1]);
			}
		}
		var table_obj=$('yearsTable');
		var first_year = last_year = 0;
		for(var i=0, k=0; i<table_obj.rows.length; i++){
			var tr_obj=table_obj.rows[i];
			for(var j=0; j<tr_obj.cells.length; j++, k++){
				var td_obj=tr_obj.cells[j];
				year = curr_year+k-1;
				if(i==0 && j==0)first_year = year;
				if(i==2 && j==3)last_year = year;
				$('year_'+i+'_'+j).innerHTML=year;
				if((year<min_year || (max_year>0 && year>max_year))){//min_year>0 && 
					td_obj.className = 'nosel';
					continue;
				}
				td_obj.onmouseover=function(e){tmpClass=this.className;this.className='hover';};
				td_obj.onmouseout=function(e){this.className=tmpClass;};
				td_obj.onclick=function(e){selectYear(curr_year-1+this.cellIndex+this.parentNode.rowIndex*tr_obj.cells.length);};
			}
		}
		if(min_year==0 || (min_year>0 && first_year > min_year)) $('prevArrow').onclick=function(e){prevArrow(3);};
		else $('prevArrow').onclick=function(){};
		if(max_year==0 || (max_year>0 && last_year < max_year)) $('nextArrow').onclick=function(e){nextArrow(3);};
		else $('nextArrow').onclick=function(e){};
	}

	function selectYear(year){
		curr_year = year;
		showMonth();
	}

	function showMonth(){
		html ='  <table id="monthsTable" border=0 cellSpacing=0 cellPadding=0>';
		html+='    <tbody id="monthsBody">';
		html+='      <tr>';
		html+='        <td><div id="month_0_0" class="month">一月</div></td>';
		html+='        <td><div id="month_0_1" class="month">二月</div></td>';
		html+='        <td><div id="month_0_2" class="month">三月</div></td>';
		html+='        <td><div id="month_0_3" class="month">四月</div></td>';
		html+='      </tr>';
		html+='      <tr>';
		html+='        <td><div id="month_1_0" class="month">五月</div></td>';
		html+='        <td><div id="month_1_1" class="month">六月</div></td>';
		html+='        <td><div id="month_1_2" class="month">七月</div></td>';
		html+='        <td><div id="month_1_3" class="month">八月</div></td>';
		html+='      </tr>';
		html+='      <tr>';
		html+='        <td><div id="month_2_0" class="month">九月</div></td>';
		html+='        <td><div id="month_2_1" class="month">十月</div></td>';
		html+='        <td><div id="month_2_2" class="month">十一月</div></td>';
		html+='        <td><div id="month_2_3" class="month">十二月</div></td>';
		html+='      </tr>';
		html+='    </tbody>';
		html+='  </table>';
		$('body').innerHTML=html;
		$('ctitle').innerHTML='<div id="title" class="title">'+curr_year+'</div>';
		addMonthEvent();
	}

	function addMonthEvent(){
		var min_year = max_year = min_mon = max_mon = 0;
		if(min_date.length>0){
			matchArray = min_date.match(datePat);
			if(matchArray != null){
				min_year = Number(matchArray[1]);
				min_mon = Number(matchArray[3]);
			}
		}
		if(max_date.length>0){
			matchArray = max_date.match(datePat);
			if(matchArray != null){
				max_year = Number(matchArray[1]);
				max_mon = Number(matchArray[3]);
			}
		}
		
		var ctitle_obj=$('title');
		var table_obj=$('monthsTable');
		for(var i=0; i<table_obj.rows.length; i++){
			var tr_obj=table_obj.rows[i];
			for(var j=0; j<tr_obj.cells.length; j++){
				var td_obj=tr_obj.cells[j];
				if((min_mon>0 && curr_year <= min_year && i*4+j+1<min_mon) || (max_mon>0 && curr_year >= max_year && i*4+j+1>max_mon)){
					td_obj.className = 'nosel';
					continue;
				}
				td_obj.onmouseover=function(e){this.className='hover';};
				td_obj.onmouseout=function(e){this.className='';};
				td_obj.onclick=function(e){selectMonth(this.cellIndex+this.parentNode.rowIndex*tr_obj.cells.length);};
			}
		}
		if(min_year==0 || (min_year>0 && curr_year > min_year))$('prevArrow').onclick=function(e){prevArrow(2);};
		else $('prevArrow').onclick=function(e){};
		if(max_year==0 || curr_year < max_year)$('nextArrow').onclick=function(e){nextArrow(2);};
		else $('nextArrow').onclick=function(e){};
		$('title').onclick=function(e){showYear()};
	}

	function selectMonth(month){
		curr_month=month;
		$('body').innerHTML=setDayTable(month,0);
		$('ctitle').innerHTML='<div id="year_title" class="title1">'+curr_year+'</div><div id="month_title" class="title1">'+months[curr_month]+'</div>';
		addDayEvent();
	}
	
	function prevArrow(type, defday){
		if(type==1){
			curr_month--;
			if(curr_month<0){
				curr_month=11;
				curr_year--;
			}
			$('year_title').innerHTML=curr_year;
			$('month_title').innerHTML=months[curr_month];
			curr_day = defday ? defday : curr_day;
			//$('daysBody').innerHTML = formDays(curr_year, curr_month, curr_day);
			//addDayEvent();
			$('body').innerHTML=setDayTable(curr_month, 0);
			addDayEvent();
		}else if(type==2){
			$('title').innerHTML=--curr_year;
			showMonth();
		}else if(type==3){
			curr_year-=10;
			showYear();
		}
	}

	function nextArrow(type, defday){
		if(type==1){
			curr_month++;
			if(curr_month>11){
				curr_month=0;
				curr_year++;
			}
			$('year_title').innerHTML=curr_year;
			$('month_title').innerHTML=months[curr_month];

			curr_day = defday ? defday : curr_day;
			//$('daysBody').innerHTML = formDays(curr_year, curr_month, curr_day);
			//addDayEvent();
			
			$('body').innerHTML=setDayTable(curr_month, 0);
			addDayEvent();
		
		}else if(type==2){
			$('title').innerHTML=++curr_year;
			showMonth();
		}else if(type==3){
			curr_year+=10;
			showYear();
		}
	}

	function HiddenCalendar(){
		var container=$('calendar_container');
		container.style.display='none';
		container.style.visibility='hidden';
		rmDocumentEvent();
	}
	
	function checkResultDate(seldate){
		if(seldate.length>0 && isDate(seldate)){
			seldate = formatDate(seldate);
		}else seldate='';
		
		var d1 = d2 = sd = null;
		if(min_date.length>0){
			d1 = new Date(min_date.replace(/\-/g, "\/"));
		}
		if(max_date.length>0){
			d2 = new Date(max_date.replace(/\-/g, "\/"));
		}
		if(seldate.length>0){
			sd = new Date(seldate.replace(/\-/g, "\/"));
		}
		if(sd != null && ((d1 != null && sd < d1) || (d2 != null && sd > d2))){
			seldate = '';
		}
		return seldate;
	}
	
	function setValue(){
		HiddenCalendar();
		//if(inputBox!=null && inputBox.value!='undefined' && inputBox.value!=null && typeof inputBox.value!='undefined'){//
		if(inputBox!=null && inputBox!='undefined' && typeof inputBox!='undefined' && inputBox!=''){
			//alert(seldate+'|'+inputBox.value);
			//if(inputBox.value == '') seldate = '';
			//else{
			if(seldate == '') seldate = trim(inputBox.value);
			inputBox.value = '';
			//}
			
			
			seldate = checkResultDate(seldate);
			
			result = finishFun(seldate);
			if(result == false)return;
			inputBox.value=seldate;
		}else{
			if(seldate != ''){
				seldate = checkResultDate(seldate);
				finishFun(seldate);
			}
		}
	}
	addDocumentEvent();
	ShowCalendar();
}