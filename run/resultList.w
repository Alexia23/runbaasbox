<?xml version="1.0" encoding="utf-8"?>

<div xmlns="http://www.w3.org/1999/xhtml" xid="window" class="window run" component="$UI/system/components/justep/window/window"
  design="device:mobile">  
  <div component="$UI/system/components/justep/model/model" xid="model" style="height:auto;left:7px;top:238px;"> 
    <div component="$UI/system/components/justep/data/data" autoLoad="true"
      xid="personalData" idColumn="name" onCustomRefresh="personalDataCustomRefresh" limit="10"> 
      <column label="姓名" name="name" type="String" xid="xid2"></column>
  <column label="头像" name="photo" type="String" xid="xid3"></column>
  <column label="总里程" name="mileage" type="Float" xid="xid4"></column>
  <column label="次数" name="times" type="Integer" xid="xid5"></column>
  <column label="排名" name="rank" type="Integer" xid="xid11"></column>
  <column label="北美团队" name="team" type="String" xid="xid6"></column></div>  
    <div component="$UI/system/components/justep/data/data" autoLoad="true"
      xid="teamData" idColumn="id" onCustomRefresh="teamDataCustomRefresh">
      <column label="排名" name="id" type="Integer" xid="xid7"/>  
      <column label="团队名称" name="name" type="String" xid="xid8"/>  
      <column label="里程" name="mileage" type="Float" xid="xid9"/>  
      <column label="次数" name="times" type="Integer" xid="xid10"/>
    </div>
  </div>  
  <div component="$UI/system/components/justep/panel/panel" class="x-panel x-full"
    xid="panel1"> 
    <div class="x-panel-top" xid="top1"> 
      <div component="$UI/system/components/justep/titleBar/titleBar" class="x-titlebar"
        xid="titleBar1" title="排行榜"> 
        <div class="x-titlebar-left" xid="div1"> 
          </div>  
        <div class="x-titlebar-title" xid="div2" dir="ltr" title="排行榜">排行榜</div>  
        <div class="x-titlebar-right reverse" xid="div3"><a component="$UI/system/components/justep/button/button" class="btn btn-link btn-only-icon" label="button" xid="button1" icon="icon-android-more" onClick="button1Click">
   <i xid="i1" class="icon-android-more"></i>
   <span xid="span1"></span></a></div> 
      </div> 
    </div>  
    <div class="x-panel-content x-scroll-view" xid="content1"> 
      <div component="$UI/system/components/justep/contents/contents" class="x-contents x-full"
        active="0" xid="pages" swipe="true" slidable="true" routable="true"> 
        <div class="x-contents-content x-scroll-view" xid="content-1"> 
          <div class="x-scroll" component="$UI/system/components/justep/scrollView/scrollView"
            xid="scrollView1"> 
            <div class="x-content-center x-pull-down container" xid="div4"> 
              <i class="x-pull-down-img glyphicon x-icon-pull-down" xid="i6"/>  
              <span class="x-pull-down-label" xid="span8" style="width:100%;">下拉刷新...</span> 
            </div>  
            <div class="x-scroll-content" xid="div5"> 
              <div component="$UI/system/components/justep/list/list" class="x-list"
                xid="list2" data="personalData" limit="10"> 
                <ul class="x-list-template" xid="listTemplateUl2"> 
                  <li xid="li2" class="x-flex run-list-row"> 
                    <div component="$UI/system/components/justep/row/row" class="x-row x-row-center"
                      xid="row2"> 
                      <div xid="col1" style="width:80px;"> 
                        <img alt="" xid="image1" style="width:100%;height:80px;" class="img-rounded" bind-attr-src="val('photo')"></img></div>  
                      <div class="x-col" xid="col5"> 
                        <div component="$UI/system/components/justep/row/row"
                          class="x-row" xid="row3"> 
                          <div class="x-col" xid="col9"> 
                            <div component="$UI/system/components/justep/output/output"
                              class="x-output" xid="output4" style="font-weight:bold;font-size:large;margin-left:5px;"
                              bind-ref="ref('name')"/> 
                          </div> 
                        </div>  
                          
                         
<div component="$UI/system/components/justep/row/row" class="x-row" xid="row1">   
    <div xid="col3" style="margin-top:9px;margin-left:5px;"> 
         <span xid="span3" style="width:100%;">排名：</span></div> 
    <div class="x-col" xid="col22">
         <div component="$UI/system/components/justep/output/output" class="x-output" xid="output2" bind-ref="ref('rank')" style="font-weight:bold;" /></div>
 	<div style="margin-top:9px;" xid="col23">
  		<span xid="span6" style="width:100%;">团队：</span></div>
  	<div class="x-col" xid="col24">
  		<div component="$UI/system/components/justep/output/output" class="x-output" xid="output7" bind-ref="ref('team')" style="font-weight:bold;"></div></div></div>
  						
