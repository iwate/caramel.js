/// <reference path="../../../src/caramel.ts" />

module App{
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
}