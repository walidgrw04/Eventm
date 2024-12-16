const API_URL = 'http://localhost:3000/events'; // Backend API endpoint

// Function to fetch events
async function fetchEvents() {
    try {
        const eventsList = document.getElementById('events-list');
        eventsList.innerHTML = '<p>Loading events...</p>';

        const response = await axios.get(API_URL);
        const events = response.data;

        eventsList.innerHTML = '';

        if (events.length === 0) {
            eventsList.innerHTML = '<p>No events found.</p>';
        } else {
            events.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.className = 'event-card';
                eventDiv.innerHTML = `
                    <h3>${event.title}</h3>
                    <p>${event.description || 'No description available.'}</p>
                    <p><strong>Date:</strong> ${event.date}</p>
                    <p><strong>Time:</strong> ${event.time}</p>
                    <p><strong>Location:</strong> ${event.location}</p>
                    <button onclick="populateUpdateForm(${event.id}, '${event.title}', '${event.description}', '${event.date}', '${event.time}', '${event.location}')">Edit</button>
                    <button onclick="deleteEvent(${event.id})">Delete</button>
                `;
                eventsList.appendChild(eventDiv);
            });
        }
    } catch (error) {
        console.error('Error fetching events:', error);
        document.getElementById('events-list').innerHTML = '<p>Error loading events. Please try again later.</p>';
    }
}

// Function to handle adding a new event
async function addEvent(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const location = document.getElementById('location').value;

    const feedback = document.getElementById('form-feedback');

    if (!title || !date || !time || !location) {
        feedback.textContent = 'Please fill in all required fields.';
        feedback.style.display = 'block';
        return;
    }

    feedback.style.display = 'none';

    try {
        const response = await axios.post(API_URL, { title, description, date, time, location });
        console.log('Event added successfully:', response.data);

        document.getElementById('event-form').reset();
        fetchEvents();

        feedback.textContent = 'Event added successfully!';
        feedback.style.color = 'green';
        feedback.style.display = 'block';

        setTimeout(() => {
            feedback.style.display = 'none';
        }, 3000);
    } catch (error) {
        console.error('Error adding event:', error);
        feedback.textContent = 'Error adding event. Please try again.';
        feedback.style.color = 'red';
        feedback.style.display = 'block';
    }
}

// Function to handle deleting an event
async function deleteEvent(id) {
    try {
        await axios.delete(`${API_URL}/${id}`);
        console.log(`Event with ID ${id} deleted.`);
        fetchEvents();
    } catch (error) {
        console.error(`Error deleting event with ID ${id}:`, error);
    }
}

// Function to populate the update form with event data
function populateUpdateForm(id, title, description, date, time, location) {
    document.getElementById('update-form').style.display = 'block';
    document.getElementById('update-id').value = id;
    document.getElementById('update-title').value = title;
    document.getElementById('update-description').value = description;
    document.getElementById('update-date').value = date;
    document.getElementById('update-time').value = time;
    document.getElementById('update-location').value = location;
}

// Function to handle updating an event
async function updateEvent(event) {
    event.preventDefault();

    const id = document.getElementById('update-id').value;
    const title = document.getElementById('update-title').value;
    const description = document.getElementById('update-description').value;
    const date = document.getElementById('update-date').value;
    const time = document.getElementById('update-time').value;
    const location = document.getElementById('update-location').value;

    const feedback = document.getElementById('update-feedback');

    if (!title || !date || !time || !location) {
        feedback.textContent = 'Please fill in all required fields.';
        feedback.style.display = 'block';
        return;
    }

    feedback.style.display = 'none';

    try {
        await axios.put(`${API_URL}/${id}`, { title, description, date, time, location });
        console.log(`Event with ID ${id} updated.`);
        document.getElementById('update-form').reset();
        document.getElementById('update-form').style.display = 'none';
        fetchEvents();

        feedback.textContent = 'Event updated successfully!';
        feedback.style.color = 'green';
        feedback.style.display = 'block';

        setTimeout(() => {
            feedback.style.display = 'none';
        }, 3000);
    } catch (error) {
        console.error(`Error updating event with ID ${id}:`, error);
        feedback.textContent = 'Error updating event. Please try again.';
        feedback.style.color = 'red';
        feedback.style.display = 'block';
    }
}

// Function to cancel updating an event
function cancelUpdate() {
    document.getElementById('update-form').reset();
    document.getElementById('update-form').style.display = 'none';
}

// Attach event listeners
document.getElementById('event-form').addEventListener('submit', addEvent);
document.getElementById('update-form').addEventListener('submit', updateEvent);

// Fetch events on page load
fetchEvents();
