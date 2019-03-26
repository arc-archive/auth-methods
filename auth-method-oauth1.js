/**
@license
Copyright 2016 The Advanced REST client authors <arc@mulesoft.com>
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
import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import {EventsTargetMixin} from '../../@advanced-rest-client/events-target-mixin/events-target-mixin.js';
import {AmfHelperMixin} from '../../@api-components/amf-helper-mixin/amf-helper-mixin.js';
import {AuthMethodsMixin} from './auth-methods-mixin.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
import '../../@advanced-rest-client/paper-masked-input/paper-masked-input.js';
import '../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../@polymer/paper-button/paper-button.js';
import '../../@polymer/paper-input/paper-input.js';
import '../../@advanced-rest-client/arc-icons/arc-icons.js';
import '../../@polymer/paper-styles/paper-styles.js';
import '../../@polymer/iron-flex-layout/iron-flex-layout.js';
import '../../@polymer/iron-form/iron-form.js';
import '../../@polymer/paper-item/paper-item.js';
import '../../@polymer/paper-toast/paper-toast.js';
import '../../@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../@polymer/paper-listbox/paper-listbox.js';
import '../../@polymer/paper-spinner/paper-spinner.js';
import './auth-methods-styles.js';
/**
 * The `<auth-method-oauth1>` element displays a form to provide the OAuth 1a settings.
 *
 * ### Example
 *
 * ```html
 * <auth-method-oauth1 consumer-key="xyz"></auth-method-oauth1>
 * ```
 *
 * ### Required form fields
 *
 * - Consumer key
 * - Timestamp
 * - Nonce
 * - Signature method
 *
 * ## Authorizing the user
 *
 * This element displays form for user input only. To perform authorization and
 * later to sign the request, add `oauth-authorization/oauth1-authorization.html`
 * to the DOM. This element sends `oauth1-token-requested` that is handled by
 * autorization element.
 *
 * Note that the OAuth1 authorization wasn't designed for browser. Most existing
 * OAuth1 implementation disallow browsers to perform the authorization by
 * not allowing POST requests to authorization server. Therefore receiving token
 * may not be possible without using browser extensions to alter HTTP request to
 * enable CORS.
 * If the server disallow obtaining authorization token and secret from clients
 * then the application should listen for `oauth1-token-requested` custom event
 * and perform authorization on the server side.
 *
 * When application is performing authorization instead of `oauth1-authorization`
 * element then the application should dispatch `oauth1-token-response` custom event
 * with `oauth_token` and `oauth_token_secret` properties set on detail object.
 * This element handles the response to reset UI state and to updates other elements
 * status that works with authorization.
 *
 * ## Signing the request
 *
 * See description for `oauth-authorization/oauth1-authorization.html` element.
 *
 * ### Styling
 *
 * `<auth-methods>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--auth-method-oauth1` | Mixin applied to the element. | `{}`
 * `--auth-method-panel` | Mixin applied to all auth elements. | `{}`
 *
 * ### Theming
 *
 * Use this mixins as a theming option across all ARC elements.
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--icon-button` | Mixin applied to `paper-icon-buttons`. | `{}`
 * `--icon-button-hover` | Mixin applied to `paper-icon-buttons` when hovered. | `{}`
 * `--input-line-color` | Mixin applied to the input underline | `{}`
 * `--auth-button` | Mixin applied to authorization and next buttons` | `{}`
 * `--auth-button-hover` | Mixin for :hover state for authorization and next buttons` | `{}`
 * `--auth-button-disabled` | Mixin for disabled state for authorization and next buttons` | `{}`
 *
 * ## Changes in version 2
 * - Crypto library is no linger included into the element.
 * Use `advanced-rest-client/cryptojs-lib` component to include the library if your project doesn't use crypto libraries already.
 *
 * @customElement
 * @polymer
 * @memberof UiElements
 * @appliesMixin EventsTargetMixin
 * @appliesMixin ArcBehaviors.AuthMethodsMixin
 * @appliesMixin ApiElements.AmfHelperMixin
 * @demo demo/oauth1.html
 */
