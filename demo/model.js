const generator = require('@api-components/api-model-generator');

const files = new Map();
files.set('api/oauth2-api.raml', 'RAML 1.0');

generator(files)
.then(() => console.log('Finito'));