<div component="$UI/system/components/justep/row/row" class="x-row" xid="row4">
   <div xid="col11" style="margin-top:9px;margin-left:5px;">
   		<span xid="span7" style="width:100%;">里程：</span></div> 
   <div xid="col21" class="x-col">
    	<div component="$UI/system/components/justep/output/output" class="x-output" xid="output8" bind-ref="ref('mileage')" style="color:#FF0000;font-weight:bold;"></div></div> 
   <div xid="col6" style="margin-top:9px;">
    	<span xid="span2" style="width:100%;">次数：</span></div> 
   <div xid="col7" class="x-col">
    	<div component="$UI/system/components/justep/output/output" class="x-output" xid="output1" bind-ref="ref('times')" style="font-weight:bold;"></div></div> </div></div> 
                    </div> 
                  </li> 
                </ul> 
              </div> 
            </div>  
            <div class="x-content-center x-pull-up" xid="div6"> 
              <span class="x-pull-up-label" xid="span9">加载更多...</span> 
            </div> 
          </div> 
        </div>  
        <div class="x-contents-content xui-hignlight-selected x-scroll-view x-content-on-right"
          xid="content-2" onActive="content_2Active" onactive="content_2Active"> 
          <div class="x-scroll" component="$UI/system/components/justep/scrollView/scrollView"
            xid="scrollView2"> 
            <div class="x-content-center x-pull-down container" xid="div7"> 
              <i class="x-pull-down-img glyphicon x-icon-pull-down" xid="i2"/>  
              <span class="x-pull-down-label" xid="span10">下拉刷新...</span> 
            </div>  
            <div class="x-scroll-content" xid="div8"> 
              <div component="$UI/system/components/justep/list/list" class="x-list"
                xid="list1" data="teamData"> 
                <ul class="x-list-template" xid="listTemplateUl1"> 
                  <li xid="li1" style="x-flex run-list-row" class="x-flex run-list-row"> 
                    <div component="$UI/system/components/justep/row/row" class="x-row"
                      xid="row6"> 
                      <div class="x-col" xid="col16"> 
                        <div component="$UI/system/components/justep/output/output"
                          class="x-output" xid="output3" bind-ref="ref('id')"/> 
                      </div>  
                      <div class="x-col" xid="col17"> 
                        <div component="$UI/system/components/justep/output/output"
                          class="x-output" xid="output5" bind-ref="ref('name')"/> 
                      </div>  
                      <div class="x-col" xid="col18"> 
                        <div component="$UI/system/components/justep/output/output"
                          class="x-output" xid="output6" bind-ref="ref('mileage')"/> 
                      </div>  
                      <div class="x-col" xid="col19"> 
                        <div component="$UI/system/components/justep/output/output"
                          class="x-output" xid="output9" bind-ref="ref('times')"/> 
                      </div> 
                    </div> 
                  </li> 
                </ul> 
              </div> 
            </div>  
            <div class="x-content-center x-pull-up" xid="div9"> 
              <span class="x-pull-up-label" xid="span11">加载更多...</span> 
            </div> 
          </div> 
        </div> 
      </div> 
    </div>  
    <div class="x-panel-bottom" xid="bottom1"> 
      <div component="$UI/system/components/justep/button/buttonGroup" class="btn-group btn-group-justified"
        tabbed="true" xid="buttonGroup2" selected="button4" style="height:48px;"> 
        <a component="$UI/system/components/justep/button/button" class="btn btn-default"
          label="个人排行榜" xid="button4" style="height:100%;" target="content-1"> 
          <i xid="i4"/>  
          <span xid="span4">个人排行榜</span>
        </a>  
        <a component="$UI/system/components/justep/button/button" class="btn btn-default"
          label="团队排行榜" xid="button5" target="content-2"> 
          <i xid="i5"/>  
          <span xid="span5">团队排行榜</span>
        </a> 
      </div>
    </div> 
  </div> 
<div component="$UI/system/components/justep/popMenu/popMenu" class="x-popMenu" xid="popMenu2" anchor="button1">
   <div class="x-popMenu-overlay" xid="div11"></div>
   <ul component="$UI/system/components/justep/menu/menu" class="x-menu dropdown-menu x-popMenu-content" xid="menu2"><li class="x-menu-item" xid="item3">
   <a component="$UI/system/components/justep/button/button" class="btn btn-link" label="上传成绩" xid="button6" icon="icon-person-add" onClick="button6Click">
    <i xid="i8" class="icon-person-add"></i>
    <span xid="span12">上传成绩</span></a> </li>
  <li class="x-menu-divider divider" xid="divider2"></li>
  <li class="x-menu-item" xid="item5">
   <a component="$UI/system/components/justep/button/button" class="btn btn-link" label="排行榜" xid="button8" icon="icon-android-contacts" onClick="button8Click">
    <i xid="i10" class="icon-android-contacts"></i>
    <span xid="span14">排行榜</span></a> </li>
  <li class="x-menu-divider divider" xid="divider3"></li>
  <li class="x-menu-item" xid="item6">
   <a component="$UI/system/components/justep/button/button" class="btn btn-link" label="总成绩" xid="button9" icon="icon-android-friends" onClick="button9Click">
    <i xid="i11" class="icon-android-friends"></i>
    <span xid="span15">总成绩</span></a> </li></ul></div></div>
