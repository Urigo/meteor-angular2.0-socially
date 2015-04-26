function TodoList() {

  var self = this;
  Tracker.autorun(function () {
    self.todos = Parties.find({}).fetch();
    console.log('todos', self.todos);
  });

  this.addTodo = function(todo) {
    //console.log('todo', todo);
    //this.todos.push(todo);
    Parties.insert({
      name: todo,
      description: 'nothing' // current time
    });
  };

  this.doneTyping = function($event) {
    if($event.which === 13) {
      console.log('enter vaule', $event.target.value);
      this.addTodo($event.target.value);
      $event.target.value = null;
    }
  }
}
TodoList.annotations = [
  new angular.Component({
    selector: "todo-list"
  }),
  new angular.View({
    template:
    '<ul>' +
    '<li *for="#todo of todos">' +
    '{{ todo.name }}' +
    '<br>' +
    '{{ todo.description }}' +
    '</li>' +
    '</ul>' +
    '<input #textbox (keyup)="doneTyping($event)">' +
    '<button (click)="addTodo(textbox.value)">Add Todo</button>',
    directives: [angular.For, angular.If]
  })
];
document.addEventListener("DOMContentLoaded", function() {
  angular.bootstrap(TodoList);
});