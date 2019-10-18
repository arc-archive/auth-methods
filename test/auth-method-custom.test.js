import { fixture, assert, nextFrame, aTimeout, html } from '@open-wc/testing';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import { AmfLoader } from './amf-loader.js';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import '../auth-method-custom.js';

describe('<auth-method-custom>', function() {
  async function basicFixture() {
    return (await fixture(`<auth-method-custom></auth-method-custom>`));
  }

  async function modelFixture(amf, security) {
    return (await fixture(html`<auth-method-custom .amf="${amf}" .amfSettings="${security}"></auth-method-custom>`));
  }

  const apiFile = 'custom-schemes-api';

  [
    ['Full model', false],
    ['Compact model', true]
  ].forEach(([label, compact]) => {
    describe(label, () => {
      describe('initialization', () => {
        let amf;
        let factory;

        before(async () => {
          amf = await AmfLoader.load(apiFile, compact);
          factory = document.createElement('api-view-model-transformer');
        });

        after(() => {
          factory = null;
        });

        afterEach(() => {
          factory.clearCache();
        });

        it('can be initialized with document.createElement', () => {
          const element = document.createElement('auth-method-custom');
          assert.ok(element);
        });

        it('can be initialized in a template with model', async () => {
          const security = AmfLoader.lookupSecurity(amf, '/custom2', 'get');
          const element = await modelFixture(amf, security);
          await aTimeout();
          assert.ok(element);
        });

        it('can be initialized in a template without the model', async () => {
          const element = await basicFixture();
          await aTimeout();
          assert.ok(element);
        });

        it('dispatches settings change event when setting model data', async () => {
          const security = AmfLoader.lookupSecurity(amf, '/custom2', 'get');
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
          assert.equal(detail.type, 'x-custom', 'type is set');
        });
      });

      describe('model data computation', () => {
        let amf;
        let factory;

        before(async () => {
          amf = await AmfLoader.load(apiFile, compact);
          factory = document.createElement('api-view-model-transformer');
        });

        after(() => {
          factory = null;
        });

        afterEach(() => {
          factory.clearCache();
        });

        it('_headers are undefined when no mode', async () => {
          const element = await basicFixture();
          assert.isUndefined(element._headers);
        });

        it('computes _headers model', async () => {
          const security = AmfLoader.lookupSecurity(amf, '/custom1', 'get');
          const element = await modelFixture(amf, security);
          await aTimeout();
          assert.typeOf(element._headers, 'array');
          assert.lengthOf(element._headers, 1);
        });

        it('_queryParameters are undefined when no mode', async () => {
          const element = await basicFixture();
          assert.isUndefined(element._queryParameters);
        });

        it('computes _queryParameters model', async () => {
          const security = AmfLoader.lookupSecurity(amf, '/custom1', 'get');
          const element = await modelFixture(amf, security);
          await aTimeout();
          assert.typeOf(element._queryParameters, 'array');
          assert.lengthOf(element._queryParameters, 2);
        });

        it('computes _schemeName', async () => {
          const security = AmfLoader.lookupSecurity(amf, '/custom1', 'get');
          const element = await modelFixture(amf, security);
          await aTimeout();
          assert.equal(element._schemeName, 'custom1');
        });

        it('computes _schemeDescription', async () => {
          const security = AmfLoader.lookupSecurity(amf, '/custom1', 'get');
          const element = await modelFixture(amf, security);
          await aTimeout();
          assert.typeOf(element._schemeDescription, 'string');
        });
      });

      describe('validation states', () => {
        let amf;
        let factory;
        let element;

        before(async () => {
          amf = await AmfLoader.load(apiFile, compact);
          factory = document.createElement('api-view-model-transformer');
        });

        after(() => {
          factory = null;
        });

        beforeEach(async () => {
          const security = AmfLoader.lookupSecurity(amf, '/custom1', 'get');
          element = await modelFixture(amf, security);
          await aTimeout();
        });

        afterEach(() => {
          factory.clearCache();
        });

        it('returns false when missing required input', async () => {
          assert.isFalse(element.validate());
        });

        it('returns true when values are set', async () => {
          // /custom1 has required "SpecialTokenHeader" header without
          // default value.
          const item = element.shadowRoot.querySelector(`api-property-form-item[name="SpecialTokenHeader"]`);
          item.value = 'test';
          await nextFrame();
          assert.isTrue(element.validate());
        });
      });

      describe('getSettings()', () => {
        let amf;
        let factory;

        before(async () => {
          amf = await AmfLoader.load(apiFile, compact);
          factory = document.createElement('api-view-model-transformer');
        });

        after(() => {
          factory = null;
        });

        afterEach(() => {
          factory.clearCache();
        });

        it('returns form values', async () => {
          const security = AmfLoader.lookupSecurity(amf, '/custom2', 'get');
          const element = await modelFixture(amf, security);
          await aTimeout();
          const result = element.getSettings();
          assert.deepEqual(result, {
            apiUserIdParam: 0,
            apiNonceParam: ''
          });
        });

        it('returns empty object when no model', async () => {
          const element = await basicFixture();
          const result = element.getSettings();
          assert.deepEqual(result, {});
        });

        it('returns empty object when DOM not ready', async () => {
          const element = document.createElement('auth-method-custom');
          const result = element.getSettings();
          assert.deepEqual(result, {});
        });
      });

      describe('docs rendering', () => {
        let amf;
        let factory;
        let element;

        before(async () => {
          amf = await AmfLoader.load(apiFile, compact);
          factory = document.createElement('api-view-model-transformer');
        });

        after(() => {
          factory = null;
        });

        beforeEach(async () => {
          const security = AmfLoader.lookupSecurity(amf, '/custom1', 'get');
          element = await modelFixture(amf, security);
          await aTimeout();
        });

        afterEach(() => {
          factory.clearCache();
        });

        it('renders schema description toggle icon', async () => {
          const button = element.shadowRoot.querySelector('.subtitle .hint-icon');
          assert.ok(button);
        });

        it('does not render schema description when noDocs is set', async () => {
          element.noDocs = true;
          await nextFrame();
          const button = element.shadowRoot.querySelector('.subtitle .hint-icon');
          assert.notOk(button);
        });

        it('does not render schema description', async () => {
          const node = element.shadowRoot.querySelector('.scheme-header .docs-container');
          assert.notOk(node);
        });

        it('renders schema description after toggle icon click', async () => {
          const button = element.shadowRoot.querySelector('.subtitle .hint-icon');
          MockInteractions.tap(button);
          await nextFrame();
          const node = element.shadowRoot.querySelector('.scheme-header .docs-container');
          assert.ok(node);
        });

        it('renders item description toggle icon', async () => {
          const button = element.shadowRoot.querySelector('.field-value .hint-icon');
          assert.ok(button);
        });

        it('does not render item description toggle icon when noDocs is set', async () => {
          element.noDocs = true;
          await nextFrame();
          const button = element.shadowRoot.querySelector('.field-value .hint-icon');
          assert.notOk(button);
        });

        it('does not render item description', async () => {
          const node = element.shadowRoot.querySelector('.docs-container');
          assert.notOk(node);
        });

        it('renders item description after toggle icon click', async () => {
          const button = element.shadowRoot.querySelector('.field-value .hint-icon');
          MockInteractions.tap(button);
          await nextFrame();
          const node = element.shadowRoot.querySelector('.docs-container');
          assert.ok(node);
        });
      });

      describe('settings change event', () => {
        let amf;
        let factory;
        let element;

        before(async () => {
          amf = await AmfLoader.load(apiFile, compact);
          factory = document.createElement('api-view-model-transformer');
        });

        after(() => {
          factory = null;
        });

        beforeEach(async () => {
          const security = AmfLoader.lookupSecurity(amf, '/custom1', 'get');
          element = await modelFixture(amf, security);
          await aTimeout();
        });

        afterEach(() => {
          factory.clearCache();
        });

        it('dispatches the event immediately after header value change', async () => {
          const item = element.shadowRoot.querySelector(`api-property-form-item[name="SpecialTokenHeader"]`);
          const spy = sinon.stub();
          element.addEventListener('auth-settings-changed', spy);
          item.value = 'test';
          const detail = spy.args[0][0].detail;
          assert.equal(detail.settings.SpecialTokenHeader, 'test', 'header is set');
        });

        it('dispatches the event immediately after query value change', async () => {
          const item = element.shadowRoot.querySelector(`api-property-form-item[name="debugTokenParam"]`);
          const spy = sinon.stub();
          element.addEventListener('auth-settings-changed', spy);
          item.value = 'Warning';
          const detail = spy.args[0][0].detail;
          assert.equal(detail.settings.debugTokenParam, 'Warning', 'param is set');
        });
      });

      describe('header change event', () => {
        let amf;
        let factory;
        let element;

        before(async () => {
          amf = await AmfLoader.load(apiFile, compact);
          factory = document.createElement('api-view-model-transformer');
        });

        after(() => {
          factory = null;
        });

        beforeEach(async () => {
          const security = AmfLoader.lookupSecurity(amf, '/custom1', 'get');
          element = await modelFixture(amf, security);
          await aTimeout();
        });

        afterEach(() => {
          factory.clearCache();
        });

        function fire(name) {
          document.body.dispatchEvent(new CustomEvent('request-header-changed', {
            detail: {
              name,
              value: 'test-value'
            },
            bubbles: true,
            composed: true
          }));
        }

        it('updates existing header', async () => {
          fire('SpecialTokenHeader');
          assert.lengthOf(element._headers, 1);
          assert.equal(element._headers[0].value, 'test-value');
        });

        it('ignores non existing headers', async () => {
          fire('ExtraHeader');
          assert.lengthOf(element._headers, 1);
          assert.equal(element._headers[0].value, '');
        });

        it('dispatches the event when a header change', () => {
          const spy = sinon.stub();
          element.addEventListener('request-header-changed', spy);
          const item = element.shadowRoot.querySelector(`api-property-form-item[name="SpecialTokenHeader"]`);
          item.value = 'test';
          assert.deepEqual(spy.args[0][0].detail, {
            name: 'SpecialTokenHeader',
            value: 'test'
          });
        });
      });

      describe('query paramse change event', () => {
        let amf;
        let factory;
        let element;

        before(async () => {
          amf = await AmfLoader.load(apiFile, compact);
          factory = document.createElement('api-view-model-transformer');
        });

        after(() => {
          factory = null;
        });

        beforeEach(async () => {
          const security = AmfLoader.lookupSecurity(amf, '/custom1', 'get');
          element = await modelFixture(amf, security);
          await aTimeout();
        });

        afterEach(() => {
          factory.clearCache();
        });

        function fire(name, value) {
          document.body.dispatchEvent(new CustomEvent('query-parameter-changed', {
            detail: {
              name,
              value
            },
            bubbles: true,
            composed: true
          }));
        }

        it('updates existing query parameetr', async () => {
          fire('debugTokenParam', 'Error');
          assert.lengthOf(element._queryParameters, 2);
          assert.equal(element._queryParameters[0].value, 'Error');
        });

        it('ignores non existing headers', async () => {
          fire('ExtraParam');
          assert.lengthOf(element._queryParameters, 2);
        });

        it('dispatches the event when a param change', () => {
          const spy = sinon.stub();
          element.addEventListener('query-parameter-changed', spy);
          const item = element.shadowRoot.querySelector(`api-property-form-item[name="debugTokenParam"]`);
          item.value = 'test';
          assert.deepEqual(spy.args[0][0].detail, {
            name: 'debugTokenParam',
            value: 'test'
          });
        });
      });
    });
  });
});
