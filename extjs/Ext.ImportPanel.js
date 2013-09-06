/**
 * Created with JetBrains PhpStorm.
 * User: v_xiaolfang
 * Date: 12-6-14
 * Time: 下午4:37
 * To change this template use File | Settings | File Templates.
 */
Ext.ns('Ext.ImportPanel');
Ext.ImportPanel = Ext.extend(Ext.Window,{
    constructor:function(config){
        config = Ext.apply({
//            title:"title",
            width:850,
            id :'import_panel',
            plain:true
        },config);
        Ext.ImportPanel.superclass.constructor.call(this,config);
    },
    initComponent : function(){
        var _this1 = this;
        this.items = [
            new Ext.MyFormPanel({gameid:this.temgameid}),
            this._createPanel()
        ];
        this.buttons = [{
            text: '提交',
            handler: function(){
                if(_this1.modfiy().length > 0  && _this1.modfiy() != 1){
                    var values=_this1.modfiy();
                    var info = '';
                    for(var i=0;i<values.length;i++)
                    {
                        info += values[i] + ';';
                    }
                    var _this = this;
                    Ext.MessageBox.confirm( "请确认", "确认导入选中的接口.", function(button,text){
                        if(button=='yes'){
//                            _this.disabled = true;
                            Ext.get('import_panel').mask("正在导入...");
                            Ext.Ajax.request({
                                url:'ViewTemplate/gameImportInter',
                                method:'POST',
                                timeout:90000,
                                params:{values:info,id:xmlid,temgameid:_this1.temgameid},
                                success:function(req){
                                    var responseObj = Ext.util.JSON.decode(req.responseText);
                                    Ext.get('import_panel').unmask();
                                    if(responseObj.success == true){
                                        Ext.Msg.alert("提示", responseObj.info);
                                        _docview.onRefresh();
                                        _this1.close();
                                    }else{
                                        Ext.Msg.alert("提示", responseObj.info);
                                    }
                                }
                            });
                        }
                    });
                }
            }
        },{
            text: 'Close',
            scope:this,
            handler: function(){
                this.close();
            }
        }];
        Ext.ImportPanel.superclass.initComponent.call(this);
    },
    _createPanel :function(){
        //定义一个grid为导入时添加接口列表 使用
        var grid;
        var data; var _this = this ;
        var ds = new Ext.data.Store({       //定义本地数据缓存器。
            proxy:new Ext.data.MemoryProxy(_this.parseJson(data)),      //代理读取器。
            reader:new Ext.data.ArrayReader({},           //数组读取器 用这个把上边定义好的data通过代理器读进来。
                [
                    {name:'id',mapping:0},
                    {name:'inter_name',mapping:1},
                    {name:'inter_opt_type',mapping:2}
                ])
        });
        ds.load();     //载入数据。//handleMouseDown: Ext.emptyFn

        var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:false});  //创建一个复选框。{singleSelect:true}
        sm.handleMouseDown = function(grid,rowIndex,key){
            sm.selectRow(rowIndex, true);
        };

        var colModel = new Ext.grid.ColumnModel([           //创建GridPanel中的列集合。
            new Ext.grid.RowNumberer(),                     //自动编号。
            sm,                                                              //复选框。
            {header:'id',dataIndex:'id',hidden:true},                  //这个编号是ds中的创建的id。
            {header:'接口名称',dataIndex:'inter_name',sortable:false,menuDisabled : true,width:640},                  //这个编号是ds中的创建的id。
            {header:'接口类型',
                renderer:function(val, metadata, record, rowIndex, colIndex, store){
                    if(val.type != '9'){
                        sm.selectRow(rowIndex, true);
                    }
                    return "<input type='radio' name='"+val.name+"opt_type' value='7' class='ck ckbox_h' checked='checked' />";
                },hidden:true,sortable:false,menuDisabled : true,dataIndex:'inter_opt_type',width:520,align:'center'}
        ]);

        grid = new Ext.grid.GridPanel({
            store:ds,      //创建GridPanel 并设置store数据。
            cm:colModel,                                          //绑定行。
            sm:sm,                                                   //复选框，有了这个可以全选
            width:835,
            height:400
        });


        return new Ext.FormPanel({
            title:'选择接口',
            items: [grid]
        });
    },
    parseJson :function (str){
        try{
            eval('var obj='+str);
            return obj;
        }catch(e){
            return null;
        }
    },
    modfiy:function(){
        var mycars=[];
        var grid = this.findByType('grid')[0];
        if (grid.getSelectionModel().hasSelection()){
            var records=grid.getSelectionModel().getSelections();

            for(var i=0;i<records.length;i++){
                var type=null;
                var temp = document.getElementsByName(records[i].data.inter_opt_type.name+'opt_type');
                //console.log(records[i]);
                for(var j=0;j<temp.length;j++){
                    if(temp[j].checked){
                        type = temp[j].value;
                    }
                }
                if(type == null){
                    alert('请选择接口 [ '+records[i].data.inter_name+' ]的类型。');
                    return 1;
                }
                mycars[i]=records[i].data.id+':'+type; //cmd:type

            }
        }else{
            alert('请选择接口!');
            return false;
        }
        return mycars;
    }

});