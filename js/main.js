$.ajax({
    url: 'js/rest.js',
    dataType: 'script',
    async: false
});

$.ajax({
    url: 'js/modal.js',
    dataType: 'script',
    async: false
});

$(function () {

    generateTable(getStatuses(), getShortTasks());

    window.location.hash = '#';

    verifyIfUserLoggedIn();

    $(window).on('hashchange', function () {
        render(decodeURI(window.location.hash));
    });

    function render(url) {
        var temp = url.split('/')[0];

        var map = {

            '': function () {

                hideAllViews();
                $('#task-board-view').removeClass('hide');
                unhideNavButtons();
                generateTable(getStatuses(), getShortTasks());
            },

            // IE splits strings in his own way
            '#': function () {

                hideAllViews();
                $('#task-board-view').removeClass('hide');
                unhideNavButtons();
                generateTable(getStatuses(), getShortTasks());
            },

            '#assigned-to-me': function () {

                hideAllViews();
                $('#task-board-view').removeClass('hide');
                generateTable(getStatuses(), getAssignedToMeShortTasks(localStorage.getItem('user')));
            },

            '#reported-by-me': function () {

                hideAllViews();
                $('#task-board-view').removeClass('hide');
                generateTable(getStatuses(), getReportedByMeShortTasks(localStorage.getItem('user')));
            },

            '#show-high-priority-tasks': function () {

                hideAllViews();
                $('#task-board-view').removeClass('hide');
                generateTable(getStatuses(), getHighPriorityTasks());
            },

            '#task': function () {

                var taskId = url.split('#task/')[1].trim();
                hideAllViews();
                $('#opened-task-view').removeClass('hide');
                generateTaskPage(taskId);
            },

            '#gallery': function () {
                var taskId = url.split('/')[1];
                var photoId = url.split('/')[2];
                showGalleryModal(taskId, photoId);
            },

            '#add-attachment': function () {
                var taskId = url.split('#add-attachment/')[1].trim();

                showAttachmentModal(taskId);
            },

            '#contacts': function () {
                hideAllViews();
                $('#contacts-view').removeClass('hide');
            },

            '#login': function () {
                localStorage.removeItem('user');
                showLoginModal();
            },

            '#edit-task': function () {
                var taskId = url.split('#edit-task/')[1];
                showEditTaskModal(taskId);
            },

            '#add-user': function () {
                showNewUserModal();
            },

            '#unauthorized': function () {
                hideAllViews();
                hideNavButtonsForUnauthorized();
                $('#login-button').text('Login');
                $('#unauthorized-page-view').removeClass('hide');
            }
        };

        if (map[temp]) {
            map[temp]();
        }
        else {
            hideAllViews();
            $('#error-page-view').removeClass('hide');
        }
    }

    $('#edit-task').on('submit', function (e) {
        e.preventDefault();
        var form = $('form[id="edit-task"]');
        var taskId = window.location.hash.split('#edit-task/')[1];

        if (taskId === undefined) {
            taskId = addNewTask(prepareTaskData(form[0], taskId));
        } else {
            updateTask(prepareTaskData(form[0], taskId), taskId);
        }

        $('#adding-task-modal').css('display', 'none');
        window.location.hash = '#task/' + taskId;
    });

    $('#add-comment').on('submit', function (e) {
        e.preventDefault();
        var form = $('form[id="add-comment"]');

        var taskId = window.location.hash.split('#task/')[1];

        addTaskComment(createTaskComment(form[0], taskId), taskId);

        form.find('textarea').val('');

        renderComments(0);
    });

    $('#add-attachment-form').on('submit', function (e) {
        e.preventDefault();
        var form = $('form[id="add-attachment-form"]');

        var taskId = window.location.hash.split('#add-attachment/')[1];

        addTaskAttachment(createTaskAttachment(form[0]), taskId);

        $('#adding-attachment-modal').css('display', 'none');
        window.location.hash = '#task/' + taskId;
    });

    $('#add-user').on('submit', function (e) {
        e.preventDefault();
        var form = $('form[id="add-user"]');
        addUser(createUser(form[0]));

        $('#adding-user-modal').css('display', 'none');
        window.location.hash = '#';
    });

    $('#login').on('submit', function (e) {
        e.preventDefault();
        var form = $('form[id="login"]');
        var userId = form[0].elements.user.value;
        localStorage.setItem('user', userId);

        var user = getUserById(userId);
        enableAdminButton(user);

        $('#login-modal').css('display', 'none');
        $('#login-button').text('Logout');
        $('#logged-in-user').text(user.userName);
        window.location.hash = '#';
    });
});

