import { html, render } from 'lit-html';
import { LitElement } from 'lit-element';
import { ApiDemoPageBase } from '@advanced-rest-client/arc-demo-helper/ApiDemoPage.js';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '@advanced-rest-client/arc-demo-helper/arc-demo-helper.js';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '@api-components/api-navigation/api-navigation.js';
import '../auth-method-apikey.js';

class DemoElement extends AmfHelperMixin(LitElement) {}
window.customElements.define('demo-element', DemoElement);

class ComponentDemo extends ApiDemoPageBase {
  constructor() {
    super();
    this._componentName = 'auth-method-apikey';

    this.initObservableProperties([
      'outlined',
      'compatibility',
      'readOnly',
      'disabled',
      'authSettings',
      'authSettingsValue',
      'security'
    ]);
    this.demoStates = ['Filled', 'Outlined', 'Anypoint'];
    this._demoStateHandler = this._demoStateHandler.bind(this);
    this._toggleMainOption = this._toggleMainOption.bind(this);
    this._authSettingsChanged = this._authSettingsChanged.bind(this);
  }

  _demoStateHandler(e) {
    const state = e.detail.value;
    switch (state) {
      case 0:
        this.outlined = false;
        this.compatibility = false;
        break;
      case 1:
        this.outlined = true;
        this.compatibility = false;
        break;
      case 2:
        this.outlined = false;
        this.compatibility = true;
        break;
    }
  }

  _toggleMainOption(e) {
    const { name, checked } = e.target;
    this[name] = checked;
  }

  _authSettingsChanged(e) {
    const value = e.detail;
    this.authSettings = value;
    this.authSettingsValue = value ? JSON.stringify(value, null, 2) : '';
  }

  get helper() {
    if (!this.__helper) {
      this.__helper = document.getElementById('helper');
    }
    return this.__helper;
  }

  _navChanged(e) {
    const { selected, type } = e.detail;
    if (type === 'method') {
      this.setData(selected);
      this.hasData = true;
    } else {
      this.hasData = false;
    }
  }

  setData(selected) {
    const helper = this.helper;
    const webApi = helper._computeWebApi(this.amf);
    const method = helper._computeMethodModel(webApi, selected);
    const key = helper._getAmfKey(helper.ns.aml.vocabularies.security.security);
    const security = helper._ensureArray(method[key]);
    const secPrefix = helper.ns.aml.vocabularies.security;
    let auth;
    for (let i = 0, len = security.length; i < len; i++) {
      const item = security[i];
      const shKey = helper._getAmfKey(secPrefix.scheme);
      let scheme = item[shKey];
      if (!scheme) {
        continue;
      }
      if (scheme instanceof Array) {
        scheme = scheme[0];
      }
      const modelType = helper._getValue(scheme, secPrefix.type);
      if (modelType === 'Api Key') {
        auth = item;
        break;
      }
    }
    this.security = auth;
  }

  _apiListTemplate() {
    return [
      ['api-keys', 'Demo API'],
    ].map(([file, label]) => html`
      <paper-item data-src="${file}-compact.json">${label} - compact model</paper-item>
      <paper-item data-src="${file}.json">${label}</paper-item>
      `);
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      outlined,
      compatibility,
      readOnly,
      disabled,
      amf,
      security
    } = this;
    return html `
    <section class="documentation-section">
      <h3>Interactive demo</h3>
      <p>
        This demo lets you preview the OAS' apiKey authorization method element with various
        configuration options.
      </p>

      <section role="main" class="horizontal-section-container centered main">
        ${this._apiNavigationTemplate()}
        <div class="demo-container">

          <arc-interactive-demo
            .states="${demoStates}"
            @state-chanegd="${this._demoStateHandler}"
            ?dark="${darkThemeActive}"
          >

            <auth-method-apikey
              slot="content"
              .amf="${amf}"
              .amfSettings="${security}"
              ?outlined="${outlined}"
              ?compatibility="${compatibility}"
              ?readOnly="${readOnly}"
              ?disabled="${disabled}"
              @auth-settings-changed="${this._authSettingsChanged}"></auth-method-apikey>

            <label slot="options" id="mainOptionsLabel">Options</label>
            <anypoint-checkbox
              aria-describedby="mainOptionsLabel"
              slot="options"
              name="readOnly"
              @change="${this._toggleMainOption}"
              >Read only</anypoint-checkbox
            >
            <anypoint-checkbox
              aria-describedby="mainOptionsLabel"
              slot="options"
              name="disabled"
              @change="${this._toggleMainOption}"
              >Disabled</anypoint-checkbox
            >
          </arc-interactive-demo>
        </div>
      </section>
    </section>`;
  }

  _render() {
    const { amf } = this;
    render(html`
      ${this.headerTemplate()}

      <demo-element id="helper" .amf="${amf}"></demo-element>

      ${this._demoTemplate()}
      `, document.querySelector('#demo'));
  }
}
const instance = new ComponentDemo();
instance.render();
window.demo = instance;
