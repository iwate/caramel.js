var App;
(function (App) {
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
})(App || (App = {}));
