InterFacePanel = Ext.extend(Ext.idip.CrudPanel, {
    baseUrl: '/FrontMgr',
    storeMapping: ["id","name","cmd","req","gameid","rsp","updatetime","operator","c_id"],
	id: "sid",
	render_div:'interface-div',
	toolbar : {},
	mark : 1,
    createWin: function(status){
        return this.initWin(245, 300, status);
    },
    afterRender : function(){  //加载完后执行
    	InterFacePanel.superclass.afterRender.call(this); //取得父类对象 
    	var params = this.store.baseParams;   //找到待修改的对象 
    	Ext.apply(params,{                //赋值属性
    		start : 0,
    		limit :20    		
    	})
    	this.store.load(params);  //手工加载
    },
    constructor: function(){
        this.sm = '';
		this.cm = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),//获得行号
		    {
		        header:"&nbsp;&nbsp;<font color=red>接口名称</font>",
		        tooltip:"接口的中文名称",
		        dataIndex:"name",
                sortable:false,
                menuDisabled : true,
		        align:'left',
		        resizable:false,
		        width:200
	        },{
		        header:"&nbsp;&nbsp;<font color=red>命令字</font>",
		        tooltip:"命令字",
		        dataIndex:"cmd",
                sortable:false,
                menuDisabled : true,
		        align:'left',
		        resizable:false,
		        width:100
	        },{
		        header:"&nbsp;&nbsp;<font color=red>请求串</font>",
		        dataIndex:"req",
                sortable:false,
                menuDisabled : true,
		        align:'left',
		        resizable:false,
		        width:320
	        },{
		        header:"&nbsp;&nbsp;<font color=red>应答串</font>",
		        dataIndex:"rsp",
                sortable:false,
                menuDisabled : true,
		        align:'left',
		        resizable:false,
		        width:320
	        },{
		        header:"&nbsp;&nbsp;<font color=red>操作时间</font>",
		        dataIndex:"updatetime",
                sortable:false,
                menuDisabled : true,
		        align:'left',
		        resizable:false,
		        width:160
	        },{
		        header:"&nbsp;&nbsp;<font color=red>操作人</font>",
		        dataIndex:"operator",
                sortable:false,
                menuDisabled : true,
		        align:'left',
		        resizable:false,
		        width:100
	        },{
	            header:'c_id',  //c_id  是protoshine id
	            dataIndex:'c_id',
	            menuDisabled : false,
	            align:'center',
	            width:10,
	            resizable:false,
	            hidden:true
	        },{
	            header:'编号',       //interface表id
	            dataIndex:'id',
	            menuDisabled : false,
	            align:'center',
	            width:10,
	            resizable:false,
	            hidden:true
	        }
	    ]);
		this.toolbar = [{
                id: 'addButton',
                text: '配置接口',
                iconCls: 'add',
                handler:this.createInterface,
                scope: this
            },'-',{
                text : '查看' ,
                iconCls : 'view',
                handler : this.onViewDetail,
                scope : this
            },'-',{
                    text: '刷新',
                    iconCls: 'refresh',
                    tooltip: this.refreshtooltip,
                    handler: this.onRefresh,
                    scope: this
            }];
        InterFacePanel.superclass.constructor.call(this);        
    } ,
    onGetGrid : function(){
        return this.gridPanel;
    },
	onGetWhat : function(what){
		gridpanel = this.onGetGrid();
		if(gridpanel.selModel.hasSelection()){
			var record = gridpanel.selModel. getSelected().get(what);
			return record;
		}
		else
			return 0;
	},
	onViewDetail:function()
	{
		var id = this.onGetWhat('id');
		var gameid = this.onGetWhat('gameid');
		if (id) {
			 var postWindow = new Ext.Window({
				title: '查看接口详细信息',
				width: 400,
				height:280,
				collapsible:true,
				maximizable:true,
				layout: 'fit',
				closeAction : 'hide',
				plain:true,
				bodyStyle:'padding:5px;',
				modal:true,
				html:'<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src=/InterfaceMgr_1/InterFaceViewDetail/'+id+'/'+gameid+'></iframe>'
			});
			postWindow.show();
		} else {
			Ext.Msg.alert('错误', '请选择一条记录查看！');
		}
	},
    onEdit: function(){
       this.createInterface();
    },
    createInterface:function(){
        var id = this.onGetWhat('id');
        if(id){
            var cmdid = this.onGetWhat('cmd');
            var name = this.onGetWhat('name');
            var req = this.onGetWhat('req');
            var rsp = this.onGetWhat('rsp');
            var gameid = this.onGetWhat('gameid');
            if(!cmdid){
                var cmd = '';
                Ext.Ajax.request({
                    url:'FrontMgr/ckinfo',
                    method:'post',
                    async : false,
                    params:{id:id,gameid:gameid},
                    success:function(req){
                        cmd =  req.responseText ;
                    }
                });
                if(req){
                    req =  req.replace(/#/g,'&') ;
                }
                if(rsp){
                    rsp =  rsp.replace(/#/g,'&') ;
                }
            }
            var cfg = '';
            Ext.Ajax.request({
                url:'FrontMgr/ckinfo1',
                method:'post',
                async : false,
                params:{id:id,gameid:gameid},
                success:function(req){
                    cfg =  req.responseText ;
                }
            });
            var win ;
            if(!win){
                win = new Ext.Window({
                    layout:'fit',
                    width:940,
                    height:580,
                    collapsible:false,
                    closeAction:'close',
                    bodyStyle:'padding:2px;',
                    title:'接口配置' ,
                    modal:true,
                    plain: true,
                    items:[{
                        style:'padding:2px 0 2px 10px',
                        xtype:'fieldset',
                        autoHeight:true,
                        items: [{
                            baseCls:"x-plain",
                            style:'padding:0px 10px 0px 10px',
                            layout:'form',
                            labelWidth: 60,
                            defaultType: 'textfield',
                            items:[{
                                itemCls  : 'sex-male' ,  //向左边浮动,处理控件横排
                                clearCls  : 'allow-float' ,  //允许两边浮动,在实际生成的HTML 结构中有专门的DIV阻断浮动
                                fieldLabel: '命令字',
                                style:'margin:0px 20px 0px 0px',
                                value   : cmdid || cmd ,
                                id      :  'cmd',
                                regex : /^\d+$/,
                                regexText:"只能输入数字.",
                                allowBlank : false
                            },{
                                fieldLabel : '描述',
                                itemCls  : 'sex-male' ,//向左边浮动,处理控件横排
                                style:'margin:0px 20px 0px 0px',
                                value       : name,
                                width       : 200,
                                disabled    : true,
                                id           : 'cmd_desc'
                            },{
                                fieldLabel: '配置id',
                                name :'cfg_id',
                                id :'cfg_id',
                                checked : cfg ? true : false ,
                                style:'margin:4px 4px 0px 0px;',
                                itemCls  : 'sex-male' , //向左边浮动,处理控件横排
                                xtype : 'checkbox',
                                listeners:{
                                check : function(v,a){
                                    var prefix_name = Ext.get('cfg_id_name').parent().parent().dom;
                                         if(a){
                                            prefix_name.style.display = 'block';
                                         }else{
                                             prefix_name.style.display = 'none';
                                         }
                                         prefix_name=null;
                                     }
                                }
                            },{
                                itemCls  : 'sex-male' ,  //向左边浮动,处理控件横排
                                name :'cfg_id_name',
                                hideLabel :true,
                                id : 'cfg_id_name',
                                value : cfg || '' ,
                                listeners:{
                                    afterRender:function(pre){
                                        if(!cfg){
                                            pre.getEl().up('.x-form-item').setDisplayed(false); // hide label
                                        }
                                    }
                                }
                            }]
                        }]
                    },{
                        title: '请求参数配置',
                        layout:'fit',
                        xtype:'fieldset',
                        collapsible: false,
                        style:'padding:2px 2px 2px 2px',
                        scope:this,
                        items:new Ext.DDGridPanel({
                            height  : 200,
                            url : '/FrontMgr/req_info/'+id ,
                            border  : false ,
                            req : req  ,
                            configText : '请求串',
                            inter_id :id
                        })
                    },{
                        title: '应答参数配置',
                        layout:'fit',
                        xtype:'fieldset',
                        collapsible: false,
                        style:'padding:2px 2px 2px 2px',
                        scope:this,
                        items:new Ext.DDGridPanel({
                            height  : 200,
                            url      : '/FrontMgr/rsp_info/'+id ,
                            border  : false ,
                            req      : rsp   ,
                            configText : '应答串',
                            inter_id :id
                        })
                    }],
                    buttons: [{
                        scope:this,
                        text: '提交',
                        handler: function(){
                            var id = this.onGetWhat('id');
                            var gameid = this.onGetWhat('gameid');
                            var cmd =  Ext.getCmp('cmd');
                            var cmdvalue = cmd.getValue();
                            var req = win.findByType('fieldset')[1].findByType('form')[0].items.get(6).getValue();
                            var rsp = win.findByType('fieldset')[2].findByType('form')[0].items.get(6).getValue();
                            if (rsp.indexOf('result=Result') == -1)
                            {
                                rsp = 'result=Result#'+rsp;
                            }
                            var ckname = win.findByType('fieldset')[1].findByType('form')[0].items.get(1).getValue();
                            var ckname1 = win.findByType('fieldset')[2].findByType('form')[0].items.get(1).getValue();
                            if(ckname){
                                 Ext.Msg.alert("提示", '请求串配置还有未配置的信息.');
                                 return;
                            }
                            if(ckname1){
                                 Ext.Msg.alert("提示", '应答串配置还有未配置的信息.');
                                 return;
                            }
                            if(isNaN(cmdvalue)){
                                Ext.Msg.alert("提示", '命令字只能是数字');
                                return;
                            }
                            if(!cmd || !req || !rsp){
                                 Ext.Msg.alert("提示", '请配置完整信息');
                                 return;
                            }
                            var cfg_id =  Ext.getCmp('cfg_id').getValue();
                            var cfg_id_name = '';
                            if(cfg_id){
                                cfg_id_name =  Ext.getCmp('cfg_id_name').getValue();
                                if(cfg_id_name == ''){
                                    Ext.Msg.alert("提示", '配置id没有填写.');
                                    return;
                                }
                            }

                             Ext.Ajax.request({
                                 url: cmdid ? 'FrontMgr/update' : 'FrontMgr/insert',
                                 method:'post',
                                 params:{id:id,gameid:gameid,cmd:cmdvalue,req:req,rsp:rsp,cfg_id:cfg_id_name},
                                 success:function(req){
                                     var responseObj = Ext.util.JSON.decode(req.responseText);
                                     if(responseObj.success == true){
                                         inter_interface.onRefresh();
                                         win.close();
                                         Ext.Msg.alert("提示", responseObj.info);
                                     }else{
                                         Ext.Msg.alert("提示", responseObj.info);
                                     }
                                 }
                             });
                        }
                    },{
                        text: '关闭',
                        handler: function(){
                            win.close();
                        }
                    }]
                });
            }
            win.show();
        }else{
            Ext.Msg.alert('错误', '请选择记录！');
        }

    }
});


Ext.onReady(function(){
	inter_interface = new InterFacePanel();
});

