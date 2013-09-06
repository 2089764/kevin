/**
 * Created with JetBrains PhpStorm.
 * User: v_xiaolfang
 * Date: 12-6-14
 * Time: 下午4:35
 * To change this template use File | Settings | File Templates.
 */
Ext.ns('Ext.MyFormPanel');
Ext.MyFormPanel=Ext.extend(Ext.form.FormPanel ,{
    constructor:function(config){
        config = Ext.apply({
            labelWidth:100,
            labelAlign:"left",
            layout:"absolute",
            height:50,
            width:850,
            fileUpload : true,
            id:"uploadform1",
            frame:true
        },config);
        Ext.MyFormPanel.superclass.constructor.call(this,config);
    },
    initComponent: function(){
        var _this = this;
        this.items=[
            {
                xtype:"label",
                text:"文件名称：",
                x:10,
                y:10
            },
            {
                xtype:"textfield",
                name:"userfile",
                id:"userfile1",
                x:70,
                y:6,
                width:250,
                inputType:"file"
            },
            {
                xtype:"button",
                text:" 上传并读取 ",
                x:350,
                y:6,
                width:30,
                //handler : submit ,
                listeners:{
                    'click':function(){
                        if(Ext.getCmp("userfile1").getValue()=="")
                        {
                            alert("请选择要导入的XML文件！");
                            return;
                        }
                        Ext.getCmp("uploadform1").getForm().submit({
                            params : {
                                xmlfile : Ext.getCmp("userfile1").getValue()
                            },
                            url : "ViewTemplate/game_upload",
                            method : "POST",
                            fileUpload:true,
                            success : function(form, action){
                                xmlid = action.result.id;
                                _this.Flushtab(action.result.id);
                            },
                            failure : function(form, action) {
                                if(action.result.error == 'type'){
                                    Ext.MessageBox.alert('Failed', '上传失败，请检查是否有写入权限。');
                                    return;
                                }
                                if(action.result.error == 'houzhui'){
                                    Ext.MessageBox.alert('Failed', "文件后缀只能一个,请检查文件后缀是否包含多个'.'。");
                                    return;
                                }
                            }
                        });
                    }
                }
            }
        ]
        Ext.MyFormPanel.superclass.initComponent.call(this);
    },
    Flushtab : function ($id){
        Ext.Ajax.request({
            url : 'ViewTemplate/gameImport' ,
            params : { id : $id,gameid :this.gameid},
            method: 'post',
            success: function( result, request ){
                var imp = Ext.getCmp('import_panel').findByType('grid')[0].getStore();
                if (result.responseText == 1)
                {
                    Ext.MessageBox.alert('Failed', 'XML载入出错，请查检xml文件,比如：编码，及标签是否封闭等。');
                    return false;
                }else{
                    imp.loadData(this.parseJson(result.responseText));
                    Ext.MessageBox.alert('提示', 'XML加载成功！请选择导入的接口！');
                }
            },
            failure: function( result, request){
                Ext.MessageBox.alert('Failed', '获取信息失败');
            }
        });
    },
    parseJson :function (str){
        try{
            eval('var obj='+str);
            return obj;
        }catch(e){
            return null;
        }
    }
});

