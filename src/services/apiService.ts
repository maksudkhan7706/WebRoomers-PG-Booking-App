import { baseUrl, authKey } from './urlHelper';

export const postRequest = async (
  endpoint: string,
  body: any,
  isMultipart = false,
) => {
  const url = baseUrl + endpoint;
  console.log('POST API URL:', url);
  console.log('POST API Payload:', body);

  try {
    let options: any = {
      method: 'POST',
      headers: {
        AuthKey: authKey,
      },
    };

    if (isMultipart) {
      //Image upload (FormData)
      options.body = body; // Directly send FormData
    } else {
      //Normal x-www-form-urlencoded
      const formBody = new URLSearchParams();
      Object.keys(body).forEach(key => formBody.append(key, body[key]));
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      options.body = formBody.toString();
    }

    const res = await fetch(url, options);
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
        AuthKey: authKey, //same as Postman header
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
