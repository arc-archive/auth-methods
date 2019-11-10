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
import '@advanced-rest-client/date-time/date-time.js';
/**
 * The `<auth-method-certificate>` element renders a form with installed
 * in the application client certificates.
 * The user can select a certificate from the list. Produced settings contains
 * the ID of selected certificate.
 * The application should handle this information by it's own.
 *
 * ### Example
 *
 * ```html
 * <auth-method-certificate selected="DATA STORE ID"></auth-method-certificate>
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
  get styles() {
    return [
      authStyles,
      css`
      :host {
        display: block;
      }

      .button-content {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .cert-meta {
        display: flex;
        flex-direction: column;
      }

      .cert-type-ico {
        color: var(--accent-color);
        text-transform: uppercase;
        margin-right: 8px;
      }

      anypoint-radio-button {
        width: 100%;
        margin: 8px 0;
        align-items: flex-start;
      }

      .default {
        align-items: center;
      }

      .name {
        font-size: 1rem;
        font-weight: 400;
        margin-bottom: 8px;
        margin-top: 7px;
      }

      .created {
        font-size: 0.85rem;
        color: var(--auth-method-certificate-second-line-color, initial);
        font-weight: 200;
      }

      .list {
        overflow: auto;
        max-height: 400px;
      }`
    ];
  }

  render() {
    const {
      compatibility,
      items,
      selected
    } = this;
    if (!items || !items.length) {
      return html`<p class="empty-screen">There are no certificates installed in the application.</p>`;
    }
    return html`<style>${this.styles}</style>
    <div class="form-title">Select a certificate</div>
    <div class="list">
      <anypoint-radio-group
        ?compatibility="${compatibility}"
        attrForSelected="data-id"
        fallbackSelection="none"
        .selected="${selected}"
        @selected-changed="${this._selectedHandler}"
      >
        <anypoint-radio-button
          data-id="none"
          ?compatibility="${compatibility}"
          class="default"
        >None</anypoint-radio-button>
        ${items.map((item) => html`<anypoint-radio-button
          data-id="${item._id}"
          ?compatibility="${compatibility}"
        >
          <div class="cert-meta">
            <span class="name">${item.name}</span>
            <span class="created">Added:
              <date-time
                .date="${item.created}"
                year="numeric"
                month="numeric"
                day="numeric"
                hour="numeric"
                minute="numeric"
              ></date-time>
            </span>
          </div>
        </anypoint-radio-button>`)}
      </anypoint-radio-group>
    </div>
    `;
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
    super();
    this.type = 'client-certificate';
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
    this.selected = '';
  }
  /**
   * Validates the form.
   *
   * @return {Boolean} Validation result.
   */
  validate() {
    return true;
  }
  /**
   * Creates a settings object with user provided data.
   *
   * @return {Object} User provided data
   */
  getSettings() {
    const { selected } = this;
    if (!selected || selected === 'none') {
      return;
    }
    return {
      id: this.selected
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

  _selectedHandler(e) {
    const { value } = e.detail;
    this.selected = value;
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
