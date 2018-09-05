/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   auth-method-digest.html
 */

/// <reference path="../polymer/types/polymer-element.d.ts" />
/// <reference path="../events-target-behavior/events-target-behavior.d.ts" />
/// <reference path="../paper-masked-input/paper-masked-input.d.ts" />
/// <reference path="../paper-checkbox/paper-checkbox.d.ts" />
/// <reference path="../paper-icon-button/paper-icon-button.d.ts" />
/// <reference path="../paper-input/paper-input.d.ts" />
/// <reference path="../iron-collapse/iron-collapse.d.ts" />
/// <reference path="../arc-icons/arc-icons.d.ts" />
/// <reference path="../iron-form/iron-form.d.ts" />
/// <reference path="../paper-dropdown-menu/paper-dropdown-menu.d.ts" />
/// <reference path="../paper-listbox/paper-listbox.d.ts" />
/// <reference path="../paper-item/paper-item.d.ts" />
/// <reference path="auth-methods-mixin.d.ts" />
/// <reference path="auth-methods-styles.d.ts" />
/// <reference path="auth-method-step.d.ts" />

declare namespace UiElements {

  /**
   * The `<auth-method-digest>` element displays a form for digest authentication.
   * The user have to choose is he want to provide username and password only or
   * all digest parameters to calculate final authorization header.
   *
   * In first case, the listeners and the transport method must perform handshake
   * by it's own. Otherwise authorization header should be set with calculated value.
   *
   * ### Example
   * ```
   * <auth-method-digest username="john" password="doe"></auth-method-digest>
   * ```
   *
   * The `settings` property (of the element or even detail property) for full form
   * has the following structure:
   *
   * ```
   * {
   *  "username": String,
   *  "realm": String,
   *  "nonce": String,
   *  "uri": String,
   *  "response": String,
   *  "opaque": String,
   *  "qop": String - can be empty,
   *  "nc": String,
   *  "cnonce": String
   * }
   * ```
   *
   * ## Response calculation
   * Depending on the algorithm and quality of protection (qop) properties the hasing
   * algorithm may need following data:
   * - request URL
   * - request payload (body)
   * - request HTTP method
   *
   * The element should be provided with this information by setting it's properties.
   * However, the element will listen for `url-value-changed`, `http-method-changed`
   * and `body-value-changed` events on the window object. Once the event is handled
   * it will set up corresponding properties.
   * All this events must have a `value` property set on event's detail object.
   *
   *
   * ## Changes in version 2.0
   *
   * - `CryptoJS` library is not included by default. Use
   * `advanced-rest-client/cryptojs-lib` component to include the library if
   * your project doesn't use crypto libraries already.
   *
   * ### Styling
   *
   * `<auth-methods>` provides the following custom properties and mixins for styling:
   *
   * Custom property | Description | Default
   * ----------------|-------------|----------
   * `--auth-method-digest` | Mixin applied to the element. | `{}`
   * `--auth-method-panel` | Mixin applied to all auth elements. | `{}`
   *
   * This is very basic element. Style inputs using `paper-input`'s or `
   * paper-toggle`'s css variables.
   */
  class AuthMethodDigest extends
    ArcBehaviors.EventsTargetBehavior(
    ArcBehaviors.AuthMethodsMixin(
    Object)) {

    /**
     * The password.
     */
    password: string|null|undefined;

    /**
     * The username.
     */
    username: string|null|undefined;

    /**
     * If set then it will display all form fields.
     */
    fullForm: boolean|null|undefined;

    /**
     * Server issued realm.
     */
    realm: string|null|undefined;

    /**
     * Server issued nonce.
     */
    nonce: string|null|undefined;

    /**
     * The realm value for the digest response.
     */
    algorithm: string|null|undefined;

    /**
     * The quality of protection value for the digest response.
     * Either '', 'auth' or 'auth-int'
     */
    qop: string|null|undefined;

    /**
     * Nonce count - increments with each request used with the same nonce
     */
    nc: number|null|undefined;

    /**
     * Client nonce
     */
    cnonce: string|null|undefined;

    /**
     * A string of data specified by the server
     */
    opaque: string|null|undefined;

    /**
     * Hashed response to server challenge
     */
    response: string|null|undefined;

    /**
     * Request HTTP method
     */
    httpMethod: string|null|undefined;

    /**
     * Current request URL.
     */
    requestUrl: string|null|undefined;

    /**
     * Current request body.
     */
    requestBody: string|null|undefined;
    _attachListeners(node: any): void;
    _detachListeners(node: any): void;

    /**
     * Validates the form.
     *
     * @returns Validation result.
     */
    validate(): Boolean|null;

    /**
     * Returns current settings. Object's structure depends on `fullForm`
     * property. If it's `false` then the object will contain username and
     * password. Otherwise it will contain a list of parameters of the
     * Authorization header.
     */
    getSettings(): object|null;

    /**
     * Restores settings from stored value.
     *
     * @param settings Object returned by `_getSettings()`
     */
    restore(settings: object|null): void;
    _processInput(): void;

    /**
     * Clears usernamr field
     */
    clearUsername(): void;

    /**
     * Generates client nonce.
     *
     * @returns Generated client nonce.
     */
    generateCnonce(): any;

    /**
     * Generates the response header based on the parameters provided in the
     * form.
     *
     * See https://en.wikipedia.org/wiki/Digest_access_authentication#Overview
     *
     * @returns A response part of the authenticated digest request.
     */
    generateResponse(): String|null;

    /**
     * Generates HA1 as defined in Digest spec.
     */
    _getHA1(): any;

    /**
     * Generates HA2 as defined in Digest spec.
     */
    _getHA2(): any;

    /**
     * Handler to the `url-value-changed` event. When the element handle this
     * event it will update the `requestUrl` property.
     */
    _onUrlChanged(e: any): void;

    /**
     * Handler to the `http-method-changed` event. When the element handle this
     * event it will update the `httpMethod` property.
     */
    _onHttpMethodChanged(e: any): void;

    /**
     * Handler to the `body-value-changed` event. When the element handle this
     * event it will update the `requestBody` property.
     */
    _onBodyChanged(e: any): void;

    /**
     * Handler to the `auth-settings-changed` event (fired by all auth panels).
     * If the event was fired by other element with the same method ttype
     * then the form will be updated to incomming values.
     * This helps to sync changes between elements in the same app.
     */
    _onAuthSettings(e: any): void;
  }
}

interface HTMLElementTagNameMap {
  "auth-method-digest": UiElements.AuthMethodDigest;
}
