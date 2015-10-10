<?xml version="1.0" encoding="utf-8"?>

<div xmlns="http://www.w3.org/1999/xhtml" xid="window" class="window" component="$UI/system/components/justep/window/window"
  design="device:mobile">  
  <div component="$UI/system/components/justep/model/model" xid="model" style="height:auto;left:123px;top:73px;" onLoad="modelLoad"> 
    <div component="$UI/system/components/justep/data/data" autoLoad="true"
      xid="wayData" idColumn="id"> 
      <column label="id" name="id" type="Integer" xid="xid1"/>  
      <column label="名称" name="name" type="String" xid="xid2"/>  
      <data xid="default1">[{"id":0, "name":""},{"id":5,"name":"走路"},{"id":1,"name":"跑步"},{"id":4,"name":"骑车"},{"id":2,"name":"游泳"},{"id":3,"name":"爬山"}]</data> 
    </div> 
  <div component="$UI/system/components/justep/data/data" autoLoad="true" xid="userData" idColumn="name"><column label="名称" name="name" type="String" xid="xid4"></column>
  <column label="团队Id" name="teamId" type="String" xid="xid5"></column>
  <column label="团队名称" name="teamName" type="String" xid="xid6"></column>
  <column label="头像" name="photo" type="String" xid="xid3"></column></div></div>  
  <span component="$UI/system/components/justep/messageDialog/messageDialog" xid="messageDialog" message="成功"></span><div component="$UI/system/components/justep/panel/panel" class="x-panel x-full"
    xid="panel1"> 
    <div class="x-panel-top" xid="top1"> 
      <div component="$UI/system/components/justep/titleBar/titleBar" class="x-titlebar"
        xid="titleBar1" title="成绩上传"> 
        <div class="x-titlebar-left" xid="div1"/>  
        <div class="x-titlebar-title" xid="div2">成绩上传</div>  
        <div class="x-titlebar-right reverse" xid="div3"><a component="$UI/system/components/justep/button/button" class="btn btn-link btn-only-icon" label="button" xid="button1" icon="icon-android-more" onClick="button1Click">
   <i xid="i1" class="icon-android-more"></i>
   <span xid="span1"></span></a></div> 
      </div> 
    </div>  
    <div class="x-panel-content" xid="content1"> 
      <div class="x-panel-content" xid="content2"> 
        <div xid="div6" style="margin:10px;padding:10px;"> 
          <div component="$UI/system/components/justep/labelEdit/labelEdit"
            class="x-label-edit x-label30" xid="labelSelect2"> 
            <label class="x-label" xid="label13" style="width:80px;"><![CDATA[锻炼方式*]]></label>  
            <select component="$UI/system/components/justep/select/select" class="form-control x-edit"
              xid="way" bind-options="wayData" bind-optionsValue="id" bind-optionsLabel="name" style="height:100%;background-color:transparent;"/> 
          </div>  
          <div component="$UI/system/components/justep/labelEdit/labelEdit"
            class="x-label-edit" xid="lichengLI"> 
            <label class="x-label" xid="lichenglable" style="width:80px;"><![CDATA[里程(km)*]]></label>  
            <input component="$UI/system/components/justep/input/input" class="form-control x-edit"
              xid="distance" dataType="Float"/> 
          </div>
          <div component="$UI/system/components/justep/labelEdit/labelEdit"
            class="x-label-edit" xid="labelInput11"> 
            <label class="x-label" xid="label11" style="width:80px;"><![CDATA[日期*]]></label>  
            <input component="$UI/system/components/justep/input/input" class="form-control x-edit"
              xid="dataData" dataType="Date" max="js:new Date()"/> 
          </div>
        </div>  
        <div xid="div7" style="text-align:right;padding-right:10px;"> 
          <a component="$UI/system/components/justep/button/button" class="btn btn-default btn-sm"
            label="提交成绩信息" xid="saveResultBtn" onClick="saveResultBtnClick"> 
            <i xid="i2"/>  
            <span xid="span5">提交成绩信息</span> 
          </a> 
        </div> 
      </div> 
    </div> 
  </div> 
<div component="$UI/system/components/justep/popMenu/popMenu" class="x-popMenu" xid="popMenu1" anchor="button1">
   <div class="x-popMenu-overlay" xid="div8"></div>
   <ul component="$UI/system/components/justep/menu/menu" class="x-menu dropdown-menu x-popMenu-content" xid="menu1"><li class="x-menu-item" xid="item1">
   <a component="$UI/system/components/justep/button/button" class="btn btn-link" label="上传成绩" xid="button2" icon="icon-person-add" onClick="button2Click">
    <i xid="i3" class="icon-person-add"></i>
    <span xid="span2">上传成绩</span></a> </li>
  <li class="x-menu-divider divider" xid="divider1"></li>
  <li class="x-menu-item" xid="item2">
   <a component="$UI/system/components/justep/button/button" class="btn btn-link" label="排行榜" xid="button3" icon="icon-android-contacts" onClick="button3Click">
    <i xid="i4" class="icon-android-contacts"></i>
    <span xid="span3">排行榜</span></a> </li>
  <li class="x-menu-divider divider" xid="divider2"></li>
  <li class="x-menu-item" xid="item3">
   <a component="$UI/system/components/justep/button/button" class="btn btn-link" label="总成绩" xid="button4" icon="icon-android-friends" onClick="button4Click">
    <i xid="i6" class="icon-android-friends"></i>
    <span xid="span4">总成绩</span></a> </li></ul></div><div component="$UI/system/components/justep/popOver/popOver" class="x-popOver" xid="popOver1">
   <div class="x-popOver-overlay" xid="div4"></div>
   <div class="x-popOver-content" xid="div5"><a component="$UI/system/components/justep/button/button" class="btn btn-link btn-only-icon" label="button" xid="button5" icon="icon-loading-a" style="font-size:36px;height:63px;width:71px;">
   <i xid="i5" class="icon-loading-a"></i>
   <span xid="span7"></span></a></div></div></div>
