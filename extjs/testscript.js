/**
 * Created with JetBrains PhpStorm.
 * User: v_xiaolfang
 * Date: 12-8-31
 * Time: 10:10
 * To change this template use File | Settings | File Templates.
 */
function modify(Index) {
    var user = Ext.getCmp('cmdid');
    user.modify(Index);
}
function del(Index) {
    var user = Ext.getCmp('cmdid');
    user.del(Index);
}
function add_test(Index){
    var user = Ext.getCmp('cmdid');
    user.add_test(Index);
}
function abtest(){
    var user = Ext.getCmp('cmdid');
    user.abtest();
}

var order_win;
function uncode(value, p, record){
    return unescape(value);
}
function gg(a,b,c,d,e,f,g,h,i,j){
    //渲染 赋值
    if(!order_win){
        order_win=new Ext.Window({
            layout:'fit',
            width:640,
            height:580,
            title:'指令详情确认页面',
            closeAction:'hide',
            layout:'column',
            plain:true,
            items:[{
                xtype:'form',
                frame:true,
                id:'form_order_inwin',
                title:'指令信息',
                items:[{
                    columnWidth:.8,
                    layout:'form',
                    items: new Ext.form.TextField({
                        xtype:'textfield',
                        id:'order_id_inwin',
                        width:360,
                        disabled:true,
                        //value:a,
                        fieldLabel:'指令ID'
                    })},{
                    columnWidth:.8,
                    layout:'form',
                    items: new Ext.form.TextField({
                        xtype:'textfield',
                        //value:c,
                        width:360,
                        id:'order_info_inwin',
                        fieldLabel:'指令功能'
                    })},{
                    columnWidth:.8,
                    layout:'form',
                    items: new Ext.form.TextField({
                        xtype:'textfield',
                        id:'order_yw_inwin',
                        //value:b,
                        width:360,
                        //disabled:true,
                        editable:true,
                        readOnly:true,
                        fieldLabel:'所属业务'
                    })},{
                    columnWidth:.8,
                    layout:'form',
                    items: new Ext.form.TextField({
                        xtype:'textfield',
                        id:'request_str_inwin',
                        width:360,
                        fieldLabel:'请求串'
                    })},{
                    columnWidth:.8,
                    layout:'form',
                    items: new Ext.form.TextField({
                        xtype:'textfield',
                        id:'answer_str_inwin',
                        width:360,
                        fieldLabel:'返回串'
                    })},{
                    columnWidth:.8,
                    layout:'form',
                    items: new Ext.form.TextArea({
                        //value:f,
                        id:'order_detail_inwin',
                        width:500,
                        fieldLabel:'指令详细信息'
                    })},{
                    columnWidth:.8,
                    layout:'form',
                    items: new Ext.form.HtmlEditor({
                        id:'result_info_inwin',
                        height:120,
                        autoHeight:true,
                        autoWidth:false,
                        enableFont:false,
                        enableFontSize:false,
                        enableSourceEdit:false,
                        enableLinks:false,
                        enableColors:false,
                        enableAlignments:false,
                        fieldLabel:'指令说明'
                    })},{
                    columnWidth:.8,
                    layout:'form',
                    items: new Ext.form.TextField({
                        xtype:'textfield',
                        id:'num_of_times_inwin',
                        fieldLabel:'支持频率'
                    })},{
                    columnWidth:.8,
                    layout:'form',
                    items: new Ext.form.TextField({
                        xtype:'textfield',
                        id:'submitman_inwin',
                        readOnly:true,
                        fieldLabel:'申请人'
                    })},{
                    columnWidth:.8,
                    layout:'form',
                    items: new Ext.form.TextField({
                        xtype:'textfield',
                        id:'order_req_time_inwin',
                        fieldLabel:'申请时间'
                    })}
                ]
            },{
                xtype:'form',
                frame:true,
                id:'order_submit_inwin',
                layout:'table',
                items:[{
                        width:200,
                        height:30
                },{
                    layout:'form',
                    items: new Ext.Button({
                        text:'提交',
                        width:220,
                        height:30,
                        handler:function()
                        {
                            // new function here.
                            var orderID   = Ext.getCmp('order_id_inwin').getValue();
                            var orderYw   = Ext.getCmp('order_yw_inwin').getValue();
                            var orderInfo = escape(Ext.getCmp('order_info_inwin').getValue());
                            var reqStr    = escape(Ext.getCmp('request_str_inwin').getValue());
                            var ansStr    = escape(Ext.getCmp('answer_str_inwin').getValue());
                            var orderDetail = escape(Ext.getCmp('order_detail_inwin').getValue());
                            var resultInfo  = escape(Ext.getCmp('result_info_inwin').getValue());
                            var numOfTimes  = Ext.getCmp('num_of_times_inwin').getValue();
                            var submitman   = Ext.getCmp('submitman_inwin').getValue();
                            var orderReqTime= Ext.getCmp('order_req_time_inwin').getValue();

                            var cmd_num = 1;
                            var cmd_list = '{"rows":"'+cmd_num+'","rowslist":[';

                            cmd_list = cmd_list + '{"order_id":"' + orderID +'","yw_id":"' + orderYw + '","order_info":"' + orderInfo + '",' +
                                '"request_str":"' + reqStr + '","answer_str":"' + ansStr + '","result_info":"' + resultInfo + '",' +
                                '"submitman":"'+submitman + '","order_detail":"' + orderDetail + '","orderReqTime":"' +orderReqTime + '",'  +
                                '"num_of_times":"'+ numOfTimes +'"}';

                            cmd_list = cmd_list + ']}';

                            Ext.Ajax.request({
                                url:'/addbs/insertInfos',
                                method:'POST',
                                params:{str:cmd_list},
                                success:function(res){
                                    var t = res.responseText;
                                    var info = Ext.util.JSON.decode(t);
                                    if(info.success=="true")
                                    {
                                        order_win.hide();
                                        Ext.MessageBox.alert('success','添加指令成功!');
                                    }
                                    if (info.success=="false")
                                    {
                                        Ext.MessageBox.alert('failure','指令添加入库失败，请检查！');
                                    }
                                    if (info.success=="cz")
                                    {
                                        Ext.MessageBox.alert('failure','指令已存在！');
                                    }
                                },
                                failure:function(res){
                                    Ext.MessageBox.alert('failure','添加指令失败,请重试。');
                                }
                            });

                        }
                    })
                },{
                    width:190
                }]
            }]
        });
    }
    order_win.show();
    //初始化值
    Ext.getCmp('order_id_inwin').setValue(a);
    Ext.getCmp('order_yw_inwin').setValue(b);
    Ext.getCmp('order_info_inwin').setValue(uncode(c.replace(/<br\/>/ig,"\n").replace(/<tab>/ig,"\t")));
    Ext.getCmp('request_str_inwin').setValue(uncode(d));
    Ext.getCmp('answer_str_inwin').setValue(uncode(e));
    Ext.getCmp('order_detail_inwin').setValue(uncode(f.replace(/<br\/>/ig,"\n").replace(/<tab>/ig,"\t")));
    Ext.getCmp('result_info_inwin').setValue(uncode(g.replace(/<br\/>/ig,"\n").replace(/<tab>/ig,"\t")));
    Ext.getCmp('num_of_times_inwin').setValue(h);
    Ext.getCmp('submitman_inwin').setValue(i);
    Ext.getCmp('order_req_time_inwin').setValue(j);
}

