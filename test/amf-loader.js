const AmfLoader = {};
AmfLoader.load = function(endpointIndex, compact) {
  endpointIndex = endpointIndex || 0;
  const file = '/oauth2-api' + (compact ? '-compact' : '') + '.json';
  const url = location.protocol + '//' + location.host +
    location.pathname.substr(0, location.pathname.lastIndexOf('/'))
    .replace('/test', '/demo') + file;
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
      const original = data;
      if (data instanceof Array) {
        data = data[0];
      }
      const encKey = compact ? 'doc:encodes' :
        ns.raml.vocabularies.document + 'encodes';
      let encodes = data[encKey];
      if (encodes instanceof Array) {
        encodes = encodes[0];
      }
      const endKey = compact ? 'raml-http:endpoint' :
        ns.raml.vocabularies.http + 'endpoint';
      let endpoints = encodes[endKey];
      if (endpoints && !(endpoints instanceof Array)) {
        endpoints = [endpoints];
      }
      const endpoint = endpoints[endpointIndex];
      const opKey = compact ? 'hydra:supportedOperation' :
        ns.w3.hydra.core + 'supportedOperation';
      let methods = endpoint[opKey];
      if (!(methods instanceof Array)) {
        methods = [methods];
      }
      const method = methods[0];
      const secKey = compact ? 'security:security' :
        ns.raml.vocabularies.security + 'security';
      let security = method[secKey];
      if (security instanceof Array) {
        security = security[0];
      }
      resolve([original, security]);
    });
    xhr.addEventListener('error',
      () => reject(new Error('Unable to load model file')));
    xhr.open('GET', url);
    xhr.send();
  });
};
