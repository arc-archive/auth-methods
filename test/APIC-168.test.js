import { fixture, assert, nextFrame, aTimeout, html } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import '../auth-method-custom.js';


describe('Issue APIC-168', function() {
  async function modelFixture(amf, security) {
    return (await fixture(html`<auth-method-custom .amf="${amf}" .amfSettings="${security}"></auth-method-custom>`));
  }

  const apiFile = 'APIC-168';

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

        it('renders form item for scalar query string', async () => {
          const security = AmfLoader.lookupSecurity(amf, '/querystring', 'get');
          const element = await modelFixture(amf, security);
          await aTimeout();
          await aTimeout();
          const node = element.shadowRoot.querySelector('[name="queryString"]');
          assert.ok(node);
        });

        it('includes scalar value in settings', async () => {
          const security = AmfLoader.lookupSecurity(amf, '/querystring', 'get');
          const element = await modelFixture(amf, security);
          await aTimeout();
          await aTimeout();
          const input = element.shadowRoot.querySelector('[name="queryString"]');
          input.value = 'test';
          await nextFrame();
          const result = element.getSettings();
          assert.deepEqual(result, {
            queryString: 'test'
          });
        });

        it('renders form items for object query string', async () => {
          const security = AmfLoader.lookupSecurity(amf, '/querystring2', 'get');
          const element = await modelFixture(amf, security);
          await aTimeout();
          await aTimeout();
          const node1 = element.shadowRoot.querySelector('[name="start"]');
          assert.ok(node1, 'start property is rendered');
          const node2 = element.shadowRoot.querySelector('[name="page-size"]');
          assert.ok(node2, 'page-size property is rendered');
        });

        it('includes object value in settings', async () => {
          const security = AmfLoader.lookupSecurity(amf, '/querystring2', 'get');
          const element = await modelFixture(amf, security);
          await aTimeout();
          await aTimeout();
          const input = element.shadowRoot.querySelector('[name="start"]');
          input.value = 10;
          await nextFrame();
          const result = element.getSettings();
          assert.deepEqual(result, {
            'start': 10,
            'page-size': ''
          });
        });
      });
    });
  });
});
