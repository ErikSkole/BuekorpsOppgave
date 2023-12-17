async function fetchData() {
    try {
        const responseCurrentUser = await fetch('/current-user');
        const currentUser = await responseCurrentUser.json();
        const responseUsers = await fetch('/users');
        const users = await responseUsers.json();
        const userList = document.getElementById('queryList');
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        ['Rolle', 'Bruker', 'Fornavn', 'Etternavn', 'Tlf', 'Email', 'Kompani', 'Peletong', 'Rediger', 'Slett'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
        users.forEach(user => {
            if (user.role !== 'Admin') {
                const row = document.createElement('tr');
                [user.role, user.username, user.first_name, user.last_name, user.phone, user.email, user.platoons_company_id, user.platoons_platoon_id].forEach(text => {
                    const td = document.createElement('td');
                    td.textContent = text;
                    row.appendChild(td);
                });
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.value = "modal";
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                if (user.username === currentUser.username) {
                    editButton.addEventListener('click', () => {
                        openEditModal(user);
                    });
                    deleteButton.addEventListener('click', () => {
                        deleteUser(user.user_id);
                    });
                } else {
                    editButton.disabled = true;
                    deleteButton.disabled = true;
                }
                const tdEdit = document.createElement('td');
                const tdDelete = document.createElement('td');
                tdEdit.appendChild(editButton);
                tdDelete.appendChild(deleteButton);
                row.appendChild(tdEdit);
                row.appendChild(tdDelete);
                table.appendChild(row);
            }
        });
        userList.appendChild(table);
    } catch (error) {
        console.error(error);
    }
}

fetchData();

function openEditModal(user) { // Function to open the edit modal form
    document.querySelector('.currentUsername').value = user.username; // Sets the text content of the currentUsername div to the username of the user that was clicked
    document.querySelector('.editModal').classList.toggle('hidden'); // Toggles the hidden class on the modal to show or hide the modal
}

function closeEditModal() { // Function to close the edit modal form
    document.querySelector('.editModal').classList.toggle('hidden');
}

document.querySelector('.logoutBtn').addEventListener('click', () => { // Adds event listener to the logout button
    window.location.href = '/logout'; // Redirects to the logout route
});

async function deleteUser(id) { // Function to delete user
    try {
        const response = await fetch('/deleteUser/' + id, { // Fetches the deleteUser route
            method: 'DELETE', 
        });
        window.location.href = '/logout';
    } catch (error) {
        console.error(error);
    }
}