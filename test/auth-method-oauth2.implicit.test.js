import { fixture, assert, aTimeout, html, nextFrame } from '@open-wc/testing';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import { AmfLoader } from './amf-loader.js';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import '../auth-method-oauth2.js';

describe('<auth-method-oauth2>', function() {
  async function implicitFixture() {
    return (await fixture(`<auth-method-oauth2 granttype="implicit"></auth-method-oauth2>`));
  }

  async function dataFixture() {
    const clientId = '821776164331-rserncqpdsq32lmbf5cfeolgcoujb6fm.apps.googleusercontent.com';
    const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const redirectUri = 'https://redirect.com/';
    const scopes = ['email', 'profile'];
    return (await fixture(html`<auth-method-oauth2
      granttype="implicit"
      clientid="${clientId}"
      authorizationuri="${authUrl}"
      .redirectUri="${redirectUri}"
      .scopes="${scopes}"></auth-method-oauth2>`));
  }

  async function autoHiddenFixture() {
    const clientId = '821776164331-rserncqpdsq32lmbf5cfeolgcoujb6fm.apps.googleusercontent.com';
    const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const redirectUri = 'https://redirect.com/';
    const scopes = ['email', 'profile'];
    const accessTokenUri = 'https://domain.com';
    return (await fixture(html`<auth-method-oauth2
      granttype="implicit"
      clientid="${clientId}"
      authorizationuri="${authUrl}"
      .redirectUri="${redirectUri}"
      .scopes="${scopes}"
      .accessTokenUri="${accessTokenUri}"></auth-method-oauth2>`));
  }

  async function implicitModelFixture(amf, security) {
    return (await fixture(html`<auth-method-oauth2
      granttype="implicit"
      .amf="${amf}"
      .amfSettings="${security}"></auth-method-oauth2>`));
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

  describe('Implicit grant', () => {
    const clientId = '821776164331-rserncqpdsq32lmbf5cfeolgcoujb6fm.apps.googleusercontent.com';
    const authorizationUri = 'https://accounts.google.com/o/oauth2/v2/auth';
    const redirectUri = 'https://redirect.com/';
    const scopes = ['email', 'profile'];

    describe('Fields visibility', () => {
      before(() => clearStorage());

      let element;
      beforeEach(async () => {
        element = await implicitFixture();
        await aTimeout();
      });

      it('Should not hide fields by default', () => {
        assert.isTrue(element.advancedOpened);
      });

      it('Client id is required', () => {
        const node = element.shadowRoot.querySelector('[name="clientId"]');
        assert.isTrue(node.required);
      });

      it('Client secret is required', () => {
        const node = element.shadowRoot.querySelector('[name="clientSecret"]');
        assert.isTrue(node.required);
      });

      it('Client secret is disabled', () => {
        const node = element.shadowRoot.querySelector('[name="clientSecret"]');
        assert.isTrue(node.disabled);
      });

      it('Client secret is hidden', () => {
        const node = element.shadowRoot.querySelector('[name="clientSecret"]');
        const display = getComputedStyle(node).display;
        assert.equal(display, 'none');
      });

      it('Advanced settings checkbox is not rendered', () => {
        const node = element.shadowRoot.querySelector('.adv-settings-input');
        assert.notOk(node);
      });

      it('Authorization URI is not hidden', () => {
        const node = element.shadowRoot.querySelector('[name="authorizationUri"]');
        const display = getComputedStyle(node).display;
        assert.equal(display, 'inline-block');
      });

      it('Authorization URI is not disabled', () => {
        const node = element.shadowRoot.querySelector('[name="authorizationUri"]');
        assert.isFalse(node.disabled);
      });

      it('Authorization URI is required', () => {
        const node = element.shadowRoot.querySelector('[name="authorizationUri"]');
        assert.isTrue(node.required);
      });

      it('Access token URI is hidden', () => {
        const node = element.shadowRoot.querySelector('[name="accessTokenUri"]');
        const display = getComputedStyle(node).display;
        assert.equal(display, 'none');
      });

      it('Access token URI is required', () => {
        const node = element.shadowRoot.querySelector('[name="accessTokenUri"]');
        assert.isTrue(node.required);
      });

      it('Access token URI is disabled', () => {
        const node = element.shadowRoot.querySelector('[name="accessTokenUri"]');
        assert.isTrue(node.disabled);
      });

      it('Username is hidden', () => {
        const node = element.shadowRoot.querySelector('[name="username"]');
        const display = getComputedStyle(node).display;
        assert.equal(display, 'none');
      });

      it('Username is required', () => {
        const node = element.shadowRoot.querySelector('[name="username"]');
        assert.isTrue(node.required);
      });

      it('Username is disabled', () => {
        const node = element.shadowRoot.querySelector('[name="username"]');
        assert.isTrue(node.disabled);
      });

      it('Password is hidden', () => {
        const node = element.shadowRoot.querySelector('[name="password"]');
        const display = getComputedStyle(node).display;
        assert.equal(display, 'none');
      });

      it('Password is required', () => {
        const node = element.shadowRoot.querySelector('[name="password"]');
        assert.isTrue(node.required);
      });

      it('Password is disabled', () => {
        const node = element.shadowRoot.querySelector('[name="password"]');
        assert.isTrue(node.disabled);
      });

      it('Custom authorization query parameters are not rendered', () => {
        const node = element.shadowRoot.querySelector('[data-type="auth-query"]');
        assert.notOk(node);
      });

      it('Custom token query parameters are not rendered', () => {
        const node = element.shadowRoot.querySelector('[data-type="token-query"]');
        assert.notOk(node);
      });

      it('Custom token headers are not rendered', () => {
        const node = element.shadowRoot.querySelector('[data-type="token-headers"]');
        assert.notOk(node);
      });

      it('Custom token body parameters are not rendered', () => {
        const node = element.shadowRoot.querySelector('[data-type="token-body"]');
        assert.notOk(node);
      });

      it('Scope selector is not hidden', () => {
        const node = element.shadowRoot.querySelector('oauth2-scope-selector');
        const display = getComputedStyle(node).display;
        assert.equal(display, 'block');
      });

      it('Request access token button is rendered', () => {
        const node = element.shadowRoot.querySelector('.authorize-actions');
        const display = getComputedStyle(node).display;
        assert.notEqual(display, 'none');
      });

      it('current-token section is not rendered', () => {
        const node = element.shadowRoot.querySelector('.current-token');
        assert.notOk(node);
      });
    });

    describe('Updating UI values', () => {
      afterEach(() => clearStorage());

      let element;
      beforeEach(async () => {
        element = await autoHiddenFixture();
      });

      it('renders hidden fields in advanced view', async () => {
        const button = element.shadowRoot.querySelector('.adv-settings-input');
        MockInteractions.tap(button);
        assert.isTrue(element.advancedOpened);
        await nextFrame();
        const node = element.shadowRoot.querySelector('.advanced-section');
        assert.isFalse(node.hasAttribute('hidden'));
      });

      it('updating authorizationUri when input changed', async () => {
        const value = 'https://other-domain.com';
        const input = element.shadowRoot.querySelector('[name="authorizationUri"]').inputElement;
        input.value = value;
        const spy = sinon.stub();
        element.addEventListener('auth-settings-changed', spy);
        input.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
        const detail = spy.args[0][0].detail;
        assert.equal(detail.settings.authorizationUri, value);
      });

      it('updates grantType when selection changed', async () => {
        const listbox = element.shadowRoot.querySelector('[data-name="grantType"]');
        const spy = sinon.stub();
        element.addEventListener('auth-settings-changed', spy);
        listbox.selected = 'password';
        await aTimeout();
        const detail = spy.args[0][0].detail;
        assert.equal(detail.settings.type, 'password');
      });
    });

    describe('Events handling', () => {
      function fire(name, value) {
        const ev = new CustomEvent('request-header-changed', {
          detail: {
            name: name,
            value: value
          },
          bubbles: true
        });
        document.body.dispatchEvent(ev);
      }

      const authName = 'authorization';
      let element;
      beforeEach(async () => {
        clearStorage();
        element = await dataFixture();
        await aTimeout();
      });

      it('Updates accessToken from the event', () => {
        fire(authName, 'bearer testToken');
        assert.equal(element.accessToken, 'testToken');
      });

      it('Updates "Bearer" uppercase', () => {
        fire(authName, 'Bearer testToken');
        assert.equal(element.accessToken, 'testToken');
      });

      it('Does not change values for other headers', () => {
        element.accessToken = 'test';
        fire('x-test', 'something');
        assert.equal(element.accessToken, 'test');
      });

      it('Clears the value for empty header', () => {
        element.accessToken = 'test-1';
        fire(authName, '');
        assert.equal(element.accessToken, '');
      });

      it('oauth2-token-requested event contains state parameter', () => {
        const spy = sinon.spy();
        element.addEventListener('oauth2-token-requested', spy);
        const button = element.shadowRoot.querySelector('.auth-button');
        MockInteractions.tap(button);
        assert.typeOf(spy.args[0][0].detail.state, 'string');
      });

      it('oauth2-token-requested event contains all required data', () => {
        const spy = sinon.spy();
        element.addEventListener('oauth2-token-requested', spy);
        const button = element.shadowRoot.querySelector('.auth-button');
        MockInteractions.tap(button);
        const result = spy.args[0][0].detail;

        assert.equal(result.type, 'implicit', 'type is set');
        assert.equal(result.clientId, clientId, 'clientId is set');
        assert.equal(result.accessToken, '', 'accessToken is empty');
        assert.typeOf(result.customData, 'object', 'customData is set');
        assert.equal(result.authorizationUri, authorizationUri, 'authorizationUri is set');
        assert.equal(result.redirectUri, redirectUri, 'redirectUri is set');
        assert.deepEqual(result.scopes, scopes, 'scopes is set');
      });
    });

    describe('getSettings()', () => {
      let element;
      beforeEach(async () => {
        clearStorage();
        element = await dataFixture();
        await aTimeout();
      });

      it('Returns an object', () => {
        const result = element.getSettings();
        assert.typeOf(result, 'object');
      });

      it('type is set', () => {
        const result = element.getSettings();
        assert.equal(result.type, element.grantType);
      });

      it('clientId is set', () => {
        const result = element.getSettings();
        assert.equal(result.clientId, clientId);
      });

      it('accessToken is set', () => {
        let result = element.getSettings();
        assert.equal(result.accessToken, '', 'Token value is empty');
        element.accessToken = 'test-token';
        result = element.getSettings();
        assert.equal(result.accessToken, element.accessToken, 'Token value is set');
      });

      it('authorizationUri is set', () => {
        const result = element.getSettings();
        assert.equal(result.authorizationUri, authorizationUri);
      });

      it('redirectUri is set', () => {
        const result = element.getSettings();
        assert.equal(result.redirectUri, redirectUri);
      });

      it('scopes is set', () => {
        const result = element.getSettings();
        assert.deepEqual(result.scopes, scopes);
      });

      it('Custom values are empty', function() {
        const result = element.getSettings();
        assert.isUndefined(result.customData.auth.parameters, 'auth params is not set');
        assert.isUndefined(result.customData.token, 'token is not set');
      });

      it('deliveryMethod is set', () => {
        const result = element.getSettings();
        assert.equal(result.deliveryMethod, 'header', 'default value is set');
      });

      it('deliveryName is set', () => {
        const result = element.getSettings();
        assert.equal(result.deliveryName, 'authorization', 'default value is set');
      });
    });

    [
      ['AMF - full model', false],
      ['AMF - compact model', true]
    ].forEach(([label, compact]) => {
      describe(label, () => {
        describe('model computations', () => {
          let amf;
          let element;
          before(async () => {
            amf = await AmfLoader.load(apiFile, compact);
          });

          beforeEach(async () => {
            clearStorage();
            const security = AmfLoader.lookupSecurity(amf, '/with-annotations', 'get');
            element = await implicitModelFixture(amf, security);
            await aTimeout();
          });

          it('Computes authorizationUri', () => {
            assert.equal(element.authorizationUri, 'https://auth.com');
          });

          it('Computes accessTokenUri', () => {
            assert.equal(element.accessTokenUri, 'https://token.com');
          });

          it('Computes scopes', () => {
            assert.deepEqual(element.scopes, ['profile', 'email']);
          });

          it('Computes grant types', () => {
            const compare = [{
              type: 'implicit',
              label: 'Access token (browser flow)'
            }, {
              type: 'authorization_code',
              label: 'Authorization code (server flow)'
            },
            {
              type: 'client_credentials',
              label: 'Client credentials'
            }, {
              type: 'password',
              label: 'Password'
            }, {
              label: 'annotated_custom_grant',
              type: 'annotated_custom_grant'
            }, {
              label: 'annotated_custom_grant2',
              type: 'annotated_custom_grant2'
            }];
            assert.deepEqual(element.grantTypes, compare);
          });

          it('computes authQueryParameters', () => {
            assert.typeOf(element._authQueryParameters, 'array');
            assert.lengthOf(element._authQueryParameters, 5);
          });

          it('computes tokenQueryParameters', () => {
            assert.typeOf(element._tokenQueryParameters, 'array');
            assert.lengthOf(element._tokenQueryParameters, 2);
          });

          it('computes tokenBody', () => {
            assert.typeOf(element._tokenBody, 'array');
            assert.lengthOf(element._tokenBody, 2);
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
            element = await implicitModelFixture(amf, security);
            await aTimeout();
          });

          it('Contains only required params', function() {
            const result = element.getSettings();
            assert.typeOf(result.customData.auth.parameters, 'array', 'auth params is an array');
            assert.lengthOf(result.customData.auth.parameters, 1, 'has one item');
          });

          it('Contains not required data when added', function() {
            const value = 1234;
            element._authQueryParameters[0].value = value;
            const result = element.getSettings();
            assert.lengthOf(result.customData.auth.parameters, 1, 'has one item');
            assert.equal(result.customData.auth.parameters[0].value, value);
          });

          it('Does not contain token data', function() {
            const result = element.getSettings();
            assert.isUndefined(result.customData.token);
          });

          it('deliveryMethod is set', () => {
            const result = element.getSettings();
            assert.equal(result.deliveryMethod, 'query', 'Custom value is set');
          });

          it('deliveryName is set', () => {
            const result = element.getSettings();
            assert.equal(result.deliveryName, 'access_token', 'Custom value is set');
          });

          it('deliveryMethod is restored to default', () => {
            element.amfSettings = undefined;
            const result = element.getSettings();
            assert.equal(result.deliveryMethod, 'header');
          });

          it('deliveryName is restored to default', () => {
            element.amfSettings = undefined;
            const result = element.getSettings();
            assert.equal(result.deliveryName, 'authorization');
          });
        });
      });
    });

    describe('a11y', () => {
      it('is accessible when empty', async () => {
        const element = await implicitModelFixture();
        await assert.isAccessible(element);
      });

      it('is accessible when with data', async () => {
        const element = await dataFixture();
        await assert.isAccessible(element);
      });
    });
  });
});
