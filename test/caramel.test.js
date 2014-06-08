/// <reference path="typings/qunit/qunit.d.ts"/>
/// <reference path="../src/caramel.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TodoModel = (function (_super) {
    __extends(TodoModel, _super);
    function TodoModel() {
        _super.call(this);
        this.title = TodoModel.defaults.title;
        this.description = TodoModel.defaults.description;
        this.isDone = TodoModel.defaults.isDone;
        this.dueDate = TodoModel.defaults.dueDate;
    }
    TodoModel.prototype.limit = function (from) {
        if (typeof from === "undefined") { from = new Date(); }
        return (this.dueDate.getTime() - from.getTime()).toString();
    };
    TodoModel.defaults = {
        title: "default title",
        description: "default description",
        isDone: false,
        dueDate: new Date()
    };
    return TodoModel;
})(Caramel.Model);
test("Model tests", function () {
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
