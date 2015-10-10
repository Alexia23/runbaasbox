<?xml version="1.0" encoding="utf-8"?>

<div xmlns="http://www.w3.org/1999/xhtml" component="$UI/system/components/justep/window/window" design="device:mobile"
  xid="window">  
  <div component="$UI/system/components/justep/model/model" xid="model" style="height:auto;left:16px;top:246px;">
    <div component="$UI/system/components/justep/data/data" xid="personalData"
      directDelete="true" autoLoad="true" idColumn="id" onCustomRefresh="mainDataCustomRefresh" confirmRefresh="false" limit="10">
      <column isCalculate="false" label="#" name="id" type="Integer" xid="xid1"></column>
  <column isCalculate="false" label="上传时间" name="uploadtime" type="DateTime" xid="xid2"></column>
  <column isCalculate="false" label="等效跑步距离km" name="distance" type="Float" xid="xid3"></column>
  <data xid="default1">[]</data></div>  
  </div>  
  <div component="$UI/system/components/justep/panel/panel" class="x-panel x-full"> 
    <div class="x-panel-top"> 
      <div component="$UI/system/components/justep/titleBar/titleBar" title="个人数据"
        class="x-titlebar"> 
        <div class="x-titlebar-left"> 
          </div>  
        <div class="x-titlebar-title">个人数据</div>  
        <div class="x-titlebar-right reverse"> 
          </div> 
      </div> 
    </div>  
    <div class="x-panel-content"> 
      <div xid="div6" style="margin:10px;padding:10px;">
   
   <div component="$UI/system/components/justep/labelEdit/labelEdit" class="x-label-edit" xid="start">
    <label class="x-label" xid="starttimelable" style="width:80px;"><![CDATA[起始日期]]></label>
    <input component="$UI/system/components/justep/input/input" class="form-control x-edit" xid="starttime" dataType="Date"></input></div> 
   <div component="$UI/system/components/justep/labelEdit/labelEdit" class="x-label-edit" xid="end">
    <label class="x-label" xid="endtimelabel" style="width:80px;"><![CDATA[结束日期]]></label>
    <input component="$UI/system/components/justep/input/input" class="form-control x-edit" xid="endtime" dataType="Date" max="js:new Date()"></input></div> </div>
  <div component="$UI/system/components/justep/dataTables/dataTables" flexibleWidth="true" rowActiveClass="active" class="table table-hover table-striped" xid="dataTables2" data="personalData">
   <columns xid="columns2">
    <column name="id" xid="column3" label="#"></column>
    <column name="uploadtime" xid="column4" label="上传时间"></column>
    <column name="distance" xid="column5" label="等效跑步距离km"></column></columns> </div></div>  
    </div> 
</div>