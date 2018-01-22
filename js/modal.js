function showGalleryModal(taskId, pictureId)  {
    var modal = $('#gallery-modal')[0];

    var attachments = getTaskById(taskId).attachments;

    var pictureIndex = attachments.findIndex(function (attachment) {
        if (attachment.id === pictureId){
            return attachment;
        }
    });

    // Get the image and insert it inside the modal - use its "title" text as a caption
    var modalImg = $('#modal-image')[0];
    var captionText = $('#caption')[0];

    modal.style.display = 'block';
    modalImg.src = attachments[pictureIndex].url;
    modalImg.title = attachments[pictureIndex].fileName;
    modalImg.alt = attachments[pictureIndex].fileName;
    captionText.innerHTML = attachments[pictureIndex].fileName;

    var nextPictureIndex = attachments.length - 1 === pictureIndex ? 0 : pictureIndex + 1;
    var prevPictureIndex  = 0 === pictureIndex ? attachments.length - 1 : pictureIndex - 1;

    $('#prev-modal-image').attr('href', '#gallery/' + taskId + '/' + attachments[prevPictureIndex].id);
    $('#next-modal-image').attr('href', '#gallery/' + taskId + '/' + attachments[nextPictureIndex].id);

    var closeBtn = $('#close-gallery-modal')[0];
    var closeModal = function () {
        modal.style.display = 'none';
        window.location.hash='#task/' + taskId;
    };

    closeBtn.addEventListener('click', closeModal);

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            window.location.hash='#task/' + taskId;
        }
    };
}

function showEditTaskModal(id) {
    var container = $('#adding-task-modal');
    container[0].style.display = 'block';

    var task;

    if (id !== undefined) {
        task = getTaskById(id);
    }

    var statuses = getStatuses();
    var types = getTaskTypes();
    var priorities = getTaskPriorities();
    var users = getUsers();


    container.find('#add-task-status').empty();
    statuses.forEach(function (status) {
        container.find('#add-task-status').append('<option value="' + status.status + '">' + status.status + '</option>');
    });

    container.find('#add-task-types').empty();
    types.forEach(function (type) {
        container.find('#add-task-types').append('<option>' + type.type + '</option>');
    });

    container.find('#add-task-priorities').empty();
    priorities.forEach(function (priority) {
        container.find('#add-task-priorities').append('<option value="' + priority.id + '">'
            + priority.priority + ' ' + priority.description +'</option>');
    });

    container.find('#add-task-assignee').empty();
    users.forEach(function (user) {
        container.find('#add-task-assignee').append('<option value="' + user.id + '">' + user.userName +'</option>');
    });

    container.find('#add-task-title').val('');
    container.find('#add-task-description').val('');
    if (task !== undefined){
        container.find('#add-task-title').val(task.title);
        container.find('#add-task-description').val(task.description);
        container.find('#add-task-status').val(task.status);
        container.find('#add-task-type').val(task.type);
        container.find('#add-task-priorities').val(task.priorityId);
        container.find('#add-task-progress').val(task.progress);
        container.find('#add-task-assignee').val(task.assigneeId);
    }

    var closeBtn = $('#close-add-task')[0];
    var closeTaskModal = function () {
        container[0].style.display = 'none';

        if (id === undefined){
            window.location.hash = '#';
            $(window).trigger('hashchange');
        } else {
            window.location.hash = '#task/' + id;
        }
    };

    closeBtn.addEventListener('click', closeTaskModal);

    window.onclick = function (event) {
        if (event.target === container[0]) {
            closeTaskModal();
        }
    };
}


function showNewUserModal() {
    var userModal = $('#adding-user-modal');
    userModal[0].style.display = 'block';

    userModal.find('#new-user-name').val('');
    userModal.find('#new-user-photo').val('');

    var closeBtn = $('#close-add-user')[0];
    var closeUserModal = function () {
        userModal[0].style.display = 'none';
        window.location.hash = '#';
    };

    closeBtn.addEventListener('click', closeUserModal);

    window.onclick = function (event) {
        if (event.target === userModal) {
            closeUserModal();
        }
    };
}

function showLoginModal() {
    var loginModal = $('#login-modal');
    loginModal[0].style.display = 'block';

    var users = getUsers();

    loginModal.find('#choose-user').empty();
    users.forEach(function (user) {
        loginModal.find('#choose-user').append('<option value="' + user.id + '">' + user.userName + '</option>');
    });

    var closeBtn = $('#close-login')[0];
    var closeLoginModal = function () {
        loginModal[0].style.display = 'none';
        window.location.hash = '#unauthorized';
    };

    closeBtn.addEventListener('click', closeLoginModal);

    window.onclick = function (event) {
        if (event.target === loginModal[0]) {
            closeLoginModal();
        }
    };
}

function showAttachmentModal(taskId) {
    var attachmentModal = $('#adding-attachment-modal')[0];
    attachmentModal.style.display = 'block';

    var closeBtn = $('#close-add-attachment')[0];
    var closeAttachmentModal = function () {
        attachmentModal.style.display = 'none';
        window.location.hash = '#task/' + taskId;
    };

    closeBtn.addEventListener('click', closeAttachmentModal);

    window.onclick = function (event) {
        if (event.target === attachmentModal) {
            closeAttachmentModal();
        }
    };
}