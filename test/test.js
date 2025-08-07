const http = require('http');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

function makeRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const jsonBody = body ? JSON.parse(body) : {};
                    resolve({ status: res.statusCode, data: jsonBody });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

async function runTests() {
    console.log('🧪 Running CommunityConnect Tests...\n');
    
    try {
        console.log('1. Testing GET /api/access-points');
        const accessPoints = await makeRequest('/api/access-points');
        assert.strictEqual(accessPoints.status, 200, 'Should return 200');
        assert(Array.isArray(accessPoints.data), 'Should return array');
        assert(accessPoints.data.length >= 3, 'Should have default access points');
        console.log('✅ GET /api/access-points works');

        console.log('\n2. Testing POST /api/access-points');
        const newPoint = {
            name: 'Test WiFi Point',
            latitude: 40.7580,
            longitude: -73.9855,
            description: 'Test description',
            contact: 'test@example.com',
            available_hours: '24/7',
            max_users: 3,
            internet_speed: '100 Mbps'
        };
        
        const createResponse = await makeRequest('/api/access-points', 'POST', newPoint);
        assert.strictEqual(createResponse.status, 200, 'Should create access point');
        assert.strictEqual(createResponse.data.name, newPoint.name, 'Should return created point');
        console.log('✅ POST /api/access-points works');

        console.log('\n3. Testing POST /api/bookings');
        const booking = {
            access_point_id: 1,
            user_name: 'Test User',
            user_contact: 'test@user.com',
            start_time: new Date(Date.now() + 60000).toISOString().slice(0, 19),
            end_time: new Date(Date.now() + 3600000).toISOString().slice(0, 19),
            purpose: 'Testing'
        };

        const bookingResponse = await makeRequest('/api/bookings', 'POST', booking);
        assert.strictEqual(bookingResponse.status, 200, 'Should create booking');
        assert.strictEqual(bookingResponse.data.user_name, booking.user_name, 'Should return created booking');
        console.log('✅ POST /api/bookings works');

        console.log('\n4. Testing GET /api/bookings');
        const bookings = await makeRequest('/api/bookings');
        assert.strictEqual(bookings.status, 200, 'Should return 200');
        assert(Array.isArray(bookings.data), 'Should return array');
        assert(bookings.data.length >= 1, 'Should have at least one booking');
        console.log('✅ GET /api/bookings works');

        console.log('\n5. Testing GET /api/stats');
        const stats = await makeRequest('/api/stats');
        assert.strictEqual(stats.status, 200, 'Should return 200');
        assert(typeof stats.data.total_access_points === 'number', 'Should have access points count');
        assert(typeof stats.data.active_bookings === 'number', 'Should have bookings count');
        assert(typeof stats.data.current_total_users === 'number', 'Should have users count');
        console.log('✅ GET /api/stats works');

        console.log('\n6. Testing invalid requests');
        const invalidPoint = await makeRequest('/api/access-points', 'POST', { name: 'No Coordinates' });
        assert.strictEqual(invalidPoint.status, 400, 'Should reject invalid access point');

        const invalidBooking = await makeRequest('/api/bookings', 'POST', { user_name: 'No Access Point' });
        assert.strictEqual(invalidBooking.status, 400, 'Should reject invalid booking');
        console.log('✅ Error handling works');

        console.log('\n🎉 All tests passed! CommunityConnect is working correctly.');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        process.exit(1);
    }
}

setTimeout(() => {
    runTests().catch(console.error);
}, 2000);