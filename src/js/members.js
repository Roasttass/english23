// This file manages member-related functionalities, including rendering the members table, updating member data, and deleting members.

const USERS_STORAGE_KEY = 'club_users';

// Get users from local storage
function getUsers() {
    let users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
}

// Render members table
export function renderMembersTable(currentUser) {
    const membersTableBody = document.getElementById('members-table-body');
    membersTableBody.innerHTML = '';

    const users = getUsers();

    users.forEach(user => {
        if (currentUser.role === 'member' && user.username !== currentUser.username) {
            return;
        }

        const tr = document.createElement('tr');

        // Profile picture cell
        const profilePictureTd = document.createElement('td');
        const profilePictureImg = document.createElement('img');
        profilePictureImg.src = user.profilePicture || 'default-profile.png';
        profilePictureImg.alt = `${user.name}'s Profile Picture`;
        profilePictureImg.style.width = '50px';
        profilePictureImg.style.height = '50px';
        profilePictureImg.style.borderRadius = '50%';
        profilePictureImg.style.cursor = 'pointer';
        profilePictureImg.addEventListener('click', () => showBioModal(user));
        profilePictureTd.appendChild(profilePictureImg);
        tr.appendChild(profilePictureTd);

        // Member name cell
        const nameTd = document.createElement('td');
        nameTd.textContent = user.name;
        nameTd.setAttribute('data-label', 'Member Name');
        tr.appendChild(nameTd);

        // Username cell
        const usernameTd = document.createElement('td');
        usernameTd.textContent = user.username;
        usernameTd.setAttribute('data-label', 'Username');
        tr.appendChild(usernameTd);

        // Password cell
        const passwordTd = document.createElement('td');
        passwordTd.textContent = currentUser.role === 'admin' ? user.password : '******';
        passwordTd.setAttribute('data-label', 'Password');
        tr.appendChild(passwordTd);

        // Ranking cell
        const rankingTd = document.createElement('td');
        rankingTd.textContent = user.ranking || '';
        rankingTd.setAttribute('data-label', 'Ranking');
        if (currentUser.role === 'admin' && user.username !== 'admin') {
            rankingTd.classList.add('editable');
            rankingTd.title = 'Click to edit Ranking';
            rankingTd.tabIndex = 0;
            rankingTd.addEventListener('click', () => makeEditable(rankingTd, user, 'ranking'));
        }
        tr.appendChild(rankingTd);

        // Points cell
        const pointsTd = document.createElement('td');
        pointsTd.textContent = user.points != null ? user.points : '';
        pointsTd.setAttribute('data-label', 'Points');
        if (currentUser.role === 'admin' && user.username !== 'admin') {
            pointsTd.classList.add('editable');
            pointsTd.title = 'Click to edit Points';
            pointsTd.tabIndex = 0;
            pointsTd.addEventListener('click', () => makeEditable(pointsTd, user, 'points'));
        }
        tr.appendChild(pointsTd);

        // Actions cell
        const actionsTd = document.createElement('td');
        if (currentUser.role === 'admin' && user.username !== 'admin') {
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => deleteMember(user.username));
            actionsTd.appendChild(deleteBtn);
        }
        tr.appendChild(actionsTd);

        membersTableBody.appendChild(tr);
    });
}

// Update user data
export function updateUser(updatedUser) {
    const users = getUsers();
    const index = users.findIndex(u => u.username === updatedUser.username);
    if (index !== -1) {
        users[index] = { ...updatedUser };
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        return true;
    }
    return false;
}

// Delete member
export function deleteMember(username) {
    if (!confirm(`Are you sure you want to delete the account for ${username}?`)) {
        return;
    }

    const users = getUsers();
    const updatedUsers = users.filter(user => user.username !== username);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

    alert(`Member ${username} has been deleted.`);
    const currentUser = findUser(getSession());
    renderMembersTable(currentUser);
}