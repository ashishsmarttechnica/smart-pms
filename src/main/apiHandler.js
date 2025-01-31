import axios from 'axios';

// Function to add delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function handleAppClose() {
  try {
    console.log('Waiting for 10 seconds before making API call...');

    // Wait for 10 seconds before making the API call
    await delay(1); // 10000 milliseconds = 10 seconds

    // Replace with your actual API endpoint and payload
    const response = await axios.post('http://192.168.1.12:2911/api/v1/dummy/api', {
      data: { message: 'App is closing' }, // Replace with required payload
    });

    console.log('API call on app close successful:', response.data);
    return 'success';
  } catch (error) {
    console.error('Error making API call on app close:', error.message);
    return 'failure';
  }
}
