// proxy because of CORS issues
const proxy = 'https://cors-anywhere.herokuapp.com/';
// Obviously token would be an environment variable on an actual backend.
// Due to time constraints, I did not set up a backend.
const encryptedToken = 'RVpUSzU5YmRkMGYwMDU2YjQzNjFiYzlhYzgwMTYzOTk5M2Y2TkpaQXk0Y0tUbGFLY1NWTGh6NDRzUTo=';

export async function getAddressId(data) {
    let response = fetch(proxy + 'https://api.easypost.com/v2/addresses', {
        method: 'POST',
        crossDomain: 'True',
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + encryptedToken,
        }),
        body: JSON.stringify(data),
    });
    return response
}

export async function getParcelId(data) {
  let response = fetch(proxy + 'https://api.easypost.com/v2/parcels', {
      method: 'POST',
      crossDomain: 'True',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + encryptedToken,
      }),
      body: JSON.stringify(data),
  });
  return response
}

export async function getRates(data) {
  let response = fetch(proxy + 'https://api.easypost.com/v2/shipments', {
      method: 'POST',
      crossDomain: 'True',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + encryptedToken,
      }),
      body: JSON.stringify(data),
  });
  return response
}

export async function getLabel(rate, shipmentId) {
  let response = fetch(proxy + `https://api.easypost.com/v2/shipments/${shipmentId}/buy`, {
      method: 'POST',
      crossDomain: 'True',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + encryptedToken,
      }),
      body: JSON.stringify(rate),
  });
  return response
}
