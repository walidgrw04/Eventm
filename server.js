const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to the Event Planner API');
});

const db = new sqlite3.Database('./events.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');

        // Create events table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                date TEXT NOT NULL,
                time TEXT NOT NULL,
                location TEXT NOT NULL
            )
        `, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Events table ready.');
            }
        });
    }
});

app.get('/events-test', (req, res) => {
    db.all('SELECT * FROM events', [], (err, rows) => {
        if (err) {
            res.status(500).send('Error retrieving events.');
        } else {
            res.json(rows);
        }
    });
});

/**
 * @api {get} /events Fetch all events
 * @apiName GetEvents
 * @apiGroup Events
 * @apiSuccess {Object[]} events List of events.
 * @apiSuccess {Number} events.id Event ID.
 * @apiSuccess {String} events.title Event title.
 * @apiSuccess {String} events.description Event description.
 * @apiSuccess {String} events.date Event date.
 * @apiSuccess {String} events.time Event time.
 * @apiSuccess {String} events.location Event location.
 */


app.get('/events', (req, res) => {
    db.all('SELECT * FROM events', [], (err, rows) => {
        if (err) {
            res.status(500).send('Error retrieving events.');
        } else {
            res.json(rows);
        }
    });
});

/**
 * @api {post} /events Add a new event
 * @apiName AddEvent
 * @apiGroup Events
 * @apiBody {String} title Event title.
 * @apiBody {String} description Event description.
 * @apiBody {String} date Event date.
 * @apiBody {String} time Event time.
 * @apiBody {String} location Event location.
 * @apiSuccess {Number} id The ID of the created event.
 */


app.post('/events', (req, res) => {
    const { title, description, date, time, location } = req.body;

    if (!title || !date || !time || !location) {
        return res.status(400).send('Missing required fields.');
    }

    db.run(
        `INSERT INTO events (title, description, date, time, location) VALUES (?, ?, ?, ?, ?)`,
        [title, description, date, time, location],
        function (err) {
            if (err) {
                console.error('Error inserting event:', err.message);
                return res.status(500).send('Error creating event.');
            }
            res.status(201).json({ id: this.lastID });
        }
    );
});

/**
 * @api {put} /events/:id Update an event
 * @apiName UpdateEvent
 * @apiGroup Events
 * @apiParam {Number} id Event ID (in URL).
 * @apiBody {String} title Event title.
 * @apiBody {String} description Event description.
 * @apiBody {String} date Event date.
 * @apiBody {String} time Event time.
 * @apiBody {String} location Event location.
 * @apiSuccess {String} message Success message.
 */


app.put('/events/:id', (req, res) => {
    const { title, description, date, time, location } = req.body;
    const { id } = req.params;
    db.run(
        `UPDATE events SET title = ?, description = ?, date = ?, time = ?, location = ? WHERE id = ?`,
        [title, description, date, time, location, id],
        function (err) {
            if (err) {
                res.status(500).send('Error updating event.');
            } else if (this.changes === 0) {
                res.status(404).send('Event not found.');
            } else {
                res.send('Event updated successfully.');
            }
        }
    );
});

/**
 * @api {delete} /events/:id Delete an event
 * @apiName DeleteEvent
 * @apiGroup Events
 * @apiParam {Number} id Event ID.
 * @apiSuccess {String} message Success message.
 */

app.delete('/events/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM events WHERE id = ?`, [id], function (err) {
        if (err) {
            res.status(500).send('Error deleting event.');
        } else if (this.changes === 0) {
            res.status(404).send('Event not found.');
        } else {
            res.send('Event deleted successfully.');
        }
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
