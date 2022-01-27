let userInfo = $('#tableAllUsers')
let getAllUser = []

getUsers()

function getUsers() {
    fetch("/api/users").then((response) => {
        response.json().then((users) => {
            users.forEach((user) => {
                addUserForTable(user)
                getAllUser.push(user)
            });
        });
    });
}
function addUserForTable(user) {
    userInfo.append(
        '<tr>' +
        '<td>' + user.id + '</td>' +
        '<td>' + user.name + '</td>' +
        '<td>' + user.lastname + '</td>' +
        '<td>' + user.username + '</td>' +
        '<td>' + user.email + '</td>' +
        '<td>' + user.roles.map(roleUser => roleUser.role) + '</td>' +
        '<td>' +
        '<button onclick="editUserById(' + user.id + ')" class="btn btn-info edit-btn" data-toggle="modal" data-target="#edit"' +
        '>Edit</button></td>' +
        '<td>' +
        '<button onclick="deleteUserById(' + user.id + ')" class="btn btn-danger" data-toggle="modal" data-target="#delete"' +
        '>Delete</button></td>' +
        '</tr>'
    )
}

function newUser() {
    let name = document.getElementById('newName').value;
    let lastname = document.getElementById('newLastname').value;
    let username = document.getElementById('newUsername').value;
    let email = document.getElementById('newEmail').value;
    let password = document.getElementById('newPassword').value;
    let roles = getRoles(Array.from(document.getElementById('newRole').selectedOptions)
        .map(role => role.value));
    fetch("/api/users", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({
            name: name,
            lastname: lastname,
            username: username,
            email: email,
            password: password,
            roles: roles
        })
    })
        .then(() => {
            document.getElementById("newUser").reset();
        })
}

function editUserById(id) {
    fetch("/api/users/" + id, {method: 'GET', dataType: 'json',})
        .then(res => {
            res.json().then(user => {
                $('#editId').val(user.id)
                $('#editName').val(user.name)
                $('#editLastname').val(user.lastname)
                $('#editUsername').val(user.username)
                $('#editEmail').val(user.email)
            })
        })
}

function updateUser() {
    let id =  document.getElementById('editId').value;
    let name = document.getElementById('editName').value;
    let lastname = document.getElementById('editLastname').value;
    let username = document.getElementById('editUsername').value;
    let email = document.getElementById('editEmail').value;
    let password = document.getElementById('editPassword').value;
    let roles = getRoles(Array.from(document.getElementById('editRole').selectedOptions)
        .map(role => role.value));
    fetch("/api/users/" + id, {
        method: "PATCH",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({
            name: name,
            lastname: lastname,
            username: username,
            email: email,
            password: password,
            roles: roles
        })
    })
        .then(() => {
            userInfo.empty();
            getUsers();
            closeForm();
        })
}

function deleteUserById(id) {
    fetch("/api/users/" + id, {method: 'GET', dataType: 'json',})
        .then(res => {
            res.json().then(user => {
                $('#deleteId').val(user.id)
                $('#deleteName').val(user.name)
                $('#deleteLastname').val(user.lastname)
                $('#deleteUsername').val(user.username)
                $('#deleteEmail').val(user.email)
                user.roles.map(role => {
                    $('#deleteRole').append('<option id="' + role.id + '" name="' + role.role + '">' +
                        role.role + '</option>')
                })
            })
        })
}

function deleteUser() {
    fetch("/api/users/" + ($('#deleteId').val()), {method: "DELETE"})
        .then(() => {
            userInfo.empty();
            getUsers();
            closeForm();
        })
}

function closeForm() {
    $("#edit .close").click();
    document.getElementById("editUserForm").reset();
    $("#delete .close").click();
    document.getElementById("deleteUserForm").reset();
    $('#deleteRole > option').remove();
}

function getRoles(list) {
    let roles = [];
    if (list.indexOf("USER") >= 0) {
        roles.push({"id": 2});
    }
    if (list.indexOf("ADMIN") >= 0) {
        roles.push({"id": 1});
    }
    return roles;
}