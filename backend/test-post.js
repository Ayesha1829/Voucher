const http = require('http');

function testPurchaseReturn() {
  const data = {
    id: 'PR-test-' + Date.now(),
    date: '2024-01-01',
    numberOfEntries: 1,
    description: 'Test purchase return'
  };

  console.log('Sending data:', data);

  const postData = JSON.stringify(data);

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/purchase-returns',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log('Response status:', res.statusCode);

    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      try {
        const result = JSON.parse(responseData);
        console.log('Response data:', result);

        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log('✅ SUCCESS: Purchase return created!');
        } else {
          console.log('❌ ERROR: Failed to create purchase return');
        }
      } catch (error) {
        console.log('❌ ERROR parsing response:', error.message);
        console.log('Raw response:', responseData);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ ERROR:', error.message);
  });

  req.write(postData);
  req.end();
}

testPurchaseReturn();
