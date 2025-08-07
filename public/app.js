class CommunityConnect {
    constructor() {
        this.map = null;
        this.markers = [];
        this.accessPoints = [];
        this.bookings = [];
        
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupMap();
        this.setupForms();
        this.loadData();
        this.setupServiceWorker();
        
        setInterval(() => this.loadStats(), 30000);
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.tab');
        const sections = document.querySelectorAll('.section');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetSection = tab.id.replace('-tab', '-section');
                
                tabs.forEach(t => t.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));
                
                tab.classList.add('active');
                document.getElementById(targetSection).classList.add('active');
                
                if (targetSection === 'map-section') {
                    setTimeout(() => this.map.invalidateSize(), 100);
                }
            });
        });
    }

    setupMap() {
        this.map = L.map('map').setView([40.7128, -74.0060], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        document.getElementById('refresh-map').addEventListener('click', () => {
            this.loadAccessPoints();
        });

        document.getElementById('locate-me').addEventListener('click', () => {
            this.locateUser();
        });
    }

    setupForms() {
        document.getElementById('add-form').addEventListener('submit', (e) => {
            this.handleAddAccessPoint(e);
        });

        document.getElementById('book-form').addEventListener('submit', (e) => {
            this.handleBookAccess(e);
        });

        document.getElementById('get-location').addEventListener('click', () => {
            this.getCurrentLocation();
        });

        this.setDefaultDateTime();
    }

    setDefaultDateTime() {
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
        
        document.getElementById('start-time').value = this.formatDateTime(now);
        document.getElementById('end-time').value = this.formatDateTime(oneHourLater);
    }

    formatDateTime(date) {
        return date.toISOString().slice(0, 16);
    }

    async loadData() {
        try {
            await Promise.all([
                this.loadAccessPoints(),
                this.loadBookings(),
                this.loadStats()
            ]);
        } catch (error) {
            this.showNotification('Failed to load data', 'error');
        }
    }

    async loadAccessPoints() {
        try {
            if (window.DEMO_DATA) {
                this.accessPoints = window.DEMO_DATA.accessPoints;
                this.updateMap();
                this.updateAccessPointSelect();
                return;
            }
            const response = await fetch('/api/access-points');
            this.accessPoints = await response.json();
            this.updateMap();
            this.updateAccessPointSelect();
        } catch (error) {
            if (window.DEMO_DATA) {
                this.accessPoints = window.DEMO_DATA.accessPoints;
                this.updateMap();
                this.updateAccessPointSelect();
            } else {
                this.showNotification('Failed to load access points', 'error');
            }
        }
    }

    async loadBookings() {
        try {
            if (window.DEMO_DATA) {
                this.bookings = window.DEMO_DATA.bookings;
                this.updateBookingsList();
                return;
            }
            const response = await fetch('/api/bookings');
            this.bookings = await response.json();
            this.updateBookingsList();
        } catch (error) {
            if (window.DEMO_DATA) {
                this.bookings = window.DEMO_DATA.bookings;
                this.updateBookingsList();
            } else {
                this.showNotification('Failed to load bookings', 'error');
            }
        }
    }

    async loadStats() {
        try {
            if (window.DEMO_DATA) {
                const stats = {
                    total_access_points: this.accessPoints.length,
                    current_total_users: this.accessPoints.reduce((sum, point) => sum + point.current_users, 0),
                    active_bookings: this.bookings.length
                };
                
                document.getElementById('stats-points').textContent = 
                    `${stats.total_access_points} Access Points`;
                document.getElementById('stats-users').textContent = 
                    `${stats.current_total_users} Active Users`;
                document.getElementById('stats-bookings').textContent = 
                    `${stats.active_bookings} Active Bookings`;
                return;
            }
            
            const response = await fetch('/api/stats');
            const stats = await response.json();
            
            document.getElementById('stats-points').textContent = 
                `${stats.total_access_points} Access Points`;
            document.getElementById('stats-users').textContent = 
                `${stats.current_total_users} Active Users`;
            document.getElementById('stats-bookings').textContent = 
                `${stats.active_bookings} Active Bookings`;
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    }

    updateMap() {
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];

        this.accessPoints.forEach(point => {
            const status = this.getAccessPointStatus(point);
            const icon = this.createMarkerIcon(status);
            
            const marker = L.marker([point.latitude, point.longitude], { icon })
                .addTo(this.map);
            
            const popupContent = this.createPopupContent(point, status);
            marker.bindPopup(popupContent);
            
            this.markers.push(marker);
        });
    }

    getAccessPointStatus(point) {
        if (point.current_users >= point.max_users) return 'full';
        if (point.current_users > 0) return 'busy';
        return 'available';
    }

    createMarkerIcon(status) {
        const colors = {
            available: '#4CAF50',
            busy: '#ff9800',
            full: '#f44336'
        };

        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${colors[status]}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
    }

    createPopupContent(point, status) {
        const statusText = status.charAt(0).toUpperCase() + status.slice(1);
        return `
            <div class="popup-content">
                <h3>${point.name}</h3>
                <p><strong>Status:</strong> <span class="status ${status}">${statusText}</span></p>
                <p><strong>Users:</strong> ${point.current_users}/${point.max_users}</p>
                ${point.description ? `<p>${point.description}</p>` : ''}
                ${point.available_hours ? `<p><strong>Hours:</strong> ${point.available_hours}</p>` : ''}
                ${point.internet_speed ? `<p><strong>Speed:</strong> ${point.internet_speed}</p>` : ''}
                ${point.contact ? `<p><strong>Contact:</strong> ${point.contact}</p>` : ''}
            </div>
        `;
    }

    updateAccessPointSelect() {
        const select = document.getElementById('access-point');
        select.innerHTML = '<option value="">Select Access Point</option>';
        
        this.accessPoints.forEach(point => {
            if (point.current_users < point.max_users) {
                const option = document.createElement('option');
                option.value = point.id;
                option.textContent = `${point.name} (${point.current_users}/${point.max_users} users)`;
                select.appendChild(option);
            }
        });
    }

    updateBookingsList() {
        const container = document.getElementById('bookings-list');
        
        if (this.bookings.length === 0) {
            container.innerHTML = '<p class="loading">No active bookings found</p>';
            return;
        }

        container.innerHTML = this.bookings.map(booking => `
            <div class="booking-card">
                <h3>${booking.access_point_name}</h3>
                <p><strong>User:</strong> ${booking.user_name}</p>
                <p class="booking-time">
                    ${new Date(booking.start_time).toLocaleString()} - 
                    ${new Date(booking.end_time).toLocaleString()}
                </p>
                ${booking.purpose ? `<p><strong>Purpose:</strong> ${booking.purpose}</p>` : ''}
                ${booking.user_contact ? `<p><strong>Contact:</strong> ${booking.user_contact}</p>` : ''}
            </div>
        `).join('');
    }

    async handleAddAccessPoint(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            latitude: parseFloat(document.getElementById('latitude').value),
            longitude: parseFloat(document.getElementById('longitude').value),
            description: document.getElementById('description').value,
            contact: document.getElementById('contact').value,
            available_hours: document.getElementById('hours').value,
            max_users: parseInt(document.getElementById('max-users').value) || 5,
            internet_speed: document.getElementById('speed').value
        };

        try {
            const response = await fetch('/api/access-points', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                this.showNotification('Access point added successfully!', 'success');
                document.getElementById('add-form').reset();
                this.loadAccessPoints();
            } else {
                const error = await response.json();
                this.showNotification(`Error: ${error.error}`, 'error');
            }
        } catch (error) {
            this.showNotification('Failed to add access point', 'error');
        }
    }

    async handleBookAccess(e) {
        e.preventDefault();
        
        const formData = {
            access_point_id: parseInt(document.getElementById('access-point').value),
            user_name: document.getElementById('user-name').value,
            user_contact: document.getElementById('user-contact').value,
            start_time: document.getElementById('start-time').value,
            end_time: document.getElementById('end-time').value,
            purpose: document.getElementById('purpose').value
        };

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                this.showNotification('Access booked successfully!', 'success');
                document.getElementById('book-form').reset();
                this.setDefaultDateTime();
                await this.loadData();
            } else {
                const error = await response.json();
                this.showNotification(`Error: ${error.error}`, 'error');
            }
        } catch (error) {
            this.showNotification('Failed to book access', 'error');
        }
    }

    locateUser() {
        if (!navigator.geolocation) {
            this.showNotification('Geolocation not supported', 'error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                this.map.setView([latitude, longitude], 15);
                
                L.marker([latitude, longitude])
                    .addTo(this.map)
                    .bindPopup('You are here!')
                    .openPopup();
            },
            () => {
                this.showNotification('Unable to get your location', 'error');
            }
        );
    }

    getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showNotification('Geolocation not supported', 'error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                document.getElementById('latitude').value = position.coords.latitude.toFixed(6);
                document.getElementById('longitude').value = position.coords.longitude.toFixed(6);
                this.showNotification('Location obtained!', 'success');
            },
            () => {
                this.showNotification('Unable to get your location', 'error');
            }
        );
    }

    showNotification(message, type) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 4000);
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(() => console.log('Service Worker registered'))
                .catch(() => console.log('Service Worker registration failed'));
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CommunityConnect();
});