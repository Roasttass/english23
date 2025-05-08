(() => {
  // DOM elements
  const loginFormEl = document.getElementById('login-form');
  const registerFormEl = document.getElementById('register-form');
  const dashboardEl = document.getElementById('dashboard');
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const loginErrorEl = document.getElementById('login-error');
  const registerErrorEl = document.getElementById('register-error');
  const usernameInput = document.getElementById('username-input');
  const passwordInput = document.getElementById('password-input');
  const registerNameInput = document.getElementById('register-name-input');
  const registerUsernameInput = document.getElementById('register-username-input');
  const registerPasswordInput = document.getElementById('register-password-input');
  const membersTableBody = document.getElementById('members-table-body');
  const welcomeMsg = document.getElementById('welcome-msg');
  const showRegisterLink = document.getElementById('show-register-link');
  const showLoginLink = document.getElementById('show-login-link');

  // DOM elements for profile
  const profileSection = document.getElementById('profile-section');
  const profilePictureEl = document.getElementById('profile-picture');
  const profilePictureInput = document.getElementById('profile-picture-input');
  const bioInput = document.getElementById('bio-input');
  const saveProfileBtn = document.getElementById('save-profile-btn');

  // DOM elements for chat
  const chatSection = document.getElementById('chat-section');
  const chatMessagesEl = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendChatBtn = document.getElementById('send-chat-btn');

  // DOM elements for bio modal
  const bioModal = document.getElementById('bio-modal');
  const bioModalOverlay = document.getElementById('bio-modal-overlay');
  const bioModalName = document.getElementById('bio-modal-name');
  const bioModalBio = document.getElementById('bio-modal-bio');
  const closeBioModalBtn = document.getElementById('close-bio-modal');

  // DOM elements for admin question submission
  const adminQuestionSection = document.getElementById('admin-question-section');
  const adminQuestionInput = document.getElementById('admin-question-input');
  const submitQuestionBtn = document.getElementById('submit-question-btn');

  // DOM elements for admin results section
  const adminResultsSection = document.getElementById('admin-results-section');
  const resultsQuestionText = document.getElementById('results-question-text');
  const resultsYesCount = document.getElementById('results-yes-count');
  const resultsYesList = document.getElementById('results-yes-list');
  const resultsNoCount = document.getElementById('results-no-count');
  const resultsNoList = document.getElementById('results-no-list');

  // DOM elements for member question popup
  const memberQuestionPopup = document.getElementById('member-question-popup');
  const popupQuestionText = document.getElementById('popup-question-text');
  const answerYesBtn = document.getElementById('answer-yes-btn');
  const answerNoBtn = document.getElementById('answer-no-btn');

  const API_BASE_URL = 'http://localhost:5000'; // Backend URL

  // Render chat messages
  function renderChatMessages() {
    chatMessagesEl.innerHTML = '';
    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/chat`, {
      headers: {
        'auth-token': token
      }
    })
    .then(response => {
      const messages = response.data;
      messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = `
          <p><strong>${msg.user}:</strong> ${msg.text}</p>
        `;
        chatMessagesEl.appendChild(messageDiv);
      });
      chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    })
    .catch(error => {
      console.error('Error fetching chat messages:', error);
    });
  }

  // Send a chat message
  function sendChatMessage(text) {
    const token = localStorage.getItem('token');
    axios.post(`${API_BASE_URL}/chat/send`, { text }, {
      headers: {
        'auth-token': token
      }
    })
    .then(() => {
      chatInput.value = '';
      renderChatMessages();
    })
    .catch(error => {
      console.error('Error sending chat message:', error);
    });
  }

  // Handle sending chat messages
  sendChatBtn.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (text) {
      sendChatMessage(text);
    }
  });

  // Allow pressing Enter to send chat messages
  chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (text) {
        sendChatMessage(text);
      }
    }
  });

  // Handle member response
  function handleMemberResponse(response) {
    const token = localStorage.getItem('token');
    axios.post(`${API_BASE_URL}/vote`, { response }, {
      headers: {
        'auth-token': token
      }
    })
    .then(() => {
      alert(`You answered: ${response}`);
      memberQuestionPopup.style.display = 'none';
    })
    .catch(error => {
      console.error('Error submitting vote:', error);
    });
  }

  // Event listeners for Yes/No buttons
  answerYesBtn.addEventListener('click', () => handleMemberResponse('Yes'));
  answerNoBtn.addEventListener('click', () => handleMemberResponse('No'));

  // Update results for admin
  function updateAdminResults() {
    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/admin/results`, {
      headers: {
        'auth-token': token
      }
    })
    .then(response => {
      const results = response.data;
      resultsQuestionText.textContent = `Current Question: ${results.question}`;
      resultsYesCount.textContent = results.yesCount;
      resultsNoCount.textContent = results.noCount;

      // Update Yes list
      resultsYesList.innerHTML = results.yes
        .map(name => `<li>${name}</li>`)
        .join('');

      // Update No list
      resultsNoList.innerHTML = results.no
        .map(name => `<li>${name}</li>`)
        .join('');

      adminResultsSection.style.display = 'block';
    })
    .catch(error => {
      console.error('Error fetching admin results:', error);
    });
  }

  // Check for a new question and show the popup
  function checkForQuestion() {
    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/vote/question`, {
      headers: {
        'auth-token': token
      }
    })
    .then(response => {
      const question = response.data.question;
      if (question) {
        popupQuestionText.textContent = question;
        memberQuestionPopup.style.display = 'block';
      }
    })
    .catch(error => {
      console.error('Error fetching question:', error);
    });
  }

  // Get user profile
  async function getProfile() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: {
          'auth-token': token,
        },
      });
      profilePictureEl.src = response.data.profilePicture || 'default-profile.png';
      bioInput.value = response.data.bio || '';
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  // Save profile updates
  async function saveProfile() {
    const file = profilePictureInput.files[0];
    let profilePicture = profilePictureEl.src;

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profilePicture = e.target.result;
        updateProfile(profilePicture);
      };
      reader.readAsDataURL(file);
    } else {
      updateProfile(profilePicture);
    }
  }

  async function updateProfile(profilePicture) {
    try {
      const token = localStorage.getItem('token');
      const bio = bioInput.value.trim();
      const userId = findUser(getSession()).id;

      await axios.put(
        `${API_BASE_URL}/users/profile/${userId}`,
        { bio, profilePicture },
        {
          headers: {
            'auth-token': token,
          },
        }
      );

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  }

  // Show dashboard and hide login
  function showDashboard(user) {
    loginFormEl.style.display = 'none';
    registerFormEl.style.display = 'none';
    dashboardEl.style.display = 'block';
    welcomeMsg.textContent = `Welcome, ${user.name} (${user.role})`;

    if (user.role === 'admin') {
      // Admin view
      adminQuestionSection.style.display = 'block';
      adminResultsSection.style.display = 'block';
      document.querySelector('table[aria-describedby="members-desc"]').style.display = 'table';
      document.getElementById('top-members-section').style.display = 'none';
      profileSection.style.display = 'none';
      chatSection.style.display = 'block';
      renderMembersTable();
      updateAdminResults(); // Update results for admin
    } else {
      // Member view
      adminQuestionSection.style.display = 'none';
      adminResultsSection.style.display = 'none';
      document.querySelector('table[aria-describedby="members-desc"]').style.display = 'none';
      document.getElementById('top-members-section').style.display = 'block';
      profileSection.style.display = 'block';
      chatSection.style.display = 'block';
      getProfile();
      renderTop10Members();

      // Check for a question
      checkForQuestion();
    }

    renderChatMessages();
  }

  // Get all users
  async function renderMembersTable() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: {
          'auth-token': token,
        },
      });
      const users = response.data;
      membersTableBody.innerHTML = '';

      users.forEach(user => {
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

        // Password cell (only visible to admin)
        const passwordTd = document.createElement('td');
        passwordTd.textContent = '******';
        passwordTd.setAttribute('data-label', 'Password');
        tr.appendChild(passwordTd);

        // Ranking cell (editable for admin)
        const rankingTd = document.createElement('td');
        rankingTd.textContent = user.ranking || '';
        rankingTd.setAttribute('data-label', 'Ranking');
        if (user.username !== 'admin') {
          rankingTd.classList.add('editable');
          rankingTd.title = 'Click to edit Ranking';
          rankingTd.tabIndex = 0;
          rankingTd.addEventListener('click', () => makeEditable(rankingTd, user, 'ranking'));
          rankingTd.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              makeEditable(rankingTd, user, 'ranking');
            }
          });
        }
        tr.appendChild(rankingTd);

        // Points cell (editable for admin)
        const pointsTd = document.createElement('td');
        pointsTd.textContent = user.points != null ? user.points : '';
        pointsTd.setAttribute('data-label', 'Points');
        if (user.username !== 'admin') {
          pointsTd.classList.add('editable');
          pointsTd.title = 'Click to edit Points';
          pointsTd.tabIndex = 0;
          pointsTd.addEventListener('click', () => makeEditable(pointsTd, user, 'points'));
          pointsTd.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              makeEditable(pointsTd, user, 'points');
            }
          });
        }
        tr.appendChild(pointsTd);

        // Actions cell (only for admin)
        const actionsTd = document.createElement('td');
        if (user.username !== 'admin') {
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Delete';
          deleteBtn.className = 'delete-btn';
          deleteBtn.addEventListener('click', () => deleteMember(user.username));
          actionsTd.appendChild(deleteBtn);
        }
        tr.appendChild(actionsTd);

        membersTableBody.appendChild(tr);
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  // Make a cell editable for admin
  function makeEditable(td, user, field) {
    if (td.querySelector('input')) return; // already editing

    const oldValue = td.textContent;
    td.textContent = '';

    const input = document.createElement('input');
    input.type = (field === 'points') ? 'number' : 'text';
    input.value = oldValue;
    input.className = 'edit-input';
    input.setAttribute('aria-label', `Edit ${field} for ${user.name}`);

    td.appendChild(input);
    input.focus();

    function saveChange() {
      const newValue = input.value.trim();
      const token = localStorage.getItem('token');
      const userId = JSON.parse(atob(token.split('.')[1])).user.id;

      let updateData = {};
      if (field === 'points') {
        // Validate points: must be a non-negative integer
        if (!/^\d+$/.test(newValue)) {
          alert('Points must be a non-negative whole number');
          input.focus();
          return;
        }
        updateData = { points: parseInt(newValue, 10) };
      } else {
        // For ranking just set as string, max length 20 chars
        if (newValue.length > 20) {
          alert('Ranking must be 20 characters or less');
          input.focus();
          return;
        }
        updateData = { ranking: newValue };
      }

      axios.put(`${API_BASE_URL}/users/${userId}`, updateData, {
        headers: {
          'auth-token': token
        }
      })
      .then(() => {
        td.textContent = newValue;
      })
      .catch(error => {
        console.error('Error updating user:', error);
        alert('Failed to update user.');
      });

      input.removeEventListener('blur', onBlur);
      input.removeEventListener('keydown', onKeyDown);
    }

    function cancelChange() {
      td.textContent = oldValue;
      input.removeEventListener('blur', onBlur);
      input.removeEventListener('keydown', onKeyDown);
    }

    function onBlur() {
      saveChange();
    }

    function onKeyDown(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveChange();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelChange();
      }
    }

    input.addEventListener('blur', onBlur);
    input.addEventListener('keydown', onKeyDown);
  }

  // Delete member (admin only)
  function deleteMember(username) {
    if (!confirm(`Are you sure you want to delete the account for ${username}?`)) {
      return;
    }

    const token = localStorage.getItem('token');
    axios.delete(`${API_BASE_URL}/users/${username}`, {
      headers: {
        'auth-token': token
      }
    })
    .then(() => {
      alert(`Member ${username} has been deleted.`);
      renderMembersTable();
    })
    .catch(error => {
      console.error('Error deleting member:', error);
      alert('Failed to delete member.');
    });
  }

  // Get top 10 members by points
  function getTop10Members() {
    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/users/top10`, {
      headers: {
        'auth-token': token
      }
    })
    .then(response => {
      const topMembers = response.data;
      const topMembersTableBody = document.getElementById('top-members-table-body');
      topMembersTableBody.innerHTML = topMembers
        .map((member, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${member.name}</td>
            <td>${member.points}</td>
            <td>${member.ranking}</td>
          </tr>
        `)
        .join('');
    })
    .catch(error => {
      console.error('Error fetching top 10 members:', error);
    });
  }

  // Show login and hide dashboard
  function showLogin() {
    loginFormEl.style.display = 'block';
    registerFormEl.style.display = 'none';
    dashboardEl.style.display = 'none';
    loginErrorEl.textContent = '';
    usernameInput.value = '';
    passwordInput.value = '';
  }

  // Show registration form and hide login
  function showRegister() {
    loginFormEl.style.display = 'none';
    registerFormEl.style.display = 'block';
    registerErrorEl.textContent = '';
    registerNameInput.value = '';
    registerUsernameInput.value = '';
    registerPasswordInput.value = '';
  }

  // Login handler
  async function handleLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      loginErrorEl.textContent = 'Please enter username and password.';
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token); // Store token
      showDashboard(user);
    } catch (error) {
      loginErrorEl.textContent = 'Invalid username or password.';
    }
  }

  // Registration handler
  async function handleRegister() {
    const name = registerNameInput.value.trim();
    const username = registerUsernameInput.value.trim();
    const password = registerPasswordInput.value;

    if (!name || !username || !password) {
      registerErrorEl.textContent = 'All fields are required.';
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        username,
        password,
      });

      alert('Registration successful! You can now log in.');
      showLogin();
    } catch (error) {
      registerErrorEl.textContent = 'Registration failed.';
    }
  }

  // Logout handler
  function handleLogout() {
    localStorage.removeItem('token');
    showLogin();

    // Hide features after logout
    profileSection.style.display = 'none';
    chatSection.style.display = 'none';
    document.getElementById('top-members-section').style.display = 'none';
    document.getElementById('admin-question-section').style.display = 'none';
    adminResultsSection.style.display = 'none';
  }

  // Submit question
  submitQuestionBtn.addEventListener('click', () => {
    const question = adminQuestionInput.value.trim();
    if (!question) {
      alert('Please enter a question.');
      return;
    }

    const token = localStorage.getItem('token');
    axios.post(`${API_BASE_URL}/admin/question`, { question }, {
      headers: {
        'auth-token': token
      }
    })
    .then(() => {
      alert('Question submitted successfully!');
      adminQuestionInput.value = '';
      updateAdminResults();
    })
    .catch(error => {
      console.error('Error submitting question:', error);
    });
  });

  // Find user by username
  function findUser(username) {
    // No need to fetch from local storage anymore
    return null;
  }

  // Init flow
  function init() {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and show dashboard
      axios.get(`${API_BASE_URL}/users/profile`, {
        headers: {
          'auth-token': token
        }
      })
      .then(response => {
        showDashboard(response.data);
      })
      .catch(error => {
        clearSession();
        showLogin();
      });
    } else {
      showLogin(); // If no session, show login form
    }
  }

  // Event listeners
  loginBtn.addEventListener('click', handleLogin);
  registerBtn.addEventListener('click', handleRegister);
  logoutBtn.addEventListener('click', handleLogout);
  showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    showRegister();
  });
  showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showLogin();
  });

  // Allow pressing Enter to submit login form
  [usernameInput, passwordInput].forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleLogin();
      }
    });
  });

  // Allow pressing Enter to submit registration form
  [registerNameInput, registerUsernameInput, registerPasswordInput].forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleRegister();
      }
    });
  });

  // Event listener for saving profile
  saveProfileBtn.addEventListener('click', () => {
    saveProfile();
  });

  // Initialize app
  init();
})();