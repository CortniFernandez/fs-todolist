$(document).on("turbolinks:load", function () {
  var taskInput = $('#task-input');
  var todoList = $('#tasks');
  var taskList = [];
  var filter = "All";

  var addTask = function(content, id, completed) {
    var taskDiv = document.createElement('div');
    taskDiv.setAttribute('class','task');
    var taskContent = document.createElement('p');
    var markCompleteButton = document.createElement('input');
    markCompleteButton.setAttribute('class','mark-complete-button');
    markCompleteButton.setAttribute('type', 'checkbox');
    if (completed) {
      taskDiv.setAttribute('class','task completed');
      markCompleteButton.checked = true;
    }
    markCompleteButton.addEventListener('click', function() {
      var completedClass = taskDiv.getAttribute('class');
      if (completedClass === 'task completed') {
        var request = {
          type: 'PUT',
          url: 'api/tasks/' + id + '/mark_active?api_key=1',
          data: {
            task: {
              completed: false
            }
          },
          success: function(response) {
            console.log(response);
            refreshTasks();
            taskDiv.setAttribute('class', 'task active');
          },
          error: function(error) {
            console.log(error)
          }
        }
        $.ajax(request);
      } else {
        var request = {
          type: 'PUT',
          url: 'api/tasks/' + id + '/mark_complete?api_key=1',
          data: {
            task: {
              completed: true
            }
          },
          success: function(response) {
            console.log(response);
            refreshTasks();
            taskDiv.setAttribute('class', 'task complete');
            markCompleteButton.checked = true;
          },
          error: function(error) {
            console.log(error)
          }
        }
        $.ajax(request);
      }
    });

    var removeButton = document.createElement('span');
    removeButton.setAttribute('class','remove-button');
    removeButton.innerHTML = "×";
    removeButton.addEventListener('click', function() {
      var parent = this.parentNode.parentNode;
      var child = this.parentNode;
      deleteTask(id, function(response) {
        if (response.success) {
          parent.removeChild(child);
          taskList = taskList.filter(function(task) {
            return !(task.id === id);
          });
          updateHelperButtons();
        }
      }, function(request, errorMsg) {
        console.error(errorMsg);
      })
    });

    taskContent.setAttribute('class', 'task-content');
    taskContent.innerHTML = content;
    taskDiv.appendChild(markCompleteButton);
    taskDiv.appendChild(taskContent);
    taskDiv.appendChild(removeButton);
    todoList.append(taskDiv);
  };

  var refreshTasks = function() {
    indexTasks(function(response) {
      taskList = response.tasks;
      console.log(taskList);
      filterTasks();
      updateHelperButtons();
    }, function(request, errorMsg) {
      console.error(errorMsg);
    })
  };

  var filterTasks = function(addTasksToDOM) {
    var shouldAddTasksToDOM;
    if (addTasksToDOM === undefined) {
      shouldAddTasksToDOM = true;
    } else {
      shouldAddTasksToDOM = addTasksToDOM;
    }
    var filteredTaskList = taskList.filter(function(task) {
      if (filter === 'All') {
        return true;
      } else if (filter === 'Active') {
        return task.completed === false;
      } else {
        return task.completed === true;
      }
    });
    if (shouldAddTasksToDOM) {
      todoList.text('');
      filteredTaskList.forEach(function(task) {
        addTask(task.content, task.id, task.completed);
      })
    }
    return filteredTaskList;
  }

  $('.filter-button').click(function() {
    var filterType = $(this).attr('id');
    if (filter !== filterType) {
      $('.filter-button').removeClass('selected');
      $(this).addClass('selected');
      filter = $(this).attr('id');
      filterTasks();
      updateHelperButtons();
    }
  });

  $('#clear-completed').click(function() {
    $('#All').click();
    filterTasks();
    $('.completed > .remove-button').click();
  })

  $('#toggle-all').click(function() {
    var activeTasks = taskList.filter(function(task) {
      return !task.completed;
    });

    if (activeTasks.length > 0) {
      $('.task:not(.completed) > .mark-complete-button').click();
    } else if (taskList.length > 0) {
      $('.task > .mark-complete-button').click();
    }
  });

  var updateHelperButtons = function() {
    var activeTasks = taskList.filter(function(task) {
      return !task.completed;
    });
    // Toggle All Button
    var tasksCurrentlyDisplayed = filterTasks(false);
    if (tasksCurrentlyDisplayed.length > 0) {
      $('#toggle-all').css('display', 'block');
    } else {
      $('#toggle-all').css('display', 'none');
    }

    if (activeTasks.length === 0 && taskList.length > 0) {
      $('#toggle-all').addClass('active');
    } else {
      $('#toggle-all').removeClass('active');
    }

    // Footer
    if (taskList.length === 0) {
      $('#footer').css('display', 'none');
    } else {
      $('#footer').css('display', 'flex');
      if ((taskList.length - activeTasks.length) > 0) {
        $('#clear-completed').css('display', 'inline-block');
      } else {
        $('#clear-completed').css('display', 'none');
      }
    }
    $('#active-tasks').text(activeTasks.length);
  }

  $('#task-input').keypress(function (e) {
    var key = e.which;
    if (key == 13) {
      console.log('adding')
      console.log('value: ', taskInput.val())

      var request = {
        type: 'POST',
        url: 'api/tasks?api_key=1',
        data: {
          task: {
            content: taskInput.val()
          }
        },
        success: function(response) {
          console.log(response);
          refreshTasks();
          taskInput.val('')
        },
        error: function(error) {
          console.log(error)
        }
      }
      $.ajax(request);
    }
  });

  refreshTasks();

  $('#' + filter).addClass('selected');

});
