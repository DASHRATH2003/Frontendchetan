console.log('Testing server...');
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/gallery',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Server is running and responding!');
    try {
      const parsedData = JSON.parse(data);
      console.log(`Received ${parsedData.length} gallery items`);
    } catch (e) {
      console.log('Could not parse response as JSON');
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
  console.log('Server might not be running or there might be a connection issue');
});

req.end();
