const getApiRequest = (path, callback) => {
  let xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      try {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      } catch (err) {
        console.error(err);
        console.log(xhr.responseText);
      }
    }
  };

  xhr.open("GET", `/api/${path}`, true);
  xhr.send();
};
