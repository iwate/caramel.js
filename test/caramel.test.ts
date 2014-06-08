/// <reference path="typings/qunit/qunit.d.ts"/>
/// <reference path="../src/caramel.ts"/>

class TodoModel extends Caramel.Model{
	static defaults = {
		title: "default title"
		, description: "default description"
		, isDone: false
		, dueDate: new Date()
	}
	public title: string = TodoModel.defaults.title;
	public description: string = TodoModel.defaults.description;
	public isDone: boolean = TodoModel.defaults.isDone;
	public dueDate: Date = TodoModel.defaults.dueDate;
	constructor (){
		super();
	}
	limit(from: Date = new Date()): string {
		return (this.dueDate.getTime() - from.getTime()).toString();
	}
}
test("Model tests", function(){
	var todo = new TodoModel();
	ok(true, "complete");
});


// test("ModelBuilder tests", function(){
// 	var builder = new Caramel.ModelBuilder<TodoModel>(TodoModel);
// 	var model: TodoModel = builder.build();
// 	equal(model.title, TodoModel.defaults.title, "title is exist.");
// 	equal(model.description, TodoModel.defaults.description, "description is exist.");
// 	equal(model.isDone, TodoModel.defaults.isDone, "isDone is exist.");
// 	equal(model.dueDate, TodoModel.defaults.dueDate, "dueDone is exist.");
// 	equal(model.limit(TodoModel.defaults.dueDate), 0, "limit is success");
// 	ok(true, "complete");
// });

// test("Model tests", function(){
// 	var builder = new Caramel.ModelBuilder(TodoModel);
// 	var model: TodoModel = builder.build();
// 	var isDone = false;
// 	model.addEventListener("change", function(key: string, val: any){
// 		if(key == "isDone"){
// 			isDone = val;
// 		}
// 	});
// 	model.isDone = true;
// 	ok(isDone, "dispatch is success");
// });
// test("sample test", function(){
	
/*	equal(model.title, TodoModel.defaults.title, "title is exist.");
	equal(model.description, TodoModel.defaults.description, "description is exist.");
	equal(model.isDone, TodoModel.defaults.isDone, "isDone is exist.");
	equal(model.dueDate, TodoModel.defaults.dueDate, "dueDone is exist.");
	equal(model.limit(), 0, "limit is success");*/
// 	ok(true, "complete");
// })