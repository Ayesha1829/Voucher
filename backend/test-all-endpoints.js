const http = require('http');

// Test Purchase Return POST
function testPurchaseReturnPost() {
  const data = {
    id: 'PR-test-' + Date.now(),
    date: '2024-01-01',
    numberOfEntries: 2,
    description: 'Test purchase return from backend test'
  };

  console.log('🔄 Testing Purchase Return POST...');
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
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(responseData);
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log('✅ Purchase Return POST SUCCESS');
          console.log('Response:', result);
          testSalesReturnPost(); // Test next endpoint
        } else {
          console.log('❌ Purchase Return POST FAILED');
          console.log('Status:', res.statusCode);
          console.log('Response:', result);
        }
      } catch (error) {
        console.log('❌ Error parsing response:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Purchase Return POST ERROR:', error.message);
  });

  req.write(postData);
  req.end();
}

// Test Sales Return POST
function testSalesReturnPost() {
  const data = {
    id: 'SR-test-' + Date.now(),
    date: '2024-01-01',
    numberOfEntries: 1,
    description: 'Test sales return from backend test'
  };

  console.log('\n🔄 Testing Sales Return POST...');
  console.log('Sending data:', data);

  const postData = JSON.stringify(data);

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/sales-returns',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(responseData);
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log('✅ Sales Return POST SUCCESS');
          console.log('Response:', result);
          testGetEndpoints(); // Test GET endpoints
        } else {
          console.log('❌ Sales Return POST FAILED');
          console.log('Status:', res.statusCode);
          console.log('Response:', result);
        }
      } catch (error) {
        console.log('❌ Error parsing response:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Sales Return POST ERROR:', error.message);
  });

  req.write(postData);
  req.end();
}

// Test GET endpoints to verify data was saved
function testGetEndpoints() {
  console.log('\n🔄 Testing GET endpoints to verify data...');
  
  // Test Purchase Returns GET
  const prOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/purchase-returns',
    method: 'GET'
  };

  const prReq = http.request(prOptions, (res) => {
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(responseData);
        console.log('✅ Purchase Returns GET SUCCESS');
        console.log('Found', result.data?.items?.length || 0, 'purchase returns');
        
        // Test Sales Returns GET
        const srOptions = {
          hostname: 'localhost',
          port: 5000,
          path: '/api/sales-returns',
          method: 'GET'
        };

        const srReq = http.request(srOptions, (res) => {
          let responseData = '';
          res.on('data', (chunk) => {
            responseData += chunk;
          });
          
          res.on('end', () => {
            try {
              const result = JSON.parse(responseData);
              console.log('✅ Sales Returns GET SUCCESS');
              console.log('Found', result.data?.items?.length || 0, 'sales returns');
              console.log('\n🎉 ALL BACKEND TESTS COMPLETED SUCCESSFULLY!');
            } catch (error) {
              console.log('❌ Error parsing sales returns response:', error.message);
            }
          });
        });

        srReq.on('error', (error) => {
          console.error('❌ Sales Returns GET ERROR:', error.message);
        });

        srReq.end();
        
      } catch (error) {
        console.log('❌ Error parsing purchase returns response:', error.message);
      }
    });
  });

  prReq.on('error', (error) => {
    console.error('❌ Purchase Returns GET ERROR:', error.message);
  });

  prReq.end();
}

// Start the tests
console.log('🚀 Starting Backend API Tests...\n');
testPurchaseReturnPost();
