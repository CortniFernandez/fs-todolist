$.ajaxSetup({
  headers: {
    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
  }
});

var indexTasks = function (successCB, errorCB) {
  var request = {
    type: 'GET',
    url: 'api/tasks?api_key=1',
    success: successCB,
    error: errorCB
  }

  $.ajax(request);
};

var postTask = function (content, id, completed, successCB, errorCB) {
  var request = {
    type: 'POST',
    url: 'api/tasks?api_key=1',
    data: {
      task: {
        content: content,
        id: id,
        completed: completed
      }
    },
    success: successCB,
    error: errorCB
  }

  $.ajax(request);
};

var deleteTask = function (id, successCB, errorCB) {
  var request = {
    type: 'DELETE',
    url: 'api/tasks/' + id + '?api_key=1',
    data: {
      task: {
        id: id
      }
    },
    success: successCB,
    error: errorCB
  }

  $.ajax(request);
};

//--------------- Mark a Task as Completed by ID --------------

var markTaskAsComplete = function (id, completed, successCB, errorCB) {
  var request = {
    type: 'PUT',
    url: 'api/tasks/' + id + '/mark_complete?api_key=1',
    data: {
      task: {
        id: id,
        completed: completed
      }
    },
    success: successCB,
    error: errorCB
  }

  $.ajax(request);
};

var markTaskAsActive = function (id, completed, successCB, errorCB) {
  var request = {
    type: 'PUT',
    url: 'api/tasks/' + id + '/mark_active?api_key=1',
    data: {
      task: {
        id: id,
        completed: completed
      }
    },
    success: successCB,
    error: errorCB
  }

  $.ajax(request);
};