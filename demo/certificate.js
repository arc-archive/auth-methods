import { html } from 'lit-html';
import '@advanced-rest-client/arc-models/client-certificate-model.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '../auth-method-certificate.js';
import { DataGenerator } from '@advanced-rest-client/arc-data-generator/arc-data-generator.js';
import { DemoBase } from './demo-base.js';

class ComponentDemo extends DemoBase {
  constructor() {
    super();
    this.initObservableProperties([
      'compatibility'
    ]);
    this.demoStates = ['Material', 'Anypoint'];
    this._componentName = 'auth-method-certificate';
    this.generateData = this.generateData.bind(this);
    this.deleteData = this.deleteData.bind(this);
  }

  async generateData() {
    await DataGenerator.insertCertificatesData();
    const e = new CustomEvent('data-imported', {
      bubbles: true
    });
    document.body.dispatchEvent(e);
  }

  async deleteData() {
    const e = new CustomEvent('destroy-model', {
      detail: {
        models: ['client-certificates']
      },
      bubbles: true
    });
    document.body.dispatchEvent(e);
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      compatibility,
      readOnly,
      disabled
    } = this;
    return html `
    <section class="documentation-section">
    <h3>Interactive demo</h3>
    <p>
      This demo lets you preview the certificate authorization method element with various
      configuration options.
    </p>

    <arc-interactive-demo
      .states="${demoStates}"
      @state-chanegd="${this._demoStateHandler}"
      ?dark="${darkThemeActive}"
    >

      <auth-method-certificate
        slot="content"
        ?compatibility="${compatibility}"
        ?readOnly="${readOnly}"
        ?disabled="${disabled}"
        @auth-settings-changed="${this._authSettingsChanged}"></auth-method-certificate>

      ${this._baseMainOptions()}
    </arc-interactive-demo>

    <div class="data-options">
      <h3>Data options</h3>

      <anypoint-button @click="${this.generateData}">Generate data</anypoint-button>
      <anypoint-button @click="${this.deleteData}">Clear data</anypoint-button>
    </div>
    </section>`;
  }

  contentTemplate() {
    return html `
      <h2>Auth method client certificate</h2>
      <client-certificate-model></client-certificate-model>
      ${this._demoTemplate()}
    `;
  }
}
const instance = new ComponentDemo();
instance.render();
window.demo = instance;
