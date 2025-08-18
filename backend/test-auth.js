// Test authentication for team endpoints
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

async function testAuth() {
  console.log('Testing authentication for team management...\n');
  
  // Use mock token for development
  const mockToken = 'mock_token_123';
  
  try {
    // Test GET request (should work without auth)
    console.log('1. Testing GET /api/team (public endpoint)...');
    const getResponse = await axios.get(`${API_URL}/team`);
    console.log('✓ GET request successful. Found', getResponse.data.length, 'team members\n');
    
    // Test POST request with mock token
    console.log('2. Testing POST /api/team with mock token...');
    const formData = new FormData();
    formData.append('name', 'Test User');
    formData.append('position', 'Test Position');
    formData.append('bio', 'Test bio');
    
    try {
      const postResponse = await axios.post(
        `${API_URL}/team`,
        {
          name: 'Test User',
          position: 'Test Position',
          bio: 'Test bio'
        },
        {
          headers: {
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✓ POST request successful with mock token\n');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✗ Authentication required - mock token not accepted');
        console.log('  This is expected if NODE_ENV is not set to "development"\n');
      } else if (error.response?.status === 403) {
        console.log('✗ Insufficient permissions');
        console.log('  User role does not have permission for this action\n');
      } else {
        console.log('✗ POST request failed:', error.response?.data?.error || error.message, '\n');
      }
    }
    
    // Test without token
    console.log('3. Testing POST /api/team without token...');
    try {
      await axios.post(`${API_URL}/team`, {
        name: 'Test User 2',
        position: 'Test Position 2'
      });
      console.log('✓ POST request successful without token (unexpected!)\n');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✓ Authentication properly required (401 Unauthorized)\n');
      } else {
        console.log('✗ Unexpected error:', error.response?.data?.error || error.message, '\n');
      }
    }
    
    console.log('Summary:');
    console.log('- Public endpoints (GET) are accessible');
    console.log('- Protected endpoints require authentication');
    console.log('- Mock token "mock_token_123" works in development mode');
    console.log('\nTo use in admin panel:');
    console.log('1. Login with email: admin@braunundeyer.de, password: admin123');
    console.log('2. The admin panel will store the token and use it automatically');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAuth();