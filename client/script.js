const API_URL = 'http://localhost:3000/events';

function toggleFullPageSpinner(show = true) {
    const spinner = document.getElementById('full-page-spinner');
    spinner.style.display = show ? 'flex' : 'none';
}

function showToast(message, isSuccess = true, duration = 5000) {
    const toastElement = document.getElementById('toast-feedback');
    toastElement.classList.toggle('text-bg-success', isSuccess);
    toastElement.classList.toggle('text-bg-danger', !isSuccess);
    toastElement.querySelector('.toast-body').textContent = message;

    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    // Automatically hide the toast after the specified duration
    setTimeout(() => toast.hide(), duration);
}

function applySearch() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const events = document.querySelectorAll('#events-list .card');
    let hasResults = false;

    events.forEach(eventCard => {
        const title = eventCard.querySelector('.card-title').textContent.toLowerCase();
        const description = eventCard.querySelector('.card-text').textContent.toLowerCase();
        const location = eventCard.querySelector('p:nth-child(5)').textContent.toLowerCase();

        if (title.includes(searchTerm) || description.includes(searchTerm) || location.includes(searchTerm)) {
            eventCard.style.display = 'block';
            hasResults = true;
        } else {
            eventCard.style.display = 'none';
        }
    });

    // Display "No Results" if nothing matches
    const eventsList = document.getElementById('events-list');
    if (!hasResults) {
        eventsList.innerHTML = '<p class="text-center text-danger">No matching events found.</p>';
    }
}

async function fetchEvents() {
    const eventsList = document.getElementById('events-list');
    toggleFullPageSpinner(true); // Show full-page spinner
    eventsList.innerHTML = '';

    try {
        const response = await axios.get(API_URL);
        console.log('Fetched Events:', response.data);

        const events = response.data.data;
        if (events.length > 0) {
            eventsList.innerHTML = events.map(event => generateEventCard(event)).join('');
        } else {
            eventsList.innerHTML = '<p class="text-center">No events found.</p>';
        }
    } catch (error) {
        console.error('Error fetching events:', error);
        eventsList.innerHTML = '<p class="text-danger text-center">Error loading events. Please try again later.</p>';
    } finally {
        toggleFullPageSpinner(false); // Hide full-page spinner
    }
}

function generateEventCard(event) {
    return `
        <div class="col-md-4">
            <div class="card shadow-sm border-0">
                <div class="card-body">
                    <h5 class="card-title">${event.title}</h5>
                    <p class="card-text">${event.description || 'No description available.'}</p>
                    <p><strong>Date:</strong> ${event.date}</p>
                    <p><strong>Time:</strong> ${event.time}</p>
                    <p><strong>Location:</strong> ${event.location}</p>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-outline-primary btn-sm" onclick="populateUpdateForm(${event.id}, '${event.title}', '${event.description}', '${event.date}', '${event.time}', '${event.location}')">Edit</button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteEvent(${event.id})">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function addEvent(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const location = document.getElementById('location').value;
    if (!title || !date || !time || !location) {
        showToast('Please fill in all required fields.', false);
        return;
    }
    try {
        await axios.post(API_URL, { title, description, date, time, location });
        document.getElementById('event-form').reset();
        fetchEvents(); // This refreshes the event list
        showToast('Event added successfully!', true);
    } catch (error) {
        console.error('Error adding event:', error);
        showToast('Error adding event. Please try again.', false);
    }
}


async function deleteEvent(id) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
        await axios.delete(`${API_URL}/${id}`);
        fetchEvents();
        showToast('Event deleted successfully!', true);
    } catch (error) {
        console.error(`Error deleting event with ID ${id}:`, error);
        showToast('Error deleting event. Please try again.', false);
    }
}

function populateUpdateForm(id, title, description, date, time, location) {
    document.getElementById('update-form').style.display = 'block';
    document.getElementById('update-id').value = id;
    document.getElementById('update-title').value = title;
    document.getElementById('update-description').value = description;
    document.getElementById('update-date').value = date;
    document.getElementById('update-time').value = time;
    document.getElementById('update-location').value = location;
}

async function updateEvent(event) {
    event.preventDefault();
    const id = document.getElementById('update-id').value;
    const title = document.getElementById('update-title').value;
    const description = document.getElementById('update-description').value;
    const date = document.getElementById('update-date').value;
    const time = document.getElementById('update-time').value;
    const location = document.getElementById('update-location').value;

    if (!title || !date || !time || !location) {
        showToast('Please fill in all required fields.', false);
        return;
    }

    if (!confirm('Are you sure you want to update this event?')) return;

    try {
        await axios.put(`${API_URL}/${id}`, { title, description, date, time, location });
        document.getElementById('update-form').reset();
        document.getElementById('update-form').style.display = 'none';
        fetchEvents();
        showToast('Event updated successfully!', true);
    } catch (error) {
        console.error(`Error updating event with ID ${id}:`, error);
        showToast('Error updating event. Please try again.', false);
    }
}

function cancelUpdate() {
    document.getElementById('update-form').reset();
    document.getElementById('update-form').style.display = 'none';
}

let currentPage = 1;
const itemsPerPage = 6;

function paginateEvents(events) {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return events.slice(start, end);
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = 'btn btn-outline-primary mx-1';
        pageButton.textContent = i;
        pageButton.onclick = () => {
            currentPage = i;
            fetchEvents();
        };
        pagination.appendChild(pageButton);
    }
}

document.getElementById('event-form').addEventListener('submit', addEvent);
document.getElementById('update-form').addEventListener('submit', updateEvent);
document.getElementById('search-bar').addEventListener('input', applySearch);

fetchEvents();
