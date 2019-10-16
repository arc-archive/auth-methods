/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import { html, css } from 'lit-element';
import { AuthMethodBase } from './auth-method-base.js';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import markdownStyles from '@advanced-rest-client/markdown-styles/markdown-styles.js';
import formStyles from '@api-components/api-form-mixin/api-form-styles.js';
import authStyles from './auth-methods-styles.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
// import { help } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@polymer/iron-form/iron-form.js';
import '@advanced-rest-client/arc-marked/arc-marked.js';
import '@api-components/api-view-model-transformer/api-view-model-transformer.js';
import '@api-components/api-property-form-item/api-property-form-item.js';

/**
 * The `<auth-method-custom>` element displays a form to provide the
 * authorization details for RAML's custom security scheme.
 *
 * The element, alike other auth methods, dispatches `auth-settings-changed`
 * custom event. However, it also sends `request-header-changed` and
 * `query-parameters-changed` custom event to directly manipulate values
 * in corresponding UI element. This events are supported with all API components
 * that handles headers or query parameters.
 *
 * This element is rendered empty if `amfSettings` property is not set.
 * Parent element or application should check if model contains the scheme.
 *
 * ### Example
 *
 * ```html
 * <auth-method-custom securityscheme="{...}"></auth-method-custom>
 * ```
 *
 * @customElement
 * @memberof UiElements
 * @appliesMixin AmfHelperMixin
 * @demo demo/custom.html
 * @extends AuthMethodBase
 */
class AuthMethodApikey extends AmfHelperMixin(AuthMethodBase) {
  static get styles() {
    return [
      markdownStyles,
      formStyles,
      authStyles,
      css`
      :host {
        display: block;
      }

      api-property-form-item {
        flex: 1;
        margin: 0.1px 0;
      }`
    ];
  }

  static get properties() {
    return {
      /**
       * AMF security scheme model.
       */
      amfSettings: { type: Object },
      /**
       * Computed list of headers to render in the form.
       */
      _headers: { type: Array },
      /**
       * Computed list of query parameters to render.
       */
      _queryParameters: { type: Array },
      /**
       * Name of the security scheme
       */
      _schemeName: { type: String },
      /**
       * Security scheme description
       */
      _schemeDescription: { type: String },
      /**
       * True to opend scheme descripyion, if available.
       */
      documentationOpened: { type: Boolean }
    };
  }

  get _hasSchemeDescription() {
    if (this.noDocs) {
      return false;
    }
    return !!this._schemeDescription;
  }

  get amfSettings() {
    return this._amfSettings;
  }

  set amfSettings(value) {
    /* istanbul ignore else */
    if (this._sop('amfSettings', value)) {
      this._schemeChanged();
    }
  }

  get _transformer() {
    if (!this.__transformer) {
      this.__transformer = document.createElement('api-view-model-transformer');
    }
    return this.__transformer;
  }

  constructor() {
    super('x-custom');
    this._headerChangedHandler = this._headerChangedHandler.bind(this);
    this._parameterChangedHandler = this._parameterChangedHandler.bind(this);
  }

  disconnectedCallback() {
    /* istanbul ignore else */
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    this.__transformer = null;
  }

  firstUpdated() {
    this._settingsChanged();
  }

  _attachListeners(node) {
    node.addEventListener('request-header-changed', this._headerChangedHandler);
    node.addEventListener('query-parameter-changed', this._parameterChangedHandler);
  }

  _detachListeners(node) {
    node.removeEventListener('request-header-changed', this._headerChangedHandler);
    node.removeEventListener('query-parameter-changed', this._parameterChangedHandler);
  }

  /**
   * Returns current configuration of the OAuth2.
   *
   * @return {Object} Current OAuth2 configuration.
   */
  getSettings() {
    const form = this.shadowRoot.querySelector('iron-form');
    if (!form) {
      return {};
    }
    return form.serializeForm();
  }

  /**
   * Validates the form.
   *
   * @return {Boolean} `true` if valid, `false` otherwise.
   */
  validate() {
    const form = this.shadowRoot.querySelector('iron-form');
    /* istanbul ignore if */
    if (!form) {
      return true;
    }
    return form.validate();
  }
  /**
   * Overrides `AmfHelperMixin.__amfChanged`
   */
  __amfChanged() {
    this._schemeChanged();
  }

  _schemeChanged() {
    if (this.__schemeChangeDebouncer) {
      return;
    }
    this.__schemeChangeDebouncer = true;
    setTimeout(() => {
      this.__schemeChangeDebouncer = false;
      this.__schemeChanged(this.amfSettings);
    });
  }

  __schemeChanged() {
    const model = this.amfSettings;
    const prefix = this.ns.raml.vocabularies.security;
    this._headers = undefined;
    this._queryParameters = undefined;
    if (!this._hasType(model, prefix.ParametrizedSecurityScheme)) {
      return;
    }
    const shKey = this._getAmfKey(prefix.scheme);
    let scheme = model[shKey];
    let type;
    if (scheme) {
      if (scheme instanceof Array) {
        scheme = scheme[0];
      }
      type = this._getValue(scheme, prefix.type);
    }
    if (type !== 'Api Key') {
      return;
    }
    // debugger
    // const hKey = this._getAmfKey(this.ns.aml.vocabularies.apiContract.header);
    // this._createViewModel('header', this._ensureArray(scheme[hKey]));
    // const params = this._readParamsProperties(scheme);
    // this._createViewModel('parameter', params);
    // this._schemeName = this._getValue(model, this.ns.aml.vocabularies.core.name);
    // this._schemeDescription = this._getValue(scheme, this.ns.aml.vocabularies.core.description);
    // this._settingsChanged();
  }
  /**
   * Handler for the `request-header-changed` event.
   * It updates value for a single header if this header is already on the list.
   * @param {CustomEvent} e
   */
  _headerChangedHandler(e) {
    this._updateEventValue(e, this._headers);
  }
  /**
   * Handler for the `query-parameter-changed` event.
   * It updates value for a single parameter if this parameter is already on the list.
   * @param {CustomEvent} e
   */
  _parameterChangedHandler(e) {
    this._updateEventValue(e, this._queryParameters);
  }
  /**
   * Update array value for given type (`headers` or `queryParameters`) for given event.
   * @param {CustomEvent} e
   * @param {Array} model Model to use to update the value.
   */
  _updateEventValue(e, model) {
    if (!model || !model.length) {
      return;
    }
    const target = this._getEventTarget(e);
    if (target === this || e.defaultPrevented) {
      return;
    }
    const name = e.detail.name;
    if (!name || typeof name !== 'string') {
      return;
    }
    for (let i = 0, len = model.length; i < len; i++) {
      const pName = model[i].name;
      if (!pName) {
        continue;
      }
      if (pName === name) {
        model[i].value = e.detail.value;
        this.requestUpdate();
        this._settingsChanged();
        return;
      }
    }
  }

  render() {
    return html``;
  }
}
window.customElements.define('auth-method-apikey', AuthMethodApikey);