import { baseUrl, authKey } from './urlHelper';

export const postRequest = async (endpoint: string, body: any) => {
  const url = baseUrl + endpoint;
  console.log('POST API URL:', url);
  console.log('POST API Payload:', body);

  try {
    // Convert body to URLSearchParams
    const formBody = new URLSearchParams();
    Object.keys(body).forEach(key => formBody.append(key, body[key]));

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', //Postman style
        AuthKey: authKey, // exact key
      },
      body: formBody.toString(), // send as form-data
    });

    const data = await res.json();
    console.log('POST API Response:', data);
    return data;
  } catch (error) {
    console.log('POST API Error:', error);
    throw error;
  }
};

export const getRequest = async (endpoint: string) => {
  const url = baseUrl + endpoint;
  console.log('GET API URL:', url);

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        AuthKey: authKey, // ✅ same as Postman header
      },
    });

    // Try JSON parsing safely
    const text = await res.text();
    console.log('RAW RESPONSE:', text);

    try {
      const data = JSON.parse(text);
      console.log('GET API Parsed Response:', data);
      return data;
    } catch (jsonErr) {
      console.log('JSON parse error:', jsonErr);
      throw new Error('Invalid JSON from server');
    }
  } catch (error) {
    console.log('GET API Error:', error);
    throw error;
  }
};
