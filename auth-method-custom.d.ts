/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   auth-method-custom.html
 */

/// <reference path="auth-methods-mixin.d.ts" />
/// <reference path="auth-methods-styles.d.ts" />
/// <reference path="auth-method-step.d.ts" />

declare namespace UiElements {

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
   * <auth-method-custom security-scheme="{...}"></auth-method-custom>
   * ```
   *
   * ### Styling
   * `<auth-methods>` provides the following custom properties and mixins for styling:
   *
   * Custom property | Description | Default
   * ----------------|-------------|----------
   * `--auth-method-custom` | Mixin applied to the element. | `{}`
   * `--auth-method-panel` | Mixin applied to all auth elements. | `{}`
   * `--inline-help-icon-color` | Color of the icon button to display help | `rgba(0, 0, 0, 0.74)`
   * `--inline-help-icon-color-hover` | Color of the icon button to display help when hovered | `--accent-color` or `rgba(0, 0, 0, 0.88)`
   * `--raml-headers-form-input-label-color` | Color of the lable of the `paper-input` element. | `rgba(0, 0, 0, 0.48)`
   * `raml-headers-form-input-label-color-required` | Color of the lable of the `paper-input` element when it's required. | `rgba(0, 0, 0, 0.72)`
   *
   * ## Changes in version 2
   *
   * - The element now works with AMF json/ld data model. RAML json parser output
   * is no longer supported.
   * - `ramlSettings` has been renamed to `amfSettings`
   * - Added scheme title and documentation to the panel.
   */
  class AuthMethodCustom extends
    ArcBehaviors.EventsTargetBehavior(
    ArcBehaviors.AuthMethodsMixin(
    Polymer.Element)) {

    /**
     * AMF security scheme model.
     */
    amfSettings: object|null|undefined;

    /**
     * Computed list of headers to render in the form.
     */
    readonly headers: any[]|null|undefined;

    /**
     * Computed list of query parameters to render.
     */
    readonly queryParameters: any[]|null|undefined;

    /**
     * Computed value, true if headers are defined in RAML settings.
     */
    readonly hasHeaders: boolean|null|undefined;

    /**
     * Computed value, true if query parameters are defined in RAML settings.
     */
    readonly hasQueryParameters: boolean|null|undefined;

    /**
     * Name of the security scheme
     */
    readonly schemeName: string|null|undefined;

    /**
     * Security scheme description
     */
    readonly schemeDescription: string|null|undefined;

    /**
     * True to opend scheme descripyion, if available.
     */
    documentationOpened: boolean|null|undefined;
    _attachListeners(node: any): void;
    _detachListeners(node: any): void;
    ready(): void;

    /**
     * Validates the form.
     *
     * @returns `true` if valid, `false` otherwise.
     */
    validate(): Boolean|null;
    _schemeChanged(model: any): void;

    /**
     * Generates view model using the tranformer.
     *
     * @param type Param type. Either `header` or `parameter`.
     */
    _createViewModel(type: String|null, model: any[]|null): Promise<any>|null;
    _computeHasData(data: any): any;
    _settingsChanged(record: any): any;

    /**
     * Returns current configuration of the OAuth2.
     *
     * @returns Current OAuth2 configuration.
     */
    getSettings(): object|null;

    /**
     * Restores settings from stored value.
     * For custom methods this is dummy function.
     */
    restore(): void;
    _debounceNotify(): void;

    /**
     * Notifies about settings change.
     */
    _notifySettingsChanged(): void;

    /**
     * Dispatches headers change event on user input.
     */
    _headerValueChanged(e: any): void;

    /**
     * Dispatches query parameter change event on user input.
     */
    _queryValueChanged(e: any): void;

    /**
     * Dispatches change event for headers and query parameters.
     *
     * @param type Change type. `header` or `parameter`.
     * @param e Custom event dispatched by the form control.
     */
    _propertyValueChanged(type: String|null, e: CustomEvent|null): void;

    /**
     * Handler for the `request-header-changed` event.
     * It updates value for a single header if this header is already on the list.
     */
    _headerChangedHandler(e: any): void;

    /**
     * Handler for the `query-parameter-changed` event.
     * It updates value for a single parameter if this parameter is already on the list.
     */
    _parameterChangedHandler(e: any): void;

    /**
     * Update array value for given type (`headers` or `queryParameters`) for given event.
     */
    _updateEventValue(target: any, e: any): void;

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
    toggleSchemeDocumentation(): void;
  }
}

interface HTMLElementTagNameMap {
  "auth-method-custom": UiElements.AuthMethodCustom;
}
