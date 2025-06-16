// Simple test using Node.js built-in http module
const http = require('http');

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testAPI() {
  console.log('Testing API endpoints...\n');

  // Test 1: Check if server is running
  try {
    console.log('1. Testing server connection...');
    const result = await makeRequest('/categories/test');
    if (result.status === 200) {
      console.log('✅ Server is running:', result.data.message);
    } else {
      console.log('❌ Server responded with status:', result.status);
      return;
    }
  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
    console.log('Make sure the server is running on port 5000');
    return;
  }

  // Test 2: Get categories
  try {
    console.log('\n2. Testing GET /categories...');
    const result = await makeRequest('/categories');
    console.log('✅ Categories endpoint working:', result.data.success ? 'Success' : 'Failed');
    console.log('Categories count:', result.data.data?.length || 0);
    if (result.data.data && result.data.data.length > 0) {
      console.log('Sample category:', result.data.data[0].name);
    }
  } catch (error) {
    console.log('❌ Categories GET failed:', error.message);
  }

  // Test 3: Get inventory
  try {
    console.log('\n3. Testing GET /inventory...');
    const result = await makeRequest('/inventory');
    console.log('✅ Inventory endpoint working:', result.data.success ? 'Success' : 'Failed');
    console.log('Inventory count:', result.data.data?.items?.length || 0);
    if (result.data.data?.items && result.data.data.items.length > 0) {
      console.log('Sample item:', result.data.data.items[0].itemName);
    }
  } catch (error) {
    console.log('❌ Inventory GET failed:', error.message);
  }

  // Test 4: Create a test category
  try {
    console.log('\n4. Testing POST /categories...');
    const categoryData = {
      name: 'Test Category ' + Date.now(),
      description: 'Test category created by API test'
    };
    
    const result = await makeRequest('/categories', 'POST', categoryData);
    console.log('✅ Category creation:', result.data.success ? 'Success' : 'Failed');
    if (result.data.success) {
      console.log('Created category ID:', result.data.data._id);
      console.log('Created category name:', result.data.data.name);
    } else {
      console.log('Error:', result.data.message);
    }
  } catch (error) {
    console.log('❌ Category POST failed:', error.message);
  }

  // Test 5: Create a test inventory item
  try {
    console.log('\n5. Testing POST /inventory...');
    
    // First get categories
    const categoriesResult = await makeRequest('/categories');
    
    if (categoriesResult.data.success && categoriesResult.data.data.length > 0) {
      const categoryId = categoriesResult.data.data[0]._id;
      
      const inventoryData = {
        itemName: 'Test Item ' + Date.now(),
        itemCode: 'TEST' + Date.now(),
        qty: 5,
        category: categoryId,
        unit: 'Pieces',
        rate: 100
      };
      
      const result = await makeRequest('/inventory', 'POST', inventoryData);
      console.log('✅ Inventory creation:', result.data.success ? 'Success' : 'Failed');
      if (result.data.success) {
        console.log('Created item ID:', result.data.data._id);
        console.log('Created item name:', result.data.data.itemName);
        console.log('Total value:', result.data.data.total);
      } else {
        console.log('Error:', result.data.message);
      }
    } else {
      console.log('❌ No categories available for inventory test');
    }
  } catch (error) {
    console.log('❌ Inventory POST failed:', error.message);
  }

  console.log('\n🎉 API testing completed!');
  console.log('\nNow you can test the frontend by:');
  console.log('1. Opening the React app');
  console.log('2. Going to Add Category page');
  console.log('3. Adding a new category');
  console.log('4. Going to Add Stock page');
  console.log('5. Adding stock items');
  console.log('6. Viewing them in Stock Items List');
}

// Run the test
testAPI();
