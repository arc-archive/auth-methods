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
import { ClientCertificatesConsumerMixin } from
'@advanced-rest-client/client-certificates-consumer-mixin/client-certificates-consumer-mixin.js';
import authStyles from './auth-methods-styles.js';
import '@polymer/iron-form/iron-form.js';
import '@anypoint-web-components/anypoint-radio-button/anypoint-radio-button.js';
import '@anypoint-web-components/anypoint-radio-button/anypoint-radio-group.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
/**
 * The `<auth-method-basic>` element displays a form to provide the Basic
 * auth credentials.
 * It calculates base64 has while typing into username or password field.
 *
 * It accepts `hash` as a property and once set it will atempt to decode it
 * and set username and paswword.
 *
 * ### Example
 *
 * ```html
 * <auth-method-basic hash="dGVzdDp0ZXN0"></auth-method-basic>
 * ```
 *
 * This example will produce a form with prefilled username and passowrd with
 * value "test".
 *
 * @customElement
 * @memberof UiElements
 * @demo demo/basic.html
 * @extends AuthMethodBase
 */
class AuthMethodCertificate extends ClientCertificatesConsumerMixin(AuthMethodBase) {
  static get styles() {
    return [
      authStyles,
      css`
      :host {
        display: block;
      }`
    ];
  }

  render() {
    const {
      username,
      password,
      outlined,
      compatibility,
      readOnly,
      disabled
    } = this;
    return html`
      <iron-form>
        <form autocomplete="on">
          <anypoint-input
            .value="${username}"
            @input="${this._usernameHandler}"
            name="username"
            type="text"
            required
            autovalidate
            autocomplete="on"
            .outlined="${outlined}"
            .compatibility="${compatibility}"
            .readOnly="${readOnly}"
            .disabled="${disabled}"
            invalidmessage="Username is required">
            <label slot="label">User name</label>
          </anypoint-input>
          <anypoint-masked-input
            name="password"
            .value="${password}"
            @input="${this._passwordHandler}"
            autocomplete="on"
            .outlined="${outlined}"
            .compatibility="${compatibility}"
            .readOnly="${readOnly}"
            .disabled="${disabled}">
            <label slot="label">Password</label>
          </anypoint-masked-input>
        </form>
      </iron-form>`;
  }

  static get properties() {
    return {
      /**
       * The id of selected certificate.
       */
      selected: { type: String },
    };
  }

  constructor() {
    super('client-certificate');
    this._onAuthSettings = this._onAuthSettings.bind(this);
  }

  _attachListeners(node) {
    node.addEventListener('auth-settings-changed', this._onAuthSettings);
  }

  _detachListeners(node) {
    node.removeEventListener('auth-settings-changed', this._onAuthSettings);
  }
  /**
   * Resets state of the form.
   */
  reset() {
    super.reset();
    this.selected = null;
  }
  /**
   * Validates the form.
   *
   * @return {Boolean} Validation result.
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
   * Creates a settings object with user provided data.
   *
   * @return {Object} User provided data
   */
  getSettings() {
    return {

    };
  }
  /**
   * Restores settings from stored value.
   *
   * @param {Object} settings Object returned by `_getSettings()`
   */
  restore(settings) {
    this.selected = settings.id;
  }
  /**
   * Handler to the `auth-settings-changed` event (fired by all auth panels).
   * If the event was fired by other element with the same method ttype
   * then the form will be updated to incomming values.
   * This helps to sync changes between elements in the same app.
   *
   * @param {Event} e
   */
  _onAuthSettings(e) {
    if (this._getEventTarget(e) === this || e.detail.type !== 'client-certificate') {
      return;
    }
    this.restore(e.detail.settings);
  }


  _valueChanged() {
    if (this.__isInputEvent) {
      return;
    }
    this._settingsChanged();
  }
  /**
   * Fired when the any of the auth method settings has changed.
   * This event will be fired quite frequently - each time anything in the text field changed.
   * With one exception. This event will not be fired if the validation of the form didn't passed.
   *
   * @event auth-settings-changed
   * @param {Object} settings Current settings containing hash, password
   * and username.
   * @param {String} type The authorization type - basic
   * @param {Boolean} valid True if the form has been validated.
   */
}
window.customElements.define('auth-method-certificate', AuthMethodCertificate);
