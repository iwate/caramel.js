var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Caramel;
(function (Caramel) {
    function add(listeners, key, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i] === listener) {
                return;
            }
        }
        listeners.push(listener);
    }

    function remove(listeners, key, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i] === listener) {
                listeners.splice(i, 1);
                return;
            }
        }
    }

    function explorer(obj, keys) {
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

    function Class(cstr, props, statics, etnds) {
        var klass = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            this.super = etnds ? etnds.bind(this) : null;
            cstr.apply(this, args);
        };
        if (typeof etnds == "function") {
            __extends(klass, etnds);
        }
        for (var key in props || {}) {
            klass.prototype[key] = props[key];
        }
        for (key in statics || {}) {
            klass[key] = statics[key];
        }
        return klass;
    }
    Caramel.Class = Class;

    var Eventable = (function () {
        function Eventable() {
            this.__caramelEventListeners__ = {};
        }
        Eventable.prototype.addEventListener = function (trigger, listener) {
            if (!Array.isArray(this.__caramelEventListeners__[trigger])) {
                this.__caramelEventListeners__[trigger] = [];
            }
            add(this.__caramelEventListeners__[trigger], trigger, listener);
        };
        Eventable.prototype.removeEventListener = function (trigger, listener) {
            if (!Array.isArray(this.__caramelEventListeners__[trigger])) {
                return;
            }
            remove(this.__caramelEventListeners__[trigger], trigger, listener);
        };
        Eventable.prototype.dispatch = function (trigger) {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                args[_i] = arguments[_i + 1];
            }
            if (!Array.isArray(this.__caramelEventListeners__[trigger])) {
                return;
            }
            this.__caramelEventListeners__[trigger].forEach(function (listener) {
                listener.apply(_this, args);
            });
        };
        return Eventable;
    })();
    Caramel.Eventable = Eventable;

    var Model = (function (_super) {
        __extends(Model, _super);
        function Model(props) {
            _super.call(this);
            this.__properties__ = {};
            for (var key in props) {
                this.__properties__[key] = {
                    value: props[key],
                    listeners: []
                };
                Object.defineProperty(this, key, {
                    configurable: false,
                    enumerable: true,
                    set: function (value) {
                        this.__properties__[key].value = value;
                        this.__properties__[key].listeners.forEach(function (listener) {
                            listener(value);
                        });
                    },
                    get: function () {
                        return this.__properties__[key].value;
                    }
                });
            }
        }
        Model.prototype.bind = function (key, listener) {
            add(this.__properties__[key].listeners, key, listener);
        };

        Model.prototype.unbind = function (key, listener) {
            remove(this.__properties__[key].listeners, key, listener);
        };
        return Model;
    })(Eventable);
    Caramel.Model = Model;

    var JsonMLTemplate = (function (_super) {
        __extends(JsonMLTemplate, _super);
        function JsonMLTemplate(jsonml) {
            if (typeof jsonml === "undefined") { jsonml = ["div"]; }
            _super.call(this);
            this.jsonml = jsonml;
        }
        JsonMLTemplate.prototype.decode = function (jsonml) {
            var tag = jsonml[0], ext = jsonml.slice(1, jsonml.length);
            var elem;
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
        };
        JsonMLTemplate.prototype.render = function () {
            return this.decode(this.jsonml);
        };
        return JsonMLTemplate;
    })(Eventable);
    Caramel.JsonMLTemplate = JsonMLTemplate;

    var HTMLTemplate = (function (_super) {
        __extends(HTMLTemplate, _super);
        function HTMLTemplate(arg) {
            _super.call(this);
            if (typeof arg == "string") {
                this.id = arg;
            } else {
                this.element = arg;
            }
        }
        HTMLTemplate.prototype.render = function () {
            var elem = document.createElement("div");
            if (!this.html) {
                if (!this.element) {
                    this.element = document.querySelector(this.id);
                }
                if (!this.element) {
                    throw "It is need DOM id or DOM element.";
                }
                this.html = this.element.innerHTML;
            }
            elem.innerHTML = this.html;
            return elem.firstElementChild;
        };
        return HTMLTemplate;
    })(Eventable);
    Caramel.HTMLTemplate = HTMLTemplate;

    var View = (function (_super) {
        __extends(View, _super);
        function View(props) {
            if (typeof props === "undefined") { props = {}; }
            _super.call(this);
            this.__binds__ = [];
            this.__bindAttrs__ = [];
            this.__bindEvents__ = [];
            this.appendTypes = {
                Append: "append",
                Prepend: "prepend",
                Before: "before",
                After: "after"
            };
            this.appends = {
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
            };
            if (!!props.element) {
                this.element = props.element;
            }
        }
        Object.defineProperty(View.prototype, "events", {
            // set model(model: Model){
            // 	this._model = model;
            // 	if(!!this.__modelEvents__){
            // 		this.__modelEvents__.forEach((event) => {
            //                this.model.addEventListener(event.trigger, this[event.callback]);
            //            });
            // 	}
            // }
            // get model(){
            // 	return this._model;
            // }
            set: function (events) {
                var _this = this;
                if (!Array.isArray(this["constructor"].prototype.__ownEvents__)) {
                    this.__ownEvents__ = this["constructor"].prototype.__ownEvents__ = [];

                    //this.__modelEvents__ = this["constructor"].prototype.__modelEvents__ = [];
                    this.__domEvents__ = this["constructor"].prototype.__domEvents__ = [];
                    for (var key in events) {
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
                this.__ownEvents__.forEach(function (event) {
                    _this.addEventListener(event.trigger, _this[event.callback]);
                });
            },
            enumerable: true,
            configurable: true
        });

        View.prototype.renderTo = function (target, appendType) {
            if (typeof appendType === "undefined") { appendType = this.appendTypes.Append; }
            if (!this.template) {
                return;
            }
            this.element = this.appends[appendType](target, this.template.render());
            this.bindAll();
            this.element.caramel = this;
            this.dispatch("rendered");
            return this;
        };
        View.prototype.decodeBinds = function (elem, strBinds) {
            var binds = [];
            strBinds.replace(/\s*/g, "").split(";").forEach(function (b) {
                var keyval = b.split(":");
                if (keyval.length !== 2) {
                    throw "miss match";
                }
                binds.push({
                    element: elem,
                    keys: keyval[0].split("."),
                    values: keyval[1].split(".")
                });
            });
            return binds;
        };
        View.prototype.bindProps = function () {
            var _this = this;
            var binds = this.element.querySelectorAll("*[data-caramel-bind]");
            var i, len;
            for (i = 0, len = binds.length; i < len; i++) {
                this.__binds__ = this.__binds__.concat(this.decodeBinds(binds[i], binds[i].getAttribute("data-caramel-bind")));
            }
            var bind = this.element.getAttribute("data-caramel-bind");
            if (!!bind) {
                this.__binds__ = this.__binds__.concat(this.decodeBinds(this.element, bind));
            }
            this.__binds__.forEach(function (b) {
                var raw = b.values[0].match(/"(.*)"/) || b.values[0].match(/'(.*)'/);
                if (!!raw) {
                    var target = explorer(b.element, b.keys);
                    target.object[target.key] = raw[1];
                } else {
                    _this[b.values[0]].bind(b.values[1], function (val) {
                        var target, value;
                        target = explorer(b.element, b.keys);
                        value = explorer(_this, b.values);
                        target.object[target.key] = value.object[value.key];
                    });
                    var value = explorer(_this, b.values);
                    value.object[value.key] = value.object[value.key];
                }
            });
        };
        View.prototype.bindAttributes = function () {
            var _this = this;
            var attrs = this.element.querySelectorAll("*[data-caramel-bind-attr]");
            var i, len;

            for (i = 0, len = attrs.length; i < len; i++) {
                this.__bindAttrs__ = this.__bindAttrs__.concat(this.decodeBinds(attrs[i], attrs[i].getAttribute("data-caramel-attr")));
            }
            var attr = this.element.getAttribute("data-caramel-attr");
            if (!!attr) {
                this.__bindAttrs__ = this.__bindAttrs__.concat(this.decodeBinds(this.element, attr));
            }

            this.__bindAttrs__.forEach(function (b) {
                _this[b.values[0]].bind(b.values[1], function (val) {
                    var value;
                    value = explorer(_this, b.values);
                    b.element.setAttribute(b.keys[0], value.object[value.key]);
                });
                var value = explorer(_this, b.values);
                value.object[value.key] = value.object[value.key];
            });
        };
        View.prototype.bindEvents = function () {
            var _this = this;
            var events = this.element.querySelectorAll("*[data-caramel-events]");
            var i, len;
            for (i = 0, len = events.length; i < len; i++) {
                this.__bindEvents__ = this.__bindEvents__.concat(this.decodeBinds(events[i], events[i].getAttribute("data-caramel-event")));
            }
            var event = this.element.getAttribute("data-caramel-event");
            if (!!event) {
                this.__bindEvents__ = this.__bindEvents__.concat(this.decodeBinds(this.element, event));
            }
            this.__bindEvents__.forEach(function (e) {
                var func = explorer(_this, e.values);
                e.element.addEventListener(e.keys[0], func.object[func.key].bind(_this));
            });
            this.__domEvents__.forEach(function (event) {
                var targets = _this.findAll(event.target);
                if (targets.length == 0) {
                    throw "Target element is not found: " + event.target;
                }
                targets.forEach(function (target) {
                    target.addEventListener(event.trigger, this[event.callback].bind(this));
                });
            });
        };
        View.prototype.bindAll = function () {
            this.bindProps();
            this.bindAttributes();
            this.bindEvents();
            return this;
        };

        View.prototype.find = function (query) {
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
        };
        View.prototype.findAll = function (query) {
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
        };
        return View;
    })(Eventable);
    Caramel.View = View;
})(Caramel || (Caramel = {}));
