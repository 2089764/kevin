/**
 * zdsAvatar.js Document 头像编辑
 *
 * @author	DonYue Team
 * @version	$Revision: 0.01 $
 * @copyright	Copyright (C) 2006-2011 DonYue Team
 * @package	DonYue
 */

(function(){
	var ZDSAVATAR={};
	ZDSAVATAR.FileName='';
	ZDSAVATAR.picFormat ='|jpg|gif|png|bmp|jpeg|';
	ZDSAVATAR.zoomSize=1;
	ZDSAVATAR.lockBi=1;//是否锁定宽高比例
	ZDSAVATAR.imgSize={width:0, height:0};

	$=function(id){
		return document.getElementById(id);
	};
	
	ZDSAVATAR.isPicFile=function(fileName){
		var extName = fileName.substring(fileName.lastIndexOf('.') + 1);
		return ZDSAVATAR.picFormat.indexOf('|' + extName.toLowerCase() + '|') > -1;
	}
	
	ZDSAVATAR.uploadPic=function(){
		ZDSAVATAR.PicFile=$('ZDSAVATAR_PicFile');//文件选择框
		if(!ZDSAVATAR.isPicFile(ZDSAVATAR.PicFile.value)){
			alert('请选择正确的图片,支持的格式包括,jpg、gif、png、bmp、jpeg!');
			return;
		}
		ZDSAVATAR.uploadFrm = $('ZDSAVATAR_uploadFrm');//form表单
		ZDSAVATAR.uploadFrm.action = 'user.php?action=user_uploadavatar';
		ZDSAVATAR.uploadFrm.encoding = 'multipart/form-data';
		ZDSAVATAR.uploadFrm.target = 'ZDSAVATAR_upload_iframe';
		ZDSAVATAR.uploadFrm.submit();
	}
	
	ZDSAVATAR.setImg=function(){
		
	}
	
	ZDSAVATAR.init=function(status, picName, width, height){
		//alert("aa");
		if(status!="success"){
			alert(status);
			return;
		}
		
		ZDSAVATAR.HideImg=$('ZDSAVATAR_HideImg');//半透明图片
		ZDSAVATAR.MainImg=$('ZDSAVATAR_MainImg');//框选高亮的图片
		ZDSAVATAR.DragDiv=$("ZDSAVATAR_DragDiv");//框选框div
		ZDSAVATAR.SizeDiv=$("ZDSAVATAR_SizeDiv");//用于缩放拖拉的小方框
		ZDSAVATAR.ZoomSlide=$("ZDSAVATAR_ZoomSlide");//缩放拖动滑块
		ZDSAVATAR.Msg01=$('ZDSAVATAR_Msg01');//提示1
		ZDSAVATAR.Msg02=$('ZDSAVATAR_Msg02');//提示2
		ZDSAVATAR.Edit=$('ZDSAVATAR_Edit');//编辑区域
		ZDSAVATAR.Zoom=$('ZDSAVATAR_Zoom');//缩放区域
		ZDSAVATAR.preDiv=$("ZDSAVATAR_preDiv");//预览图片区域
		ZDSAVATAR.preDiv.innerHTML='<img src="'+picName+'" id="ZDSAVATAR_Preview" style="position: absolute;">';
		ZDSAVATAR.Preview=$("ZDSAVATAR_Preview");//预览的图片
		ZDSAVATAR.picFileName=picName;//文件名
		
		ZDSAVATAR.Msg01.style.display='none';
		ZDSAVATAR.Msg02.style.display='none';
		ZDSAVATAR.Edit.style.display='block';
		ZDSAVATAR.Zoom.style.display='block';
		
		ZDSAVATAR.imgSize.height=height;
		ZDSAVATAR.imgSize.width=width;
		
		ZDSAVATAR.MainImg.src=ZDSAVATAR.HideImg.src=picName;
		ZDSAVATAR.MainImg.style.width=ZDSAVATAR.HideImg.style.width=width+"px";
		ZDSAVATAR.MainImg.style.height=ZDSAVATAR.HideImg.style.height=height+"px";

		ZDSAVATAR.il=(310-width)/2;//图片位置
		ZDSAVATAR.it=(310-height)/2;
		ZDSAVATAR.iw=width;//图片大小
		ZDSAVATAR.ih=height;
		ZDSAVATAR.dw=60;//框选框div的大小
		ZDSAVATAR.dh=60;
		ZDSAVATAR.zoomSize=1;
		ZDSAVATAR.ZoomSlide.style.left="115px";
		ZDSAVATAR.dt=0;
		ZDSAVATAR.dl=0;
		
		ZDSAVATAR.MainImg.style.left=ZDSAVATAR.HideImg.style.left=ZDSAVATAR.il+"px";
		ZDSAVATAR.MainImg.style.top=ZDSAVATAR.HideImg.style.top=ZDSAVATAR.it+"px";
		
		if(ZDSAVATAR.lockBi){
			ZDSAVATAR.dw=ZDSAVATAR.dh=(ZDSAVATAR.dw>ZDSAVATAR.dh)?ZDSAVATAR.dh:ZDSAVATAR.dw;
			ZDSAVATAR.DragDiv.style.width=ZDSAVATAR.DragDiv.style.height=ZDSAVATAR.dw+"px";
			ZDSAVATAR.dt=ZDSAVATAR.dl=(310-ZDSAVATAR.dw)/2;
		}else{
			ZDSAVATAR.dt=(310-ZDSAVATAR.dh)/2;
			ZDSAVATAR.dl=(310-ZDSAVATAR.dw)/2;
		}
		ZDSAVATAR.DragDiv.style.width=ZDSAVATAR.dw+"px";
		ZDSAVATAR.DragDiv.style.height=ZDSAVATAR.dh+"px";
		ZDSAVATAR.DragDiv.style.top=ZDSAVATAR.dt+"px";
		ZDSAVATAR.DragDiv.style.left=ZDSAVATAR.dl+"px";
		
		ZDSAVATAR.idt=ZDSAVATAR.dt-ZDSAVATAR.it;//主图片的框选高亮的位置
		ZDSAVATAR.idl=ZDSAVATAR.dl-ZDSAVATAR.il;
		ZDSAVATAR.idr=ZDSAVATAR.idl+ZDSAVATAR.dw;
		ZDSAVATAR.idb=ZDSAVATAR.idt+ZDSAVATAR.dh;
		ZDSAVATAR.MainImg.style.clip = "rect("+ZDSAVATAR.idt+"px "+ZDSAVATAR.idr+"px "+ZDSAVATAR.idb+"px "+ZDSAVATAR.idl+"px)";
		
		ZDSAVATAR.bei=1;
		ZDSAVATAR.pl=ZDSAVATAR.pt=0;//预览图片位置
		ZDSAVATAR.pit=ZDSAVATAR.pir=ZDSAVATAR.pib=ZDSAVATAR.pil=0;//预览图片的显示窗口位置
		ZDSAVATAR.ph=ZDSAVATAR.pw=0;//预览图片的宽度
		if(ZDSAVATAR.dw>=ZDSAVATAR.dh){
			ZDSAVATAR.bei=120/ZDSAVATAR.dw;
			ZDSAVATAR.pl=-ZDSAVATAR.idl*ZDSAVATAR.bei;
			ZDSAVATAR.pt=(60-(ZDSAVATAR.idt+ZDSAVATAR.dh/2)*ZDSAVATAR.bei);
			ZDSAVATAR.pw=width*ZDSAVATAR.bei;
			ZDSAVATAR.pit=ZDSAVATAR.idt*ZDSAVATAR.bei;
			ZDSAVATAR.pir=ZDSAVATAR.idr*ZDSAVATAR.bei;
			ZDSAVATAR.pib=ZDSAVATAR.idb*ZDSAVATAR.bei;
			ZDSAVATAR.pil=ZDSAVATAR.pl;
			ZDSAVATAR.Preview.style.width = ZDSAVATAR.pw+"px";
		}else{
			ZDSAVATAR.bei=120/ZDSAVATAR.dh;
			ZDSAVATAR.pt=-ZDSAVATAR.idt*ZDSAVATAR.bei;
			ZDSAVATAR.pl=(60-(ZDSAVATAR.idl+ZDSAVATAR.dw/2)*ZDSAVATAR.bei)+"px";
			ZDSAVATAR.ph=height*ZDSAVATAR.bei;
			ZDSAVATAR.pit=-ZDSAVATAR.pt;
			ZDSAVATAR.pir=ZDSAVATAR.idr*ZDSAVATAR.bei;
			ZDSAVATAR.pib=ZDSAVATAR.idb*ZDSAVATAR.bei;
			ZDSAVATAR.pil=ZDSAVATAR.idl*ZDSAVATAR.bei;
			ZDSAVATAR.Preview.style.height=ZDSAVATAR.ph+"px";
		}
		ZDSAVATAR.Preview.style.left=ZDSAVATAR.pl+"px";
		ZDSAVATAR.Preview.style.top=ZDSAVATAR.pt+"px";
		ZDSAVATAR.Preview.style.clip = "rect("+ZDSAVATAR.pit+"px "+ZDSAVATAR.pir+"px "+ZDSAVATAR.pib+"px "+ZDSAVATAR.pil+"px)";
	};

	//设置默认属性
	ZDSAVATAR.SetOptions = function(options){
		ZDSAVATAR.options = {//默认值
			lockBi:			true,//是否锁定选择框的大小比例
			onOKClick:		ZDSAVATAR.OKClick
		};
		ZDSAVATAR.Extend(ZDSAVATAR.options, options || {});
	};
	
	ZDSAVATAR.OKClick = function(){
		ZDSAVATAR.uploadFrm = $('ZDSAVATAR_uploadFrm');//form表单
		
		ZDSAVATAR.picName = $('picName');
		ZDSAVATAR.width = $('width');
		ZDSAVATAR.height = $('height');
		ZDSAVATAR.left = $('left');
		ZDSAVATAR.top = $('top');
		ZDSAVATAR.rate = $('rate');
		
		ZDSAVATAR.picName.value=ZDSAVATAR.picFileName;
		ZDSAVATAR.width.value=parseInt(ZDSAVATAR.DragDiv.style.width)/ZDSAVATAR.zoomSize;
		ZDSAVATAR.height.value=parseInt(ZDSAVATAR.DragDiv.style.height)/ZDSAVATAR.zoomSize;
		ZDSAVATAR.left.value=ZDSAVATAR.idl/ZDSAVATAR.zoomSize;
		ZDSAVATAR.top.value=ZDSAVATAR.idt/ZDSAVATAR.zoomSize;
		ZDSAVATAR.rate.value=ZDSAVATAR.zoomSize;
		//alert(parseInt(ZDSAVATAR.DragDiv.style.width)+"--"+parseInt(ZDSAVATAR.DragDiv.style.height)+"--"+ZDSAVATAR.idl+"--"+ZDSAVATAR.idt+"--"+ZDSAVATAR.width.value+"--"+ZDSAVATAR.height.value+"--"+ZDSAVATAR.left.value+"--"+ZDSAVATAR.top.value+"--"+ZDSAVATAR.zoomSize);
		ZDSAVATAR.uploadFrm.action = 'user.php?action=user_editavatar';
		ZDSAVATAR.uploadFrm.target = 'ZDSAVATAR_upload_iframe';
		ZDSAVATAR.uploadFrm.submit();
	};
	
	ZDSAVATAR.resetPic = function(){
		ZDSAVATAR.Msg01.style.display='block';
		ZDSAVATAR.Msg02.style.display='block';
		ZDSAVATAR.Edit.style.display='none';
		ZDSAVATAR.Zoom.style.display='none';
		ZDSAVATAR.preDiv.innerHTML='头像预览';
	};
	
	ZDSAVATAR.MoveBefore = function(){
		ZDSAVATAR.dw=parseInt(ZDSAVATAR.DragDiv.style.width);//虚线框的宽度
		ZDSAVATAR.dh=parseInt(ZDSAVATAR.DragDiv.style.height);//
		ZDSAVATAR.il=parseInt(ZDSAVATAR.MainImg.style.left);//图片左边缘坐标
		ZDSAVATAR.it=parseInt(ZDSAVATAR.MainImg.style.top);//图片顶边缘坐标
		ZDSAVATAR.iw=parseInt(ZDSAVATAR.MainImg.width);//图片宽度
		ZDSAVATAR.ih=parseInt(ZDSAVATAR.MainImg.height);//图片高度
		ZDSAVATAR.minX=310>ZDSAVATAR.iw?(310-ZDSAVATAR.iw)/2:0;//虚线框左边缘的最小坐标
		ZDSAVATAR.minY=310>ZDSAVATAR.ih?(310-ZDSAVATAR.ih)/2:0;//虚线框顶部边缘的最小坐标
		ZDSAVATAR.maxX=(310>ZDSAVATAR.iw?(ZDSAVATAR.minX+ZDSAVATAR.iw):310)-ZDSAVATAR.dw;//
		ZDSAVATAR.maxY=(310>ZDSAVATAR.ih?(ZDSAVATAR.minY+ZDSAVATAR.ih):310)-ZDSAVATAR.dh;
		if(ZDSAVATAR.dw>ZDSAVATAR.dh)ZDSAVATAR.bei=120/ZDSAVATAR.dw;
		else ZDSAVATAR.bei=120/ZDSAVATAR.dh;
		ZDSAVATAR.hen=(310-ZDSAVATAR.iw)/(310-ZDSAVATAR.dw);
		ZDSAVATAR.zon=(310-ZDSAVATAR.ih)/(310-ZDSAVATAR.dh);
	};
	
	ZDSAVATAR.MoveFun = function(X,Y){
		if(X<ZDSAVATAR.minX)X=ZDSAVATAR.minX;
		if(Y<ZDSAVATAR.minY)Y=ZDSAVATAR.minY;
		if(X>ZDSAVATAR.maxX)X=ZDSAVATAR.maxX;
		if(Y>ZDSAVATAR.maxY)Y=ZDSAVATAR.maxY;
		ZDSAVATAR.dl=X;
		ZDSAVATAR.dt=Y;
		ZDSAVATAR.DragDiv.style.left=ZDSAVATAR.dl+"px";
		ZDSAVATAR.DragDiv.style.top=ZDSAVATAR.dt+"px";
		if(ZDSAVATAR.iw>310 && 310>ZDSAVATAR.dw){
			ZDSAVATAR.il=ZDSAVATAR.dl*ZDSAVATAR.hen;
			ZDSAVATAR.HideImg.style.left=ZDSAVATAR.MainImg.style.left=ZDSAVATAR.il+"px";
		}
		if(ZDSAVATAR.ih>310 && 310>ZDSAVATAR.dh){
			ZDSAVATAR.it=ZDSAVATAR.dt*ZDSAVATAR.zon;
			ZDSAVATAR.HideImg.style.top=ZDSAVATAR.MainImg.style.top=ZDSAVATAR.it+"px";
		}
		ZDSAVATAR.idt=ZDSAVATAR.dt-ZDSAVATAR.it;//主图片的框选高亮的位置
		ZDSAVATAR.idl=ZDSAVATAR.dl-ZDSAVATAR.il;
		ZDSAVATAR.idr=ZDSAVATAR.idl+ZDSAVATAR.dw;
		ZDSAVATAR.idb=ZDSAVATAR.idt+ZDSAVATAR.dh;
		
		ZDSAVATAR.MainImg.style.clip = "rect(" + ZDSAVATAR.idt + "px " + ZDSAVATAR.idr + "px " + ZDSAVATAR.idb + "px " + ZDSAVATAR.idl + "px)";
		if(ZDSAVATAR.dw>=ZDSAVATAR.dh){
			ZDSAVATAR.pl=-ZDSAVATAR.idl*ZDSAVATAR.bei;
			ZDSAVATAR.pt=(60-(ZDSAVATAR.idt+ZDSAVATAR.dh/2)*ZDSAVATAR.bei);
			ZDSAVATAR.pw=ZDSAVATAR.iw*ZDSAVATAR.bei;
			ZDSAVATAR.pit=ZDSAVATAR.idt*ZDSAVATAR.bei;
			ZDSAVATAR.pir=ZDSAVATAR.idr*ZDSAVATAR.bei;
			ZDSAVATAR.pib=ZDSAVATAR.idb*ZDSAVATAR.bei;
			ZDSAVATAR.pil=ZDSAVATAR.pl;
		}else{
			ZDSAVATAR.pt=-ZDSAVATAR.idt*ZDSAVATAR.bei;
			ZDSAVATAR.pl=(60-(ZDSAVATAR.idl+ZDSAVATAR.dw/2)*ZDSAVATAR.bei)+"px";
			ZDSAVATAR.ph=ZDSAVATAR.ih*ZDSAVATAR.bei;
			ZDSAVATAR.pit=-ZDSAVATAR.pt;
			ZDSAVATAR.pir=ZDSAVATAR.idr*ZDSAVATAR.bei;
			ZDSAVATAR.pib=ZDSAVATAR.idb*ZDSAVATAR.bei;
			ZDSAVATAR.pil=ZDSAVATAR.idl*ZDSAVATAR.bei;
		}
		ZDSAVATAR.Preview.style.left=ZDSAVATAR.pl+"px";
		ZDSAVATAR.Preview.style.top=ZDSAVATAR.pt+"px";
		ZDSAVATAR.Preview.style.clip = "rect("+ZDSAVATAR.pit+"px "+ZDSAVATAR.pir+"px "+ZDSAVATAR.pib+"px "+ZDSAVATAR.pil+"px)";
	};
	
	ZDSAVATAR.SizeBefore = function(X,Y){
		ZDSAVATAR.dw=parseInt(ZDSAVATAR.DragDiv.style.width);//虚线框的宽
		ZDSAVATAR.dh=parseInt(ZDSAVATAR.DragDiv.style.height);
		ZDSAVATAR.dl=parseInt(ZDSAVATAR.DragDiv.style.left);//虚线框的左边缘坐标
		ZDSAVATAR.dt=parseInt(ZDSAVATAR.DragDiv.style.top);//虚线框的顶部边缘坐标
		ZDSAVATAR.iw=parseInt(ZDSAVATAR.MainImg.width);//预览的图片的宽
		ZDSAVATAR.ih=parseInt(ZDSAVATAR.MainImg.height);
		ZDSAVATAR.il=parseInt(ZDSAVATAR.MainImg.style.left);//用于高亮显示的图片的左侧边缘坐标
		ZDSAVATAR.it=parseInt(ZDSAVATAR.MainImg.style.top);//用于高亮显示的图片的顶部边缘坐标
		ZDSAVATAR.idl=ZDSAVATAR.dl-ZDSAVATAR.il;//虚线框在图片上的相对x坐标(相当于图片左边缘到虚线框左边缘的距离)
		ZDSAVATAR.idt=ZDSAVATAR.dt-ZDSAVATAR.it;//虚线框在图片上的相对y坐标(相当于图片顶边缘到虚线框顶边缘的距离)
		ZDSAVATAR.idw=310>ZDSAVATAR.iw?ZDSAVATAR.iw-ZDSAVATAR.idl:310-ZDSAVATAR.dl;//虚线框在当前位置能拉伸到的最大宽度
		ZDSAVATAR.idh=310>ZDSAVATAR.ih?ZDSAVATAR.ih-ZDSAVATAR.idt:310-ZDSAVATAR.dt;//虚线框在当前位置能拉伸到的最大高度
		ZDSAVATAR.tmpx=ZDSAVATAR.dw-X;
		ZDSAVATAR.tmpy=ZDSAVATAR.dh-Y;
	};
	
	ZDSAVATAR.SizeFun = function(X,Y){
		ZDSAVATAR.dw=X+ZDSAVATAR.tmpx;
		ZDSAVATAR.dh=Y+ZDSAVATAR.tmpy;
		if(ZDSAVATAR.dw<40)ZDSAVATAR.dw=40;
		if(ZDSAVATAR.dh<40)ZDSAVATAR.dh=40;
		if(ZDSAVATAR.dw>ZDSAVATAR.idw)ZDSAVATAR.dw=ZDSAVATAR.idw;
		if(ZDSAVATAR.dh>ZDSAVATAR.idh)ZDSAVATAR.dh=ZDSAVATAR.idh;
		if(ZDSAVATAR.lockBi)ZDSAVATAR.dw=ZDSAVATAR.dh=(ZDSAVATAR.dw>ZDSAVATAR.dh)?ZDSAVATAR.dh:ZDSAVATAR.dw;
		ZDSAVATAR.DragDiv.style.width=ZDSAVATAR.dw+"px"
		ZDSAVATAR.DragDiv.style.height=ZDSAVATAR.dh+"px";
		
		if(ZDSAVATAR.iw>310){
			if(310>ZDSAVATAR.dw){
				ZDSAVATAR.il=ZDSAVATAR.dl*(310-ZDSAVATAR.iw)/(310-ZDSAVATAR.dw);
				ZDSAVATAR.MainImg.style.left=ZDSAVATAR.HideImg.style.left=ZDSAVATAR.il+"px";
			}
			ZDSAVATAR.idl=ZDSAVATAR.dl-ZDSAVATAR.il;
		}
		if(ZDSAVATAR.ih>310){
			if(310>ZDSAVATAR.dh){
				ZDSAVATAR.it=ZDSAVATAR.dt*(310-ZDSAVATAR.ih)/(310-ZDSAVATAR.dh);
				ZDSAVATAR.MainImg.style.top=ZDSAVATAR.HideImg.style.top=ZDSAVATAR.it+"px";
			}
			ZDSAVATAR.idt=ZDSAVATAR.dt-ZDSAVATAR.it;
		}
		ZDSAVATAR.MainImg.style.clip = "rect("+ZDSAVATAR.idt+"px " + (ZDSAVATAR.idl+ZDSAVATAR.dw) + "px " + (ZDSAVATAR.idt+ZDSAVATAR.dh) + "px "+ZDSAVATAR.idl+"px)";

		if(ZDSAVATAR.dw>ZDSAVATAR.dh){
			ZDSAVATAR.bei=120/ZDSAVATAR.dw;
			ZDSAVATAR.Preview.style.width=(ZDSAVATAR.iw*ZDSAVATAR.bei)+"px";
			ZDSAVATAR.Preview.style.height="auto";
			ZDSAVATAR.Preview.style.left=-(ZDSAVATAR.idl*ZDSAVATAR.bei)+"px";
			ZDSAVATAR.Preview.style.top=(60-(ZDSAVATAR.idt+ZDSAVATAR.dh/2)*ZDSAVATAR.bei)+"px";
		}else{
			ZDSAVATAR.bei=120/ZDSAVATAR.dh;
			ZDSAVATAR.Preview.style.width="auto";
			ZDSAVATAR.Preview.style.height=ZDSAVATAR.ih*ZDSAVATAR.bei+"px";
			ZDSAVATAR.Preview.style.left=(60-(ZDSAVATAR.idl+ZDSAVATAR.dw/2)*ZDSAVATAR.bei)+"px";
			ZDSAVATAR.Preview.style.top=-(ZDSAVATAR.idt*ZDSAVATAR.bei)+"px";
		}
		ZDSAVATAR.Preview.style.clip = "rect("+ZDSAVATAR.idt*ZDSAVATAR.bei+"px "+(ZDSAVATAR.idl+ZDSAVATAR.dw)*ZDSAVATAR.bei+"px "+(ZDSAVATAR.idt+ZDSAVATAR.dh)*ZDSAVATAR.bei+"px "+ZDSAVATAR.idl*ZDSAVATAR.bei+"px)";
	};
	
	ZDSAVATAR.ZoomBefore = function(){
		ZDSAVATAR.dw=parseInt(ZDSAVATAR.DragDiv.style.width);
		ZDSAVATAR.dh=parseInt(ZDSAVATAR.DragDiv.style.height);
		ZDSAVATAR.dl=parseInt(ZDSAVATAR.DragDiv.style.left);
		ZDSAVATAR.dt=parseInt(ZDSAVATAR.DragDiv.style.top);
		ZDSAVATAR.il=parseInt(ZDSAVATAR.MainImg.style.left);
		ZDSAVATAR.it=parseInt(ZDSAVATAR.MainImg.style.top);
		ZDSAVATAR.iw=parseInt(ZDSAVATAR.MainImg.width);
		ZDSAVATAR.ih=parseInt(ZDSAVATAR.MainImg.height);
		ZDSAVATAR.dr=ZDSAVATAR.dl+ZDSAVATAR.dw;
		ZDSAVATAR.db=ZDSAVATAR.dt+ZDSAVATAR.dh;
	};
	
	ZDSAVATAR.ZoomFun = function(X,Y){
		if(X<0)X=0;
		if(X>230)X=230;
		ZDSAVATAR.ZoomSlide.style.left=X+"px";
		ZDSAVATAR.zoomSize=(X+50)/165;
		
		ZDSAVATAR.iw=ZDSAVATAR.imgSize.width*ZDSAVATAR.zoomSize;//图片大小
		ZDSAVATAR.ih=ZDSAVATAR.imgSize.height*ZDSAVATAR.zoomSize;
		ZDSAVATAR.MainImg.style.width=ZDSAVATAR.HideImg.style.width=ZDSAVATAR.iw+"px";//图片位置
		ZDSAVATAR.MainImg.style.height=ZDSAVATAR.HideImg.style.height=ZDSAVATAR.ih+"px";
		if(ZDSAVATAR.iw>310)ZDSAVATAR.il=(310-ZDSAVATAR.iw)*ZDSAVATAR.dl/(310-ZDSAVATAR.dw);
		else ZDSAVATAR.il=(310-ZDSAVATAR.iw)/2;
		if(ZDSAVATAR.ih>310)ZDSAVATAR.it=(310-ZDSAVATAR.ih)*ZDSAVATAR.dt/(310-ZDSAVATAR.dh);
		else ZDSAVATAR.it=(310-ZDSAVATAR.ih)/2;
		ZDSAVATAR.MainImg.style.left=ZDSAVATAR.HideImg.style.left=ZDSAVATAR.il+"px";
		ZDSAVATAR.MainImg.style.top=ZDSAVATAR.HideImg.style.top=ZDSAVATAR.it+"px";
		ZDSAVATAR.ir=ZDSAVATAR.il+ZDSAVATAR.iw;
		ZDSAVATAR.ib=ZDSAVATAR.it+ZDSAVATAR.ih;
		
		if(ZDSAVATAR.il>ZDSAVATAR.dl){
			if(ZDSAVATAR.iw>ZDSAVATAR.dw) ZDSAVATAR.dl=ZDSAVATAR.il;
			else{
				ZDSAVATAR.dl=ZDSAVATAR.il;
				ZDSAVATAR.dw=ZDSAVATAR.iw;
			}
		}
		if(ZDSAVATAR.it>ZDSAVATAR.dt){
			if(ZDSAVATAR.ih>ZDSAVATAR.dh) ZDSAVATAR.dt=ZDSAVATAR.it;
			else{
				ZDSAVATAR.dt=ZDSAVATAR.it;
				ZDSAVATAR.dh=ZDSAVATAR.ih;
			}
		}
		if(ZDSAVATAR.ir<ZDSAVATAR.dr){
			if(ZDSAVATAR.iw>ZDSAVATAR.dw) ZDSAVATAR.dl=ZDSAVATAR.ir-ZDSAVATAR.dw;
			else{
				ZDSAVATAR.dl=ZDSAVATAR.il;
				ZDSAVATAR.dw=ZDSAVATAR.iw;
			}
		}
		if(ZDSAVATAR.ib<ZDSAVATAR.db){
			if(ZDSAVATAR.ih>ZDSAVATAR.dh) ZDSAVATAR.dt=ZDSAVATAR.ib-ZDSAVATAR.dh;
			else{
				ZDSAVATAR.dt=ZDSAVATAR.it;
				ZDSAVATAR.dh=ZDSAVATAR.ih;
			}
		}
		ZDSAVATAR.DragDiv.style.left=ZDSAVATAR.dl+"px";
		ZDSAVATAR.DragDiv.style.top=ZDSAVATAR.dt+"px";
		if(ZDSAVATAR.lockBi)ZDSAVATAR.dw=ZDSAVATAR.dh=(ZDSAVATAR.dw>ZDSAVATAR.dh)?ZDSAVATAR.dh:ZDSAVATAR.dw;
		ZDSAVATAR.DragDiv.style.width=ZDSAVATAR.dw+"px";
		ZDSAVATAR.DragDiv.style.height=ZDSAVATAR.dh+"px";
		ZDSAVATAR.MainImg.style.clip = "rect(" + (ZDSAVATAR.dt-ZDSAVATAR.it) + "px " + (ZDSAVATAR.dl-ZDSAVATAR.il+ZDSAVATAR.dw) + "px " + (ZDSAVATAR.dt-ZDSAVATAR.it+ZDSAVATAR.dh) + "px " + (ZDSAVATAR.dl-ZDSAVATAR.il) + "px)";
		
		if(ZDSAVATAR.dw>ZDSAVATAR.dh){
			ZDSAVATAR.bei=120/ZDSAVATAR.dw;
			ZDSAVATAR.Preview.style.width=(ZDSAVATAR.iw*ZDSAVATAR.bei)+"px";
			ZDSAVATAR.Preview.style.height="auto";
			ZDSAVATAR.Preview.style.left=((ZDSAVATAR.il-ZDSAVATAR.dl)*ZDSAVATAR.bei)+"px";
			ZDSAVATAR.Preview.style.top=(60-(ZDSAVATAR.dt-ZDSAVATAR.it+ZDSAVATAR.dh/2)*ZDSAVATAR.bei)+"px";
		}else{
			ZDSAVATAR.bei=120/ZDSAVATAR.dh;
			ZDSAVATAR.Preview.style.width="auto";
			ZDSAVATAR.Preview.style.height=ZDSAVATAR.ih*ZDSAVATAR.bei+"px";
			ZDSAVATAR.Preview.style.left=(60-(ZDSAVATAR.dl-ZDSAVATAR.il+ZDSAVATAR.dw/2)*ZDSAVATAR.bei)+"px";
			ZDSAVATAR.Preview.style.top=((ZDSAVATAR.it-ZDSAVATAR.dt)*ZDSAVATAR.bei)+"px";
		}
		ZDSAVATAR.Preview.style.clip = "rect("+(ZDSAVATAR.dt-ZDSAVATAR.it)*ZDSAVATAR.bei+"px "+(ZDSAVATAR.dl-ZDSAVATAR.il+ZDSAVATAR.dw)*ZDSAVATAR.bei+"px "+(ZDSAVATAR.dt-ZDSAVATAR.it+ZDSAVATAR.dh)*ZDSAVATAR.bei+"px "+(ZDSAVATAR.dl-ZDSAVATAR.il)*ZDSAVATAR.bei+"px)";
	};
	
	ZDSAVATAR.dragFun=function(e,o){
		//alert(o.id);
		var d=document;
		if(!e)e=window.event;
		var X=e.pageX?e.pageX:e.clientX;
		var Y=e.pageY?e.pageY:e.clientY;
		switch(o.id){
			case "ZDSAVATAR_DragDiv":ZDSAVATAR.MoveBefore();break;
			case "ZDSAVATAR_SizeDiv":ZDSAVATAR.SizeBefore(X,Y);break;
			case "ZDSAVATAR_ZoomSlide":ZDSAVATAR.ZoomBefore();break;
		}
		if(o.setCapture) o.setCapture();
		else if(window.captureEvents) window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		var backData = {x : (X-parseInt(o.style.left)), y : (Y-parseInt(o.style.top))};
		d.onmousemove=function(e){
			if(!e)e=window.event;
			X=e.pageX?e.pageX:e.clientX;
			Y=e.pageY?e.pageY:e.clientY;
			switch(o.id){
				case "ZDSAVATAR_DragDiv":ZDSAVATAR.MoveFun(X-backData.x, Y-backData.y);break;
				case "ZDSAVATAR_SizeDiv":ZDSAVATAR.SizeFun(X, Y);break;
				case "ZDSAVATAR_ZoomSlide":ZDSAVATAR.ZoomFun(X-backData.x, Y-backData.y);break;
			}
		};
		d.onmouseup=function(e){
			if(!e)e=window.event;
			if(o.releaseCapture) o.releaseCapture();
			else if(window.captureEvents) window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
			d.onmousemove=null;
			d.onmouseup=null;
			if(!document.body.pageWidth)document.body.pageWidth=document.body.clientWidth;
			if(!document.body.pageHeight)document.body.pageHeight=document.body.clientHeight;
		};
		ZDSAVATAR.stopBubble(e);
	};
	
	ZDSAVATAR.Extend = function(destination, source){
		for(var property in source){
			destination[property] = source[property];
		}
	};
	
	ZDSAVATAR.stopBubble=function(e){
		if(window.event) window.event.cancelBubble = true;
		else e.stopPropagation();
	};
	
	if(window.ZDSAVATAR === undefined) window.ZDSAVATAR = ZDSAVATAR;
})();