class AuthMethodOauth1 extends AmfHelperMixin(AuthMethodsMixin(EventsTargetMixin(PolymerElement))) {
  static get template() {
    return html`
    <style include="auth-methods-styles">
    :host {
      display: block;
      @apply --auth-method-panel;
      @apply --auth-method-oauth1;
    }

    .form {
      max-width: 700px;
    }

    .grant-dropdown {
      width: 320px;
    }

    .auth-button {
      background-color: var(--primary-color);
      color: rgba(255, 255, 255, 0.87);
      @apply --auth-button;
    }

    .auth-button:hover {
      @apply --auth-button-hover;
    }

    .auth-button[disabled] {
      background-color: rgba(0, 0, 0, 0.24);
      color: rgba(0, 0, 0, 0.54);
      @apply --auth-button-disabled;
    }

    .authorize-actions {
      margin-top: 12px;
      @apply --layout-horizontal;
      @apply --layout-center;
    }

    paper-item:hover {
      @apply --paper-item-hover;
    }
    </style>
    <div class="form">
      <iron-form>
        <form autocomplete="on">
          <paper-dropdown-menu label="Authorization token method" class="auth-token-method" required="" auto-validate="">
            <paper-listbox slot="dropdown-content" selected="{{authTokenMethod}}" attr-for-selected="data-type">
              <paper-item data-type="GET">GET</paper-item>
              <paper-item data-type="POST">POST</paper-item>
            </paper-listbox>
          </paper-dropdown-menu>
          <paper-dropdown-menu label="Oauth parameters location" class="auth-params-location" required="" auto-validate="">
            <paper-listbox slot="dropdown-content" selected="{{authParamsLocation}}" attr-for-selected="data-type">
              <paper-item data-type="querystring">Query string</paper-item>
              <paper-item data-type="authorization">Authorization header</paper-item>
            </paper-listbox>
          </paper-dropdown-menu>
          <paper-masked-input auto-validate="" required="" label="Consumer key" value="{{consumerKey}}" data-field="consumerKey" autocomplete="on"></paper-masked-input>
          <paper-masked-input label="Consumer secret" value="{{consumerSecret}}" data-field="consumerSecret" autocomplete="on"></paper-masked-input>
          <paper-masked-input auto-validate="" label="Token" value="{{token}}" data-field="token" autocomplete="on"></paper-masked-input>
          <paper-masked-input label="Token secret" value="{{tokenSecret}}" data-field="tokenSecret" autocomplete="on"></paper-masked-input>
          <paper-input label="Request token URL" value="{{requestTokenUri}}"></paper-input>
          <paper-input label="Token Authorization URL" value="{{accessTokenUri}}"></paper-input>
          <paper-input label="User authorization dialog URL" value="{{authorizationUri}}"></paper-input>
          <paper-input label="Redirect URL" value="{{redirectUri}}"></paper-input>
          <paper-input auto-validate="" required="" label="Timestamp" value="{{timestamp}}" type="text" data-field="timestamp" autocomplete="on">
            <paper-icon-button slot="suffix" class="action-icon" on-tap="_genTimestamp" icon="arc:cached" alt="Regenerate input icon" title="Regenerate timestamp"></paper-icon-button>
            <paper-icon-button slot="suffix" class="action-icon" on-tap="_clearField" icon="arc:clear" alt="Clear input icon" title="Clear input"></paper-icon-button>
          </paper-input>
          <paper-input auto-validate="" required="" label="Nonce" value="{{nonce}}" type="text" data-field="nonce" autocomplete="on">
            <paper-icon-button slot="suffix" class="action-icon" on-tap="_genNonce" icon="arc:cached" alt="Regenerate input icon" title="Regenerate nonce"></paper-icon-button>
            <paper-icon-button slot="suffix" class="action-icon" on-tap="_clearField" icon="arc:clear" alt="Clear input icon" title="Clear input"></paper-icon-button>
          </paper-input>
          <paper-input label="Realm" value="{{realm}}" type="text" data-field="realm" autocomplete="on"></paper-input>
          <paper-dropdown-menu label="Signature method" class="grant-dropdown" required="" auto-validate="">
            <paper-listbox slot="dropdown-content" selected="{{signatureMethod}}" attr-for-selected="data-type">
              <template is="dom-repeat" items="[[signatureMethods]]">
                <paper-item data-type\$="[[item]]">[[item]]</paper-item>
              </template>
            </paper-listbox>
          </paper-dropdown-menu>
          <div class="authorize-actions">
            <paper-button disabled\$="[[_authorizing]]" class="auth-button" on-tap="authorize">Authorize</paper-button>
            <paper-spinner active="[[_authorizing]]"></paper-spinner>
          </div>
        </form>
      </iron-form>
    </div>
    <paper-toast text="" duration="5000"></paper-toast>
`;
  }

