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
      'compatibility',
      'authSettings',
      'authSettingsValue',
    ]);
    this.demoStates = ['Material', 'Anypoint'];
    this._componentName = 'auth-method-certificate';
    this.generateData = this.generateData.bind(this);
    this.deleteData = this.deleteData.bind(this);
    this._authSettingsChanged = this._authSettingsChanged.bind(this);
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

  _authSettingsChanged(e) {
    const value = e.detail;
    this.authSettings = value;
    this.authSettingsValue = value ? JSON.stringify(value, null, 2) : '';
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

  _introductionTemplate() {
    return html `
      <section class="documentation-section">
        <h2>Introduction</h2>
        <p>
          A web component to render accessible certificates based authorization form.
        </p>
        <p>
          This component implements Material Design styles.
        </p>

        <h3>Settings data model</h3>
        <p>
          After updating a value in the editor it produces a data model:
        </p>

        <output>${this.authSettingsValue ? this.authSettingsValue : 'Model not ready'}</output>
      </section>
    `;
  }

  _usageTemplate() {
    return html `
      <section class="documentation-section">
        <h2>Usage</h2>
        <p>Anypoint dropdown menu comes with 2 predefied styles:</p>
        <ul>
          <li><b>Filled</b> (default)</li>
          <li>
            <b>Compatibility</b> - To provide compatibility with Anypoint design
          </li>
        </ul>
      </section>`;
  }

  contentTemplate() {
    return html `
      <h2>Auth method client certificate</h2>
      <client-certificate-model></client-certificate-model>
      ${this._demoTemplate()}
      ${this._introductionTemplate()}
      ${this._usageTemplate()}
    `;
  }
}
const instance = new ComponentDemo();
instance.render();
window.demo = instance;
