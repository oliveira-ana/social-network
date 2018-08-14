var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function() {
  getTasksFromDB();
  $(".add-tasks").click(addTasksClick);
});

function addTasksClick(event) {
  event.preventDefault();

  var newTask = $(".tasks-input").val();
  var taskFromDB = addTaskToDB(newTask);

  createListItem(newTask, taskFromDB.key)
}

function addTaskToDB(text) {
  return database.ref("tasks/" + USER_ID).push({
    text: text
  });
}

function getTasksFromDB() {
  database.ref("tasks/" + USER_ID).once('value')
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        createListItem(childData.text, childKey)
      });
    });
}

function createListItem(text, key) {
  $(".tasks-list").append(`
    <li>
      <input type="checkbox" data-task-id=${key} />
      <span>${text}</span>
    </li>`);

  $(`input[data-task-id="${key}"]`).click(function() {
    database.ref("tasks/" + USER_ID + "/" + key).remove();
    $(this).parent().remove();
  });
}