  static get is() {
    return 'auth-method-oauth1';
  }
  static get properties() {
    return {
      // Client ID aka consumer key
      consumerKey: {
        type: String,
        notify: true,
        observer: '_settingsChanged'
      },
      // The client secret aka consumer secret
      consumerSecret: {
        type: String,
        notify: true,
        observer: '_settingsChanged'
      },
      // Oauth 1 token (from the oauth console)
      token: {
        type: String,
        notify: true,
        observer: '_settingsChanged'
      },
      // Oauth 1 token secret (from the oauth console)
      tokenSecret: {
        type: String,
        notify: true,
        observer: '_settingsChanged'
      },
      // Timestamp
      timestamp: {
        type: Number,
        notify: true,
        observer: '_settingsChanged'
      },
      // The nonce generated for this request
      nonce: {
        type: String,
        notify: true,
        observer: '_settingsChanged'
      },
      // Optional realm
      realm: {
        type: String,
        notify: true,
        observer: '_settingsChanged'
      },
      /**
       * Signature method. Enum {`HMAC-SHA256`, `HMAC-SHA1`, `PLAINTEXT`}
       */
      signatureMethod: {
        type: String,
        value: 'HMAC-SHA1',
        notify: true,
        observer: '_settingsChanged'
      },
      // True when currently authorizing the user.
      _authorizing: Boolean,
      /**
       * Authorization callback URI
       */
      redirectUri: {
        type: String,
        observer: '_settingsChanged'
      },
      /**
       * OAuth1 endpoint to obtain request token to request user authorization.
       */
      requestTokenUri: {
        type: String,
        observer: '_settingsChanged'
      },
      /**
       * Endpoint to authorize the token.
       */
      accessTokenUri: {
        type: String,
        observer: '_settingsChanged'
      },
      /**
       * HTTP method to obtain authorization header.
       * Spec recommends POST
       */
      authTokenMethod: {
        type: String,
        value: 'POST',
        observer: '_settingsChanged'
      },
      /**
       * A location of the OAuth 1 authorization parameters.
       * It can be either in the URL as a query string (`querystring` value)
       * or in the authorization header (`authorization`) value.
       */
      authParamsLocation: {
        type: String,
        value: 'authorization',
        observer: '_settingsChanged'
      },
      /**
       * An URI to authentication endpoint where the user should be redirected
       * to auththorize the app.
       */
      authorizationUri: {
        type: String,
        observer: '_settingsChanged'
      },
      /**
       * RAML `securedBy` obejct definition.
       * If set, it will prefill the settings in the auth panel.
       */
      amfSettings: {
        type: Object,
        observer: '_amfSettingsChanged'
      },
      /**
       * List of currently support signature methods.
       * This can be updated when `amfSettings` property is set.
       */
      signatureMethods: Array
    };
  }
  /**
   * Returns default list of signature methods for OAuth1
   */
  get defaultSignatureMethods() {
    return ['HMAC-SHA1', 'RSA-SHA1', 'PLAINTEXT'];
  }

  constructor() {
    super();
    this._oauth1ErrorHandler = this._oauth1ErrorHandler.bind(this);
    this._tokenResponseHandler = this._tokenResponseHandler.bind(this);
  }

  _attachListeners() {
    window.addEventListener('oauth1-error', this._onAuthSettings);
    window.addEventListener('oauth1-token-response', this._tokenResponseHandler);
  }

  _detachListeners() {
    window.removeEventListener('oauth1-error', this._onAuthSettings);
    window.removeEventListener('oauth1-token-response', this._tokenResponseHandler);
  }

  ready() {
    super.ready();
    this._genTimestamp();
    this._genNonce();
    if (!this.signatureMethods) {
      this.signatureMethods = this.defaultSignatureMethods;
    }
  }

