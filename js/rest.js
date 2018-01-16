function getStatuses() {
    return processRequest('taskStatuses', 'GET');
}

function getTaskTypes() {
    return processRequest('taskTypes', 'GET');
}

function getTaskPriorities() {
    return processRequest('taskPriorities', 'GET');
}

function getTaskPriorityById(id) {
    var path = 'taskPriorities/' + id;
    return processRequest(path, 'GET');
}

function getShortTasks() {
    return processRequest('shortTasks', 'GET');
}

function getAssignedToMeShortTasks(assigneeId) {
    var path = 'shortTasks?assigneeId=' + assigneeId;
    return processRequest(path, 'GET');
}


function getReportedByMeShortTasks(reporterId) {
    var path = 'shortTasks?reporterId=' + reporterId;
    return processRequest(path, 'GET');
}

function getHighPriorityTasks() {
    return processRequest('shortTasks?priority=1&priority=2', 'GET');
}

function getUsers() {
    return processRequest('users', 'GET');
}

function getUserById(id) {
    var path = 'users/' + id;
    return processRequest(path, 'GET');
}


function addUser(data) {
    return processRequest('users', 'POST', data);
}

function getTaskById(id) {
    var path = 'tasks/' + id + '?_embed=attachments';
    return processRequest(path, 'GET');
}

function getTaskComments(id) {
    var path = 'tasks/' + id + '/comments';
    return processRequest(path, 'GET');
}

function addTaskComment(data, id) {
    var path = 'tasks/' + id + '/comments';
    return processRequest(path, 'POST', data);
}

function addTaskAttachment(data, id) {
    var path = 'tasks/' + id + '/attachments';
    return processRequest(path, 'POST', data);
}

function getLastTaskNumber() {
    return processRequest('lastTaskNumber', 'GET');
}

function setLastTaskNumber(id) {
    var data = {
        number: id
    };
    return processRequest('lastTaskNumber', 'PATCH', data);
}

function addNewTask(data) {
    var response = processRequest('tasks', 'POST', data);

    response = processRequest('shortTasks', 'POST', generateShortTaskData(data, response));

    setLastTaskNumber(+data.taskId.replace('Task-',''));
    return response.id;
}

function updateTask(data, taskId) {
    processRequest('tasks/' + taskId, 'PATCH', data);

    processRequest('shortTasks/' + taskId, 'PATCH', generateShortTaskData(data));
}

function processRequest(path, type, data) {
    return JSON.parse($.ajax({
                                 type: type,
                                 url: 'http://localhost:3000/' + path,
                                 data: data,
                                 async: false
                             }).responseText);
}

function generateShortTaskData(data, response) {
    return {
        id: response === undefined ? '' : response.id,
        taskId: data.taskId,
        title: data.title,
        assigneeId: data.assigneeId,
        assignee: data.assignee,
        assigneeAvatarUrl: data.assigneeAvatarUrl,
        reporterId: data.reporterId,
        priority: data.priority,
        priorityId: data.priorityId,
        priorityDescription: data.priorityDescription,
        priorityUrl: data.priorityUrl,
        progress: data.progress,
        type: data.type,
        status: data.status
    };
}