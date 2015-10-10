<?xml version="1.0" encoding="utf-8"?>

<div xmlns="http://www.w3.org/1999/xhtml" xid="window" class="window" component="$UI/system/components/justep/window/window"
  design="device:mobile">  
  <div component="$UI/system/components/justep/model/model" xid="model" style="height:auto;left:319px;top:545px;"
    onLoad="modelLoad"> 
    </div>  
  <div component="$UI/system/components/justep/panel/panel" class="x-panel x-full"
    xid="panel1"> 
    <div class="x-panel-top" xid="top1"> 
      <div component="$UI/system/components/justep/titleBar/titleBar" class="x-titlebar"
        xid="titleBar1" title="总成绩"> 
        <div class="x-titlebar-left" xid="div1"/>  
        <div class="x-titlebar-title" xid="div2">总成绩</div>  
        <div class="x-titlebar-right reverse" xid="div3"><a component="$UI/system/components/justep/button/button" class="btn btn-link btn-only-icon" label="button" xid="button1" icon="icon-android-more" onClick="button1Click">
   <i xid="i1" class="icon-android-more"></i>
   <span xid="span4"></span></a></div> 
      </div> 
    </div>  
    <div class="x-panel-content" xid="content1"> 
      <div component="$UI/system/components/justep/controlGroup/controlGroup"
        class="x-control-group" title="总体" xid="controlGroup1"> 
        <div class="x-control-group-title" xid="controlGroupTitle1" style="background-color:transparent;"> 
          <span xid="span1"><![CDATA[总体]]></span> 
        </div>  
        <div component="$UI/system/components/justep/labelEdit/labelEdit" class="x-label-edit x-label30"
          xid="labelOutput2"> 
          <label class="x-label" xid="label2" style="text-align:center;"><![CDATA[总体目标：]]></label>  
          <div component="$UI/system/components/justep/output/output" class="x-output x-edit"
            xid="total_target"/> 
        </div>  
        <div component="$UI/system/components/justep/labelEdit/labelEdit" class="x-label-edit x-label30"
          xid="labelOutput3"> 
          <label class="x-label" xid="label3" style="text-align:center;"><![CDATA[总体完成：]]></label>  
          <div component="$UI/system/components/justep/output/output" class="x-output x-edit"
            xid="total_complete"/> 
        </div>  
        <div component="$UI/system/components/justep/labelEdit/labelEdit" class="x-label-edit x-label30"
          xid="labelOutput4" style="border-bottom-style:solid;border-bottom-width:1px;border-bottom-color:#C0C0C0;"> 
          <label class="x-label" xid="label4" style="text-align:center;"><![CDATA[完成比例：]]>  
            </label>  
          <div component="$UI/system/components/justep/output/output" class="x-output x-edit"
            xid="total_compltet_percent"/> 
        </div> 
      </div> 
    <div component="$UI/system/components/justep/controlGroup/controlGroup" class="x-control-group" title="团队" xid="controlGroup2">
   <div class="x-control-group-title" xid="controlGroupTitle2" style="background-color:transparent;">
    <span xid="span2"><![CDATA[团队]]></span></div> 
  <div component="$UI/system/components/justep/labelEdit/labelEdit" class="x-label-edit x-label30" xid="labelOutput5">
   <label class="x-label" xid="label7" style="text-align:center;"><![CDATA[团队完成：]]></label>
   <div component="$UI/system/components/justep/output/output" class="x-output x-edit" xid="team_complete"></div></div>
  <div component="$UI/system/components/justep/labelEdit/labelEdit" class="x-label-edit x-label30" xid="labelOutput6" style="border-bottom-style:solid;border-bottom-width:1px;border-bottom-color:#C0C0C0;">
   <label class="x-label" xid="label8" style="text-align:center;"><![CDATA[完成比例：]]></label>
   <div component="$UI/system/components/justep/output/output" class="x-output x-edit" xid="team_compltet_percent"></div></div></div>
  <div component="$UI/system/components/justep/controlGroup/controlGroup" class="x-control-group" title="个人" xid="controlGroup3">
   <div class="x-control-group-title" xid="controlGroupTitle3" style="background-color:transparent;">
    <span xid="span3"  bind-click="span3Click"><![CDATA[个人]]></span></div> 
  <div component="$UI/system/components/justep/labelEdit/labelEdit" class="x-label-edit x-label30" xid="labelOutput7">
   <label class="x-label" xid="label9" style="text-align:center;"><![CDATA[个人完成：]]></label>
   <div component="$UI/system/components/justep/output/output" class="x-output x-edit" xid="personal_complete"></div></div>
  <div component="$UI/system/components/justep/labelEdit/labelEdit" class="x-label-edit x-label30" xid="labelOutput8">
   <label class="x-label" xid="label10" style="text-align:center;"><![CDATA[完成比例：]]></label>
   <div component="$UI/system/components/justep/output/output" class="x-output x-edit" xid="personal_compltet_percent"></div></div></div></div> 
  </div> 
<div component="$UI/system/components/justep/popMenu/popMenu" class="x-popMenu" xid="popMenu1" anchor="button1">
   <div class="x-popMenu-overlay" xid="div4"></div>
   <ul component="$UI/system/components/justep/menu/menu" class="x-menu dropdown-menu x-popMenu-content" xid="menu1"><li class="x-menu-item" xid="item1">
   <a component="$UI/system/components/justep/button/button" class="btn btn-link" label="上传成绩" xid="button2" icon="icon-person-add" onClick="button2Click">
    <i xid="i2" class="icon-person-add"></i>
    <span xid="span5">上传成绩</span></a> </li>
  <li class="x-menu-divider divider" xid="divider1"></li>
  <li class="x-menu-item" xid="item2">
   <a component="$UI/system/components/justep/button/button" class="btn btn-link" label="排行榜" xid="button3" icon="icon-android-contacts" onClick="button3Click">
    <i xid="i3" class="icon-android-contacts"></i>
    <span xid="span6">排行榜</span></a> </li>
  <li class="x-menu-divider divider" xid="divider2"></li>
  <li class="x-menu-item" xid="item4">
   <a component="$UI/system/components/justep/button/button" class="btn btn-link" label="总成绩" xid="button5" icon="icon-android-friends" onClick="button5Click">
    <i xid="i5" class="icon-android-friends"></i>
    <span xid="span8">总成绩</span></a> </li></ul></div></div>
