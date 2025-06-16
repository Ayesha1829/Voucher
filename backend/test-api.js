// Simple test script to check API endpoints
const API_BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('Testing API endpoints...\n');

  // Test 1: Check if server is running
  try {
    console.log('1. Testing server connection...');
    const response = await fetch(`${API_BASE_URL}/categories/test`);
    const data = await response.json();
    console.log('✅ Server is running:', data.message);
  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
    return;
  }

  // Test 2: Get categories
  try {
    console.log('\n2. Testing GET /categories...');
    const response = await fetch(`${API_BASE_URL}/categories`);
    const data = await response.json();
    console.log('✅ Categories endpoint working:', data.success ? 'Success' : 'Failed');
    console.log('Categories count:', data.data?.length || 0);
    if (data.data && data.data.length > 0) {
      console.log('Sample category:', data.data[0].name);
    }
  } catch (error) {
    console.log('❌ Categories GET failed:', error.message);
  }

  // Test 3: Get inventory
  try {
    console.log('\n3. Testing GET /inventory...');
    const response = await fetch(`${API_BASE_URL}/inventory`);
    const data = await response.json();
    console.log('✅ Inventory endpoint working:', data.success ? 'Success' : 'Failed');
    console.log('Inventory count:', data.data?.items?.length || data.data?.length || 0);
    if (data.data?.items && data.data.items.length > 0) {
      console.log('Sample item:', data.data.items[0].itemName);
    }
  } catch (error) {
    console.log('❌ Inventory GET failed:', error.message);
  }

  // Test 4: Create a test category
  try {
    console.log('\n4. Testing POST /categories...');
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Category ' + Date.now(),
        description: 'Test category created by API test'
      })
    });
    const data = await response.json();
    console.log('✅ Category creation:', data.success ? 'Success' : 'Failed');
    if (data.success) {
      console.log('Created category ID:', data.data._id);
      console.log('Created category name:', data.data.name);
    } else {
      console.log('Error:', data.message);
    }
  } catch (error) {
    console.log('❌ Category POST failed:', error.message);
  }

  // Test 5: Create a test inventory item
  try {
    console.log('\n5. Testing POST /inventory...');
    
    // First get a category ID
    const categoriesResponse = await fetch(`${API_BASE_URL}/categories`);
    const categoriesData = await categoriesResponse.json();
    
    if (categoriesData.success && categoriesData.data.length > 0) {
      const categoryId = categoriesData.data[0]._id;
      
      const response = await fetch(`${API_BASE_URL}/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemName: 'Test Item ' + Date.now(),
          itemCode: 'TEST' + Date.now(),
          qty: 5,
          category: categoryId,
          unit: 'Pieces',
          rate: 100
        })
      });
      
      const data = await response.json();
      console.log('✅ Inventory creation:', data.success ? 'Success' : 'Failed');
      if (data.success) {
        console.log('Created item ID:', data.data._id);
        console.log('Created item name:', data.data.itemName);
        console.log('Total value:', data.data.total);
      } else {
        console.log('Error:', data.message);
      }
    } else {
      console.log('❌ No categories available for inventory test');
    }
  } catch (error) {
    console.log('❌ Inventory POST failed:', error.message);
  }

  console.log('\n🎉 API testing completed!');
}

// Run the test
testAPI();
