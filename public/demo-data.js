// Demo data for static version
window.DEMO_DATA = {
    accessPoints: [
        {
            id: 1,
            name: 'Community Library WiFi',
            latitude: 40.7128,
            longitude: -74.0060,
            description: 'Free WiFi available during library hours',
            contact: 'library@community.org',
            available_hours: '9 AM - 8 PM',
            max_users: 5,
            current_users: 0,
            internet_speed: '50 Mbps',
            active: 1
        },
        {
            id: 2,
            name: 'Coffee Shop Hotspot',
            latitude: 40.7589,
            longitude: -73.9851,
            description: 'Purchase required for WiFi access',
            contact: 'coffee@shop.com',
            available_hours: '6 AM - 10 PM',
            max_users: 8,
            current_users: 2,
            internet_speed: '25 Mbps',
            active: 1
        },
        {
            id: 3,
            name: 'Community Center',
            latitude: 40.7411,
            longitude: -73.9897,
            description: 'Free access for community members',
            contact: 'center@community.org',
            available_hours: '8 AM - 6 PM',
            max_users: 10,
            current_users: 5,
            internet_speed: '100 Mbps',
            active: 1
        }
    ],
    bookings: [
        {
            id: 1,
            access_point_id: 1,
            access_point_name: 'Community Library WiFi',
            user_name: 'Sarah Johnson',
            user_contact: 'sarah@email.com',
            start_time: new Date(Date.now() + 3600000).toISOString(),
            end_time: new Date(Date.now() + 7200000).toISOString(),
            purpose: 'Remote work session'
        }
    ]
};