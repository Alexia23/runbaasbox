define(function(require){
require('$model/UI2/system/components/justep/row/row');
require('$model/UI2/system/components/justep/panel/panel');
require('$model/UI2/system/components/justep/button/buttonGroup');
require('$model/UI2/system/components/justep/list/list');
require('$model/UI2/system/components/justep/window/window');
require('$model/UI2/system/components/justep/popMenu/popMenu');
require('$model/UI2/system/components/justep/data/data');
require('$model/UI2/system/components/justep/titleBar/titleBar');
require('$model/UI2/system/components/justep/contents/contents');
require('$model/UI2/system/components/justep/panel/child');
require('$model/UI2/system/components/justep/scrollView/scrollView');
require('$model/UI2/system/components/justep/contents/content');
require('$model/UI2/system/components/justep/model/model');
require('$model/UI2/system/components/justep/button/button');
require('$model/UI2/system/components/justep/output/output');
require('$model/UI2/system/components/justep/menu/menu');
var __parent1=require('$model/UI2/system/lib/base/modelBase'); 
var __parent0=require('$model/UI2/run/resultList'); 
require('css!$model/UI2/run/resultList').load();
var __result = __parent1._extend(__parent0).extend({
	constructor:function(contextUrl){
	this.__sysParam='true';
	this.__contextUrl=contextUrl;
	this.__id='__baseID__';
	this._flag_='aac764b672284768723aa3eda26d66c3';
	this.callParent(contextUrl);
 var __Data__ = require("$UI/system/components/justep/data/data");new __Data__(this,{"autoLoad":true,"confirmDelete":true,"confirmRefresh":true,"defCols":{"mileage":{"define":"mileage","label":"总里程","name":"mileage","relation":"mileage","rules":{"number":true},"type":"Float"},"name":{"define":"name","label":"姓名","name":"name","relation":"name","type":"String"},"photo":{"define":"photo","label":"头像","name":"photo","relation":"photo","type":"String"},"rank":{"define":"rank","label":"排名","name":"rank","relation":"rank","rules":{"integer":true},"type":"Integer"},"team":{"define":"team","label":"北美团队","name":"team","relation":"team","type":"String"},"times":{"define":"times","label":"次数","name":"times","relation":"times","rules":{"integer":true},"type":"Integer"}},"directDelete":false,"events":{"onCustomRefresh":"personalDataCustomRefresh"},"idColumn":"name","limit":10,"xid":"personalData"});
 new __Data__(this,{"autoLoad":true,"confirmDelete":true,"confirmRefresh":true,"defCols":{"id":{"define":"id","label":"排名","name":"id","relation":"id","rules":{"integer":true},"type":"Integer"},"mileage":{"define":"mileage","label":"里程","name":"mileage","relation":"mileage","rules":{"number":true},"type":"Float"},"name":{"define":"name","label":"团队名称","name":"name","relation":"name","type":"String"},"times":{"define":"times","label":"次数","name":"times","relation":"times","rules":{"integer":true},"type":"Integer"}},"directDelete":false,"events":{"onCustomRefresh":"teamDataCustomRefresh"},"idColumn":"id","limit":20,"xid":"teamData"});
}}); 
return __result;});