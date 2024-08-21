import axios from 'axios';

async function pullImage(image: string) {
  try {
    await axios.post(
      'http://localhost:2375/images/create',
      {},
      {
        params: { fromImage: image },
      }
    );
    console.log(`Image ${image} pulled successfully`);
  } catch (error) {
    console.error('Error pulling image:', error);
  }
}

pullImage('nginx');
