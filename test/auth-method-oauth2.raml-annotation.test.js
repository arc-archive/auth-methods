import { fixture, assert, aTimeout, html } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import sinon from 'sinon/pkg/sinon-esm.js';
import '../auth-method-oauth2.js';

describe('<auth-method-oauth2>', function() {
  const clientId = '821776164331-rserncqpdsq32lmbf5cfeolgcoujb6fm.apps.googleusercontent.com';
  const authorizationUri = 'https://auth.com';
  const accessTokenUri = 'https://token.com';
  const clientSecret = 'test-secret';
  const redirectUri = 'https://redirect';
  const scopes = ['profile', 'email'];
  const username = 'test-username';
  const password = 'test-password';

  async function modelFixture(amf, security) {
    return (await fixture(html`<auth-method-oauth2
      granttype="annotated_custom_grant"
      .amf="${amf}"
      .amfSettings="${security}"
      .clientId="${clientId}"
      .username="${username}"
      .password="${password}"
      .redirectUri="${redirectUri}"
      .clientSecret="${clientSecret}"></auth-method-oauth2>`));
  }

  const apiFile = 'oauth2-api';

  function clearStorage() {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.indexOf('auth.methods.latest') === 0) {
        sessionStorage.removeItem(key);
      }
    });
    const factory = document.createElement('api-view-model-transformer');
    factory.clearCache();
  }

  describe('OAuth2 with raml annotation', () => {
    [
      ['AMF - full model', false],
      ['AMF - compact model', true]
    ].forEach(([label, compact]) => {
      describe(label, () => {
        describe('basic computations', () => {
          let amf;
          let element;
          before(async () => {
            amf = await AmfLoader.load(apiFile, compact);
          });

          beforeEach(async () => {
            clearStorage();
            const security = AmfLoader.lookupSecurity(amf, '/with-annotations', 'get');
            element = await modelFixture(amf, security);
            await aTimeout();
          });

          it('authQueryParameters is computed', function() {
            assert.typeOf(element._authQueryParameters, 'array');
            assert.lengthOf(element._authQueryParameters, 5);
          });

          it('tokenQueryParameters is computed', function() {
            assert.typeOf(element._tokenQueryParameters, 'array');
            assert.lengthOf(element._tokenQueryParameters, 2);
          });

          it('tokenHeaders is computed', function() {
            assert.typeOf(element._tokenHeaders, 'array');
            assert.lengthOf(element._tokenHeaders, 1);
          });

          it('tokenBody is computed', function() {
            assert.typeOf(element._tokenBody, 'array');
            assert.lengthOf(element._tokenBody, 2);
          });

          it('grantTypes is computed', function() {
            assert.lengthOf(element.grantTypes, 6, 'has all types');
            assert.equal(element.grantTypes[0].type, 'implicit');
            assert.equal(element.grantTypes[1].type, 'authorization_code');
            assert.equal(element.grantTypes[2].type, 'client_credentials');
            assert.equal(element.grantTypes[3].type, 'password');
            assert.equal(element.grantTypes[4].type, 'annotated_custom_grant');
            assert.equal(element.grantTypes[5].type, 'annotated_custom_grant2');
          });

          it('grantTypes Has labels', function() {
            assert.lengthOf(element.grantTypes, 6, 'has all types');
            assert.equal(element.grantTypes[0].label, 'Access token (browser flow)');
            assert.equal(element.grantTypes[1].label, 'Authorization code (server flow)');
            assert.equal(element.grantTypes[2].label, 'Client credentials');
            assert.equal(element.grantTypes[3].label, 'Password');
            assert.equal(element.grantTypes[4].type, 'annotated_custom_grant');
            assert.equal(element.grantTypes[5].type, 'annotated_custom_grant2');
          });
        });

        describe('form rendering ', () => {
          let amf;
          let element;
          before(async () => {
            amf = await AmfLoader.load(apiFile, compact);
          });

          beforeEach(async () => {
            clearStorage();
            const security = AmfLoader.lookupSecurity(amf, '/with-annotations', 'get');
            element = await modelFixture(amf, security);
            await aTimeout();
          });

          it('renders custom authorization query parameters', () => {
            const nodes = element.shadowRoot.querySelectorAll('[data-type="auth-query"]');
            assert.lengthOf(nodes, 6);
          });

          it('renders custom authorization token headers', () => {
            const nodes = element.shadowRoot.querySelectorAll('[data-type="token-headers"]');
            assert.lengthOf(nodes, 1);
          });

          it('renders custom authorization token query parameters', () => {
            const nodes = element.shadowRoot.querySelectorAll('[data-type="token-query"]');
            assert.lengthOf(nodes, 3);
          });

          it('renders custom authorization token body', () => {
            const nodes = element.shadowRoot.querySelectorAll('[data-type="token-body"]');
            assert.lengthOf(nodes, 2);
          });
        });

        describe('Updating UI values', () => {
          let amf;
          let element;
          const value = 'other-value';
          before(async () => {
            amf = await AmfLoader.load(apiFile, compact);
          });

          beforeEach(async () => {
            clearStorage();
            const security = AmfLoader.lookupSecurity(amf, '/with-annotations', 'get');
            element = await modelFixture(amf, security);
            await aTimeout();
          });

          it('updates custom auth query item', async () => {
            const input = element.shadowRoot.querySelector('[data-type="auth-query"]');
            input.value = value;
            const spy = sinon.stub();
            element.addEventListener('auth-settings-changed', spy);
            await aTimeout();
            await aTimeout();
            const result = spy.args[0][0].detail.settings;
            assert.equal(result.customData.auth.parameters[0].value, value);
          });

          it('updates custom auth query item', async () => {
            const input = element.shadowRoot.querySelector('[data-type="token-query"]');
            input.value = value;
            const spy = sinon.stub();
            element.addEventListener('auth-settings-changed', spy);
            await aTimeout();
            await aTimeout();
            const result = spy.args[0][0].detail.settings;
            assert.equal(result.customData.token.parameters[0].value, value);
          });

          it('updates custom auth header item', async () => {
            const input = element.shadowRoot.querySelector('[data-type="token-headers"]');
            input.value = value;
            const spy = sinon.stub();
            element.addEventListener('auth-settings-changed', spy);
            await aTimeout();
            await aTimeout();
            const result = spy.args[0][0].detail.settings;
            assert.equal(result.customData.token.headers[0].value, value);
          });

          it('updates custom auth body item', async () => {
            const input = element.shadowRoot.querySelectorAll('[data-type="token-body"]')[1];
            input.value = value;
            const spy = sinon.stub();
            element.addEventListener('auth-settings-changed', spy);
            await aTimeout();
            await aTimeout();
            const result = spy.args[0][0].detail.settings;
            assert.equal(result.customData.token.body[1].value, value);
          });
        });

        describe('getSettings()', () => {
          let amf;
          let element;
          before(async () => {
            amf = await AmfLoader.load(apiFile, compact);
          });

          beforeEach(async () => {
            clearStorage();
            const security = AmfLoader.lookupSecurity(amf, '/with-annotations', 'get');
            element = await modelFixture(amf, security);
            await aTimeout();
          });


          it('Returns an object', function() {
            const result = element.getSettings();
            assert.typeOf(result, 'object');
          });

          it('type is set', function() {
            const result = element.getSettings();
            assert.equal(result.type, 'annotated_custom_grant');
          });

          it('clientId is set', function() {
            const result = element.getSettings();
            assert.equal(result.clientId, clientId);
          });

          it('accessToken is set', function() {
            let result = element.getSettings();
            assert.equal(result.accessToken, '', 'Token value is empty');
            element.accessToken = 'test-token';
            result = element.getSettings();
            assert.equal(result.accessToken, element.accessToken, 'Token value is set');
          });

          it('authorizationUri is set', function() {
            const result = element.getSettings();
            assert.equal(result.authorizationUri, authorizationUri);
          });

          it('redirectUri is set', function() {
            const result = element.getSettings();
            assert.equal(result.redirectUri, redirectUri);
          });

          it('scopes is set', function() {
            const result = element.getSettings();
            assert.deepEqual(result.scopes, scopes);
          });

          it('clientSecret is set', function() {
            const result = element.getSettings();
            assert.equal(result.clientSecret, clientSecret);
          });

          it('accessTokenUri is set', function() {
            const result = element.getSettings();
            assert.equal(result.accessTokenUri, accessTokenUri);
          });

          it('username is set', function() {
            const result = element.getSettings();
            assert.equal(result.username, username);
          });

          it('password is set', function() {
            const result = element.getSettings();
            assert.equal(result.password, password);
          });

          it('Custom values are set when required', function() {
            const result = element.getSettings();
            assert.equal(result.customData.auth.parameters[0].name, 'resource');
            assert.equal(result.customData.auth.parameters[0].value, 'default');
          });

          it('Authorization query param is set', function() {
            const value = 'test-aq';
            element._authQueryParameters[0].value = value;
            const result = element.getSettings();
            assert.equal(result.customData.auth.parameters[0].value, value);
          });

          it('Custom value has name and value', function() {
            const value = 'test-aq';
            element._authQueryParameters[4].value = value;
            const result = element.getSettings();
            assert.equal(result.customData.auth.parameters[0].name, 'resource');
            assert.equal(result.customData.auth.parameters[0].value, value);
          });

          it('Custom values are not set when not required', function() {
            const result = element.getSettings();
            assert.isUndefined(result.customData.auth.headers);
          });

          it('Token query param is set', function() {
            const value = 'test-tq';
            element._tokenQueryParameters[0].value = value;
            const result = element.getSettings();
            assert.equal(result.customData.token.parameters[0].value, value);
          });

          it('Token header is set', function() {
            const value = 'test-th';
            element._tokenHeaders[0].value = value;
            const result = element.getSettings();
            assert.equal(result.customData.token.headers[0].value, value);
          });

          it('Token body is set', function() {
            const value = 'test-tb';
            element._tokenBody[0].value = value;
            const result = element.getSettings();
            assert.equal(result.customData.token.body[0].value, value);
          });
        });

        describe('a11y', () => {
          let amf;
          let element;
          before(async () => {
            amf = await AmfLoader.load(apiFile, compact);
          });

          beforeEach(async () => {
            clearStorage();
            const security = AmfLoader.lookupSecurity(amf, '/with-annotations', 'get');
            element = await modelFixture(amf, security);
            await aTimeout();
          });

          it('is accessible when with data', async () => {
            await assert.isAccessible(element);
          });
        });
      });
    });
  });
});
