document.addEventListener('DOMContentLoaded', () => {
    const userContainer = document.getElementById('user-container');
    const reloadButton = document.getElementById('reload-btn');

    // Indian names and addresses
    const indianNames = [
        'Amit Sharma', 'Priya Singh', 'Rahul Verma', 'Sneha Patel', 'Vikram Joshi',
        'Neha Gupta', 'Rohan Mehra', 'Pooja Desai', 'Arjun Reddy', 'Kavita Nair'
    ];
    const indianCities = [
        'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata',
        'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
    ];
    const indianStreets = [
        'MG Road', 'Brigade Road', 'Anna Salai', 'Park Street', 'Banjara Hills',
        'FC Road', 'Ashram Road', 'Jawahar Nagar', 'C-Scheme', 'Hazratganj'
    ];
    const indianSuites = [
        'Suite 101', 'Suite 202', 'Suite 303', 'Suite 404', 'Suite 505',
        'Suite 606', 'Suite 707', 'Suite 808', 'Suite 909', 'Suite 1001'
    ];

    // Add User form elements
    const addUserBtn = document.getElementById('add-user-btn');
    const addUserForm = document.getElementById('add-user-form');
    const submitUserBtn = document.getElementById('submit-user-btn');
    const cancelUserBtn = document.getElementById('cancel-user-btn');
    const newName = document.getElementById('new-name');
    const newEmail = document.getElementById('new-email');
    const newStreet = document.getElementById('new-street');
    const newSuite = document.getElementById('new-suite');
    const newCity = document.getElementById('new-city');

    let localUsers = []; // Store added users

    // Show form
    addUserBtn.addEventListener('click', () => {
        addUserForm.style.display = 'block';
    });

    // Hide form
    cancelUserBtn.addEventListener('click', () => {
        addUserForm.style.display = 'none';
        newName.value = '';
        newEmail.value = '';
        newStreet.value = '';
        newSuite.value = '';
        newCity.value = '';
    });

    // Add user
    submitUserBtn.addEventListener('click', () => {
        if (newName.value && newEmail.value && newStreet.value && newSuite.value && newCity.value) {
            const user = {
                name: newName.value,
                email: newEmail.value,
                address: {
                    street: newStreet.value,
                    suite: newSuite.value,
                    city: newCity.value
                }
            };
            localUsers.push(user);
            renderUsers(currentApiUsers);
            addUserForm.style.display = 'none';
            newName.value = '';
            newEmail.value = '';
            newStreet.value = '';
            newSuite.value = '';
            newCity.value = '';
        }
    });

    // Render users (API + local)
    function renderUsers(apiUsers = []) {
        userContainer.innerHTML = '';
        const allUsers = [...apiUsers, ...localUsers];
        allUsers.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'user-card';
            userDiv.innerHTML = `
                <h2>${user.name}</h2>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Address:</strong> ${user.address.street}, ${user.address.suite}, ${user.address.city}</p>
            `;
            userContainer.appendChild(userDiv);
        });
    }

    let currentApiUsers = []; // Store API users for reload

    // Update fetchUsers to use renderUsers
    const fetchUsers = () => {
        userContainer.innerHTML = 'Loading users...';
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => {
                // Check if the response is successful
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse the JSON response [cite: 12]
            })
            .then(users => {
                // Assign Indian name and address
                users.forEach((user, idx) => {
                    user.name = indianNames[idx % indianNames.length];
                    user.address.city = indianCities[idx % indianCities.length];
                    user.address.street = indianStreets[idx % indianStreets.length];
                    user.address.suite = indianSuites[idx % indianSuites.length];
                    user.email = user.email.replace(/@.*$/, '@example.in');
                });
                currentApiUsers = users;
                renderUsers(users);
            })
            .catch(error => { // Handle errors 
                console.error('Fetch error:', error);
                userContainer.innerHTML = `<p class="error">Failed to load users. Please check your network connection.</p>`;
            });
    };

    // Fetch users when the page loads
    fetchUsers();

    // Add event listener to the reload button
    reloadButton.addEventListener('click', fetchUsers);
});