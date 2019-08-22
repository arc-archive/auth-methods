import { fixture, assert, nextFrame, aTimeout, html } from '@open-wc/testing';
import sinon from 'sinon/pkg/sinon-esm.js';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import '../auth-method-digest.js';

describe('<auth-method-digest>', function() {
  async function basicFixture() {
    return (await fixture(html`<auth-method-digest></auth-method-digest>`));
  }

  async function valuesFixture() {
    return (await fixture(html`<auth-method-digest username="test" passswortd="test"></auth-method-digest>`));
  }

  async function advValuesFixture() {
    const requestUrl = 'https://api.domain.com/path/to/resource?parm=value';
    const httpMethod = 'GET';
    const realm = 'realm@domain.com';
    const nonce = '1234abcd';
    const cnonce = '19ed03580cf7125';
    return (await fixture(html`<auth-method-digest
      fullform
      username="test"
      password="test"
      .requestUrl="${requestUrl}"
      .httpMethod="${httpMethod}"
      .realm="${realm}"
      .nonce="${nonce}"
      .cnonce="${cnonce}"
      ></auth-method-digest>`));
  }

  describe('initialization', () => {
    it('can be initialized with document.createElement', () => {
      const element = document.createElement('auth-method-digest');
      assert.ok(element);
    });

    it('fullForm is not set by default', async () => {
      const element = await basicFixture();
      assert.isUndefined(element.fullForm);
    });

    it('fullForm is not rendered by default', async () => {
      const element = await basicFixture();
      const node = element.querySelector('.extended-form');
      assert.notOk(node);
    });

    it('nc is set', async () => {
      const element = await basicFixture();
      assert.equal(element.nc, 1);
    });

    it('type is set', async () => {
      const element = await basicFixture();
      assert.equal(element.type, 'digest');
    });

    it('produces model when initializing', async () => {
      const element = await basicFixture();
      const spy = sinon.stub();
      element.addEventListener('auth-settings-changed', spy);
      await aTimeout();
      assert.isTrue(spy.called);
    });

    it('produces the model with initial values', async () => {
      const element = await valuesFixture();
      const spy = sinon.stub();
      element.addEventListener('auth-settings-changed', spy);
      await aTimeout();
      assert.isTrue(spy.called);
    });
  });

  describe('advanced form view toggle', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('clicking checkbox sets "fullForm"', async () => {
      const node = element.shadowRoot.querySelector('.adv-settings-input');
      MockInteractions.tap(node);
      assert.isTrue(element.fullForm);
    });

    it('checking checkbox sets "fullForm"', async () => {
      const node = element.shadowRoot.querySelector('.adv-settings-input');
      node.checked = true;
      assert.isTrue(element.fullForm);
    });

    it('renders the full form', async () => {
      const button = element.shadowRoot.querySelector('.adv-settings-input');
      MockInteractions.tap(button);
      await nextFrame();
      const node = element.shadowRoot.querySelector('.extended-form');
      assert.ok(node);
    });
  });

  describe('restore()', () => {
    let element;
    let settings;
    beforeEach(async () => {
      element = await basicFixture();
      settings = {
        username: 'test-username',
        password: 'test-passwd',
        realm: 'test-realm',
        nonce: 'test-nonce',
        opaque: 'test-opaque',
        qop: 'test-qop',
        uri: '/test-uri',
        nc: '000000001'
      };
    });
    [
      'username',
      'password',
      'realm',
      'nonce',
      'qop'
    ].forEach((prop) => {
      it(`restores ${prop}`, () => {
        element.restore(settings);
        assert.equal(element[prop], settings[prop]);
      });
    });

    it('restores uri', () => {
      element.restore(settings);
      assert.equal(element._requestUri, settings.uri);
    });

    it('restores nc', () => {
      element.restore(settings);
      assert.equal(element.nc, 1);
    });

    it('restores settings from the event', () => {
      const e = new CustomEvent('auth-settings-changed', {
        bubbles: true,
        detail: {
          settings,
          type: 'digest'
        }
      });
      document.body.dispatchEvent(e);
      assert.equal(element._requestUri, settings.uri);
    });
  });

  describe('basic form', () => {
    describe('validation', () => {
      it('is not valid without required values', async () => {
        const element = await basicFixture();
        assert.isFalse(element.validate());
      });

      it('is valid with required values', async () => {
        const element = await valuesFixture();
        assert.isTrue(element.validate());
      });
    });

    describe('settings notification', () => {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('produces settings with invalid state', async () => {
        const input = element.shadowRoot.querySelector(`anypoint-masked-input[name="password"]`).inputElement;
        input.value = 'test';
        const spy = sinon.stub();
        element.addEventListener('auth-settings-changed', spy);
        input.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
        const detail = spy.args[0][0].detail;
        assert.isFalse(detail.valid);
        assert.equal(detail.type, 'digest');
        assert.equal(detail.settings.username, '');
        assert.equal(detail.settings.password, 'test');
      });

      it('produces settings with valid state', async () => {
        const input = element.shadowRoot.querySelector(`anypoint-input[name="username"]`).inputElement;
        input.value = 'test';
        const spy = sinon.stub();
        element.addEventListener('auth-settings-changed', spy);
        input.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
        const detail = spy.args[0][0].detail;
        assert.isTrue(detail.valid);
        assert.equal(detail.type, 'digest');
        assert.equal(detail.settings.username, 'test');
        assert.equal(detail.settings.password, '');
      });
    });
  });

  describe('advanced-form form', () => {
    describe('getSettings()', () => {
      let element;
      beforeEach(async () => {
        element = await advValuesFixture();
      });

      it('Generates response for default values', () => {
        const result = element.getSettings();
        assert.equal(result.response, '31c83004c5976bf9bde92a83420579e3');
      });

      it('Generates response for qop auth', () => {
        element.qop = 'auth';
        const result = element.getSettings();
        assert.equal(result.response, '544411d3df2c3af2e7898882a645f3ea');
      });

      it('Generates response for qop auth-int', () => {
        element.qop = 'auth-int';
        const result = element.getSettings();
        assert.equal(result.response, '4bde443f767b0282a1ea346bb97bc5e4');
      });

      it('Generates response for qop auth and algorithm MD5-sess', () => {
        element.qop = 'auth';
        element.algorithm = 'MD5-sess';
        const result = element.getSettings();
        assert.equal(result.response, '44bf6aec3fb2c95d128f96ff97d8cb42');
      });

      it('Generates response for qop auth-int and algorithm MD5-sess', () => {
        element.qop = 'auth-int';
        element.algorithm = 'MD5-sess';
        const result = element.getSettings();
        assert.equal(result.response, '1d47bf00e1b7ba627404328417f938d9');
      });

      it('Generates response for qop auth and algorithm MD5', () => {
        element.qop = 'auth';
        element.algorithm = 'MD5';
        const result = element.getSettings();
        assert.equal(result.response, '544411d3df2c3af2e7898882a645f3ea');
      });

      it('Generates response for qop auth and algorithm MD5', () => {
        element.qop = 'auth-int';
        element.algorithm = 'MD5';
        const result = element.getSettings();
        assert.equal(result.response, '4bde443f767b0282a1ea346bb97bc5e4');
      });
    });

    describe('producting model for data change', () => {
      let element;
      beforeEach(async () => {
        element = await advValuesFixture();
        await aTimeout();
      });

      [
        'username',
        'realm',
        'nonce',
        'opaque',
        'cnonce'
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
    });
  });
});
