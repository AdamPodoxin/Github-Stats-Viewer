const getApiRequest = (path, callback) => {
  let xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const response = JSON.parse(xhr.responseText);
      callback(response);
    }
  };

  xhr.open("GET", `/api/${path}`, true);
  xhr.send();
};