  /**
   * Validates the form.
   *
   * @return {Boolean} `true` if valid, `false` otherwise.
   */
  validate() {
    const form = this.shadowRoot.querySelector('iron-form');
    return form.validate();
  }
  /**
   * Called each time when any of the settings change. It informs application
   * that the user updated the form.
   * It fires `auth-settings-changed` custom event even if the form is invalid
   * (missing some info).
   *
   * The `valid` property is always if `settings.token` amd
   * `settings.tokenSecret` is not set.
   */
  _settingsChanged() {
    let validationResult = this.validate();
    const settings = this.getSettings();
    if (validationResult) {
      if (!settings || !settings.token || !settings.tokenSecret) {
        validationResult = false;
      }
    }
    const detail = {
      settings: settings,
      type: 'oauth1',
      valid: validationResult
    };
    this.dispatchEvent(new CustomEvent('auth-settings-changed', {
      detail: detail,
      bubbles: true,
      composed: true
    }));
  }

  getSettings() {
    return {
      consumerKey: this.consumerKey,
      consumerSecret: this.consumerSecret,
      token: this.token,
      tokenSecret: this.tokenSecret,
      timestamp: this.timestamp,
      nonce: this.nonce,
      realm: this.realm,
      signatureMethod: this.signatureMethod,
      requestTokenUri: this.requestTokenUri,
      accessTokenUri: this.accessTokenUri,
      redirectUri: this.redirectUri,
      authTokenMethod: this.authTokenMethod,
      authParamsLocation: this.authParamsLocation,
      authorizationUri: this.authorizationUri,
      type: 'oauth1'
    };
  }

  /**
   * Restores settings from stored value.
   *
   * @param {Object} settings Object returned by `_getSettings()`
   */
  restore(settings) {
    this.consumerKey = settings.consumerKey;
    this.consumerSecret = settings.consumerSecret;
    this.token = settings.token;
    this.tokenSecret = settings.tokenSecret;
    this.timestamp = settings.timestamp;
    this.nonce = settings.nonce;
    this.realm = settings.realm;
    this.signatureMethod = settings.signatureMethod;
    this.requestTokenUri = settings.requestTokenUri;
    this.accessTokenUri = settings.accessTokenUri;
    this.redirectUri = settings.redirectUri;
    this.authTokenMethod = settings.authTokenMethod;
    this.authParamsLocation = settings.authParamsLocation;
    this.authorizationUri = settings.authorizationUri;
  }

  // Removes a value from the (paper-)input going up through path of the event.
  _clearField(e) {
    const path = e.target.path;
    let inputTarget;
    while ((inputTarget = path.shift())) {
      if (inputTarget.nodeName === 'INPUT' || inputTarget.nodeName === 'PAPER-INPUT') {
        break;
      }
    }
    if (!inputTarget) {
      return;
    }
    inputTarget.value = '';
  }

  /**
   * Sends the `oauth2-token-requested` event.
   * @return {Boolean} True if event was sent. Can be false if event is not
   * handled or when the form is invalid.
   */
  authorize() {
    this._authorizing = true;
    const detail = {};
    if (this.consumerKey) {
      detail.consumerKey = this.consumerKey;
    }
    if (this.consumerSecret) {
      detail.consumerSecret = this.consumerSecret;
    }
    if (this.token) {
      detail.token = this.token;
    }
    if (this.tokenSecret) {
      detail.tokenSecret = this.tokenSecret;
    }
    if (this.timestamp) {
      detail.timestamp = this.timestamp;
    }
    if (this.nonce) {
      detail.nonce = this.nonce;
    }
    if (this.realm) {
      detail.realm = this.realm;
    }
    if (this.signatureMethod) {
      detail.signatureMethod = this.signatureMethod;
    }
    if (this.requestTokenUri) {
      detail.requestTokenUri = this.requestTokenUri;
    }
    if (this.accessTokenUri) {
      detail.accessTokenUri = this.accessTokenUri;
    }
    if (this.redirectUri) {
      detail.redirectUri = this.redirectUri;
    }
    if (this.authParamsLocation) {
      detail.authParamsLocation = this.authParamsLocation;
    }
    if (this.authTokenMethod) {
      detail.authTokenMethod = this.authTokenMethod;
    }
    if (this.authorizationUri) {
      detail.authorizationUri = this.authorizationUri;
    }
    detail.type = 'oauth1';
    this.dispatchEvent(new CustomEvent('oauth1-token-requested', {
      detail: detail,
      bubbles: true,
      composed: true
    }));
    return true;
  }
  /**
   * Handles OAuth1 authorization errors.
   */
  _oauth1ErrorHandler(e, detail) {
    this._authorizing = false;
    const toast = this.shadowRoot.querySelecrtor('paper-toast');
    toast.text = detail.message;
    toast.opened = true;
  }

  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  // jscs:disable requireDotNotation

