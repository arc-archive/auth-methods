import { fixture, assert, nextFrame, aTimeout, html } from '@open-wc/testing';
import sinon from 'sinon/pkg/sinon-esm.js';
import { AmfLoader } from './amf-loader.js';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import '../auth-method-oauth1.js';

describe('<auth-method-oauth1>', function() {
  async function basicFixture() {
    return (await fixture(`<auth-method-oauth1></auth-method-oauth1>`));
  }

  async function modelFixture(amf, security) {
    return (await fixture(html`<auth-method-oauth1 .amf="${amf}" .amfSettings="${security}"></auth-method-oauth1>`));
  }

  const apiFile = 'oauth1-api';

  describe('initialization', () => {
    it('can be initialized with document.createElement', () => {
      const element = document.createElement('auth-method-oauth1');
      assert.ok(element);
    });

    it('can be initialized in a template without the model', async () => {
      const element = await basicFixture();
      await aTimeout();
      assert.ok(element);
    });

    it('sets timestamp', async () => {
      const element = await basicFixture();
      assert.typeOf(element.timestamp, 'number');
    });

    it('sets nonce', async () => {
      const element = await basicFixture();
      assert.typeOf(element.nonce, 'string');
    });

    it('sets signatureMethods', async () => {
      const element = await basicFixture();
      assert.typeOf(element.signatureMethods, 'array');
      assert.lengthOf(element.signatureMethods, 3);
    });

    it('sets authTokenMethod', async () => {
      const element = await basicFixture();
      assert.equal(element.authTokenMethod, 'POST');
    });

    it('sets authTokenMethod', async () => {
      const element = await basicFixture();
      assert.equal(element.authParamsLocation, 'authorization');
    });
  });

  describe('restore()', () => {
    let element;
    let settings;
    beforeEach(async () => {
      element = await basicFixture();
      settings = {
        consumerKey: 'a',
        consumerSecret: 'b',
        token: 'c',
        tokenSecret: 'd',
        timestamp: 123,
        nonce: 'e',
        realm: 'f',
        signatureMethod: 'g',
        requestTokenUri: 'h',
        accessTokenUri: 'i',
        redirectUri: 'j',
        authTokenMethod: 'k',
        authParamsLocation: 'l',
        authorizationUri: 'm'
      };
    });

    [
      'consumerKey',
      'consumerSecret',
      'token',
      'tokenSecret',
      'timestamp',
      'nonce',
      'realm',
      'signatureMethod',
      'requestTokenUri',
      'accessTokenUri',
      'redirectUri',
      'authTokenMethod',
      'authParamsLocation',
      'authorizationUri'
    ].forEach((prop) => {
      it(`restores ${prop}`, () => {
        element.restore(settings);
        assert.equal(element[prop], settings[prop]);
      });
    });
  });

  describe('authorize()', () => {
    let element;
    let settings;
    beforeEach(async () => {
      element = await basicFixture();
      settings = {
        consumerKey: 'a',
        consumerSecret: 'b',
        token: 'c',
        tokenSecret: 'd',
        timestamp: 123,
        nonce: 'e',
        realm: 'f',
        signatureMethod: 'g',
        requestTokenUri: 'h',
        accessTokenUri: 'i',
        redirectUri: 'j',
        authTokenMethod: 'k',
        authParamsLocation: 'l',
        authorizationUri: 'm'
      };
    });

    [
      'consumerKey',
      'consumerSecret',
      'token',
      'tokenSecret',
      'timestamp',
      'nonce',
      'realm',
      'signatureMethod',
      'requestTokenUri',
      'accessTokenUri',
      'redirectUri',
      'authTokenMethod',
      'authParamsLocation',
      'authorizationUri'
    ].forEach((prop) => {
      it(`restores ${prop}`, () => {
        const spy = sinon.spy();
        element.addEventListener('oauth1-token-requested', spy);
        element[prop] = settings[prop];
        element.authorize();
        const detail = spy.args[0][0].detail;
        assert.equal(detail[prop], settings[prop]);
      });
    });
  });

  describe('auth-settings-changed event', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Fires auth-settings-changed custom event', async () => {
      let eventData;
      element.addEventListener('auth-settings-changed', function clb(e) {
        element.removeEventListener('auth-settings-changed', clb);
        eventData = e.detail;
      });
      element.consumerKey = 'test-key';
      // first one is for `update()` to be called and second for `_settingsChanged()`
      // to be executed
      await aTimeout();
      await aTimeout();
      assert.typeOf(eventData, 'object');
      assert.equal(eventData.type, 'oauth1');
      assert.typeOf(eventData.settings, 'object');
    });

    it('auth-settings-changed custom event contains settings', async () => {
      element.consumerSecret = 'test-secret';
      element.requestTokenUri = 'test-request-token-url';
      element.accessTokenUri = 'test-access-token-url';
      element.authorizationUri = 'test-authorization-url';
      element.redirectUri = 'test-redirect-url';
      element.nonce = 'test-nonce';
      element.timestamp = 12345;

      let eventData;
      element.addEventListener('auth-settings-changed', function clb(e) {
        element.removeEventListener('auth-settings-changed', clb);
        eventData = e.detail;
      });

      element.consumerKey = 'test-key';
      await aTimeout();
      await aTimeout();

      assert.isFalse(eventData.valid, 'valid is false');
      const s = eventData.settings;
      assert.typeOf(s, 'object');
      assert.equal(s.consumerKey, element.consumerKey);
      assert.equal(s.consumerSecret, element.consumerSecret);
      assert.equal(s.requestTokenUri, element.requestTokenUri);
      assert.equal(s.accessTokenUri, element.accessTokenUri);
      assert.equal(s.authorizationUri, element.authorizationUri);
      assert.equal(s.redirectUri, element.redirectUri);
      assert.equal(s.nonce, element.nonce);
      assert.equal(s.timestamp, element.timestamp);
      assert.equal(s.type, 'oauth1');
    });

    it('auth-settings-changed valid is true with token data', async () => {
      element.consumerSecret = 'test-secret';
      element.token = 'test-token';
      element.tokenSecret = 'test-token-secret';
      let eventData;
      element.addEventListener('auth-settings-changed', function clb(e) {
        element.removeEventListener('auth-settings-changed', clb);
        eventData = e.detail;
      });
      element.consumerKey = 'test-key';
      await aTimeout();
      await aTimeout();
      const s = eventData.settings;
      assert.isTrue(eventData.valid, 'valid is true');
      assert.equal(s.token, element.token);
      assert.equal(s.tokenSecret, element.tokenSecret);
    });
  });

  describe('oauth1-token-requested event', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Fires oauth1-token-requested custom event', async () => {
      element.consumerSecret = 'test-secret';
      element.requestTokenUri = 'test-request-token-url';
      element.accessTokenUri = 'test-access-token-url';
      element.authorizationUri = 'test-authorization-url';
      element.redirectUri = 'test-redirect-url';
      element.nonce = 'test-nonce';
      element.timestamp = 12345;
      element.consumerKey = 'test-key';
      const button = element.shadowRoot.querySelector('.auth-button');
      let eventData;
      element.addEventListener('oauth1-token-requested', function clb(e) {
        element.removeEventListener('oauth1-token-requested', clb);
        eventData = e.detail;
      });
      await nextFrame();
      MockInteractions.tap(button);
      const s = eventData;
      assert.equal(s.consumerKey, element.consumerKey);
      assert.equal(s.consumerSecret, element.consumerSecret);
      assert.equal(s.requestTokenUri, element.requestTokenUri);
      assert.equal(s.accessTokenUri, element.accessTokenUri);
      assert.equal(s.authorizationUri, element.authorizationUri);
      assert.equal(s.redirectUri, element.redirectUri);
      assert.equal(s.nonce, element.nonce);
      assert.equal(s.timestamp, element.timestamp);
      assert.equal(s.type, 'oauth1');
    });

    it('Requesting token activates the loader', async () => {
      element.consumerKey = 'test-key';
      await nextFrame();
      element.authorize();
      await nextFrame();
      assert.isTrue(element._authorizing);
      assert.isTrue(element.shadowRoot.querySelector('paper-spinner').active);
    });

    it('Resets the UI state when token response ready', async () => {
      element.consumerKey = 'test-key';
      await nextFrame();
      element.authorize();
      assert.isTrue(element._authorizing);
      const event = new CustomEvent('oauth1-token-response', {
        detail: {
          oauth_token: 'token',
          oauth_token_secret: 'secret'
        },
        bubbles: true
      });
      document.body.dispatchEvent(event);
      assert.isFalse(element._authorizing);
    });
  });

  describe('oauth1-error event', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element._authorizing = true;
    });

    function fire() {
      const e = new CustomEvent('oauth1-error', {
        detail: {
          message: 'error-message'
        },
        bubbles: true
      });
      document.body.dispatchEvent(e);
    }

    it('resets _authorizing state', () => {
      fire();
      assert.isFalse(element._authorizing);
    });

    it('renders the toast', () => {
      fire();
      const toast = element.shadowRoot.querySelector('paper-toast');
      assert.equal(toast.text, 'error-message');
      assert.isTrue(toast.opened);
    });
  });

  describe('changing input values', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    [
      'requestTokenUri',
      'accessTokenUri',
      'authorizationUri',
      'redirectUri',
      'nonce',
      'realm'
    ].forEach((prop) => {
      it(`produces the model for ${prop} change`, () => {
        const input = element.shadowRoot.querySelector(`anypoint-input[name="${prop}"]`).inputElement;
        input.value = 'test-updated';
        const spy = sinon.stub();
        element.addEventListener('auth-settings-changed', spy);
        input.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
        const detail = spy.args[0][0].detail;
        assert.equal(detail.settings[prop], 'test-updated');
      });
    });

    it(`produces the model for timestamp change`, () => {
      const input = element.shadowRoot.querySelector(`anypoint-input[name="timestamp"]`).inputElement;
      input.value = 1234;
      const spy = sinon.stub();
      element.addEventListener('auth-settings-changed', spy);
      input.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
      const detail = spy.args[0][0].detail;
      assert.equal(detail.settings.timestamp, 1234);
    });

    [
      'consumerKey',
      'consumerSecret',
      'token',
      'tokenSecret'
    ].forEach((prop) => {
      it(`produces the model for ${prop} change`, () => {
        const input = element.shadowRoot.querySelector(`anypoint-masked-input[name="${prop}"]`).inputElement;
        input.value = 'test-updated';
        const spy = sinon.stub();
        element.addEventListener('auth-settings-changed', spy);
        input.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
        const detail = spy.args[0][0].detail;
        assert.equal(detail.settings[prop], 'test-updated');
      });
    });
  });

  [
    ['Full model', false],
    ['Compact model', true]
  ].forEach(([label, compact]) => {
    describe(label, () => {
      describe('initialization', () => {
        let amf;

        before(async () => {
          amf = await AmfLoader.load(apiFile, compact);
        });

        it('can be initialized in a template with model', async () => {
          const security = AmfLoader.lookupSecurity(amf, '/oauth1', 'get');
          const element = await modelFixture(amf, security);
          await aTimeout();
          assert.ok(element);
        });

        it('dispatches settings change event when setting model data', async () => {
          const security = AmfLoader.lookupSecurity(amf, '/oauth1', 'get');
          const element = await modelFixture(amf, security);
          const spy = sinon.spy();
          element.addEventListener('auth-settings-changed', spy);
          await aTimeout();
          // first timeout is for settings observer to process the data
          // and the second to notify value.
          await aTimeout();
          const detail = spy.args[0][0].detail;
          assert.typeOf(detail.settings, 'object', 'settings is set');
          assert.typeOf(detail.valid, 'boolean', 'valid is set');
          assert.equal(detail.type, 'oauth1', 'type is set');
        });
      });

      describe('validation', () => {
        let amf;

        before(async () => {
          amf = await AmfLoader.load(apiFile, compact);
        });

        it('does not passes validation in default state', async () => {
          const element = await basicFixture();
          assert.isFalse(element.validate());
        });

        it('passes validation for minimum required', async () => {
          const element = await basicFixture();
          element.consumerKey = 'test-key';
          await nextFrame();
          assert.isTrue(element.validate());
        });

        it('passes validation with outh settings', async () => {
          const security = AmfLoader.lookupSecurity(amf, '/oauth1', 'get');
          const element = await modelFixture(amf, security);
          element.consumerKey = 'test-key';
          await nextFrame();
          assert.isTrue(element.validate());
        });
      });

      describe('AMF properties', () => {
        let amf;
        let element;

        before(async () => {
          amf = await AmfLoader.load(apiFile, compact);
        });

        beforeEach(async () => {
          const security = AmfLoader.lookupSecurity(amf, '/oauth1', 'get');
          element = await modelFixture(amf, security);
        });

        it('requestTokenUri is set', () => {
          assert.equal(element.requestTokenUri, 'http://api.domain.com/oauth1/request_token');
        });

        it('authorizationUri is set', () => {
          assert.equal(element.authorizationUri, 'http://api.domain.com/oauth1/authorize');
        });

        it('accessTokenUri is set', () => {
          assert.equal(element.accessTokenUri, 'http://api.domain.com/oauth1/access_token');
        });

        it('signatureMethods is set', () => {
          assert.deepEqual(element.signatureMethods, ['RSA-SHA1', 'HMAC-SHA1']);
        });

        it('restores signatureMethods when removing model', () => {
          element.amfSettings = undefined;
          assert.deepEqual(element.signatureMethods, element.defaultSignatureMethods);
        });

        it('restores signatureMethods when changing model', async () => {
          const security = AmfLoader.lookupSecurity(amf, '/custom', 'get');
          element.amfSettings = security;
          await aTimeout();
          assert.deepEqual(element.signatureMethods, element.defaultSignatureMethods);
        });
      });
    });
  });
});
