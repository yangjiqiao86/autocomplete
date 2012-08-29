define("#autocomplete/0.8.0/data-source",["#base/1.0.0/base","#class/1.0.0/class","#events/1.0.0/events","$"],function(e,t,n){function o(e){return Object.prototype.toString.call(e)==="[object String]"}function u(e){return e?e.replace(/^([a-z])/,function(e,t){return t.toUpperCase()}):""}var r=e("#base/1.0.0/base"),i=e("$"),s=r.extend({attrs:{source:[],type:"array"},initialize:function(e){s.superclass.initialize.call(this,e);var t=this.get("source");if(o(t))this.set("type","url");else if(i.isArray(t))this.set("type","array");else{if(!i.isPlainObject(t))throw"Source Type Error";this.set("type","object")}},getData:function(e,t){return this["_get"+u(this.get("type"))+"Data"]()},_getUrlData:function(e){var t=this,n=this.get("source").replace(/{{query}}/g,e?e:"");i.ajax(n,{dataType:"jsonp"}).success(function(e){t.trigger("data",e)}).error(function(e){t.trigger("data",{})})},_getArrayData:function(){var e=this.get("source");return this.trigger("data",e),e},_getObjectData:function(e){},_getFunctionData:function(e){}});n.exports=s}),define("#autocomplete/0.8.0/filter",["$"],function(e,t,n){var r=e("$"),i={startsWith:function(e,t){var n=[],i=e.length,s=new RegExp("^"+e),o=i===1?[0]:[[0,i]];return r.each(t,function(e,t){var r={};s.test(t)&&(r.value=t,r.highlightIndex=o,n.push(r))}),n}};n.exports=i}),define("#autocomplete/0.8.0/autocomplete",["./data-source","./filter","$","#overlay/0.9.9/overlay","#position/1.0.0/position","#iframe-shim/1.0.0/iframe-shim","#widget/1.0.0/widget","#base/1.0.0/base","#class/1.0.0/class","#events/1.0.0/events","#widget/1.0.0/templatable","#handlebars/1.0.0/handlebars"],function(e,t,n){function h(e){return Object.prototype.toString.call(e)==="[object String]"}function p(e,t){if(!e)return t;if(r.isFunction(e))return e.call(this,t);if(h(e)){var n=e.split("."),i=t,s;while(n.length){var o=n.shift();i=i[o];if(!i)break}return i}return t}var r=e("$"),i=e("#overlay/0.9.9/overlay"),s=e("#widget/1.0.0/templatable"),o=e("#handlebars/1.0.0/handlebars"),u=e("./data-source"),a=e("./filter"),f='<div class="{{prefix}}"><ul class="{{prefix}}-ctn" data-role="items">{{#each items}}<li data-role="item" class="{{../prefix}}-item" data-value="{{value}}">{{highlightItem ../prefix}}</li>{{/each}}</ul></div>',l={UP:38,DOWN:40,LEFT:37,RIGHT:39,ENTER:13,ESC:27,BACKSPACE:8},c=i.extend({Implements:s,attrs:{trigger:{value:null,getter:function(e){return r(e)}},prefix:"ui-autocomplete",template:f,filter:"startsWith",resultsLocator:"",selectedIndex:undefined,dataSource:[],inputValue:"",data:[]},events:{"click [data-role=item]":function(e){this.selectItem(),e.preventDefault()},"mouseenter [data-role=item]":function(e){var t=this.items.index(e.currentTarget);this.set("selectedIndex",t)}},templateHelpers:{highlightItem:function(e){var t=this.highlightIndex,n=0,i=this.value,s="";if(r.isArray(t)){for(var u=0,a=t.length;u<a;u++){var f=t[u],l,c;r.isArray(f)?(l=f[0],c=f[1]-f[0]):(l=f,c=1),l-n>0&&(s+=i.substring(n,l)),s+='<span class="'+e+'-item-hl">'+i.substr(l,c)+"</span>",n=l+c}return i.length-n>0&&(s+=i.substring(n,i.length)),new o.SafeString(s)}return this.value}},parseElement:function(){this.model={prefix:this.get("prefix"),items:[]},c.superclass.parseElement.call(this)},initProps:function(e){this.dataSource=(new u({source:this.get("dataSource")})).on("data",this._filterData,this)},setup:function(){c.superclass.setup.call(this);var e=this.get("trigger"),t=this;e.on("keyup.autocomplete",function(e){var n=t._getCurrentValue();t.set("inputValue",n)}).on("keydown.autocomplete",function(e){var n=t.get("selectedIndex");switch(e.which){case l.UP:e.preventDefault(),n>0?t.set("selectedIndex",n-1):t.set("selectedIndex",t.items.length-1),t.show();break;case l.DOWN:e.preventDefault(),n<t.items.length-1?t.set("selectedIndex",n+1):t.set("selectedIndex",0),t.show();break;case l.LEFT:break;case l.RIGHT:t.selectItem();break;case l.ENTER:t.selectItem()}}).on("focus.autocomplete",function(e){}).on("blur.autocomplete",function(e){setTimeout(function(){t.hide()},400)}).attr("autocomplete","off"),this._tweakAlignDefaultValue()},selectItem:function(){var e=this.currentItem.data("value");this.get("trigger").val(e),this.set("inputValue",e),this.get("trigger").focus(),this.trigger("item_selected",e),this.hide()},_tweakAlignDefaultValue:function(){var e=this.get("align");e.baseXY.toString()===[0,0].toString()&&(e.baseXY=[0,"100%"]),e.baseElement._id==="VIEWPORT"&&(e.baseElement=this.get("trigger")),this.set("align",e)},_getCurrentValue:function(){return this.get("trigger").val()},_filterData:function(e){var t=this.get("filter"),n=this.dataSource,i=this.get("resultsLocator");n.get("type")==="url"&&(e=p(i,e)),r.isFunction(t)||(t=a[t]),t&&r.isFunction(t)&&(e=t.call(this,this.get("inputValue"),e)),this.set("data",e)},_clear:function(e){this.$("[data-role=items]").empty(),this.items=null,this.set("selectedIndex",-1)},_onRenderInputValue:function(e){!e&&this._clear();if(!e&&this.get("trigger").val()===e){this.hide();return}this.dataSource.getData(e)},_onRenderData:function(e){if(!e.length){this.hide();return}this.items=null,this.set("selectedIndex",-1),this.model.items=e,this.renderPartial("[data-role=items]"),this.items=this.$("[data-role=items]").children(),this.set("selectedIndex",0),this.show()},_onRenderSelectedIndex:function(e){if(e===-1)return;var t=this.get("prefix")+"-item-hover";this.currentItem&&this.currentItem.removeClass(t),this.currentItem=this.items.eq(e).addClass(t)}});n.exports=c});