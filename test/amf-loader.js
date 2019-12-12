
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import { LitElement } from 'lit-element';

export const AmfLoader = {};

class HelperElement extends AmfHelperMixin(LitElement) {}
window.customElements.define('helper-element', HelperElement);

const helper = new HelperElement();

AmfLoader.load = async function(fileName, compact) {
  compact = compact ? '-compact' : '';
  const file = `${fileName}${compact}.json`;
  const url = location.protocol + '//' + location.host + '/base/demo/' + file;
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
      resolve(data);
    });
    xhr.addEventListener('error',
        () => reject(new Error('Unable to load model file')));
    xhr.open('GET', url);
    xhr.send();
  });
};

AmfLoader.lookupOperation = function(model, endpoint, operation) {
  helper.amf = model;
  const webApi = helper._computeWebApi(model);
  const endPoint = helper._computeEndpointByPath(webApi, endpoint);
  const opKey = helper._getAmfKey(helper.ns.aml.vocabularies.apiContract.supportedOperation);
  const ops = helper._ensureArray(endPoint[opKey]);
  return ops.find((item) => helper._getValue(item, helper.ns.aml.vocabularies.apiContract.method) === operation);
};

AmfLoader.lookupSecurity = function(model, endpoint, operation) {
  helper.amf = model;
  const method = AmfLoader.lookupOperation(model, endpoint, operation);
  const secKey = helper._getAmfKey(helper.ns.aml.vocabularies.security.security);
  const schemesKey = helper._getAmfKey(helper.ns.aml.vocabularies.security.schemes);
  let security = method[secKey];
  if (security instanceof Array) {
    security = security[0];
  }
  security = security[schemesKey];
  if (security instanceof Array) {
    security = security[0];
  }
  return security;
};