  /**
   * Handler for the `oauth1-token-response` custom event.
   * Sets `token` and `tokenSecret` properties from the event.
   */
  _tokenResponseHandler(e) {
    this._authorizing = false;
    this.token = e.detail.oauth_token;
    this.tokenSecret = e.detail.oauth_token_secret;
  }
  // Returns current timestamp in seconds
  _genTimestamp() {
    const t = Math.floor(Date.now() / 1000);
    this.timestamp = t;
  }
  /**
   * Returns autogenerated nocne
   * @param {?Number} length Optional, size of generated string. Default to 32.
   * @return {String} Generated nonce string.
   */
  _genNonce(length) {
    const result = [];
    const chrs = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const chrsLength = chrs.length;
    length = Number(length || 32);
    if (length !== length) {
      length = 32;
    }
    for (let i = 0; i < length; i++) {
      result[result.length] = (chrs[Math.floor(Math.random() * chrsLength)]);
    }
    this.nonce = result.join('');
  }
  /**
   * Called when the AMF object change
   */
  _amfSettingsChanged(model) {
    if (!model) {
      this.signatureMethods = this.defaultSignatureMethods;
      return;
    }
    const prefix = this.ns.raml.vocabularies.security;
    const shKey = this._getAmfKey(prefix + 'scheme');
    let scheme = model[shKey];
    let type;
    if (scheme) {
      if (scheme instanceof Array) {
        scheme = scheme[0];
      }
      type = this._getValue(scheme, prefix + 'type');
    }
    if (type !== 'OAuth 1.0') {
      this.signatureMethods = this.defaultSignatureMethods;
      return;
    }
    const sKey = this._getAmfKey(this.ns.raml.vocabularies.security + 'settings');
    let settings = scheme[sKey];
    if (settings instanceof Array) {
      settings = settings[0];
    }
    if (!settings) {
      this.signatureMethods = this.defaultSignatureMethods;
      return;
    }
    this.requestTokenUri = this._getValue(settings, prefix + 'requestTokenUri');
    this.authorizationUri = this._getValue(settings, prefix + 'authorizationUri');
    this.accessTokenUri = this._getValue(settings, prefix + 'tokenCredentialsUri');
    const signaturtes = this._getValueArray(settings, prefix + 'signature');
    if (!signaturtes || !signaturtes.length) {
      this.signatureMethods = this.defaultSignatureMethods;
    } else {
      this.signatureMethods = signaturtes;
    }
  }
  /**
   * Fired when user requested to perform an authorization.
   * The details object vary depends on the `grantType` property.
   * However this event always fire two properties set on the `detail` object: `type` and
   * `clientId`.
   *
   * @event oauth1-token-requested
   * @param {String} consumerKey The consumer key. May be undefined if not provided.
   * @param {String} consumerSecret May be undefined if not provided.
   * @param {String} token May be undefined if not provided.
   * @param {String} tokenSecret May be undefined if not provided.
   * @param {String} timestamp May be undefined if not provided.
   * @param {String} nonce May be undefined if not provided.
   * @param {String} realm May be undefined if not provided.
   * @param {String} signatureMethod May be undefined if not provided.
   * @param {String} type Always `oauth1`
   */
  /**
   * Fired when the any of the auth method settings has changed.
   * This event will be fired quite frequently - each time anything in the text field changed.
   * With one exception. This event will not be fired if the validation of the form didn't passed.
   *
   * @event auth-settings-changed
   * @param {Object} settings Current settings. See the
   * `oauth1-token-requested` for detailed description.
   * @param {String} type The authorization type - oauth1
   */
}
window.customElements.define(AuthMethodOauth1.is, AuthMethodOauth1);
