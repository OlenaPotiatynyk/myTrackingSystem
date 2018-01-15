function showGalleryModal(taskId, pictureId)  {
    var modal = $('#gallery-modal')[0];

    var attachments = getTaskById(taskId).attachments;

    // here we are not able use .findIndex for IE !!
    var pictureIndex = attachments.findIndex(function (attachment) {
        if (attachment.id === pictureId){
            return attachment;
        }

    });

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var modalImg = $("#modal-image")[0];
    var captionText = $("#caption")[0];

    modal.style.display = "block";
    modalImg.src = attachments[pictureIndex].url;
    captionText.innerHTML = attachments[pictureIndex].fileName; // all img need to have alt!!!

    var nextPictureIndex = attachments.length - 1 === pictureIndex ? 0 : pictureIndex + 1;
    var prevPictureIndex  = 0 === pictureIndex ? attachments.length - 1 : pictureIndex - 1;

    $("#prev-modal-image").attr('href', "#gallery/" + taskId + "/" + attachments[prevPictureIndex].id);
    $("#next-modal-image").attr('href', "#gallery/" + taskId + "/" + attachments[nextPictureIndex].id);

    var closeBtn = $("#close-gallery-modal")[0];
    var closeModal = function () {
        modal.style.display = "none";
        window.location.hash="#task/" + taskId;
    };

    closeBtn.addEventListener('click', closeModal);

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
            window.location.hash="#task/" + taskId;
        }
    };
}

function showEditTaskModal(taskId) {
    var taskModal = $('#adding-task-modal')[0];
    taskModal.style.display = "block";

    var task;

    if (taskId !== undefined) {
        task = getTaskById(taskId);
    }

    var container = $("#adding-task-modal");

    var statuses = getStatuses();
    var types = getTaskTypes();
    var priorities = getTaskPriorities();
    var users = getUsers();


    container.find("#add-task-status").empty();
    statuses.forEach(function (status) {
        container.find("#add-task-status").append('<option value="'+ status.status +'">'+ status.status +'</option>');
    });

    container.find("#add-task-types").empty();
    types.forEach(function (type) {
        container.find("#add-task-types").append('<option>'+ type.type +'</option>');
    });

    container.find("#add-task-priorities").empty();
    priorities.forEach(function (priority) {
        container.find("#add-task-priorities").append('<option value="'+ priority.id +'">' + priority.priority + ' ' + priority.description +'</option>');
    });

    container.find("#add-task-assignee").empty();
    users.forEach(function (user) {
        container.find("#add-task-assignee").append('<option value="' + user.id + '">' + user.userName +'</option>');
    });

    container.find("#add-task-title").empty();
    container.find("#add-task-description").empty();
    if (task !== undefined){
        container.find("#add-task-title").attr("value", task.title);
        container.find("#add-task-description").val(task.description);
        container.find("#add-task-status").val(task.status);
        container.find("#add-task-type").val(task.type);
        container.find("#add-task-priorities").val(task.priorityId);
        container.find("#add-task-progress").val(task.progress);
        container.find("#add-task-assignee").val(task.assigneeId);
    }

    var closeBtn = $("#close-add-task")[0];
    var closeTaskModal = function () {
        taskModal.style.display = "none";

        window.location.hash = "#task/" + taskId;
        $(window).trigger('hashchange');
    };

    closeBtn.addEventListener('click', closeTaskModal);

    window.onclick = function (event) {
        if (event.target === taskModal) {
            taskModal.style.display = "none";

            window.location.hash = "#task/" + taskId;
            $(window).trigger('hashchange');
        }
    };
}


function showNewUserModal() {
    var userModal = $('#adding-user-modal')[0];
    userModal.style.display = "block";

    var closeBtn = $("#close-add-user")[0];
    var closeUserModal = function () {
        userModal.style.display = "none";

        window.location.hash = "#";
        $(window).trigger('hashchange');
    };

    closeBtn.addEventListener('click', closeUserModal);

    window.onclick = function (event) {
        if (event.target === userModal) {
            userModal.style.display = "none";

            window.location.hash = "#";
            $(window).trigger('hashchange');
        }
    };
}

function showLoginModal() {
    var loginModal = $('#login-modal')[0];
    loginModal.style.display = "block";

    var container = $("#login-modal");

    var users = getUsers();

    container.find("#choose-user").empty();
    users.forEach(function (user) {
        container.find("#choose-user").append('<option value="' + user.id + '">' + user.userName + '</option>');
    });

    var closeBtn = $("#close-login")[0];
    var closeLoginModal = function () {
        loginModal.style.display = "none";

        window.location.hash = "#unauthorized";
    };

    closeBtn.addEventListener('click', closeLoginModal);

    window.onclick = function (event) {
        if (event.target === loginModal) {
            loginModal.style.display = "none";

            window.location.hash = "#unauthorized";
        }
    };
}

function showAttachmentModal(taskId) {
    var attachmentModal = $('#adding-attachment-modal')[0];
    attachmentModal.style.display = "block";

    var closeBtn = $("#close-add-attachment")[0];
    var closeAttachmentModal = function () {
        attachmentModal.style.display = "none";

        window.location.hash = "#";
        $(window).trigger('hashchange');
    };

    closeBtn.addEventListener('click', closeAttachmentModal);

    window.onclick = function (event) {
        if (event.target === attachmentModal) {
            attachmentModal.style.display = "none";
            window.location.hash = "#task/" + taskId;
        }
    };
}