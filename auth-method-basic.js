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
import '@anypoint-web-components/anypoint-input/anypoint-input.js';
import '@anypoint-web-components/anypoint-input/anypoint-masked-input.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import '@advanced-rest-client/arc-icons/arc-icons.js';
import '@polymer/iron-form/iron-form.js';
import authStyles from './auth-methods-styles.js';
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
class AuthMethodBasic extends AuthMethodBase {
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
      legacy,
      readOnly,
      disabled
    } = this;
    return html`
      <div class="form-title">Set authorization data</div>
      <iron-form>
        <form autocomplete="on">
          <anypoint-input
            .value="${username}"
            @value-changed="${this._usernameHandler}"
            name="username"
            type="text"
            required
            autovalidate
            autocomplete="on"
            .outlined="${outlined}"
            .legacy="${legacy}"
            .readOnly="${readOnly}"
            .disabled="${disabled}">
            <label slot="label">User name</label>
          </anypoint-input>
          <anypoint-masked-input
            name="password"
            .value="${password}"
            @value-changed="${this._passwordHandler}"
            autocomplete="on"
            .outlined="${outlined}"
            .legacy="${legacy}"
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
       * base64 hash of the uid and passwd. When set it will override
       * current username and password.
       */
      hash: { type: String },
      // The password.
      password: { type: String },
      // The username.
      username: { type: String }
    };
  }

  get username() {
    return this._username;
  }

  set username(value) {
    if (this._sop('username', value)) {
      this._userInputChanged(value, this.password);
      this._notifyChanged('username', value);
    }
  }

  get password() {
    return this._password;
  }

  set password(value) {
    if (this._sop('password', value)) {
      this._userInputChanged(this.username, value);
      this._notifyChanged('password', value);
    }
  }

  get hash() {
    return this._hash;
  }

  set hash(value) {
    if (this._sop('hash', value)) {
      this._hashChanged(value);
      this._settingsChanged(value);
      this._notifyChanged('hash', value);
    }
  }

  constructor() {
    super();
    this._onAuthSettings = this._onAuthSettings.bind(this);
    this._headerChangedHandler = this._headerChangedHandler.bind(this);
  }

  _attachListeners(node) {
    node.addEventListener('auth-settings-changed', this._onAuthSettings);
    node.addEventListener('request-header-changed', this._headerChangedHandler);
  }

  _detachListeners(node) {
    node.removeEventListener('auth-settings-changed', this._onAuthSettings);
    node.removeEventListener('request-header-changed', this._headerChangedHandler);
  }
  /**
   * Resets state of the form.
   */
  reset() {
    this.hash = '';
    this.username = '';
    this.password = '';
  }
  /**
   * Validates the form.
   *
   * @return {Boolean} Validation result.
   */
  validate() {
    const form = this.shadowRoot.querySelector('iron-form');
    if (!form) {
      return true;
    }
    return form.validate();
  }
  /**
   * Dispatches `auth-settings-changed` custom event.
   */
  _settingsChanged() {
    if (this.__cancelChangeEvent) {
      return;
    }
    const e = this._notifySettingsChange('basic');
    this._notifyHeaderChange(e.detail.settings);
  }
  /**
   * Creates a settings object with user provided data.
   *
   * @return {Object} User provided data
   */
  getSettings() {
    return {
      hash: this.hash || '',
      password: this.password || '',
      username: this.username || ''
    };
  }
  /**
   * Restores settings from stored value.
   *
   * @param {Object} settings Object returned by `_getSettings()`
   */
  restore(settings) {
    if (settings.hash) {
      this.hash = settings.hash;
    } else {
      this.password = settings.password;
      this.username = settings.username;
    }
  }
  /**
   * Decodes hash value on change from the external source.
   *
   * @param {String} hash Hash value
   */
  _hashChanged(hash) {
    if (this._internalHashChange || !hash) {
      return;
    }
    try {
      const encoded = atob(hash);
      const parts = encoded.split(':');
      if (parts.length) {
        this._internalHashChange = true;
        this.username = parts[0];
        if (parts[1]) {
          this.password = parts[1];
        }
        this._internalHashChange = false;
      }
    } catch (e) {
      this.dispatchEvent(new CustomEvent('error', {
        detail: {
          error: e
        }
      }));
    }
  }
  /**
   * Computes hash value for given username or password.
   * It computes value if at least one value for username and password is
   * provided. Otherwise it sets hash to empty string.
   *
   * @param {String} uid Username
   * @param {String} passwd Password
   * @return {String} Computed hash.
   */
  hashData(uid, passwd) {
    if (!uid) {
      uid = '';
    }
    if (!passwd) {
      passwd = '';
    }
    let hash;
    if (uid || passwd) {
      const enc = uid + ':' + passwd;
      hash = btoa(enc);
    } else {
      hash = '';
    }
    return hash;
  }
  /**
   * Sets the hash value for current username and password.
   *
   * @param {String} uid Username
   * @param {String} passwd Password
   */
  _userInputChanged(uid, passwd) {
    this._internalHashChange = true;
    this.hash = this.hashData(uid, passwd);
    this._internalHashChange = false;
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
    if (e.target === this || e.detail.type !== 'basic') {
      return;
    }
    this.__cancelChangeEvent = true;
    this.restore(e.detail.settings);
    this.__cancelChangeEvent = false;
  }
  /**
   * Handler for the `request-header-changed` custom event.
   * If the panel is opened the it checks if current header updates
   * authorization.
   * @param {Event} e
   */
  _headerChangedHandler(e) {
    if (e.defaultPrevented || e.target === this) {
      return;
    }
    let name = e.detail.name;
    if (!name) {
      return;
    }
    name = name.toLowerCase();
    if (name !== 'authorization') {
      return;
    }
    let value = e.detail.value;
    if (!value) {
      if (this.hash) {
        this.reset();
      }
      return;
    }
    const lowerValue = value.toLowerCase();
    if (lowerValue.indexOf('basic') !== 0) {
      if (this.hash) {
        this.reset();
      }
      return;
    }
    value = value.substr(6);
    this.__cancelHeaderEvent = true;
    this.hash = value;
    this.__cancelHeaderEvent = false;
  }
  /**
   * Dispatches `request-header-changed` custom event to inform other
   * elements about authorization value change.
   *
   * @param {Object} settings
   */
  _notifyHeaderChange(settings) {
    if (this.__cancelHeaderEvent) {
      return;
    }
    const value = (settings && settings.hash) ? 'Basic ' + settings.hash : 'Basic ';
    this.dispatchEvent(new CustomEvent('request-header-changed', {
      detail: {
        name: 'Authorization',
        value: value
      },
      bubbles: true,
      composed: true
    }));
  }

  _usernameHandler(e) {
    this.username = e.detail.value;
  }

  _passwordHandler(e) {
    this.password = e.detail.value;
  }
  /**
   * Fired when error occured when decoding hash.
   * The event is not bubbling.
   *
   * @event error
   * @param {Error} error The error object.
   */
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
  /**
   * Fired when the header value has changed.
   *
   * @event request-header-changed
   * @param {String} name Name of the header
   * @param {String} value Value of the header
   */
}
window.customElements.define('auth-method-basic', AuthMethodBasic);
