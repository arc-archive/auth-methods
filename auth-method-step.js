import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
import '../../@polymer/polymer/lib/elements/dom-if.js';
import '../../@polymer/paper-ripple/paper-ripple.js';
import '../../@polymer/iron-collapse/iron-collapse.js';
import '../../@advanced-rest-client/arc-icons/arc-icons.js';
import '../../@polymer/iron-icon/iron-icon.js';
/**
 * An element that renders authorization steps with title and content.
 *
 * @customElement
 * @polymer
 * @memberof UiElements
 */
export class AuthMethodStep extends PolymerElement {
  static get template() {
    return html`
    <style>
    .row {
      padding: 12px 0;
    }

    .stepper {
      @apply --layout-horizontal;
      @apply --layout-center;
      position: relative;
      pointer-events: none;
    }

    :host([inactive]) .stepper {
      pointer-events: all;
      cursor: pointer;
    }

    .stepper .step {
      display: inline-block;
      background-color: var(--stepper-step-number-background-color, #3D8099);
      color: var(--stepper-step-number-color, #fff);
      font-size: 14px;
      @apply --layout-center-center;
      @apply --layout-horizontal;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      margin-right: 12px;
    }

    .stepper .step-header {
      position: relative;
      @apply --layout-flex;
    }

    .stepper .step-title {
      @apply --arc-font-body1;
      display: block;
      color: var(--stepper-step-title-color, #3D8099);
      font-size: 16px;
      font-weight: 500;
    }

    .edit-icon {
      margin-left: 8px;
      color: var(--api-form-action-icon-color, rgba(0, 0, 0, 0.74));
      transition: color 0.25s linear;
      width: 20px;
      height: 20px;
      @apply --icon-button;
    }

    .edit-icon:hover {
      color: var(--api-form-action-icon-hover-color, rgba(0, 0, 0, 0.84));
      @apply --icon-button-hover;
    }

    .stepper .step-selection {
      @apply --arc-font-body1;
      color: var(--stepper-step-selection-label-color, rgba(0, 0, 0, 0.54));
      position: absolute;
      bottom: -16px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
      max-width: 100%;
    }

    .step-content {
      @apply --layout-horizontal;
      min-height: 32px;
    }

    .line {
      min-width: 11px;
      max-width: 11px;
      border-right: 1px var(--stepper-line-color, rgba(0, 0, 0, 0.12)) solid;
      margin-right: 24px;
      margin-top: 8px;
    }

    .step-content .content {
      @apply --layout-flex;
      max-width: calc(100% - 16px);
      @apply --auth-methods-step-content;
    }

    .container {
      width: 100%;
    }

    [hidden] {
      display: none !important;
    }

    paper-ripple {
      color: var(--stepper-step-title-color, #3D8099);
    }

    .step-title-render {
      @apply --layout-vertical;
      @apply --layout-center;
      @apply --layout-self-stretch;
    }

    .step-title-render .line {
      @apply --layout-flex;
      display: none;
    }

    :host([inactive]) .step-title-render .line {
      display: block;
    }

    :host([no-steps]) .line {
      display: none;
    }

    .step-inactive-title {
      @apply --arc-font-body1;
      font-size: 16px;
      font-weight: 400;
      margin-top: 12px;
      display: block;

      @apply --layout-horizontal;
      @apply --layout-center;
    }

    :host([no-steps]) .stepper {
      display: none !important;
    }
    </style>

    <div class="row">
      <div class="stepper">
        <div class="step-title-render">
          <span class="step">[[_computeStep(stepStartIndex, step)]]</span>
          <div class="line"></div>
        </div>
        <span class="step-header" on-tap="_inactiveTap">
          <span class="step-title">
            <slot name="title"></slot>
            <iron-icon icon="arc:edit"
              class="edit-icon"
              title="Click to make changes"
              hidden\$="[[!inactive]]"></iron-icon>
          </span>
          <span class="step-inactive-title" hidden\$="[[!inactive]]">
            <slot name="inactive-title"></slot>
          </span>
        </span>
        <paper-ripple></paper-ripple>
      </div>
      <iron-collapse opened="[[_computeContentOpened(inactive, noSteps)]]">
        <div class="step-content">
          <div class="line"></div>
          <div class="container">
            <slot></slot>
          </div>
        </div>
      </iron-collapse>
    </div>
`;
  }

  static get is() {
    return 'auth-method-step';
  }
  static get properties() {
    return {
      // base64 hash of the uid and passwd. When set it will override current username and password.
      stepStartIndex: {
        type: Number,
        value: 1
      },
      step: Number,
      /**
       * If true then the auth method will not render progress bar (stepper).
       */
      noSteps: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      // Title of the step
      title: String,
      // If inactive it shows alternative summary content
      inactive: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      }
    };
  }

  _computeStep(stepStartIndex, currentStep) {
    return stepStartIndex + currentStep;
  }

  _inactiveTap() {
    if (!this.inactive) {
      return;
    }
    this.dispatchEvent(new CustomEvent('inactive-tap', {
      bubbles: false
    }));
  }

  _computeContentOpened(inactive, noSteps) {
    if (noSteps) {
      return true;
    }
    return !inactive;
  }
}
window.customElements.define(AuthMethodStep.is, AuthMethodStep);
