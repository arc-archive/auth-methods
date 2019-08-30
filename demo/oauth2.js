import { html, render } from 'lit-html';
import { LitElement } from 'lit-element';
import { ApiDemoPageBase } from '@advanced-rest-client/arc-demo-helper/ApiDemoPage.js';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '@advanced-rest-client/arc-demo-helper/arc-demo-helper.js';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '@api-components/api-navigation/api-navigation.js';
import '@advanced-rest-client/oauth-authorization/oauth2-authorization.js';
import '../auth-method-oauth2.js';

class DemoElement extends AmfHelperMixin(LitElement) {}
window.customElements.define('demo-element', DemoElement);

class ComponentDemo extends ApiDemoPageBase {
  constructor() {
    super();
    this._componentName = 'auth-method-oauth2';

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

    this.defaultScopes = ['email', 'profile'];
    this.allowedScopes = ['email', 'user', 'profile', 'https://www.googleapis.com/auth/analytics.readonly',
      'https://www.googleapis.com/auth/bigquery', 'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/devstorage.read_only', 'https://www.googleapis.com/auth/blogger.readonly',
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/compute',
      'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/firebase',
      'https://www.googleapis.com/auth/fitness.activity.read',
      'https://www.googleapis.com/auth/fitness.body.read',
      'https://www.googleapis.com/auth/fitness.location.read',
      'https://www.googleapis.com/auth/fitness.nutrition.read',
      'https://www.googleapis.com/auth/games', 'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/gmail.readonly', 'openid',
      'https://www.googleapis.com/auth/contacts.readonly',
      'https://www.googleapis.com/auth/user.addresses.read',
      'https://www.googleapis.com/auth/user.emails.read', 'https://www.googleapis.com/auth/user.birthday.read',
      'https://www.googleapis.com/auth/user.phonenumbers.read'];
    this.redirectUri = location.origin +
      '/node_modules/@advanced-rest-client/oauth-authorization/oauth-popup.html';
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
    const key = helper._getAmfKey(helper.ns.raml.vocabularies.security + 'security');
    const security = helper._ensureArray(method[key]);
    const secPrefix = helper.ns.raml.vocabularies.security;
    let oauth;
    for (let i = 0, len = security.length; i < len; i++) {
      const item = security[i];
      const shKey = helper._getAmfKey(secPrefix + 'scheme');
      let scheme = item[shKey];
      if (!scheme) {
        continue;
      }
      if (scheme instanceof Array) {
        scheme = scheme[0];
      }
      const modelType = helper._getValue(scheme, secPrefix + 'type');
      if (modelType === 'OAuth 2.0') {
        oauth = item;
        break;
      }
    }
    this.security = oauth;
  }

  _apiListTemplate() {
    return html`
    <paper-item data-src="oauth2-api.json">Demo api</paper-item>
    <paper-item data-src="oauth2-api-compact.json">Demo api - compact model</paper-item>`;
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
      security,
      defaultScopes,
      allowedScopes,
      redirectUri
    } = this;
    return html `
    <section class="documentation-section">
      <h3>Interactive demo</h3>
      <p>
        This demo lets you preview the OAuth2 authorization method element with various
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

            <auth-method-oauth2
              slot="content"
              .amf="${amf}"
              .amfSettings="${security}"
              ?outlined="${outlined}"
              ?compatibility="${compatibility}"
              ?readOnly="${readOnly}"
              ?disabled="${disabled}"
              accesstokenuri="https://www.googleapis.com/oauth2/v4/token"
              clientid="821776164331-rserncqpdsq32lmbf5cfeolgcoujb6fm.apps.googleusercontent.com"
              authorizationuri="https://accounts.google.com/o/oauth2/v2/auth"
              granttype="implicit"
              .scopes="${defaultScopes}"
              .allowedScopes="${allowedScopes}"
              .redirectUri="${redirectUri}"
              @auth-settings-changed="${this._authSettingsChanged}"></auth-method-oauth2>

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

  _introductionTemplate() {
    return html `
      <section class="documentation-section">
        <h3>Introduction</h3>
        <p>
          A web component to render accessible OAuth2 authorization form.
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
        <p>Anypoint dropdown menu comes with 3 predefied styles:</p>
        <ul>
          <li><b>Filled</b> (default)</li>
          <li><b>Outlined</b></li>
          <li>
            <b>Compatibility</b> - To provide compatibility with Anypoint design
          </li>
        </ul>

        <h3>Without AMF model</h3>
        <auth-method-oauth2 .redirectUri="${this.redirectUri}"></auth-method-oauth2>
      </section>`;
  }

  _render() {
    const { amf } = this;
    render(html`
      ${this.headerTemplate()}

      <demo-element id="helper" .amf="${amf}"></demo-element>
      <oauth2-authorization></oauth2-authorization>

        ${this._demoTemplate()}
        ${this._introductionTemplate()}
        ${this._usageTemplate()}
      `, document.querySelector('#demo'));
  }
}
const instance = new ComponentDemo();
instance.render();
window.demo = instance;
