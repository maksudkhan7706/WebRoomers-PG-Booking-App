import { appLog } from '../utils/appLog';
import { baseUrl, authKey } from './urlHelper';

// export const postRequest = async (
//   endpoint: string,
//   body: any,
//   isMultipart = false,
// ) => {
//   const url = baseUrl + endpoint;
//   appLog('apiService', 'POST API URL:', url);
//   appLog('apiService', 'POST API Payload:', body);
//   try {
//     let headers: any = {
//       AuthKey: authKey,
//     };

//     let options: any = {
//       method: 'POST',
//       headers,
//     };

//     if (isMultipart) {
//       //Multipart request (FormData)
//       options.body = body;
//       // ❗ Don't set Content-Type manually
//       // fetch() will auto-set the boundary for FormData
//     } else {
//       //Normal x-www-form-urlencoded
//       const formBody = new URLSearchParams();
//       Object.keys(body).forEach(key => formBody.append(key, body[key]));
//       headers['Content-Type'] = 'application/x-www-form-urlencoded';
//       options.body = formBody.toString();
//     }

//     const res = await fetch(url, options);
//     const text = await res.text();
//     //Parse safely
//     const data = JSON.parse(text);
//     appLog('apiService', 'POST API Parsed Response:', data);
//     return data;
//   } catch (error) {
//     appLog('apiService', 'POST API Error', error);
//     throw error;
//   }
// };
export const postRequest = async (
  endpoint: string,
  body: any,
  isMultipart = false,
  isJson = false,
) => {
  const url = baseUrl + endpoint;
  appLog('apiService', 'POST API URL:', url);
  appLog('apiService', 'POST API Payload:', body);

  try {
    let headers: any = { AuthKey: authKey };
    let options: any = { method: 'POST', headers };

    if (isMultipart) {
      // Agar body already FormData hai, to direct use karo
      if (body instanceof FormData) {
        options.body = body;
      } else {
        const formData = new FormData();
        Object.keys(body).forEach(key => {
          const value = body[key];
          // null, undefined, ya empty skip kar do
          if (value === null || value === undefined) return;
          if (value && typeof value === 'object' && value.uri) {
            formData.append(key, value);
          } else {
            formData.append(key, value);
          }
        });
        options.body = formData;
      }
    } else if (isJson) {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    } else {
      const formBody = new URLSearchParams();
      Object.keys(body).forEach(key => {
        if (body[key] !== null && body[key] !== undefined)
          formBody.append(key, body[key]);
      });
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      options.body = formBody.toString();
    }

    const res = await fetch(url, options);
    const text = await res.text();
    const data = JSON.parse(text);
    appLog('apiService', 'POST API Parsed Response:', data);
    return data;
  } catch (error) {
    appLog('apiService', 'POST API Error', error);
    throw error;
  }
};

export const getRequest = async (endpoint: string) => {
  const url = baseUrl + endpoint;
  appLog('apiService', 'GET API URL', url);
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

    try {
      const data = JSON.parse(text);
      appLog('apiService', 'GET API Parsed Response', data);
      return data;
    } catch (jsonErr) {
      appLog('apiService', 'JSON parse error:', jsonErr);
      throw new Error('Invalid JSON from server');
    }
  } catch (error) {
    appLog('apiService', 'GET API Error:', error);
    throw error;
  }
};
