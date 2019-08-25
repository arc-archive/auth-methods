import { fixture, assert, aTimeout, html } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import '../auth-method-custom.js';
import * as sinon from 'sinon/pkg/sinon-esm.js';

describe('Issue SE-12042', function() {
  async function modelFixture(amf, security) {
    return (await fixture(html`<auth-method-custom .amf="${amf}" .amfSettings="${security}"></auth-method-custom>`));
  }

  const apiFile = 'SE-12042';

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

        it('dispatches query-parameter-changed event when view model is created', async () => {
          const spy = sinon.spy();
          document.body.addEventListener('query-parameter-changed', spy);
          const security = AmfLoader.lookupSecurity(amf, '/check/api-status', 'get');
          await modelFixture(amf, security);
          await aTimeout();
          await aTimeout();
          document.body.removeEventListener('query-parameter-changed', spy);

          assert.isTrue(spy.calledOnce);
        });

        it('dispatches query-parameter-changed event when value change', async () => {
          const security = AmfLoader.lookupSecurity(amf, '/check/api-status', 'get');
          const element = await modelFixture(amf, security);
          await aTimeout();
          await aTimeout();
          const spy = sinon.spy();
          element.addEventListener('query-parameter-changed', spy);
          const input = element.shadowRoot.querySelector('[name="testParam"]');
          input.value = 'test';
          assert.isTrue(spy.calledOnce);
        });

        it('dispatches request-header-changed event when view model is created', async () => {
          const spy = sinon.spy();
          document.body.addEventListener('request-header-changed', spy);
          const security = AmfLoader.lookupSecurity(amf, '/check/api-status', 'get');
          await modelFixture(amf, security);
          await aTimeout();
          await aTimeout();
          document.body.removeEventListener('query-parameter-changed', spy);
          assert.ok(spy.callCount, 2);
        });

        it('dispatches request-header-changed event when value change', async () => {
          const security = AmfLoader.lookupSecurity(amf, '/check/api-status', 'get');
          const element = await modelFixture(amf, security);
          await aTimeout();
          await aTimeout();
          const spy = sinon.spy();
          element.addEventListener('request-header-changed', spy);
          const input = element.shadowRoot.querySelector('[name="Client-Id"]');
          input.value = 'test';
          assert.isTrue(spy.calledOnce);
        });
      });
    });
  });
});
