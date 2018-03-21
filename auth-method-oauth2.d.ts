/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   auth-method-oauth2.html
 */

/// <reference path="../polymer/types/polymer-element.d.ts" />
/// <reference path="../polymer/types/lib/utils/render-status.d.ts" />
/// <reference path="../polymer/types/lib/elements/dom-if.d.ts" />
/// <reference path="../events-target-behavior/events-target-behavior.d.ts" />
/// <reference path="../paper-masked-input/paper-masked-input.d.ts" />
/// <reference path="../paper-icon-button/paper-icon-button.d.ts" />
/// <reference path="../paper-button/paper-button.d.ts" />
/// <reference path="../paper-input/paper-input.d.ts" />
/// <reference path="../arc-icons/arc-icons.d.ts" />
/// <reference path="../paper-styles/paper-styles.d.ts" />
/// <reference path="../iron-flex-layout/iron-flex-layout.d.ts" />
/// <reference path="../iron-form/iron-form.d.ts" />
/// <reference path="../paper-item/paper-item.d.ts" />
/// <reference path="../paper-toast/paper-toast.d.ts" />
/// <reference path="../paper-dropdown-menu/paper-dropdown-menu.d.ts" />
/// <reference path="../paper-listbox/paper-listbox.d.ts" />
/// <reference path="../oauth2-scope-selector/oauth2-scope-selector.d.ts" />
/// <reference path="../paper-spinner/paper-spinner.d.ts" />
/// <reference path="../iron-collapse/iron-collapse.d.ts" />
/// <reference path="../paper-ripple/paper-ripple.d.ts" />
/// <reference path="../paper-checkbox/paper-checkbox.d.ts" />
/// <reference path="../clipboard-copy/clipboard-copy.d.ts" />
/// <reference path="../api-view-model-transformer/api-view-model-transformer.d.ts" />
/// <reference path="../api-property-form-item/api-property-form-item.d.ts" />
/// <reference path="../marked-element/marked-element.d.ts" />
/// <reference path="../markdown-styles/markdown-styles.d.ts" />
/// <reference path="auth-methods-mixin.d.ts" />
/// <reference path="auth-methods-styles.d.ts" />
/// <reference path="auth-method-step.d.ts" />

declare namespace UiElements {

