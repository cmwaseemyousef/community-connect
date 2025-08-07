const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('community.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS access_points (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        description TEXT,
        contact TEXT,
        available_hours TEXT,
        max_users INTEGER DEFAULT 5,
        current_users INTEGER DEFAULT 0,
        internet_speed TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        active INTEGER DEFAULT 1
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        access_point_id INTEGER,
        user_name TEXT NOT NULL,
        user_contact TEXT,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        purpose TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (access_point_id) REFERENCES access_points (id)
    )`);

    db.run(`INSERT OR IGNORE INTO access_points 
            (id, name, latitude, longitude, description, contact, available_hours, internet_speed) 
            VALUES 
            (1, 'Community Library WiFi', 40.7128, -74.0060, 'Free WiFi available during library hours', 'library@community.org', '9 AM - 8 PM', '50 Mbps'),
            (2, 'Coffee Shop Hotspot', 40.7589, -73.9851, 'Purchase required for WiFi access', 'coffee@shop.com', '6 AM - 10 PM', '25 Mbps'),
            (3, 'Community Center', 40.7411, -73.9897, 'Free access for community members', 'center@community.org', '8 AM - 6 PM', '100 Mbps')`);
});

app.get('/api/access-points', (req, res) => {
    db.all('SELECT * FROM access_points WHERE active = 1', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/access-points', (req, res) => {
    const { name, latitude, longitude, description, contact, available_hours, max_users, internet_speed } = req.body;
    
    if (!name || !latitude || !longitude) {
        res.status(400).json({ error: 'Name, latitude, and longitude are required' });
        return;
    }

    db.run(
        `INSERT INTO access_points (name, latitude, longitude, description, contact, available_hours, max_users, internet_speed) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, latitude, longitude, description, contact, available_hours, max_users || 5, internet_speed],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ 
                id: this.lastID,
                name,
                latitude,
                longitude,
                description,
                contact,
                available_hours,
                max_users: max_users || 5,
                internet_speed
            });
        }
    );
});

app.get('/api/bookings', (req, res) => {
    const query = `
        SELECT b.*, ap.name as access_point_name 
        FROM bookings b 
        JOIN access_points ap ON b.access_point_id = ap.id 
        WHERE b.end_time > datetime('now')
        ORDER BY b.start_time ASC
    `;
    
    db.all(query, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/bookings', (req, res) => {
    const { access_point_id, user_name, user_contact, start_time, end_time, purpose } = req.body;
    
    if (!access_point_id || !user_name || !start_time || !end_time) {
        res.status(400).json({ error: 'Access point ID, user name, start time, and end time are required' });
        return;
    }

    db.get(
        'SELECT current_users, max_users FROM access_points WHERE id = ?',
        [access_point_id],
        (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            if (!row) {
                res.status(404).json({ error: 'Access point not found' });
                return;
            }

            if (row.current_users >= row.max_users) {
                res.status(400).json({ error: 'Access point is at capacity' });
                return;
            }

            db.run(
                `INSERT INTO bookings (access_point_id, user_name, user_contact, start_time, end_time, purpose) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [access_point_id, user_name, user_contact, start_time, end_time, purpose],
                function(err) {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }

                    db.run(
                        'UPDATE access_points SET current_users = current_users + 1 WHERE id = ?',
                        [access_point_id]
                    );

                    res.json({ 
                        id: this.lastID,
                        access_point_id,
                        user_name,
                        user_contact,
                        start_time,
                        end_time,
                        purpose
                    });
                }
            );
        }
    );
});

app.get('/api/stats', (req, res) => {
    const stats = {};
    
    db.get('SELECT COUNT(*) as total FROM access_points WHERE active = 1', (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        stats.total_access_points = row.total;
        
        db.get('SELECT COUNT(*) as total FROM bookings WHERE end_time > datetime("now")', (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            stats.active_bookings = row.total;
            
            db.get('SELECT SUM(current_users) as total FROM access_points WHERE active = 1', (err, row) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                stats.current_total_users = row.total || 0;
                
                res.json(stats);
            });
        });
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`CommunityConnect server running on port ${PORT}`);
    console.log(`Access the app at http://localhost:${PORT}`);
});