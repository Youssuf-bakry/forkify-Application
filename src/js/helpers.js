import { TIMEOUT_SEC } from './config';
// console.log(TIMEOUT_SEC);
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 3000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  const fetchPro = uploadData
    ? fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
      })
    : fetch(url);
  try {
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); //to make error if the connection is too slow
    // const res = await fetch('https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886');

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err; // rethrowing it to be able to handle int in ghe model (propagting it)
  }
};

// export const getJSON = async function (url) {

// export const sendJSON = async function (url, uploadData) {
//   try {
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); //to make error if the connection is too slow
//     // const res = await fetch('https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886');

//     const data = await res.json();
//     if (!res.ok) throw new Error(`${data.message} ${res.status}`);
//     return data;
//   } catch (err) {
//     throw err; // rethrowing it to be able to handle int in ghe model (propagting it)
//   }
// };
