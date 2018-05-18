const AmfLoader = {};
AmfLoader.load = function(endpointIndex) {
  endpointIndex = endpointIndex || 0;
  const url = location.protocol + '//' + location.host +
    location.pathname.substr(0, location.pathname.lastIndexOf('/'))
    .replace('/test', '/demo') + '/amf-model.json';
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (e) => {
      let data;
      try {
        data = JSON.parse(e.target.response);
      } catch (e) {
        reject(e);
        return;
      }
      data = data[0]['http://raml.org/vocabularies/document#encodes'][0];
      data = data['http://raml.org/vocabularies/http#endpoint'][endpointIndex];
      data = data['http://www.w3.org/ns/hydra/core#supportedOperation'][0];
      data = data['http://raml.org/vocabularies/security#security'][0];
      resolve(data);
    });
    xhr.addEventListener('error',
      () => reject(new Error('Unable to load model file')));
    xhr.open('GET', url);
    xhr.send();
  });
};
