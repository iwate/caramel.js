/// <reference path="../../../src/caramel.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var App;
(function (App) {
    var ClockTime = (function () {
        function ClockTime() {
            this.current = new Date();
        }
        ClockTime.prototype.toString = function () {
            return this.current.getHours() + ":" + this.current.getMinutes() + ":" + this.current.getSeconds();
        };
        return ClockTime;
    })();
    var Clock = (function (_super) {
        __extends(Clock, _super);
        function Clock() {
            _super.call(this, {
                current: new ClockTime()
            });
            this.timeoutId = null;
        }
        Clock.prototype.update = function () {
            var _this = this;
            this.current = new ClockTime();
            this.timeoutId = setTimeout(function () {
                _this.update();
            }, 1000);
        };
        Clock.prototype.start = function () {
            this.update();
        };
        Clock.prototype.stop = function () {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        };
        Clock.prototype.toggle = function () {
            if (!this.timeoutId) {
                this.start();
            } else {
                this.stop();
            }
        };
        return Clock;
    })(Caramel.Model);

    var ClockView = (function (_super) {
        __extends(ClockView, _super);
        function ClockView() {
            _super.apply(this, arguments);
            this.template = new Caramel.HTMLTemplate("#clock-template");
            this.model = new Clock();
            this.events = {
                "rendered": "initialize"
            };
        }
        ClockView.prototype.initialize = function () {
            this.model.start();
        };
        ClockView.prototype.toggle = function () {
            this.model.toggle();
        };
        return ClockView;
    })(Caramel.View);

    window.onload = function () {
        new ClockView().renderTo(document.body);
        new ClockView().renderTo(document.body);
        new ClockView().renderTo(document.body);
    };
})(App || (App = {}));