function verifyIfUserLoggedIn() {
    var currentUser = localStorage.getItem('user');

    if (currentUser === null) {
        window.location.hash = '#login';
    } else {
        var user = getUserById(currentUser);
        $('#login-button').text('Logout');
        $('#logged-in-user').text(user.userName);
        enableAdminButton(user);
    }
}

function generateTable(statuses, tasks) {
    $('#task-board-view').removeClass('hide');
    $('#filters').removeClass('hide');

    var block = '';

    statuses = statuses.map(function (status) {
        return status.status
    });

    statuses.forEach(function (status) {
        return block += '<div class=\"column\">' + '<div class=\"column__title\">' +
            status + ': ' + '</div>' + generateTasks(tasks, status) + '</div>';
    });
    $('#task-board-view').html(block);
}

function generateTasks(tasks, status) {
    var tasksByStatus = '';
    tasks.filter(function (task) {
        return task.status === status;
    }).forEach(function (task) {
        tasksByStatus += '<a href="#task/' + task.id + '"><div class=\"task\" id=\"' + task.taskId + '\">'
            + '<div' + ' class=\"nowrap\"><div' + ' class=\"task__left-block\">'
            + '<img title=\"' + task.priority + '\" class=\"priority-img\" src=\"'
            + task.priorityUrl + '\">' + '</div>' + '<div class=\"task__content\">'
            + task.taskId + '</b><br>' + '<span class=\"task-title\">' + task.title + '</span><br>'
            + 'Type: ' + task.type + ' </b><br>'
            + 'Priority: ' + task.priorityDescription + '</b><br>' + '</div>'
            + '<div><img class=\"task__assignee-avatar\" title=\"' + task.assignee + '\" src=\"'
            + task.assigneeAvatarUrl + '\">' + '</div></div>'
            + '<div class=\"progress-bar__container\" style=\"height: 4px\" title=\"Progress: '
            + task.progress + '%\">'
            + '<div class=\"progress-bar__colored-line\" style=\"width: ' + task.progress
            + '%; background: ' + choseProgressBarColor(task.progress) + '\"></div></div>'
            + '</div></a>';
    });
    return tasksByStatus;
}

function generateTaskPage(taskId) {
    var editTaskButton = $('#edit-current-task');
    editTaskButton.removeClass('hide');
    editTaskButton.find('a').attr('href', '#edit-task/' + taskId);

    var task = getTaskById(taskId);
    var container = $('.opened-task');
    container.find('#task_id').text(task.taskId);
    container.find('#task_title').text(task.title);
    container.find('#task_status').text(task.status);
    container.find('#task_type').text(task.type);
    container.find('#task_priority').text(task.priority);
    container.find('#task_description').text(task.description);
    container.find('#task_assignee_name').text(task.assignee);
    container.find('#task_assignee').attr('src', task.assigneeAvatarUrl);
    container.find('#task_assignee').attr('title', task.assignee);
    container.find('#task_assignee').attr('alt', task.assignee);
    container.find('#task_reporter_name').text(task.reporter);
    container.find('#task_reporter').attr('src', task.reporterAvatarUrl);
    container.find('#task_reporter').attr('title', task.reporter);
    container.find('#task_reporter').attr('alt', task.reporter);
    container.find('#task_progress').text(task.progress + '%');
    container.find('#task_progress_bar').attr('style', 'width:' + task.progress + '%');

    container.find('#gallery').empty();
    if (task.attachments !== undefined) {
        task.attachments.forEach(function (attachment) {
            container.find('#gallery').append('<a href="#gallery/' + taskId + '/' + attachment.id + '"><div class=\"gallery__wrapper\">' +
                '<div style="background-image: url(' + attachment.url
                + ')\" title=\"' + attachment.fileName
                + '\" class=\"gallery__thumbnail\"></div></div></a>');
        })
    }

    container.find('#gallery').append('<a href="#add-attachment/' + taskId + '">'
        + '<div class=\"add-attachment\" title=\"Add attachment\">'
        + '<div class=\"border\">'
        + '<img src=\"img/icons/add-square-button.svg\" alt=\"Add attachment\"'
        + 'title=\"Add attachment\" class=\"add-attachment__icon\"></div></div></a>');


    renderComments(0);
}

