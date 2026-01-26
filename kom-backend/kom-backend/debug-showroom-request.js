const axios = require('axios');

async function check() {
  try {
    console.log('Logging in...');
    const loginRes = await axios.post('http://localhost:3000/api/v1/auth/login', {
      email: 'admin@kom.bh',
      password: 'SuperAdmin123!'
    });

    const token = loginRes.data.data.accessToken;
    console.log('Logged in. Token received.');

    console.log('Fetching inactive showrooms...');
    const usersRes = await axios.get('http://localhost:3000/api/v1/admin/users', {
      params: {
        role: 'USER_SHOWROOM',
        isActive: false
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Response status:', usersRes.status);
    console.log('Total users found:', usersRes.data.meta?.total);
    console.log('Users data:', JSON.stringify(usersRes.data.data, null, 2));

  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

check();
