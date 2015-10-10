<?xml version="1.0" encoding="utf-8"?>

<div xmlns="http://www.w3.org/1999/xhtml" xid="window" class="window" component="$UI/system/components/justep/window/window"
  design="device:mobile">  
  <div component="$UI/system/components/justep/model/model" xid="model" style="height:auto;left:310px;top:123px;" onLoad="modelLoad"> 
    <div component="$UI/system/components/justep/data/data" autoLoad="true"
      xid="teamData" idColumn="id">
      <column label="id" name="id" type="Integer" xid="xid1"/>  
      <column label="名称" name="name" type="String" xid="xid2"/>
      <data>
        [{"id":"1","name":"apple"}]
      </data>
    </div>
  </div>  
  <span component="$UI/system/components/justep/messageDialog/messageDialog" xid="messageDialog" style="left:20px;top:18px;"></span><div component="$UI/system/components/justep/panel/panel" class="x-panel x-full"
    xid="panel1"> 
    <div class="x-panel-top" xid="top1"> 
      <div component="$UI/system/components/justep/titleBar/titleBar" class="x-titlebar"
        xid="titleBar1" title="注册"> 
        <div class="x-titlebar-left" xid="div1"> 
          </div>  
        <div class="x-titlebar-title" xid="div2">注册</div>  
        <div class="x-titlebar-right reverse" xid="div3"/> 
      </div> 
    </div>  
    <div class="x-panel-content" xid="content1"> 
      <div xid="div6" style="margin:10px;padding:10px;"> 
        <div component="$UI/system/components/justep/labelEdit/labelEdit" class="x-label-edit"
          xid="labelInput9"> 
          <label class="x-label" xid="label4" style="width:80px;">姓名*</label>  
          <input component="$UI/system/components/justep/input/input" class="form-control x-edit"
            xid="user_name"/> 
        </div>  
        <div component="$UI/system/components/justep/labelEdit/labelEdit" class="x-label-edit"
          xid="labelInput10"> 
          <label class="x-label" xid="label10" style="width:80px;"><![CDATA[入学年级*]]></label>  
          <input component="$UI/system/components/justep/input/input" class="form-control x-edit"
            xid="user_grade" placeHolder="如：99级计算机系"/> 
        </div>  
        <div component="$UI/system/components/justep/labelEdit/labelEdit" class="x-label-edit"
          xid="labelInput11"> 
          <label class="x-label" xid="label11" style="width:80px;"><![CDATA[工作单位*]]></label>  
          <input component="$UI/system/components/justep/input/input" class="form-control x-edit"
            xid="user_company"/> 
        </div>  
        <div component="$UI/system/components/justep/labelEdit/labelEdit" class="x-label-edit"
          xid="labelInput8"> 
          <label class="x-label" xid="label5" style="width:80px;">电话*</label>  
          <input component="$UI/system/components/justep/input/input" class="form-control x-edit"
            xid="user_mobile" dataType="Integer"/> 
        </div>  
        <div component="$UI/system/components/justep/labelEdit/labelEdit" class="x-label-edit x-label30"
          xid="labelSelect2"> 
          <label class="x-label" xid="label13" style="width:80px;"><![CDATA[团队组织*]]></label>  
          <select component="$UI/system/components/justep/select/select" class="form-control x-edit"
            xid="user_team" bind-options="teamData" bind-optionsValue="id" bind-optionsLabel="name"/> 
        </div> 
      </div>  
      <div xid="div7" style="text-align:right;padding-right:10px;"> 
        <a component="$UI/system/components/justep/button/button" class="btn btn-default btn-sm"
          label="提交用户信息" xid="saveUserBtn" onClick="saveUserBtnClick"> 
          <i xid="i2"/>  
          <span xid="span5">提交用户信息</span> 
        </a>  
        </div> 
    </div> 
  </div>  
  <div component="$UI/system/components/justep/popOver/popOver" class="x-popOver"
    xid="popOver1" dismissible="false" opacity="0.8"> 
    <div class="x-popOver-overlay" xid="div8" style="font-size:medium;"/>  
    <div class="x-popOver-content" xid="div9"> 
      <a component="$UI/system/components/justep/button/button" class="btn btn-link btn-only-icon"
        label="button" xid="button5" icon="icon-loading-a" style="font-size:36px;height:63px;width:71px;"> 
        <i xid="i5" class="icon-loading-a"/>  
        <span xid="span7"/>
      </a>
    </div> 
  </div> 
</div>
