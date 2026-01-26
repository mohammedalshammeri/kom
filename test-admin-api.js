const axios = require('axios');

async function testApi() {
  try {
    // Note: This requires a valid JWT token usually. 
    // But since I don't have one easily, I might hit 401. 
    // However, I can check if the logs show the request hitting the controller at least.
    
    // Actually, I can allow this endpoint to be Public temporarily if needed, 
    // but better to check if I can get a token or bypass.
    
    // For now, I'll just try to hit it and see what happens.
    // If 401, I'll assume the frontend has a token.
    
    const response = await axios.get('http://localhost:3000/api/v1/admin/users?role=USER_SHOWROOM&isActive=false');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
       console.log('Error Status:', error.response.status);
       console.log('Error Data:', error.response.data);
    } else {
       console.log('Error:', error.message);
    }
  }
}

testApi();
