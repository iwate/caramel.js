module Caramel {
	function add(listeners:Array<(...args:any[])=>void>, key:string, listener:(...args:any[])=>void) {
	    var i = listeners.length;
	    while (i--) {
	        if (listeners[i] === listener) {
	            return;
	        }
	    }
	    listeners.push(listener);
	}

	function remove(listeners:Array<(...args:any[])=>void>, key:string, listener:(...args:any[])=>void) {
	    var i = listeners.length;
	    while (i--) {
	        if (listeners[i] === listener) {
	            listeners.splice(i, 1);
	            return;
	        }
	    }
	}

	function explorer(obj:any, keys:string[]): {object:any; key:string} {
	    var head = keys[0], tails = keys.slice(1, keys.length);
	    if (typeof obj[head] === "undefind") {
	        throw "miss match in explorer";
	    }
	    if (tails.length == 0) {
	        return {
	            object: obj,
	            key: head
	        };
	    }
	    return explorer(obj[head], tails);
	}
	declare var __extends: (d, b)=>void;
	export function Class(cstr:(...args:any[])=>void, props?:Object, statics?:Object, etnds?:(...args:any[])=>void){
		var klass = function(...args:any[]){
			this.super = etnds? etnds.bind(this) : null;
			cstr.apply(this, args);
		}
		if(typeof etnds == "function"){
			__extends(klass, etnds);
		}
		for(var key in props || {}){
			klass.prototype[key] = props[key];
		}
		for(key in statics || {}){
			klass[key] = statics[key];
		}
		return klass;
	}

	export class Eventable{
		private __caramelEventListeners__ = {};
		addEventListener(trigger: string, listener: (...args:any[])=>void):void {
			if(!Array.isArray(this.__caramelEventListeners__[trigger])){
				this.__caramelEventListeners__[trigger] = [];
			}
			add(this.__caramelEventListeners__[trigger], trigger, listener);
		}
		removeEventListener(trigger: string, listener: (...args:any[])=>void):void {
			if(!Array.isArray(this.__caramelEventListeners__[trigger])){
				return;
			}
			remove(this.__caramelEventListeners__[trigger], trigger, listener);
		}
		dispatch(trigger: string, ...args:any[]){
			if(!Array.isArray(this.__caramelEventListeners__[trigger])){
				return;
			}
			this.__caramelEventListeners__[trigger].forEach((listener) => {
				listener.apply(this, args);
			});
		}
	}

	export class Model extends Eventable {
		private __properties__: any = {};
		constructor(props: Object){
			super();
			for(var key in props){
				this.__properties__[key] = {
					value: props[key]
					, listeners: []
				};
				Object.defineProperty(this, key, {
					configurable: false
					, enumerable: true
					, set: function(value){
						this.__properties__[key].value = value;
						this.__properties__[key].listeners.forEach((listener) => {
							listener(value);
						});
					}
					, get: function(){
						return this.__properties__[key].value;
					}
				});
			}
		}

		bind(key: string, listener: (...args: any[]) => void){
			add(this.__properties__[key].listeners, key, listener);
		}
		
		unbind(key: string, listener: (...args: any[]) => void){
			remove(this.__properties__[key].listeners, key, listener);
		}
	}

	export interface ITemplate extends Eventable{
		render(): HTMLElement;
	}

	export class JsonMLTemplate extends Eventable implements ITemplate{
		constructor(public jsonml:Array<any> = ["div"]){
			super();
		}
		decode(jsonml: Array<any>): HTMLElement{
			var tag = jsonml[0], ext = jsonml.slice(1, jsonml.length);
            var elem: HTMLElement;
            if (typeof tag === "string") {
                elem = document.createElement(tag);
                for (var i = 0, len = ext.length; i < len; i++) {
                    if (Array.isArray(ext[i])) {
                        elem.appendChild(this.decode(ext[i]));
                    } else if (ext[i].constructor == Object) {
                        Object.keys(ext[i]).forEach(function (attr) {
                            elem.setAttribute(attr, ext[i][attr]);
                        });
                    } else if (typeof ext[i] === "string") {
                        elem.innerText = ext[i];
                    }
                }
            }
            return elem;
		}
		render(){
			return this.decode(this.jsonml);
		}	
	}

	export class HTMLTemplate extends Eventable implements ITemplate{
		private id: string;
		private element: HTMLElement;
		private html: string;
		constructor(id: string);
		constructor(elem: HTMLElement);
		constructor(arg: any){
			super();
			if (typeof arg == "string") {
	            this.id = arg;
	        } else {
	            this.element = arg;
	        }
		}
		render(): HTMLElement{
			var elem = document.createElement("div");
	        if (!this.html) {
	            if (!this.element) {
	                this.element = <HTMLElement><any>document.querySelector(this.id);
	            }
	            if (!this.element) {
	                throw "It is need DOM id or DOM element.";
	            }
	            this.html = this.element.innerHTML;
	        }
	        elem.innerHTML = this.html;
	        return <HTMLElement><any>elem.firstElementChild;
		}
	}

	export class View extends Eventable{
		private __binds__: Array<{element:HTMLElement; keys:string[]; values:string[]}> = [];
		private __bindAttrs__: Array<{element:HTMLElement; keys:string[]; values:string[]}> = [];
		private __bindEvents__: Array<{element:HTMLElement; keys:string[]; values:string[]}> = [];
		private __ownEvents__: Array<{trigger:string; callback: string}>;
		private __domEvents__: Array<{trigger:string; callback: string; target: string}>;
		element: HTMLElement;
		template: ITemplate;
		set events(events: Object){
			if(!Array.isArray(this["constructor"].prototype.__ownEvents__)){
				this.__ownEvents__ = this["constructor"].prototype.__ownEvents__ = [];
				//this.__modelEvents__ = this["constructor"].prototype.__modelEvents__ = [];
				this.__domEvents__ = this["constructor"].prototype.__domEvents__ = [];
				for(var key in events){
					var trigger, array;
	                array = key.split(/\s+/);
	                trigger = array.shift();
	                if (array.length > 0) {
	                    this.__domEvents__.push({
                            trigger: trigger,
                            target: array.join(" "),
                            callback: events[key]
                        });
	                } else {
	                    this.__ownEvents__.push({
	                        trigger: trigger,
	                        callback: events[key]
	                    });
	                }
				}
			}
			this.__ownEvents__.forEach((event) => {
	            this.addEventListener(event.trigger, this[event.callback]);
	        });
		}
		constructor(props: {element?:HTMLElement} = {}){
			super();
			if(!!props.element){
				this.element = props.element;
			}
		}
		appendTypes = {
	        Append: "append",
	        Prepend: "prepend",
	        Before: "before",
	        After: "after"
	    }
	    appends = {
	        "append": function (parent, elem) {
	            parent.appendChild(elem);
	            return elem;
	        },
	        "prepend": function (parent, elem) {
	            parent.insertBefore(elem, parent.firstElementChild);
	            return elem;
	        },
	        "before": function (target, elem) {
	            target.parentElement.insertBefore(elem, target);
	            return elem;
	        },
	        "after": function (target, elem) {
	            var next = target.nextSibling;
	            if (!!next) {
	                target.parentElement.insertBefore(elem, next);
	            } else {
	                target.parentElement.appendChild(elem);
	            }
	            return elem;
	        }
	    }
	    renderTo (target, appendType = this.appendTypes.Append) {
	        if (!this.template) {
	            return;
	        }
	        this.element = this.appends[appendType](target, this.template.render());
	        this.bindAll();
	        (<any>this.element).caramel = this;
	        this.dispatch("rendered");
	        return this;
	    }
	    private decodeBinds (elem: Node, strBinds:string): Array<{element:HTMLElement; keys: string[]; values: string[]}>{
	        var binds = [];
	        strBinds.replace(/\s*/g, "").split(";").forEach((b) => {
	            var keyval = b.split(":");
	            if (keyval.length !== 2) {
	                throw "miss match";
	            }
	            binds.push({
	                element: <HTMLElement><any>elem,
	                keys: keyval[0].split("."),
	                values: keyval[1].split(".")
	            });
	        });
	        return binds;
	    }
	    private bindProps(){
	    	var binds = this.element.querySelectorAll("*[data-caramel-bind]");
	    	var i, len;
	    	for (i = 0, len = binds.length; i < len; i++) {
	            this.__binds__ = this.__binds__.concat(this.decodeBinds(binds[i], (<HTMLElement><any>binds[i]).getAttribute("data-caramel-bind")));
	        }
	        var bind = this.element.getAttribute("data-caramel-bind");
	        if (!!bind) {
	            this.__binds__ = this.__binds__.concat(this.decodeBinds(this.element, bind));
	        }
	        this.__binds__.forEach((b) => {
	            var raw = b.values[0].match(/"(.*)"/) || b.values[0].match(/'(.*)'/);
	            if (!!raw) {
	                var target = explorer(b.element, b.keys);
	                target.object[target.key] = raw[1];
	            } else {
	                this[b.values[0]].bind(b.values[1], (val) => {
	                    var target, value;
	                    target = explorer(b.element, b.keys);
	                    value = explorer(this, b.values);
	                    target.object[target.key] = value.object[value.key];
	                });
	                var value = explorer(this, b.values);
	                value.object[value.key] = value.object[value.key];
	            }
	        });
	    }
	    private bindAttributes(){
	    	var attrs = this.element.querySelectorAll("*[data-caramel-bind-attr]");
	        var i, len;
	        
	        for (i = 0, len = attrs.length; i < len; i++) {
	            this.__bindAttrs__ = this.__bindAttrs__.concat(this.decodeBinds(attrs[i], (<HTMLElement><any>attrs[i]).getAttribute("data-caramel-attr")));
	        }
	        var attr = this.element.getAttribute("data-caramel-attr");
	        if (!!attr) {
	            this.__bindAttrs__ = this.__bindAttrs__.concat(this.decodeBinds(this.element, attr));
	        }
	        
	        this.__bindAttrs__.forEach((b) => {
	            this[b.values[0]].bind(b.values[1], (val) => {
	                var value;
	                value = explorer(this, b.values);
	                b.element.setAttribute(b.keys[0], value.object[value.key]);
	            });
	            var value = explorer(this, b.values);
	            value.object[value.key] = value.object[value.key];
	        });
	    }
	    private bindEvents(){
	    	var events = this.element.querySelectorAll("*[data-caramel-events]");
	    	var i, len;
	    	for(i = 0, len = events.length; i < len; i++){
	    		this.__bindEvents__ = this.__bindEvents__.concat(this.decodeBinds(events[i], (<HTMLElement><any>events[i]).getAttribute("data-caramel-event")));
	    	}
	    	var event = this.element.getAttribute("data-caramel-event");
	    	if(!!event) {
	    		this.__bindEvents__ = this.__bindEvents__.concat(this.decodeBinds(this.element,event));
	    	}
	    	this.__bindEvents__.forEach((e) => {
	    		var func = explorer(this, e.values);
	    		e.element.addEventListener(e.keys[0], func.object[func.key].bind(this));
	    	})
	    	this.__domEvents__.forEach((event) => {
	            var targets = this.findAll(event.target);
	            if (targets.length == 0) {
	                throw "Target element is not found: " + event.target;
	            }
	            targets.forEach(function (target) {
	                target.addEventListener(event.trigger, this[event.callback].bind(this));
	            });
	        });
	    }
	    bindAll() {
	        this.bindProps();
	        this.bindAttributes();
	        this.bindEvents();
	        return this;
	    }
	    
	    find(query) {
	        if (this.element === null) {
	            throw "not element";
	        }
	        var elem = this.element.querySelector(query);
	        if (!!elem)
	            return elem;
	        elem = this.element.parentElement.querySelector(query);
	        if (!!elem && elem === this.element)
	            return elem;
	        return null;
	    }
	    findAll(query) {
	        var founds = [], elems, elem, i, len;
	        if (this.element === null) {
	            throw "not element";
	        }
	        elems = this.element.querySelectorAll(query);
	        if (elems.length > 0) {
	            for (i = 0, len = elems.length; i < len; i++) {
	                founds.push(elems[i]);
	            }
	            return founds;
	        }
	        elems = this.element.parentElement.querySelectorAll(query);
	        for (i = 0, len = elems.length; i < len; i++) {
	        	elem = elems[i];
                if (!!elem && elem === this.element) {
		            founds.push(elem);
		            return founds;
		        }
            }
	        return founds;
	    }
	}

}