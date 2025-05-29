const http = require('http');

console.log('Registering admin user...');

const data = JSON.stringify({
  username: 'admin',
  password: 'adminpassword',
  name: 'Admin User',
  email: 'admin@example.com'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('Admin user registered successfully!');
      try {
        const parsedData = JSON.parse(responseData);
        console.log('Token:', parsedData.token);
        console.log('You can now log in with:');
        console.log('Username: admin');
        console.log('Password: adminpassword');
      } catch (e) {
        console.log('Could not parse response as JSON');
        console.log('Response:', responseData);
      }
    } else {
      console.log('Failed to register admin user');
      console.log('Response:', responseData);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
  console.log('Server might not be running or there might be a connection issue');
});

req.write(data);
req.end();
