import axios from 'axios';

async function createVolume(volumeName: string) {
  try {
    await axios.post('http://localhost:2375/volumes/create', {
      Name: volumeName,
    });
    console.log(`Volume ${volumeName} created successfully`);
  } catch (error) {
    console.error('Error creating volume:', error);
  }
}

createVolume('volume-example');