var timeID=null;
var timeEnd=0;
var contents='';
var beforeline='';

//将压力测试结果入库
function pushData(){

    Ext.Ajax.request({
        url : '/TestScript/addStressData',
        method:'post',
        success:function(req){
//                        var responseObj = Ext.util.JSON.decode(req.responseText);
//                        if(responseObj.success == 'false')
//                        {
//                            Ext.Msg.alert("提示", responseObj.info);
//                        }
        }
    });
}

/*
* 获取压力测试结果
* @param string  val 压力测试结果txt
* */
function getstressrep(val,mark) {
    Ext.Ajax.request({
        url:'/TestScript/stressrep/',
        method:'post',
        params:val,
        success:function (req) {
//            var responseObj = Ext.util.JSON.decode(req.responseText);
//            if(responseObj.success == 'false')
//            {
//                Ext.Msg.alert("提示", responseObj.info);
//                return;
//            }
            var fp1 = Ext.getCmp('stress_result');
            if (beforeline != req.responseText)//与前一条打印记录不同，将记录输出到文本框。
            {
                timeEnd = 0;
                beforeline = req.responseText;
                if(mark ==0)
                {
                    contents=contents+req.responseText;
                    fp1.getForm().items.get(0).setValue(contents);
                }else{
                    fp1.getForm().items.get(0).setValue(req.responseText);
                }
            }else{  //与前一条打印记录相同，扔掉。
                timeEnd = timeEnd + 1;
            }
            if (mark == 1 && req.responseText.indexOf('Pressure test end') != -1) {
                timeEnd = 0;
                clearInterval(timeID);
                pushData();//将压力测试结果入库
                Ext.getCmp('beginstress').setDisabled(false);
                Ext.Msg.alert("提示", '压力测试成功。所有结果已返回。');
                return;
            }
        }
    });

    if (timeEnd > 4)//连续4次没有新信息，则表示文件已经读完。
    {
        //统一接入
        if(mark =='1')
        {
            Ext.Ajax.request({
                url:'/TestScript/ckProcess/',
                method:'post',
                params:val,
                success:function (ck) {
                    console.log(ck.responseText)
                    if (ck.responseText == 0) {
                        clearInterval(timeID);
                        Ext.Msg.alert("提示", '压力测试异常退出，请查错误或重新测试。');
                    }
                }
            });

        }else{
            //老业务处理
            var succperIndex=contents.indexOf('succper');
            if(-1!=succperIndex)
            {
                pushData();//将压力测试结果入库
                Ext.Msg.alert("提示", '所有结果已返回。压力测试PASS!');
                clearInterval(timeID);
            }else{
                Ext.Ajax.request({
                    url:'/TestScript/ckProcess/',
                    method:'post',
                    params:val,
                    success:function (ck) {
                        console.log(ck.responseText)
                        if (ck.responseText == 0) {
                            timeEnd=0;
                            clearInterval(timeID);
                            Ext.Msg.alert("提示", '压力测试异常退出，请查错误或重新测试。');
                        }
                    }
                });
            }
            //按钮可用
            Ext.getCmp('beginstress').setDisabled(false);
            Ext.Ajax.request({
                url:'/TestScript/clearFile',
                method:'post',
                params:val,
                success:function (ck) {
                }
            });
        }
    }
    if (timeEnd == 20)
    {
        timeEnd=0;
        clearInterval(timeID);
        Ext.Msg.alert("提示", '压力测试异常退出，请查错误或重新测试。');
    }
  //  return;
}
/*
* 执行压力测试
* */
function pressstress(ck,infos,mark)
{
    contents='';
    beforeline='';
    var args = arguments;
    var fp1 = Ext.getCmp('stress_result');
    fp1.getForm().items.get(0).setValue(contents);

    var form = Ext.getCmp('stress').getForm();
    if(form.isValid())
    {
        var val = form.getFieldValues();
        if(Ext.isEmpty(val.ip))
        {
            Ext.Msg.alert("提示", '<nobr>ip不能为空。</nobr>');
            return false;
        }
        if(Ext.isEmpty(val.port))
        {
            Ext.Msg.alert("提示", '<nobr>port不能为空。</nobr>');
            return false;
        }
          Ext.Ajax.request({
            url: (ck=='0') ? '/TestScript/addstress' :'/TestScript/updatestress',
            method:'post',
            params:{mycars:infos,ip:val.ip,key:val.key,port:val.port,report_file:val.report_file,
                send_times:val.send_times,thread_count:val.thread_count,time_out:val.time_out,path:val.path,
                oidb_ip:val.oidb_ip,oidb_port:val.oidb_port,conn_type:val.conn_type,send_type:val.send_type,
                conn_count:val.conn_count,send_rate:val.send_rate},
            success:function(req){
//                var responseObj = Ext.util.JSON.decode(req.responseText);
//                //console.log(responseObj);
//                clearInterval(timeID);
//                Ext.Msg.alert("提示", responseObj.info);
//                return;
            }
        });

        contents='';
        beforeline='';
        fp1.getForm().items.get(0).setValue(contents);
        //读取测试结果
        console.log('start getstressrep interval!');
        contents='';
        beforeline='';
        timeID = setInterval(function(){getstressrep({report_file:val.report_file},mark)},2800);
        console.log('stop getstressrep interval!');
    }
}
Ext.onReady(function(){

    Ext.QuickTips.init();
    var msg = function(title, msg){
        Ext.Msg.show({
            title: title,
            msg: msg,
            minWidth: 200,
            modal: true,
            icon: Ext.Msg.INFO,
            buttons: Ext.Msg.OK
        });
    };
    /*
     * 右边测试页面
     *
     */
    //IP 选择列表
    var proto = new Ext.form.ComboBox({
        store : [['10.140.48.24','10.140.48.24'],['172.25.39.106','172.25.39.106'],['10.12.16.67','10.12.16.67'],['10.12.16.80','10.12.16.80']],
        editable : false,
        fieldLabel : "服务器IP",
        name : 'ip',
        width : 200,
        triggerAction : "all",
        allowBlank:false,
        mode : "local" ,
        listeners : {
            afterRender : function(combo) {
                var firstValue = '10.140.48.24';
                combo.setValue(firstValue);//同时下拉框会将与name为firstValue值对应的 text显示
            }
        }
    });
    var fp = new Ext.FormPanel({
        frame: false, border:false,
        bodyStyle: 'padding: 10px 10px 0 10px;',
        labelWidth: 80,
        defaultType: 'textarea',
        buttonAlign: 'center',
        defaults: {
            anchor: '95%',
            msgTarget: 'side'
            },
        items:[proto,{
            fieldLabel: '端口',
            style: 'margin-top:30px;',
            labelStyle: 'margin-top:30px;',
            xtype: 'textfield',
            value:'9062',
            name :'port',
            width : 200,
            regex : /^\d+$/,
            regexText:'端口为数字!  '
        },{
            fieldLabel: '命令',
            style: 'margin-top:30px;',
            labelStyle: 'margin-top:30px;',
            value : '',
            width : 200,
            height:120,
            name :'cmd'
        },{
            fieldLabel: '测试结果',
            style: 'margin-top:30px;',
            labelStyle : 'margin-top:30px;',
            value : '',
            width : 200,
            height : 260,
            name : 'result'
        }],
        buttons:[{
            id:'fpid',
            text: '测试',
            listeners:{
                click : function(){
                    var ip = fp.getForm().items.get(0).getValue();
                    var port = fp.getForm().items.get(1).getValue();
                    var cmd1 =  fp.getForm().items.get(2).getValue();
                    Ext.Ajax.request({
                        url: '/Debug/cmd',
                        method:'post',
                        params:{ip:ip,port:port,cmd:cmd1},
                        success:function(req){
                            var responseObj = Ext.util.JSON.decode(req.responseText);
                            fp.getForm().items.get(3).setValue(responseObj.info);
//                        Ext.Msg.alert("提示", '请查看结果');
                        }
                    });
                }
            }
        },{
            text: '清除',
            handler: function(){
                fp.getForm().items.get(2).setValue('');
                fp.getForm().items.get(3).setValue('');
            }
        },{
            text: '添加到自动化测试桩',
            handler: function(){
                var test_cmd = fp.getForm().items.get(2).getValue();
                var test_res = fp.getForm().items.get(3).getValue();
                var addautoPanel = new Ext.Window({
                    title: '添加到自动化测试桩' ,
                    width: 600,
                    height:380,
                    bodyStyle:'padding:5px 25px 0',
                    plain:true,
                    modal:true,
                    defaultType: 'textfield',
                    items: [{
                        xtype : 'form',
                        id:'serverIni',
                        baseCls:"x-plain",
                        defaultType: 'textarea',
                        items:[{
                            xtype: 'checkboxgroup',
                            id : 'test_server',
                            name : 'test_server',
                            fieldLabel: '选择服务器',
                            items: [
                                {boxLabel: '测试桩', name: 'rb-auto', inputValue: 0, checked: true},
                                {boxLabel: '现网', name: 'rb-auto', inputValue: 1}
                            ]
                        },{
                            fieldLabel: '测试串',
                            height:100,
                            width: 400,
                            name :'cmd',
                            value:test_cmd
                        },{
                             fieldLabel: '返回值',
                             height:80,
                             width: 400,
                             name :'result',
                             value:test_res /*,
                             regex: /^\S+$/ ,
                             blankText:"不能为空，请填写"*/
                         },{
                             fieldLabel: '描述',
                             height:80,
                             width: 400,
                             name :'des',
                             value:''/*,
                             regex: /^\S+$/ ,
                             blankText:"不能为空，请填写"*/
                         }]
                    }],
                    buttons: [{
                        text: '提交',
                        scope: this,
                        handler: function(){
                            var form = Ext.getCmp('serverIni').getForm();
                            if(form.isValid()){
                                var val = form.getFieldValues();
                                if(Ext.isEmpty(val.cmd))
                                {
                                    Ext.Msg.alert("提示", '<nobr>测试串不能为空。</nobr>');
                                    return false;
                                }
                                if(Ext.isEmpty(val.result))
                                {
                                    Ext.Msg.alert("提示", '<nobr>返回值不能为空。</nobr>');
                                    return false;
                                }

                                //验证选择的服务器
                                var ids = [];
                                var cbitems = Ext.getCmp('test_server').items;
                                for (var i = 0; i < cbitems.length; i++) {
                                    if (cbitems.itemAt(i).checked) {
                                        ids.push(cbitems.itemAt(i).inputValue);
                                    }
                                }
                                if(ids.length ==0){
                                    Ext.Msg.alert("提示", '<nobr>请选择服务器！</nobr>');
                                    return false;
                                }
                                ids = ids.join(',');
                                Ext.Ajax.request({
                                    url: '/TestScript/addServerData',
                                    method:'post',
                                    params:{ids:ids,cmd: val.cmd,result:val.result,des:val.des},
                                    success:function(req){
                                        var responseObj = Ext.util.JSON.decode(req.responseText);
                                        Ext.Msg.alert("提示", responseObj.info);
                                        if(responseObj.success){
                                            addautoPanel.close();
                                        }
                                    }
                                });
                            }
                        }
                    },{
                        text: '关闭',
                        scope:this,
                        handler:function(){
                            addautoPanel.close();
                        }
                    }]
                });
                addautoPanel.show();
            }
        },{
            text: '添加到BS',
            handler: function(){
                //获取命令及测试结果值
                var test_cmd = fp.getForm().items.get(2).getValue().trim();
                var test_res = fp.getForm().items.get(3).getValue().trim();
                //验证命令及结果不能为空 ，如果为空则提示并退出
                if(test_cmd == '' || test_res == '')
                {
                    Ext.Msg.alert('警告：','命令或测试结果不能为空！')
                    return;
                }
                //验证结果是否为返回 result = 0 正常的结果，如果不是则提示并退出
                var ck = Ext.util.Format.substr(test_res,0,8);
                if(ck !='result=0')
                {
                    Ext.Msg.alert('提示：','返回结果必须为result=0的串才能添加到BS网站')
                    return;
                }
                var rs;
                //获取值
                 Ext.Ajax.request({
                     url:'/addbs/returnInfos',
                     async: false,
                     params: {req:test_cmd,rsp:test_res},
                     success:function(res){
                         rs =Ext.util.JSON.decode(res.responseText);
                     }
                 });
                if(rs.mark){
                    var result_info = "​result=0    成功  \n\nresult=其他  错误 \n";
                    //调用窗口添加
                    gg(rs.order_id,rs.yw_id,rs.order_info,test_cmd,test_res,result_info,rs.result_info,rs.num_of_times,rs.submitman,rs.submit_time);
//                gg(rs.order_id,rs.yw_id,rs.order_info,rs.request_str,rs.answer_str,result_info,result_detail,rs.num_of_times,rs.submitman,rs.submit_time);
                }else{
                    Ext.Msg.alert('温馨提示','指令已存在，无需添加。')
                }
           }
        }]
    });
    /*
     * 命令串面板
     *  @ 命令串的添加功能
     *  @ 压力测试功能
     */
    var xg = Ext.grid;
    var reader = new Ext.data.JsonReader({
        idProperty:'id',
        fields: [
            {name: 'id', type: 'int'},
            {name: 'cmdid', type: 'int'},
            {name: 'cmd', type: 'string'},
            {name: 'return', type: 'string'},
            {name: 'desc', type: 'string'},
            {name: 'mark', type: 'string'}
        ],
        root:'data',
        remoteGroup:true,
        remoteSort: true
    });
    var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:false});  //创建一个复选框。{singleSelect:true}
    sm.handleMouseDown = function(grid,rowIndex,key){
      //  sm.selectRow(rowIndex, true);
    };
    function change(val){
        return '<span style="white-space:normal;">' + val + '</span>';
    }
    var grid = new xg.EditorGridPanel({
        id:'cmdid',
        sm:sm,
        frame: false,
        border:false,
        stripeRows : true,// 显示斑马线
        animCollapse: false,
        trackMouseOver: false,
        buttonAlign: 'center',
        iconCls: 'icon-grid',
        ds: new Ext.data.GroupingStore({
            reader: reader,
            proxy : new Ext.data.HttpProxy({
                url: '/TestScript/getData',
                method: 'post'
            }),
            sortInfo: {field: 'cmdid', direction: 'ASC'},
            groupField: 'cmdid'
        }),
        columns: [
            sm,
            {
                header: '测试串',
                sortable:false,
                menuDisabled : true,
                dataIndex: 'cmd',
                hideable: false ,renderer: change
            },{
                header: 'cmdid',
                width: 20,
                sortable: true,
                hidden: true,
                dataIndex: 'cmdid'
            },{
                header: 'mark',
                width: 20,
                sortable: true,
                hidden: true,
                dataIndex: 'mark',
                renderer:function(val, metadata, record, rowIndex, colIndex, store){
                    if(val == 1){
                        sm.selectRow(rowIndex, true);
                    }
                }
            },{
                header: 'return',
                width: 20,
                sortable: true,
                hidden: true,
                dataIndex: 'return'
            },{
                header: 'id',
                width: 20,
                sortable: true,
                hidden: true,
                dataIndex: 'id'
            },{
                header: 'desc',
                width: 20,
                sortable: true,
                hidden: true,
                dataIndex: 'desc'
            },{
                header: "操作", width: 50, sortable:false, menuDisabled : true, dataIndex: 'last',
                renderer:function(val, metadata, record, rowIndex, colIndex, store){
                    return  "<input type='button' style='background-Color:#DFE8F6;border:0;' name='opt_type' value='修改' onclick='modify("+rowIndex+");'/> " +
                        "<input type='button' style='background-Color:#DFE8F6;border:0;' name='opt_type' value='删除' onclick='del("+rowIndex+");'/> " +
                        "<input type='button' style='background-Color:#DFE8F6;border:0;' name='opt_type' value='指令测试' onclick='add_test("+rowIndex+");'/>";
                }
            }
        ],
        view: new Ext.grid.GroupingView({
            forceFit:true,
            showGroupName: false,
            enableNoGroups:false,
            enableGroupingMenu:false,
            startCollapsed : true ,
            hideGroupedColumn: true
        }),
        tbar : [{
            text: '添加指令',
            scope: this,
            tooltip: 'add',
            handler: modify
        },{
            text : '压力测试',
            scope: this ,
            handler:abtest
        },{
            text : '启动服务',
            scope: this ,
            handler:function(){
                var args = arguments;
                var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"启动中..."});
                myMask.show();
                Ext.Ajax.request({
                    url: '/TestScript/start',
                    timeout:600000,
                    method:'post',
                    success:function(req){
                        myMask.hide();
                        if(req.responseText == '0')
                        {
                            Ext.Msg.alert("提示","启动成功");
                        }else{
                            Ext.Msg.alert("提示", req.responseText);
                        }
                    },
                    failure : function() {
                        args.callee(); //出现错误重新发送
                    }
                });
            }
        }] ,
        abtest : function(){
            var mycars = this.selects();
            var len = mycars.length;
            if(len<1){
                return;
            }

            var str = '';
            Ext.Ajax.request({
                url: '/TestScript/getGameName',
                method:'post',
                async : false,
                success:function(req){
                    str = req.responseText;
                }
            });
            var arr = str.split('$$$');
            var gamename = arr[0];
            var mark = arr[1];
            var json = arr[2];
            var openos = arr[3];
            var encryption  = arr[4];
            var ck = arr[5];
            var ip = arr[6];
            var port = arr[7];
            var send_times  = arr[8];
            var thread_count  = arr[9];
            var time_out  = arr[10];
            var path  = arr[11];
            var oidb_ip  = arr[12];
            var oidb_port  = arr[13];
            var keys  = arr[14];
            var conn_type  = arr[15];
            var send_type  = arr[16];
            var conn_count  = arr[17];
            var send_rate  = arr[18];
            var infos = mycars.join('$$$');
            var send_type_stores = new Ext.data.SimpleStore({
                fields : ['id', 'value'],
                data : [['0', 'sendsyn'], ['1', 'sendasyn']]
            });
            var conn_type_stores = new Ext.data.SimpleStore({
                fields : ['id', 'value'],
                data : [['0', 'shortconn'], ['1', 'longconn']]
            });
            var makeab = new Ext.Window({
                title: '压力测试',
                width: 1200,
                layout : 'column',
                buttonAlign:'center',
                height:560,
                plain:true,
                modal:true,
                items : [{
                    columnWidth :.23,
                    style:'margin:4px;padding:4px',
                    xtype : 'fieldset',
                    title: '参数设置',
                    height:450,
                    layout :'fit',
                    items:[{
                        xtype : 'form',
                        id:'stress',
                        defaultType: 'textfield',
                        baseCls:"x-plain",
                        items:[{
                            fieldLabel: 'ip',
                            style: 'margin-top:10px;',
                            labelStyle: 'margin-top:10px;',
                            name :'ip',
                            value: (ck =='0') ? '' :ip
                        },{
                            fieldLabel: 'port',
                            style: 'margin-top:10px;',
                            labelStyle: 'margin-top:10px;',
                            value: (ck =='0') ? '' : port ,
                            name :'port'
                        },{
                            fieldLabel: 'send_times',
                            style: 'margin-top:10px;',
                            labelStyle: 'margin-top:10px;',
                            value:(ck =='0') ? '10000' :send_times,
                            name :'send_times'
                        },{
                            fieldLabel: 'thread_count',
                            style: 'margin-top:10px;',
                            labelStyle: 'margin-top:10px;',
                            value:(ck =='0') ? '6' :thread_count,
                            name :'thread_count'
                        },{
                            fieldLabel: 'time_out',
                            style: 'margin-top:10px;',
                            labelStyle: 'margin-top:10px;',
                            value:(ck =='0') ? '3000' :time_out,
                            name :'time_out'
                        },{
                            fieldLabel: 'report_file',
                            style: 'margin-top:10px;',
                            labelStyle: 'margin-top:10px;',
                            value:gamename,
                            name :'report_file'
                        },{
                            fieldLabel: 'path',
                            style: 'margin-top:10px;',
                            labelStyle: 'margin-top:10px;',
                            disabled:(json =='1')?false:true,
                            hideLabel : (mark == '1')? false : true,
                            hidden : (mark == '1')? false : true,
                            value : (json =='1')? path : '',
                            name :'path'
                        },{
                            fieldLabel: 'oidb_ip',
                            style: 'margin-top:10px;',
                            labelStyle: 'margin-top:10px;',
                            disabled:(openos =='1') ?false:true,
                            value : (openos =='1')? oidb_ip : '',
                            hideLabel : (mark == '1')? false : true,
                            hidden : (mark == '1')? false : true,
                            name :'oidb_ip'
                        },{
                            fieldLabel: 'oidb_port',
                            disabled:(openos =='1') ?false:true,
                            style: 'margin-top:10px;',
                            hideLabel : (mark == '1')? false : true,
                            hidden : (mark == '1')? false : true,
                            labelStyle: 'margin-top:10px;',
                            value : (openos =='1')? oidb_port : '',
                            name :'oidb_port'
                        },{
                            fieldLabel: 'key',
                            style: 'margin-top:10px;',
                            labelStyle: 'margin-top:10px;',
                            name :'key',
                            hideLabel : (mark == '1' && encryption == '1')? false : true,
                            hidden : (mark == '1' && encryption == '1')? false : true,
                            value : keys || ''
                        },{
                            width:130,
                            layout:'form',
                            xtype: "combo",
                            valueField : 'id',
                            displayField : 'value',
                            store : conn_type_stores,
                            hideLabel : (mark == '1')? true : false,
                            hidden : (mark == '1')? true : false,
                            mode:'local',
                            triggerAction:'all',
                            fieldLabel: 'conn_type',
                            value:(encryption !='0') ? conn_type :1,
                            name :'conn_type'
                        },{
                            width:130,
                            layout:'form',
                            xtype: "combo",
                            valueField : 'id',
                            displayField : 'value',
                            store : send_type_stores,
                            mode:'local',
                            triggerAction:'all',
                            fieldLabel: 'send_type',
                            value:(encryption !='0') ? send_type :1,
                            hideLabel : (mark == '1')? true : false,
                            hidden : (mark == '1')? true : false,
                            name :'send_type'
                        },{
                            xtype: "textfield",
                            fieldLabel: 'conn_count',
                            style: 'margin-top:10px;',
                            labelStyle: 'margin-top:10px;',
                            value:(encryption !='0') ? conn_count :'10',
                            hideLabel : (mark == '1')? true : false,
                            hidden : (mark == '1')? true : false,
                            name :'conn_count'
                        },{
                            xtype: "textfield",
                            fieldLabel: 'send_rate',
                            style: 'margin-top:10px;',
                            labelStyle: 'margin-top:10px;',
                            value:(encryption !='0') ? send_rate :'10',
                            hideLabel : (mark == '1')? true : false,
                            hidden : (mark == '1')? true : false,
                            name :'send_rate'
                        }]
                    }]
                },{
                    columnWidth :.75,
                    style:'margin:4px;padding:4px',
                    xtype : 'fieldset',
                    title: '压力结果',
                    layout :'fit',
                    items:[{
                        xtype:'form',
                        id:'stress_result',
                        autoScroll:true,
                        defaultType: 'textarea',
                        baseCls:"x-plain",
                        items:[{
//                            fieldLabel: '压力结果',
                            width:860,
                            height:450,
                            name :'s_result',
                            hideLabel:true
                        }]
                    }]
                }],
                buttons: [{
                    text: '压力测试',
                    id :'beginstress',
                    scope: this,
                    handler: function(){
                        var pathV = Ext.getCmp('stress').getForm().findField('path');
                        if(pathV.disabled == false && Ext.isEmpty(pathV.getValue()))
                        {
                            Ext.Msg.alert("提示","path值不能为空!");
                            return;
                        }
                        this.disabled = true;  // Ext.getCmp('beginstress').setDisabled(false);
                        clearInterval(timeID);
                        contents='';
                        beforeline='';
                        var fp1 = Ext.getCmp('stress_result');
                        fp1.getForm().items.get(0).setValue(contents);
                        setTimeout(function (){pressstress(ck,infos,mark);}, 1000);
                    }
                },{
                    text: '关闭',
                    scope:this,
                    handler:function(){
                        makeab.close();
                        clearInterval(timeID);
                        contents='';
                        beforeline='';
                    }
                },'->']
            });
            makeab.show();
            if(mark==0 && len>1){
                Ext.Msg.alert("温馨提示", '对老业务多条指令压力测试，测试结果不能入库。');
            }
        },
        modify : function(val){
            var ck = true;
            if(!Ext.isObject(val)){
                ck = false ;
                var cmd_v = this.store.getAt(val).get('cmd');
                var id_v = this.store.getAt(val).get('id');
//                var return_v = this.store.getAt(val).get('return');
                var mark_v = this.store.getAt(val).get('mark');
                var cmdid_v = this.store.getAt(val).get('cmdid');
//                var desc_v = this.store.getAt(val).get('desc');
            }
            var addIniPanel = new Ext.Window({
                title: ck ? '添加指令' : '修改指令',
                width: 600,
                height:180,
                bodyStyle:'padding:5px 25px 0',
                plain:true,
                modal:true,
                defaultType: 'textfield',
                items: [{
                    xtype : 'form',
                    id:'configIni',
                    baseCls:"x-plain",
                    defaultType: 'textarea',
                    items:[{
                        fieldLabel: '测试串',
                        height:100,
                        width: 400,
                        name :'cmd',
//                        regex: /^\S+$/ ,
//                        blankText:"不能为空，请填写",
                        value:ck ? '' : cmd_v
                    }/*,{
                        fieldLabel: '返回值',
                        height:80,
                        width: 400,
                        name :'result',
                        value:ck ? '' : return_v ,
                        regex: /^\S+$/ ,
                        blankText:"不能为空，请填写"
                    },{
                        fieldLabel: '描述',
                        height:80,
                        width: 400,
                        name :'des',
                        value:ck ? '' : desc_v,
                        regex: /^\S+$/ ,
                        blankText:"不能为空，请填写"
                    }*/]
                }],
                buttons: [{
                    text: '提交',
                    scope: this,
                    handler: function(){
                        var form = Ext.getCmp('configIni').getForm();
                        if(form.isValid()){
                            var val = form.getFieldValues();
                            if(Ext.isEmpty(val.cmd))
                            {
                                Ext.Msg.alert("提示", '<nobr>测试串不能为空。</nobr>');
                                return false;
                            }
                           /* if(Ext.isEmpty(val.result))
                            {
                                Ext.Msg.alert("提示", '<nobr>返回值不能为空。</nobr>');
                                return false;
                            }
                            if(Ext.isEmpty(val.des))
                            {
                                Ext.Msg.alert("提示", '<nobr>描述不能为空。</nobr>');
                                return false;
                            }*/
                            Ext.Ajax.request({
                                url: ck ? '/TestScript/addcmdData' :'/TestScript/updatecmdData',
                                method:'post',
                                params:{id:id_v,cmdid:cmdid_v,mark:mark_v,cmd: val.cmd,result:'',des:''},//result: val.result,des: val.des
                                success:function(req){
                                    var responseObj = Ext.util.JSON.decode(req.responseText);
                                    Ext.Msg.alert("提示", responseObj.info);
                                    fp.getForm().items.get(2).setValue(val.cmd);
                                    grid.store.reload();
                                    if(responseObj.success){
                                        addIniPanel.close();
                                    }
                                }
                            });
                        }
                    }
                },{
                    text: '关闭',
                    scope:this,
                    handler:function(){
                        addIniPanel.close();
                    }
                }]
            });
            addIniPanel.show();
        },
        del:function(val){
            var id_v = this.store.getAt(val).get('id');
            Ext.MessageBox.confirm( "请确认", "提交选中的信息", function(button,text){
                if(button=='yes'){
                    Ext.Ajax.request({
                        url: '/TestScript/delete',
                        method:'post',
                        params:{id:id_v},
                        success:function(req){
                            var responseObj = Ext.util.JSON.decode(req.responseText);
                            Ext.Msg.alert("提示", responseObj.info);
                            grid.store.reload();
                        }
                    });
                }
            })
        },
        add_test:function(val){
            var cmd = this.store.getAt(val).get('cmd');
            fp.getForm().items.get(2).setValue(cmd);
            //1109新增点击测试直接将结果放入结果区功能，下面模拟点击测试按钮效果。
            Ext.getCmp('fpid').fireEvent('click');
        },
        selects:function(){
            var mycars=[];
            var grid = Ext.getCmp('cmdid');
            if (grid.getSelectionModel().hasSelection()){
                var records=grid.getSelectionModel().getSelections();
                for(var i=0;i<records.length;i++){
                    mycars[i]=records[i].data.cmd; //cmd:type
                }
            }else{
                alert('请选择指令!');
            }
            return mycars;
        }
    });
    // load the remote data
    grid.store.load();
    var view=new Ext.Viewport({
        enableTabScroll:true,
        layout:"fit",frame: false,
        items:[{
                layout : 'column',
                frame: false,
                autoScroll:true,
                title: '接口测试',
                style:'padding:2px;background-Color:#DFE8F6;',
                plain: true,
//        baseCls:"x-plain",
                items : [{
                    columnWidth :.6,
                    style:'margin-left:2px;padding:2px 0 2px 2px',
//            xtype : 'fieldset',
                    height:550,
                    layout :'fit',
                    frame: false,
                    border:true,
//                    autoScroll:true,
                    items:[grid]
                },{
                    columnWidth :.4, border:true,
                    height:550,
                    frame: false,
                    style:'margin-right:0px;padding:2px 0px 2px 0',
//            xtype : 'fieldset',
//            title: ' ',
                    layout :'fit',
                    items:[fp]
                }]
            }]
    })

})