  /**
   * The `<auth-method-oauth2>` element displays a form to provide the OAuth 2.0 settings.
   *
   * ### Example
   *
   * ```html
   * <auth-method-oauth2></auth-method-oauth2>
   * ```
   *
   * This element uses `oauth2-scope-selector` so the `allowedScopes`, `preventCustomScopes` and
   * `scopes` properties will be set on this element. See documentation of `oauth2-scope-selector`
   * for more description.
   *
   * ### Forcing the user to select scope from the list
   *
   * ```html
   * <auth-method-oauth2 prevent-custom-scopes></auth-method-oauth2>
   * ```
   *
   * ```javascript
   * var form = document.querySelector('auth-method-oauth2');
   * form.allowedScopes = ['profile', 'email'];
   * ```
   *
   * ## Authorizing the user
   * The element sends the `oauth2-token-requested` with the OAuth settings provided with the form.
   * Any element / app can handle this event and perform authorization.
   * *
   * When the authorization is performed the app / other element should set back `accessToken` property
   * of this element or send the `oauth2-token-response` with token response value so the change will
   * can reflected in the UI.
   * ARC provides the `oauth2-authorization` element that can handle this events.
   *
   * ### Example
   *
   * ```html
   * <auth-method-oauth2></auth-method-oauth2>
   * <oauth2-authorization></oauth2-authorization>
   * ```
   *
   * The `oauth2-authorization` can be set anywhere in the DOM up from this element siblings to the
   * body. See demo for example usage.
   *
   *      ## Redirect URL
   * Most OAuth 2 providers requires setting the redirect URL with the request. This can't be changed
   * by the user and redirect URL can be only set in the provider's settings panel. The element
   * accepts the `redirectUri` property which will be displayed to the user that (s)he has to set up
   * this callback URL in the OAuth provider settings. It can be any URL where token / code will be
   * handled properly and the value returned to the `oauth2-authorization` element.
   * See `oauth2-authorization` documentation for more information.
   *
   * If you going to use `oauth2-authorization` popup then the redirect URL value must be set to:
   * `/bower_components/oauth-authorization/oauth-popup.html`. Mind missing `2` in `oauth-authorization`.
   * This popup is a common popup for auth methods.
   *
   * ### OAuth 2.0 extensibility
   *
   * As per [RFC6749, section 8](https://tools.ietf.org/html/rfc6749#section-8) OAuth 2.0
   * protocol can be extended by custom `grant_type`, custom query parameters and custom headers.
   *
   * This is not yet supported in RAML. However, working together with RAML spec creators,
   * an official RAML annotation to extend OAuth 2.0 settings has been created.
   * The annotation source can be found in the [RAML organization repository](https://github.com/raml-org/raml-annotations/blob/master/annotations/security-schemes/oauth-2-custom-settings.raml).
   *
   * When the annotation is applied to the `ramlSettings` property, this element renders
   * additional form inputs to support custom schemes.
   *
   * This produces additional property in the token authorization request: `customData`.
   * The object contains user input from custom properties.
   * *
   * #### `customData` model
   *
   * ```json
   * customData: {
   *  auth: {
   *    parameters: Array|undefined
   *  },
   *  token: {
   *    parameters: Array|undefined,
   *    headers: Array|undefined,
   *    body: Array|undefined
   *  }
   * }
   * ```
   * `auth` contains properties to be applied to the authorization request.
   * Only query parameetrs are (and can be) supported.
   *
   * `token` property contains properties to be applied when making token request.
   * It can include `parameters` as a query parameters, `headers` as a list
   * of headers to apply, and `body` as a list of properties to send with
   * body.
   *
   * Note: `body` content type is always `application/x-www-form-urlencoded`.
   * `customData.token.body` parameters must not be url encoded. Processors
   * handing token request should handle values encoding.
   *
   * #### Annotation example
   *
   * ```yaml
   *  annotationTypes:
   *    customSettings: !include oauth-2-custom-settings.raml
   *  securitySchemes:
   *    oauth2:
   *      type: OAuth 2.0
   *      describedBy:
   *        headers:
   *          Authorization:
   *            example: "Bearer token"
   *      settings:
   *        (customSettings):
   *          authorizationSettings:
   *            queryParameters:
   *              resource:
   *                type: string
   *                required: true
   *                description: |
   *                  A resource ID that defines a domain of authorization.
   *          accessTokenSettings:
   *            body:
   *              resource:
   *                type: string
   *                required: true
   *                description: |
   *                  A resource ID that defines a domain of authorization.
   *        accessTokenUri: https://auth.domain.com/authorize
   *        authorizationUri: https://auth.domain.com/token
   *        authorizationGrants: [code]
   *     scopes: profile
   * ```
   * ### Styling
   *
   * `<auth-method-oauth2>` provides the following custom properties and mixins for styling:
   *
   * Custom property | Description | Default
   * ----------------|-------------|----------
   * `--auth-method-oauth2` | Mixin applied to the element. | `{}`
   * `--auth-method-panel` | Mixin applied to all auth elements. | `{}`
   * `--auth-grant-dropdown` | Mixin applied to the authorization grants dropdown list | `{}`
   *
   * This is very basic element. Style inputs using `paper-input`'s or `
   * paper-toggle`'s css variables.
   *
   * ### Theming
   * Use this mixins as a theming option across all ARC elements.
   *
   * Custom property | Description | Default
   * ----------------|-------------|----------
   * `--icon-button` | Mixin applied to `paper-icon-buttons`. | `{}`
   * `--icon-button-hover` | Mixin applied to `paper-icon-buttons` when hovered. | `{}`
   * `--input-line-color` | Mixin applied to the input underline | `{}`
   * `--form-label` | Mixin applied to form labels. It will not affect `paper-*` labels | `{}`
   * `--auth-button` | Mixin applied to authorization and next buttons` | `{}`
   * `--auth-button-hover` | Mixin for :hover state for authorization and next buttons` | `{}`
   * `--auth-button-disabled` | Mixin for disabled state for authorization and next buttons` | `{}`
   * `--auth-redirect-section` | Mixin applied to the redirect uri section | `{}`
   * `--error-toast` | Mixin applied to the error toast message | `{}`
   * `--warning-primary-color` | Error toast background color | `#FF7043`
   * `--warning-contrast-color` | Error toast color | `#fff`
   *
   * ## Changes in version 2
   *
   * - Renamed properties
   *  - `authUrl` -> `authorizationUri`
   *  - `redirectUrl` -> `redirectUri`
   *  - `accessTokenUrl` -> `accessTokenUri`
   *  - `tokenValue` -> `accessToken`
   *  - `hasTokenValue` -> `hasAccessToken`
   * - Added `tokenType` to the events describing type of the token.
   * By default it's `Bearer`
   * - **The element does not support RAML js data model anymore**. It uses
   * [AMF](https://github.com/mulesoft/amf/) `json/ld` model. Use AMF to read
   * API spec file (RAML, OAS, etc) and load settings via `amfSettings`
   * property
   * - Added `deliveryMethod` and `deliveryName` properties to the
   * `detail.setting` object.
   */
  class AuthMethodOauth2 extends
    ArcBehaviors.EventsTargetBehavior(
    ArcBehaviors.AuthMethodsMixin(
    Polymer.Element)) {
    readonly _queryModelOpts: any;
    readonly _headersModelOpts: any;

    /**
     * List of OAuth 2.0 grants.
     * This list can be extended by custom grants
     */
    readonly _oauth2GrantTypes: Array<object|null>|null;

    /**
     * Seleted authorization grand type.
     */
    grantType: string|null|undefined;

    /**
     * Computed value, true if the grant type is a cutom definition.
     */
    readonly isCustomGrant: boolean|null|undefined;

    /**
     * Computed value, true if the `grantType` is set.
     */
    readonly isSelectedType: boolean|null|undefined;

    /**
     * If true, OAuth flow selector will be collapsed.
     */
    forceHideTypeSelector: boolean|null|undefined;

    /**
     * The client ID for the auth token.
     */
    clientId: string|null|undefined;

    /**
     * The client secret. It to be used when selected server flow.
     */
    clientSecret: string|null|undefined;

    /**
     * The authorization URL to initialize the OAuth flow.
     */
    authorizationUri: string|null|undefined;

    /**
     * The access token URL to exchange code for token. It is used in server flow.
     */
    accessTokenUri: string|null|undefined;

    /**
     * The password. To be used with the password flow.
     */
    password: string|null|undefined;

    /**
     * The password. To be used with the password flow.
     */
    username: string|null|undefined;

    /**
     * A callback URL to be used with this element.
     * User can't change the callback URL and it will inform the user to setup OAuth to use
     * this value.
     *
     * This is relevant when selected flow is the browser flow.
     */
    redirectUri: string|null|undefined;

    /**
     * List of user selected scopes.
     * It can be pre-populated with list of scopes (array of strings).
     */
    scopes: any[]|null|undefined;

    /**
     * List of pre-defined scopes to choose from. It will be passed to the `oauth2-scope-selector`
     * element.
     */
    allowedScopes: any[]|null|undefined;

    /**
     * If true then the `oauth2-scope-selector` will disallow to add a scope that is not
     * in the `allowedScopes` list. Has no effect if the `allowedScopes` is not set.
     */
    preventCustomScopes: boolean|null|undefined;

    /**
     * True when currently authorizing the user.
     */
    _authorizing: boolean|null|undefined;

    /**
     * When the user authorized the app it should be set to the token value.
     * This element do not perform authorization. Other elements must intercept
     * `oauth2-token-requested` and perform the authorization. As a result the element
     * performing an authorization should set back the auth token on the event target object
     * (this element).
     */
    accessToken: string|null|undefined;

    /**
     * Received from the response token value.
     * By default it is "bearer" as the only one defined in OAuth 2.0
     * spec.
     * If the token response contains `tokenType` property this value is
     * updated.
     */
    tokenType: string|null|undefined;

    /**
     * Computed value, true if access token is set.
     */
    readonly hasAccessToken: boolean|null|undefined;

    /**
     * AMF json/ld mode describing security scheme.
     */
    amfSettings: object|null|undefined;

    /**
     * Currently available grant types.
     */
    grantTypes: any[]|null|undefined;

    /**
     * `true` whem the element has been initialized.
     * When changed it dispatches first oauth settings event with initial
     * values.
     */
    _initialized: boolean|null|undefined;

    /**
     * If true, the flow type selector will be forced to be opened
     */
    _typeSelectorForceOpened: boolean|null|undefined;

    /**
     * The element will automatically hide following fileds it the element has been initialized
     * with values for this fields (without user interaction):
     *
     * - autorization url
     * - token url
     * - scopes
     *
     * If all this values are set then the element will set `isAdvanced` attribute and set
     * `advancedOpened` to false
     *
     * Setting this property will prevent this behavior.
     */
    noAuto: boolean|null|undefined;

    /**
     * If set it will render autorization url, token url and scopes as advanced options
     * activated on user interaction.
     */
    isAdvanced: boolean|null|undefined;

    /**
     * If true then the advanced options are opened.
     */
    advancedOpened: boolean|null|undefined;

    /**
     * If set, the grant typr selector will be hidden from the UI.
     */
    noGrantType: boolean|null|undefined;

    /**
     * List of query parameters to apply to authorization request.
     * This is allowed by the OAuth 2.0 spec as an extension of the
     * protocol.
     * This value is computed if the `ramlSettings` contains annotations
     * and one of it is `customSettings`.
     * See https://github.com/raml-org/raml-annotations for definition.
     */
    readonly authQueryParameters: any[]|null|undefined;

    /**
     * List of query parameters to apply to token request.
     * This is allowed by the OAuth 2.0 spec as an extension of the
     * protocol.
     * This value is computed if the `ramlSettings` contains annotations
     * and one of it is `customSettings`.
     * See https://github.com/raml-org/raml-annotations for definition.
     */
    readonly tokenQueryParameters: any[]|null|undefined;

    /**
     * List of headers to apply to token request.
     * This is allowed by the OAuth 2.0 spec as an extension of the
     * protocol.
     * This value is computed if the `ramlSettings` contains annotations
     * and one of it is `customSettings`.
     * See https://github.com/raml-org/raml-annotations for definition.
     */
    readonly tokenHeaders: any[]|null|undefined;

    /**
     * List of body parameters to apply to token request.
     * This is allowed by the OAuth 2.0 spec as an extension of the
     * protocol.
     * This value is computed if the `ramlSettings` contains annotations
     * and one of it is `customSettings`.
     * See https://github.com/raml-org/raml-annotations for definition.
     */
    readonly tokenBody: any[]|null|undefined;

    /**
     * Default delivery method of access token. Reported with
     * settings change event as `deliveryMethod`.
     *
     * This value is added to event's `settings` property.
     *
     * When setting AMF model, this value may change, if AMF description
     * forces different than default placement of the token.
     */
    oauthDeliveryMethod: string|null|undefined;

    /**
     * Default parameter name that carries access token. Reported with
     * the settings change event as `deliveryName`.
     *
     * This value is added to event's `settings` property.
     *
     * When setting AMF model, this value may change, if AMF description
     * forces different than default parameter name for the token.
     */
    oauthDeliveryName: string|null|undefined;
    _attachListeners(node: any): void;
    _detachListeners(node: any): void;
    ready(): void;

    /**
     * This function hides all non-crucial fields that has been pre-filled when element has been
     * initialize (values not provided by the user). Hidden fields will be available under
     * "advanced" options.
     *
     * To prevent this behavior set `no-auto` attribute on this element.
     */
    _autoHide(): void;

    /**
     * Validates the form.
     *
     * @returns `true` if valid, `false` otherwise.
     */
    validate(): Boolean|null;
    _settingsChanged(): void;

    /**
     * Removes a value from the (paper-)input going up through path of the event.
     */
    _clearField(e: any): void;

    /**
     * Checks if the HTML element should be visible in the UI for given properties.
     */
    _isFieldDisabled(): any;

    /**
     * Computes the `required` attribute on input fileld.
     * When using custom grant type all fields are not required.
     */
    _isFieldRequired(isCustomGrant: Boolean|null): Boolean|null;

    /**
     * Handler for "authorize" button click. Sends the `oauth2-token-requested` event.
     */
    authorize(): void;

    /**
     * Generates `state` parameter for the OAuth2 call.
     *
     * @returns Generated state string.
     */
    generateState(): String|null;

    /**
     * Returns current configuration of the OAuth2.
     *
     * @returns Current OAuth2 configuration.
     */
    getSettings(): object|null;

    /**
     * Adds `customData` property values that can be applied to the
     * authorization request.
     *
     * @param detail Token request detail object. The object is passed
     * by reference so no need for return value
     */
    _computeAuthCustomData(detail: object|null): void;

    /**
     * Adds `customData` property values that can be applied to the
     * token request.
     *
     * @param detail Token request detail object. The object is passed
     * by reference so no need for return value
     */
    _computeTokenCustomData(detail: object|null): void;

    /**
     * Computes list of parameter values from current model.
     *
     * This function ignores empty values if they are not required.
     * Required property are always included, even if the value is not set.
     *
     * @param params Model for form inputs.
     * @returns Array of objects with `name` and `value`
     * properties or undefined if `params` is empty or no values are available.
     */
    _computeCustomParameters(params: any[]|null): any[]|null|undefined;

    /**
     * Restores settings from stored value.
     *
     * @param settings Object returned by `getSettings()`
     */
    restore(settings: object|null): void;

    /**
     * Computes value for `hasAccessToken` property
     *
     * @param newValue Token changed value
     */
    _computeHasToken(newValue: String|null): Boolean|null;

    /**
     * Handler for `oauth2-error` custom event.
     * Informs the user about the error in the flow if the state property
     * is the one used with the request.
     */
    _oauth2ErrorHandler(e: CustomEvent|null): void;

    /**
     * Handler for the token response from the authorization component.
     */
    _tokenSuccessHandler(e: CustomEvent|null): void;

    /**
     * Handler to set up data from the AMF model.
     *
     * @param model Security model of AMF
     */
    _amfChanged(model: object|null): void;
    _setupOAuthDeliveryMethod(model: any): void;

    /**
     * Determines placemenet of OAuth authorization token location.
     * It can be either query parameter or header. This function
     * reads API spec to get this information or provides default if
     * not specifies.
     */
    _getOauth2DeliveryMethod(info: any): object|null;

    /**
     * Reads API security definition and applies itn to the view as predefined
     * values.
     *
     * @param model AMF model describing settings of the security
     * scheme
     */
    _preFillAmfData(model: object|null): void;

    /**
     * Extracts array value from AMF property.
     *
     * @param model Property model
     */
    _getAmfArrayValue(model: any[]|null): Array<String|null>|null|undefined;

    /**
     * Extracts scopes list from the security definition
     */
    _redSecurityScopes(model: any[]|null): Array<String|null>|null|undefined;

    /**
     * Finds a key for Custom
     *
     * @param model Security scheme settings object.
     */
    _amfCustomSettingsKey(model: object|null): String|null|undefined;

    /**
     * Applies `authorizationGrants` from OAuth2 settings annotation.
     *
     * @param gransts OAuth spec grants available for the endpoint
     * @param annotation Read annotation.
     * @returns List of granst to apply.
     */
    _applyAnnotationGranst(gransts: any[]|null, annotation: object|null): any[]|null;

    /**
     * Sets up annotation supported variables to apply form view for:
     * - authorization query parameters
     * - authorization headers
     * - token query parameters
     * - token headers
     * - token body
     *
     * @param annotation Annotation applied to the OAuth settings
     */
    _setupAnotationParameters(annotation: object|null): void;

    /**
     * Sets up query parameters to be used with authorization request.
     *
     * @param params List of parameters from the annotation.
     */
    _setupAuthRequestQueryParameters(params: any[]|null): void;

    /**
     * Sets up query parameters to be used with token request.
     *
     * @param params List of parameters from the annotation.
     */
    _setupTokenRequestQueryParameters(params: any[]|null): void;

    /**
     * Sets up headers to be used with token request.
     *
     * @param params List of parameters from the annotation.
     */
    _setupTokenRequestHeaders(params: any[]|null): void;

    /**
     * Sets up body parameters to be used with token request.
     *
     * @param params List of parameters from the annotation.
     */
    _setupTokenRequestBody(params: any[]|null): void;

    /**
     * Creats a form view model for type items.
     *
     * @param params List of properties to process.
     * @returns Form view model or undefined if not set.
     */
    _createViewModel(params: any[]|null, modelOptions: object|null): Promise<any[]|null|undefined>;

    /**
     * Computes value of `isCustomGrant` property when `grantType` changes.
     *
     * @param grantType Selected grant type.
     * @returns `true` if the `grantType` is none of the ones defined
     * by the OAuth 2.0 spec.
     */
    _computeIsCustomGrant(grantType: String|null): Boolean|null;

    /**
     * Updates list of OAuth grant types supported by current endpoint.
     * The information should be available in RAML file.
     *
     * @param supportedTypes List of supported types. If empty
     * or not set then all available types will be displayed.
     */
    _updateGrantTypes(supportedTypes: Array<String|null>|null): void;

    /**
     * Computes list of grant types to render in the form.
     */
    _computeGrantList(allowed: any): any;

    /**
     * Computes boolean value for `isSelectedType` if `grantType` is set.
     *
     * @param grantType Current grant type.
     * @returns True when the value is set.
     */
    _computeIsSelectedType(grantType: String|null): Boolean|null;

    /**
     * Clears grant type selection.
     */
    _clearTypeSelection(): void;

    /**
     * Computes the label for selected step title.
     *
     * @param grantType Selected grant type.
     * @returns Label to render
     */
    _computeSelectedTypeLabel(grantType: String|null): String|null;
    _copyContent(e: any): void;
    _resetCopyButtonState(button: any): void;
    _updateStepperState(noStepper: any): void;
    _noGrantTypeChanged(newValue: any, oldValue: any): void;

    /**
     * Handler for the `request-header-changed` custom event.
     * If the panel is opened the it checks if current header updates
     * authorization.
     */
    _headerChangedHandler(e: any): void;

    /**
     * Toggles documentartion for custom property.
     */
    _toggleDocumentation(e: CustomEvent|null): void;

    /**
     * Creates a documentation element.
     */
    _createDocsElements(model: object|null, appendTo: object|null): void;

    /**
     * Clears all custom data documention nodes.
     */
    _clearDocs(): void;
  }
}

interface HTMLElementTagNameMap {
  "auth-method-oauth2": UiElements.AuthMethodOauth2;
}
