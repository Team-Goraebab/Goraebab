import axios from 'axios';

async function createNetwork(networkName: string) {
  try {
    await axios.post('http://localhost:2375/networks/create', {
      Name: networkName,
    });
    console.log(`Network ${networkName} created successfully`);
  } catch (error) {
    console.error('Error creating network:', error);
  }
}

createNetwork('network-example');
