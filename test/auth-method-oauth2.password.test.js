import { fixture, assert, aTimeout, html, nextFrame } from '@open-wc/testing';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import { AmfLoader } from './amf-loader.js';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import '../auth-method-oauth2.js';

describe('<auth-method-oauth2>', function() {
  const clientId = '821776164331-rserncqpdsq32lmbf5cfeolgcoujb6fm.apps.googleusercontent.com';
  const accessTokenUri = 'https://accounts.google.com/o/oauth2/v2/auth';
  const username = 'test-username';
  const password = 'test-password';
  const scopes = ['email', 'profile'];

  async function basicFixture() {
    return (await fixture(`<auth-method-oauth2 granttype="password"></auth-method-oauth2>`));
  }

  async function dataFixture() {
    return (await fixture(html`<auth-method-oauth2
      granttype="password"
      clientid="${clientId}"
      .accessTokenUri="${accessTokenUri}"
      .username="${username}"
      .password="${password}"
      .scopes="${scopes}"></auth-method-oauth2>`));
  }

  async function modelFixture(amf, security) {
    return (await fixture(html`<auth-method-oauth2
      granttype="password"
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

  describe('Password grant', () => {
    describe('Validation', () => {
      let element;
      beforeEach(async () => {
        clearStorage();
        element = await dataFixture();
        await aTimeout();
      });

      it('Should not be validated', async () => {
        element.password = '';
        await nextFrame();
        assert.isFalse(element.validate());
      });

      it('Should be validated', () => {
        assert.isTrue(element.validate());
      });

      it('Should not fire oauth2-token-requested event', async () => {
        const spy = sinon.stub();
        element.password = '';
        await nextFrame();
        element.addEventListener('oauth2-token-requested', spy);
        const button = element.shadowRoot.querySelector('.auth-button');
        MockInteractions.tap(button);
        assert.isFalse(spy.calledOnce);
      });

      it('dispatches oauth2-token-requested event', async () => {
        const spy = sinon.stub();
        element.addEventListener('oauth2-token-requested', spy);
        const button = element.shadowRoot.querySelector('.auth-button');
        MockInteractions.tap(button);
        assert.isTrue(spy.calledOnce);
      });
    });

    describe('Fields visibility', () => {
      let element;
      beforeEach(async () => {
        clearStorage();
        element = await basicFixture();
        await aTimeout();
      });

      it('Client id is not required', () => {
        const node = element.shadowRoot.querySelector('[name="clientId"]');
        assert.notEqual(node.required, true);
      });

      it('Client secret is not required', () => {
        const node = element.shadowRoot.querySelector('[name="clientSecret"]');
        assert.notEqual(node.required, true);
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

      it('Authorization URI is hidden', () => {
        const node = element.shadowRoot.querySelector('[name="authorizationUri"]');
        const display = getComputedStyle(node).display;
        assert.equal(display, 'none');
      });

      it('Authorization URI is disabled', () => {
        const node = element.shadowRoot.querySelector('[name="authorizationUri"]');
        assert.isTrue(node.disabled);
      });

      it('Authorization URI is required', () => {
        const node = element.shadowRoot.querySelector('[name="authorizationUri"]');
        assert.isTrue(node.required);
      });

      it('Access token URI is not hidden', () => {
        const node = element.shadowRoot.querySelector('[name="accessTokenUri"]');
        const display = getComputedStyle(node).display;
        assert.equal(display, 'inline-block');
      });

      it('Access token URI is required', () => {
        const node = element.shadowRoot.querySelector('[name="accessTokenUri"]');
        assert.isTrue(node.required);
      });

      it('Access token URI is not disabled', () => {
        const node = element.shadowRoot.querySelector('[name="accessTokenUri"]');
        assert.isFalse(node.disabled);
      });

      it('Username is none hidden', () => {
        const node = element.shadowRoot.querySelector('[name="username"]');
        const display = getComputedStyle(node).display;
        assert.equal(display, 'inline-block');
      });

      it('Username is required', () => {
        const node = element.shadowRoot.querySelector('[name="username"]');
        assert.isTrue(node.required);
      });

      it('Username is not disabled', () => {
        const node = element.shadowRoot.querySelector('[name="username"]');
        assert.isFalse(node.disabled);
      });

      it('Password is not hidden', () => {
        const node = element.shadowRoot.querySelector('[name="password"]');
        const display = getComputedStyle(node).display;
        assert.equal(display, 'inline-block');
      });

      it('Password is required', () => {
        const node = element.shadowRoot.querySelector('[name="password"]');
        assert.isTrue(node.required);
      });

      it('Password is not disabled', () => {
        const node = element.shadowRoot.querySelector('[name="password"]');
        assert.isFalse(node.disabled);
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

    describe('Events', () => {
      let element;
      beforeEach(async () => {
        clearStorage();
        element = await dataFixture();
        await aTimeout();
      });

      it('oauth2-token-requested event contains state parameter', () => {
        let eventData;
        element.addEventListener('oauth2-token-requested', function clb(e) {
          element.removeEventListener('oauth2-token-requested', clb);
          eventData = e.detail;
        });
        const button = element.shadowRoot.querySelector('.auth-button');
        MockInteractions.tap(button);
        assert.typeOf(eventData.state, 'string');
      });

      it('oauth2-token-requested event contains all required data', (done) => {
        element.addEventListener('oauth2-token-requested', function clb(e) {
          element.removeEventListener('oauth2-token-requested', clb);
          assert.equal(e.detail.type, 'password', 'type is set');
          assert.equal(e.detail.accessTokenUri, accessTokenUri, 'accessTokenUri is set');
          assert.equal(e.detail.clientId, clientId, 'clientId is set');
          assert.equal(e.detail.username, username, 'username is set');
          assert.equal(e.detail.password, password, 'password is set');
          assert.typeOf(e.detail.customData, 'object', 'customData is set');
          done();
        });
        element.authorize();
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

      it('scopes is set', () => {
        const result = element.getSettings();
        assert.isTrue(result.scopes === scopes);
      });

      it('clientSecret is not set', () => {
        const result = element.getSettings();
        assert.isUndefined(result.clientSecret);
      });

      it('accessTokenUri is set', () => {
        const result = element.getSettings();
        assert.equal(result.accessTokenUri, accessTokenUri);
      });

      it('username is set', () => {
        const result = element.getSettings();
        assert.equal(result.username, username);
      });

      it('password is set', () => {
        const result = element.getSettings();
        assert.equal(result.password, password);
      });

      it('Custom values are empty', () => {
        const result = element.getSettings();
        assert.isUndefined(result.customData.auth, 'auth params is not set');
        assert.isUndefined(result.customData.token.parameters, 'token params is not set');
        assert.isUndefined(result.customData.token.headers, 'token headers is not set');
        assert.isUndefined(result.customData.token.body, 'token body is not set');
      });

      it('deliveryMethod is set', () => {
        const result = element.getSettings();
        assert.equal(result.deliveryMethod, 'header', 'default value is set');
      });

      it('deliveryName is set', () => {
        const result = element.getSettings();
        assert.equal(result.deliveryName, 'authorization', 'default value is set');
      });

      it('scopes is set', () => {
        const result = element.getSettings();
        assert.typeOf(result.scopes, 'array');
        assert.deepEqual(result.scopes, scopes);
      });
    });

    [
      ['AMF - full model', false],
      ['AMF - compact model', true]
    ].forEach(([label, compact]) => {
      describe(label, () => {
        describe('Initialization', () => {
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

          it('has password media type', () => {
            assert.equal(element.grantType, 'password');
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

          it('Contains only required params', () => {
            const result = element.getSettings();
            assert.typeOf(result.customData.token.body, 'array', 'token body is an array');
            assert.lengthOf(result.customData.token.body, 1, 'has one item');
            assert.isUndefined(result.customData.token.headers, 'token headers is not set');
          });

          it('Contains not required data when added', () => {
            const value = 'test-aq';
            element._tokenQueryParameters[0].value = value;
            const result = element.getSettings();
            assert.lengthOf(result.customData.token.parameters, 1, 'has one item');
            assert.equal(result.customData.token.parameters[0].value, value);
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
        const element = await basicFixture();
        await assert.isAccessible(element);
      });

      it('is accessible when with data', async () => {
        const element = await dataFixture();
        await assert.isAccessible(element);
      });
    });
  });
});
