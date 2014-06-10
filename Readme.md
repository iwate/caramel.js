Caramel.js
==========================================================================================================
Caramel is light weight front-end MVC framework that has template and binding feature.

This is written by TypeScript and this is able to use in TypeScript and JavaScript.

##Eventable
Eventale provide event feature. Inherited class of this class can register listeners and can fire events.

```
class A extends Caramel.Eventable{}
var a = new A();
a.addEventListener("event", (...args:any[]) => {
	console.log("event is fired");
});
a.dispatch("event", "event param1", "event param2"); // "event is fired"
``` 

##Model
Model provide property bind feature. You can get property changes notify.

If you bind the property, pass the initialize object to super constructor.

```
class A extends Caramel.Model {
	property1: string;
	property2: number;
	constructor(){
		super({
			property1: ""
		});
	}
}
var a = new A();
a.bind("property1", (newVal) => {
	console.log("a's new value is " + newVal);
});
a.property1 = "foo"; // "a's new value is foo";

/* The following is error why  "property2" is not in the initialize object passed to super constructor. */
a.bind("property2", (newVal) => {
	console.log("a's new value is " + newVal);
});
```

##View

// TODO: Write description

```
<style type="text/css">
	.template{
		display: none;
	}
</style>
<div id="a-template" class="template">
	<h1 data-caramel-bind="innerText: model.property1"
		data-caramel-event="click: onClick"></h1>
</div>
```

```
class AView extends Caramel.Model {
	template: Caramel.ITemplate = new Caramel.HTMLTemplate("#a-template");
	model: Caramel.Model = new A();
	events = {
		"rendered": "initialize"
		, "mouseover h1": "onMouseOver"
		, "mouseleave h1": "onMouseLeave"
	}
	initialize(){
		this.model.property1 = "property1";
		console.log(this.element.innerText); // "property1";
	}
	onMouseOver(){
		this.element.style.color = "blue";
	}
	onMouseLeave(){
		this.element.style.color = "black";
	}
	onClick(){
		this.element.style.color = "red";
	}
}
window.onload = function(){
	new AView().renderTo(document.body);
	new AView().renderTo(document.body);
}
```

##Sample

// TODO: Write description

app.ts

```
class ClockTime{
	private current: Date = new Date();
	toString(){
		return this.current.getHours() + ":"
			+ this.current.getMinutes() + ":"
			+ this.current.getSeconds();
	}
}
class Clock extends Caramel.Model {
	private current: ClockTime; 
	private timeoutId: number = null;
	constructor(){
		super({
			current: new ClockTime()
		});
	}
	update(){
		this.current = new ClockTime();
		this.timeoutId = setTimeout(()=>{
			this.update();
		}, 1000);
	}
	start(){
		this.update();
	}
	stop(){
		clearTimeout(this.timeoutId);
		this.timeoutId = null;
	}
	toggle(){
		if(!this.timeoutId){
			this.start();
		} else {
			this.stop();
		}
	}
}

class ClockView extends Caramel.View {
	template: Caramel.ITemplate = new Caramel.HTMLTemplate("#clock-template");
	model = new Clock();
	events = {
		"rendered": "initialize"
	}
	initialize(){
		this.model.start();
	}
	toggle(){
		this.model.toggle();
	}
}

window.onload = function(){
	new ClockView().renderTo(document.body);
	new ClockView().renderTo(document.body);
	new ClockView().renderTo(document.body);
}
```

index.html

```
<!DOCTYPE html>
<html>
<head>
	<title>Clock Sample : Caramel.js</title>
	<script type="text/javascript" src="../../../src/caramel.js"></script>
	<script type="text/javascript" src="app.js"></script>
	<style type="text/css">
	.template{
		display: none;
	}
	</style>
</head>
<body>
	<div id="clock-template" class="template">
		<h1 data-caramel-bind="innerText: model.current"
			data-caramel-event="click: toggle"></h1>
	</div>
</body>
</html>
```

## How to use Caramel in JavaScript

If you want use Caramel in JavaScript, you use Caramel.Class function.

```
var A = Caramel.Class(function(){
	// this is constructor;
	this.super({
		property1: ""
	});
	this.property2 = 0;
}, {
	// this is property method define area.
}, {
	// this is static property define area.
}, Caramel.Model /* Parent class*/);

var AView = Caramel.Class(function(){
	this.super();
	this.template = new Caramel.HTMLTemplate("#a-template");
}, null, null, Caramel.View);
```

Clock sample in JavaScript

```
var ClockTime = Caramel.Class(function(){
    this.current = new Date();
}, {
    toString: function() {
        return this.current.getHours() + ":" + this.current.getMinutes() + ":" + this.current.getSeconds();
    }
});
var Clock = Caramel.Class(function(){
    this.super({
        current: new ClockTime()
    });
    this.timeoutId = null;
}, {
    update: function(){
        var that = this;
        this.current = new ClockTime();
        this.timeoutId = setTimeout(function () {
            that.update();
        }, 1000);
    }
    , start: function(){
        this.update();
    }
    , stop: function(){
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
    }
    , toggle: function(){
        if (!this.timeoutId) {
            this.start();
        } else {
            this.stop();
        }
    }
}, null, Caramel.Model);
var ClockView = Caramel.Class(function(){
    this.super();
    this.template = new Caramel.HTMLTemplate("#clock-template");
    this.model = new Clock();
    this.events = {
        "rendered": "initialize"
    }
}, {
    initialize: function(){
        this.model.start();
    }
    , toggle: function(){
        this.model.toggle();
    }
},null, Caramel.View);

window.onload = function () {
    new ClockView().renderTo(document.body);
    new ClockView().renderTo(document.body);
    new ClockView().renderTo(document.body);
};
```
