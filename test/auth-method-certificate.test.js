import { fixture, assert, html, aTimeout } from '@open-wc/testing';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import { DataGenerator } from '@advanced-rest-client/arc-data-generator/arc-data-generator.js';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import '@advanced-rest-client/arc-models/client-certificate-model.js';
import '../auth-method-certificate.js';

describe('<auth-method-certificate>', function() {
  async function basicFixture() {
    return (await fixture(`<auth-method-certificate></auth-method-certificate>`));
  }

  async function queryDataFixture() {
    const elmRequest = fixture(html`<div>
      <client-certificate-model></client-certificate-model>
      <auth-method-certificate></auth-method-certificate>
    </div>`);
    return new Promise((resolve) => {
      window.addEventListener('client-certificate-list', function f(e) {
        window.removeEventListener('client-certificate-list', f);
        const { detail } = e;
        setTimeout(() => {
          detail.result
          .then(() => elmRequest)
          .then((node) => {
            resolve(node.querySelector('auth-method-certificate'));
          });
        });
      });
    });
  }

  async function untilAfterQuery(element, result) {
    return new Promise((resolve) => {
      element.addEventListener('client-certificate-list', function f(e) {
        element.removeEventListener('client-certificate-list', f);
        e.preventDefault();
        e.detail.result = Promise.resolve(result || []);
        setTimeout(() => resolve());
      });
      element.reset();
    });
  }

  describe('Empty state', () => {
    it('render empty state', async () => {
      const element = await basicFixture();
      await untilAfterQuery(element);
      const node = element.shadowRoot.querySelector('.empty-screen');
      assert.ok(node);
    });

    it('queries for certificates when initialized', async () => {
      const spy = sinon.spy();
      window.addEventListener('client-certificate-list', spy);
      await basicFixture();
      assert.isTrue(spy.called);
    });
  });

  describe('Data list', () => {
    before(async () => {
      await DataGenerator.insertCertificatesData({});
    });

    after(async () => {
      await DataGenerator.destroyClientCertificates();
    });

    let element;
    beforeEach(async () => {
      element = await queryDataFixture();
    });

    it('has items set', () => {
      assert.lengthOf(element.items, 15);
    });

    it('renders list items', () => {
      const nodes = element.shadowRoot.querySelectorAll('anypoint-radio-button');
      assert.lengthOf(nodes, 16);
    });

    it('does not render empty state', async () => {
      const node = element.shadowRoot.querySelector('.empty-screen');
      assert.notOk(node);
    });
  });

  describe('datastore-destroyed event handler', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element.items = DataGenerator.generateClientCertificates({ size: 5 });
    });

    it('resets items', () => {
      document.body.dispatchEvent(new CustomEvent('datastore-destroyed', {
        bubbles: true,
        detail: {
          datastore: 'client-certificates'
        }
      }));
      assert.isUndefined(element.items);
    });

    it('ignores other data stores', () => {
      document.body.dispatchEvent(new CustomEvent('datastore-destroyed', {
        bubbles: true,
        detail: {
          datastore: 'saved-requests'
        }
      }));
      assert.lengthOf(element.items, 5);
    });
  });

  describe('data-imported event handler', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('calls reset()', () => {
      const spy = sinon.spy(element, 'reset');
      document.body.dispatchEvent(new CustomEvent('data-imported', {
        bubbles: true
      }));
      assert.isTrue(spy.called);
    });
  });

  describe('client-certificate-delete event handler', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      const items = DataGenerator.generateClientCertificates({ size: 5 });
      await untilAfterQuery(element, items);
    });

    function fire(id, cancelable) {
      if (cancelable === undefined) {
        cancelable = false;
      }
      const e = new CustomEvent('client-certificate-delete', {
        cancelable,
        bubbles: true,
        detail: {
          id
        }
      });
      document.body.dispatchEvent(e);
    }

    it('removes existing item', () => {
      const item = element.items[0];
      fire(item._id);
      assert.lengthOf(element.items, 4);
    });

    it('ignores cancelable event', () => {
      const item = element.items[0];
      fire(item._id, true);
      assert.lengthOf(element.items, 5);
    });

    it('ignores when not on the list', () => {
      fire('some-id', true);
      assert.lengthOf(element.items, 5);
    });
  });

  describe('client-certificate-insert event handler', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      const items = DataGenerator.generateClientCertificates({ size: 5 });
      items.forEach((item, index) => item._id = index + '_');
      await untilAfterQuery(element, items);
    });

    function fire(detail, cancelable) {
      if (cancelable === undefined) {
        cancelable = false;
      }
      const e = new CustomEvent('client-certificate-insert', {
        cancelable,
        bubbles: true,
        detail
      });
      document.body.dispatchEvent(e);
    }

    it('updates existing item', () => {
      let item = element.items[0];
      item = Object.assign({}, item);
      item.name = 'test';
      fire(item);
      assert.equal(element.items[0].name, 'test');
    });

    it('ignores cancelable event', () => {
      let item = element.items[0];
      item = Object.assign({}, item);
      item.name = 'test';
      fire(item, true);
      assert.notEqual(element.items[0].name, 'test');
    });

    it('Adds new item to the list', () => {
      const item = DataGenerator.generateClientCertificate();
      item._id = '6_';
      fire(item);
      assert.lengthOf(element.items, 6);
    });
  });

  describe('Selecting and item', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      const items = DataGenerator.generateClientCertificates({ size: 5 });
      items.forEach((item, index) => item._id = index + '_');
      await untilAfterQuery(element, items);
    });

    it('has default selection', () => {
      assert.equal(element.selected, 'none');
    });

    it('changes selection on item click', () => {
      const node = element.shadowRoot.querySelectorAll('anypoint-radio-button')[1];
      MockInteractions.tap(node);
      assert.notEqual(element.selected, 'none');
      assert.equal(element.selected, node.dataset.id);
    });

    it('generates settings when items is clicked', async () => {
      const node = element.shadowRoot.querySelectorAll('anypoint-radio-button')[1];
      MockInteractions.tap(node);
      const spy = sinon.spy();
      element.addEventListener('auth-settings-changed', spy);
      await aTimeout();
      const detail = spy.args[0][0].detail;
      assert.typeOf(detail.settings, 'object', 'settings is set');
      assert.equal(detail.settings.id, element.selected, 'id is set');
      assert.isTrue(detail.valid, 'valid is set');
      assert.equal(detail.type, 'client-certificate', 'type is set');
    });

    it('ignores settings when none is selected', async () => {
      const nodes = element.shadowRoot.querySelectorAll('anypoint-radio-button');
      const node = nodes[1];
      MockInteractions.tap(node);
      await aTimeout();
      const node0 = nodes[0];
      MockInteractions.tap(node0);
      const spy = sinon.spy();
      element.addEventListener('auth-settings-changed', spy);
      await aTimeout();
      assert.isTrue(spy.called, 'event called');
      const detail = spy.args[0][0].detail;
      assert.notOk(detail, 'settings is not set');
    });
  });

  describe('Restoring settings', () => {
    it('sets selected when settings are restored', async () => {
      const element = await basicFixture();
      await untilAfterQuery(element);
      element.restore({
        id: 'test'
      });
      assert.equal(element.selected, 'test');
    });
  });
});
