import { fixture, assert, nextFrame, aTimeout, html } from '@open-wc/testing';
import sinon from 'sinon/pkg/sinon-esm.js';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import '../auth-method-oauth2.js';

describe('<auth-method-oauth2>', function() {
  async function basicFixture() {
    return (await fixture(`<auth-method-oauth2></auth-method-oauth2>`));
  }
  const clientId = '821776164331-rserncqpdsq32lmbf5cfeolgcoujb6fm.apps.googleusercontent.com';
  const authorizationUri = 'https://accounts.google.com/o/oauth2/v2/auth';
  const redirectUri = 'https://redirect.com/';
  const scopes = ['email', 'profile'];

  async function dataFixture() {
    return (await fixture(html`<auth-method-oauth2
      clientid="${clientId}"
      authorizationuri="${authorizationUri}"
      .redirectUri="${redirectUri}"
      .scopes="${scopes}"></auth-method-oauth2>`));
  }

  function clearStorage() {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.indexOf('auth.methods.latest') === 0) {
        sessionStorage.removeItem(key);
      }
    });
  }

  describe('initialization', () => {
    before(() => clearStorage());

    it('can be initialized with document.createElement', () => {
      const element = document.createElement('auth-method-oauth2');
      assert.ok(element);
    });

    it('can be initialized in a template without the model', async () => {
      const element = await basicFixture();
      await aTimeout();
      assert.ok(element);
    });

    it('sets grantTypes', async () => {
      const element = await basicFixture();
      assert.typeOf(element.grantTypes, 'array');
      assert.deepEqual(element.grantTypes, element._oauth2GrantTypes);
    });

    it('sets oauthDeliveryName', async () => {
      const element = await basicFixture();
      assert.equal(element.oauthDeliveryName, 'authorization');
    });

    it('sets oauthDeliveryMethod', async () => {
      const element = await basicFixture();
      assert.equal(element.oauthDeliveryMethod, 'header');
    });
  });

  describe('oauth2-token-response event', () => {
    before(() => clearStorage());

    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    function dispatchTokenResponse(detail) {
      const event = new CustomEvent('oauth2-token-response', {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: detail
      });
      document.body.dispatchEvent(event);
    }

    it('The `oauth2-token-response` event sets the accessToken', () => {
      dispatchTokenResponse({
        accessToken: 'test-token'
      });
      assert.equal(element.accessToken, 'test-token');
    });

    it('The event sets accessToken with state parameter', () => {
      const state = 'test123';
      element._lastState = state;
      dispatchTokenResponse({
        accessToken: 'test-token',
        state
      });
      assert.equal(element.accessToken, 'test-token');
    });

    it('The event do not sets accessToken when state missmatch', () => {
      element._lastState = 'test123';
      dispatchTokenResponse({
        accessToken: 'test-token',
        state: 'test456'
      });
      assert.isUndefined(element.accessToken);
    });
  });

  describe('tokenType property', () => {
    afterEach(() => clearStorage());

    let element;
    const type = 'test-type';
    beforeEach(async () => {
      element = await dataFixture();
    });

    it('stores type in sessionStorage', () => {
      element.tokenType = type;
      assert.equal(sessionStorage[element.storeKeys.tokenType], type);
    });

    it('adds type to settings', () => {
      element.tokenType = type;
      const result = element.getSettings();
      assert.equal(result.tokenType, type);
    });

    it('restores Bearer token info when incoming token has no type', () => {
      element.tokenType = type;
      document.body.dispatchEvent(new CustomEvent('oauth2-token-response', {
        bubbles: true,
        detail: {
          accessToken: 'test-incoming'
        }
      }));
      assert.equal(element.tokenType, 'Bearer');
    });

    it('updates tokenType from incoming token info', () => {
      element.tokenType = type;
      document.body.dispatchEvent(new CustomEvent('oauth2-token-response', {
        bubbles: true,
        detail: {
          accessToken: 'test-incoming',
          tokenType: 'other'
        }
      }));
      assert.equal(element.tokenType, 'other');
    });

    it('processing header change uses tokenType property', () => {
      element.tokenType = type;
      document.body.dispatchEvent(new CustomEvent('request-header-changed', {
        bubbles: true,
        detail: {
          name: 'authorization',
          value: type + ': other'
        }
      }));
      assert.equal(element.accessToken, 'other');
    });
  });

  describe('restore()', () => {
    afterEach(() => clearStorage());

    let element;
    let cnf;
    beforeEach(async () => {
      element = await dataFixture();
      cnf = {
        type: 'implicit',
        clientId,
        accessToken: 'test-token',
        scopes
      };
    });

    it('restores basic properties', () => {
      element.restore(cnf);
      assert.equal(element.grantType, cnf.type);
      assert.equal(element.clientId, clientId);
      assert.equal(element.accessToken, cnf.accessToken);
      assert.deepEqual(element.scopes, scopes);
    });

    it('restores implicit properties', () => {
      cnf.authorizationUri = authorizationUri;
      element.restore(cnf);
      assert.equal(element.authorizationUri, authorizationUri);
    });

    it('restores authorization_code properties', () => {
      cnf.type = 'authorization_code';
      cnf.authorizationUri = authorizationUri;
      cnf.clientSecret = 'secret';
      cnf.accessTokenUri = 'accessTokenUri';
      element.restore(cnf);
      assert.equal(element.authorizationUri, authorizationUri);
      assert.equal(element.clientSecret, cnf.clientSecret);
      assert.equal(element.accessTokenUri, cnf.accessTokenUri);
    });

    it('restores client_credentials properties', () => {
      cnf.type = 'client_credentials';
      cnf.clientSecret = 'secret';
      cnf.accessTokenUri = 'accessTokenUri';
      element.restore(cnf);
      assert.equal(element.clientSecret, cnf.clientSecret);
      assert.equal(element.accessTokenUri, cnf.accessTokenUri);
    });

    it('restores client_credentials properties', () => {
      cnf.type = 'password';
      cnf.password = 'password';
      cnf.username = 'username';
      cnf.accessTokenUri = 'accessTokenUri';
      element.restore(cnf);
      assert.equal(element.password, cnf.password);
      assert.equal(element.username, cnf.username);
      assert.equal(element.accessTokenUri, cnf.accessTokenUri);
    });

    it('restores custom grant properties', () => {
      cnf.type = 'my-custom';
      cnf.password = 'password';
      cnf.username = 'username';
      cnf.accessTokenUri = 'accessTokenUri';
      cnf.authorizationUri = authorizationUri;
      cnf.clientSecret = 'secret';
      element.restore(cnf);
      assert.equal(element.password, cnf.password);
      assert.equal(element.username, cnf.username);
      assert.equal(element.accessTokenUri, cnf.accessTokenUri);
      assert.equal(element.clientSecret, cnf.clientSecret);
      assert.equal(element.authorizationUri, authorizationUri);
    });
  });

  describe('_clickCopyAction()', () => {
    let element;
    beforeEach(async () => {
      element = await dataFixture();
    });

    it('calls copy() on copy element', () => {
      const elm = element.shadowRoot.querySelector('clipboard-copy');
      const spy = sinon.spy(elm, 'copy');
      const node = element.shadowRoot.querySelector('.read-only-param-field .code');
      MockInteractions.tap(node);
      assert.isTrue(spy.called);
    });
  });

  describe('_updateGrantTypes()', () => {
    let element;
    beforeEach(async () => {
      element = await dataFixture();
    });

    it('sets default types', () => {
      element.grantTypes = [];
      element._updateGrantTypes();
      assert.deepEqual(element.grantTypes, element._oauth2GrantTypes);
    });

    it('sets passed types', () => {
      const grantTypes = ['custom'];
      element._updateGrantTypes(grantTypes);
      assert.lengthOf(element.grantTypes, 1);
      assert.equal(element.grantTypes[0].label, 'custom');
      assert.equal(element.grantTypes[0].type, 'custom');
    });

    it('sets grantType for the first option', () => {
      const grantTypes = ['custom'];
      element._updateGrantTypes(grantTypes);
      assert.equal(element.grantType, 'custom');
    });

    it('sets previouslt existing type', () => {
      const grantTypes = ['password'];
      element._updateGrantTypes(grantTypes);
      assert.equal(element.grantType, 'password');
    });
  });

  describe('_authorizing state', () => {
    before(() => clearStorage());

    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element._authorizing = true;
      await nextFrame();
    });

    it('Get token button is disabled ', () => {
      const button = element.shadowRoot.querySelector('.auth-button[data-type="get-token"]');
      assert.isTrue(button.disabled);
    });

    it('Refresh token is not rendered ', () => {
      const button = element.shadowRoot.querySelector('.auth-button[data-type="refresh-token"]');
      assert.notOk(button);
    });

    it('`oauth2-token-response` event restores _authorizing', () => {
      const event = new CustomEvent('oauth2-token-response', {
        bubbles: true,
        cancelable: true,
        detail: {
          accessToken: 'test-token'
        }
      });
      element.dispatchEvent(event);
      assert.isFalse(element._authorizing);
    });

    it('oauth2-error event restores _authorizing', () => {
      const event = new CustomEvent('oauth2-error', {
        bubbles: true,
        cancelable: true,
        detail: {
          message: 'test-error'
        }
      });
      element.dispatchEvent(event);
      assert.isFalse(element._authorizing);
    });
  });
});
