const amf = require('amf-client-js');
const fs = require('fs');

amf.plugins.document.WebApi.register();
amf.plugins.document.Vocabularies.register();
amf.plugins.features.AMFValidation.register();

const dataPath = 'demo/oauth2-api.raml';
amf.Core.init().then(() => {
  const ramlParser = amf.Core.parser('RAML 1.0', 'application/yaml');
  const jsonLdParser = amf.Core.generator('AMF Graph', 'application/ld+json');
  ramlParser.parseFileAsync(`file://${dataPath}`)
  .then((doc) => {
    const r = amf.Core.resolver('RAML 1.0');
    doc = r.resolve(doc);
    return jsonLdParser.generateString(doc);
  })
  .then((data) => fs.writeFile(`./demo/amf-model.json`,
    JSON.stringify(JSON.parse(data)), 'utf8'))
  .then(() => console.log('Data saved'))
  .catch((cause) => {
    console.error(cause);
  });
});
