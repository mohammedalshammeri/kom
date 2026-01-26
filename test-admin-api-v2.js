async function testApi() {
  try {
    console.log('Fetching...');
    const response = await fetch('http://localhost:3000/api/v1/admin/users?role=USER_SHOWROOM&isActive=false');
    console.log('Status:', response.status);
    
    if (response.ok) {
        const data = await response.json();
        console.log('Data:', JSON.stringify(data, null, 2));
    } else {
        const text = await response.text();
        console.log('Error Body:', text);
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
}

testApi();
