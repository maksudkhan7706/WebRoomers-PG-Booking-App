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
  try {
    const res = await fetch(baseUrl + endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `API Key ${authKey}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log('GET API Error:', error);
    throw error;
  }
};
