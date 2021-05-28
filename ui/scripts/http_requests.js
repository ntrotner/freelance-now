export function GET(url, success, failed) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && (`${xhr.status}`.startsWith('2') || `${xhr.status}`.startsWith('3'))) {
      try {
        const json = JSON.parse(xhr.responseText);
        success(json);
      } catch {
        success(xhr.responseText);
      }
    } else if (xhr.readyState === 4 && (`${xhr.status}`.startsWith('4') || `${xhr.status}`.startsWith('5'))) {
      failed(xhr.response);
    }
  };
  xhr.send();
}

export function POST(url, reqHeader, payload, success, failed) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  reqHeader.forEach((header) => xhr.setRequestHeader(header.name, header.value));

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      try {
        const json = JSON.parse(xhr.responseText);
        success(json);
      } catch {
        success(xhr.responseText);
      }
    } else if (xhr.readyState === 4 && (`${xhr.status}`.startsWith('4') || `${xhr.status}`.startsWith('5'))) {
      failed(xhr.response);
    }
  };
  const sendData = JSON.stringify(payload);
  xhr.send(sendData);
}
