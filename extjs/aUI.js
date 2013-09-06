Ext.ns('Ext.a.aUI');

Ext.a.aUI = Ext.extend(Ext.form.FormPanel,{
	
	constructor : function(config){
		Ext.a.aUI.supperclass.constructor.call(this,config);
	} ,
	initComponent : function(){
		Ext.a.aUI.supperclass.initComponent.call(this);
		this.items = [{
			id : 'a',
			fieldLabel : 'a',
			xtype : 'textfield'
		},{
			id : 'b',
			fieldLabel : 'b',
			xtype : 'textfield'
		}];
		this.buttons = [{
			text : 'button',
			id : 'btn'			
		}];
	}
});
//另外一个页面调用时
new Ext.a.aUI({
	renderTo : Ext.getBody()
});


//注册
Ext.reg('aui',Ext.a.aUI );
//注册后就可以使用xtype来调用 
new Ext.Panel({
	items : [{
		xtype : 'aui'
	}]
});


//事件 单独写在一起
Ext.a.aAction = Ext.extend(Ext.a.aUI,{
	initComponent : function(){
		var btn = Ext.getCmp('btn')
		this.addListens('click')
	}
});