function renderComments(page) {
    var taskId = window.location.hash.split('#task/')[1];

    var commentsContainer = $('.opened-task').find('#comments');
    var paginationContainer = $('.opened-task').find('#pagination');

    commentsContainer.empty();
    paginationContainer.empty();

    var comments = getTaskComments(taskId).sort(function (a, b) {
        return new Date(b.dateAdded) - new Date(a.dateAdded);
    });

    var firstCommentNumber = page * 3;
    for (var i = firstCommentNumber; i < Math.min(firstCommentNumber + 3, comments.length); i++) {
        var comment = comments[i];
        commentsContainer.append('<div class=\"comment\"><div class="comment__info"><img class="person-aside-block__img"' +
            ' src="' + comment.userPhotoUrl + '" title="' + comment.userName + '"><div> ' + comment.userName + ' <span><em>(' + comment.dateAdded
            + ')</em></span>: </div></div>' + '<p>' + comment.comment + '</p></div>');
    }

    var pagesNumber = Math.ceil(comments.length / 3);
    for (i = 1; i <= pagesNumber; i++) {
        paginationContainer.append('<a class=\"pagination__links\" onclick="renderComments(' + (i - 1) + ')">' + i + '</a>')
    }
}

function choseProgressBarColor(progress) {
    if (progress <= 25) {
        return '#f48847';
    } else if (progress <= 75) {
        return '#ffc84a';
    } else {
        return '#a6c34c';
    }
}

function hideAllViews() {
    $('#task-board-view').addClass('hide');
    $('#opened-task-view').addClass('hide');
    $('#contacts-view').addClass('hide');
    $('#error-page-view').addClass('hide');
    $('#unauthorized-page-view').addClass('hide');
    $('#edit-current-task').addClass('hide');
    $('#filters').addClass('hide');
}


function hideNavButtonsForUnauthorized() {
    [].slice.call($('.main-menu__link')).forEach(function (value) {
        if (value.text !== 'Login' && value.text !== 'Logout') {
            value.classList.add('hide')
        }
    });
}

function unhideNavButtons() {
    [].slice.call($('.main-menu__link')).forEach(function (value) {
        value.classList.remove('hide')
    });
}

function enableAdminButton(user) {
    if (user.userRole === 'Admin') {
        $(".admin").css('display', 'inline');
    } else {
        $(".admin").css('display', 'none');
    }
}

function prepareTaskData(form, id) {
    var title = form.elements.title.value;
    var description = form.elements.description.value;
    var status = form.elements.status.value;
    var progress = form.elements.progress.value;
    var priority = getTaskPriorityById(form.elements.priority.value);
    var type = form.elements.type.value;
    var assignee = getUserById(form.elements.assignee.value);
    var reporter = getUserById(localStorage.getItem('user'));
    var taskId;

    if (id === undefined) {
        taskId = generateNewTaskId();
    }

    return {
        taskId: taskId,
        title: title,
        description: description,
        status: status,
        priority: priority.priority,
        priorityId: priority.id,
        priorityDescription: priority.description,
        priorityUrl: priority.priorityUrl,
        type: type,
        assigneeId: assignee.id,
        assignee: assignee.userName,
        assigneeAvatarUrl: assignee.userAvatarUrl,
        reporter: reporter.userName,
        reporterAvatarUrl: reporter.userAvatarUrl,
        progress: progress
    }
}

function createTaskComment(form) {
    var user = getUserById(localStorage.getItem('user'));

    var comment = form.elements.comment.value;
    return {
        dateAdded: new Date(),
        userId: user.id,
        userName: user.userName,
        userPhotoUrl: user.userAvatarUrl,
        comment: comment
    }
}

function createTaskAttachment(form) {

    var url = form.elements.url.value;
    var caption = form.elements.caption.value;
    return {
        url: url,
        fileName: caption
    }
}

function createUser(form) {
    var userName = form.elements.name.value;
    var userAvatarUrl = form.elements.photo.value;
    var userRole = form.elements.role.value;
    return {
        userName: userName,
        userAvatarUrl: userAvatarUrl,
        userRole: userRole
    }
}

// TODO delegate to backend
function generateNewTaskId() {

    var lastTaskId = getLastTaskNumber().number;
    return 'Task-' + ++lastTaskId;
}

//google-map api
function initMap() {
    var coordinates = {
        lat: 50.4305191,
        lng: 30.4871098
    };

    var map = new google.maps.Map($('#map')[0], {
        zoom: 16,
        center: coordinates
    });

    var marker = new google.maps.Marker({
        // position: coordinates,
        map: map
    });
}