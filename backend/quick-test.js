const http = require('http');

console.log('🔍 Quick Backend Test Starting...\n');

// Test health endpoint
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('✅ Health Check Response:');
    console.log('Status Code:', res.statusCode);
    console.log('Response:', data);
    
    // Test categories endpoint
    testCategories();
  });
});

req.on('error', (error) => {
  console.log('❌ Health Check Failed:', error.message);
  console.log('Make sure server is running on port 5000');
});

req.end();

function testCategories() {
  console.log('\n🔍 Testing Categories Endpoint...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/categories',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('✅ Categories Response:');
      console.log('Status Code:', res.statusCode);
      try {
        const jsonData = JSON.parse(data);
        console.log('Success:', jsonData.success);
        console.log('Categories Count:', jsonData.data?.length || 0);
        if (jsonData.data && jsonData.data.length > 0) {
          console.log('First Category:', jsonData.data[0].name);
        }
      } catch (error) {
        console.log('Response:', data);
      }
      
      // Test inventory endpoint
      testInventory();
    });
  });

  req.on('error', (error) => {
    console.log('❌ Categories Test Failed:', error.message);
  });

  req.end();
}

function testInventory() {
  console.log('\n🔍 Testing Inventory Endpoint...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/inventory',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('✅ Inventory Response:');
      console.log('Status Code:', res.statusCode);
      try {
        const jsonData = JSON.parse(data);
        console.log('Success:', jsonData.success);
        console.log('Inventory Count:', jsonData.data?.items?.length || 0);
        if (jsonData.data?.items && jsonData.data.items.length > 0) {
          console.log('First Item:', jsonData.data.items[0].itemName);
        }
      } catch (error) {
        console.log('Response:', data);
      }
      
      console.log('\n🎉 Quick test completed!');
    });
  });

  req.on('error', (error) => {
    console.log('❌ Inventory Test Failed:', error.message);
  });

  req.end();
}
