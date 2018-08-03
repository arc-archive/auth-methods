const AmfLoader = {};
AmfLoader.load = function(endpointIndex) {
  endpointIndex = endpointIndex || 0;
  const url = location.protocol + '//' + location.host +
    location.pathname.substr(0, location.pathname.lastIndexOf('/'))
    .replace('/test', '/demo') + '/oauth2-api.json';
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
      const ns = ApiElements.Amf.ns;
      data = data[0][ns.raml.vocabularies.document + 'encodes'][0];
      data = data[ns.raml.vocabularies.http + 'endpoint'][endpointIndex];
      data = data[ns.w3.hydra.core + 'supportedOperation'][0];
      data = data[ns.raml.vocabularies.security + 'security'][0];
      resolve(data);
    });
    xhr.addEventListener('error',
      () => reject(new Error('Unable to load model file')));
    xhr.open('GET', url);
    xhr.send();
  });
};
