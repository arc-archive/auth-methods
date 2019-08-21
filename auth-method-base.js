/**
@license
Copyright 2018 The Advanced REST client authors
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
import { LitElement } from 'lit-element';
import { EventsTargetMixin } from '@advanced-rest-client/events-target-mixin/events-target-mixin.js';
/**
 * Base class for all authorization methods
 */
export class AuthMethodBase extends EventsTargetMixin(LitElement) {
  static get properties() {
    return {
      /**
       * Setting passed to paper buttons.
       */
      noink: { type: Boolean },
      /**
       * WHen set it prohibits methods from rendering inline documentation.
       */
      noDocs: { type: Boolean },
      /**
       * When set the editor is in read only mode.
       */
      readOnly: { type: Boolean },
      /**
       * When set the inputs are disabled
       */
      disabled: { type: Boolean },
      /**
       * Enables Anypoint legacy styling
       */
      legacy: { type: Boolean },
      /**
       * Enables Material Design outlined style
       */
      outlined: { type: Boolean }
    };
  }
  /**
   * Sets Observable Property.
   * @param {String} prop Property name to set
   * @param {any} value A value to set
   * @return {Boolean} True if property was changed.
   */
  _sop(prop, value) {
    const key = `_${prop}`;
    const old = this[key];
    /* istanbul ignore if */
    if (old === value) {
      return false;
    }
    this[key] = value;
    this.requestUpdate(prop, old);
    return true;
  }

  _notifyChanged(prop, value) {
    this.dispatchEvent(new CustomEvent(`${prop}-changed`, {
      detail: {
        value
      }
    }));
  }
  /**
   * Gathers data by calling `validate()` and `getSettings()` function and
   * dispatches `auth-settings-changed` custom event
   *
   * @param {String} type Auth form type.
   * @return {CustomEvent} Dispatched event
   */
  _notifySettingsChange(type) {
    const detail = {
      settings: this.getSettings(),
      type,
      valid: this.validate()
    };
    const e = new CustomEvent('auth-settings-changed', {
      detail: detail,
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(e);
    return e;
  }
  /**
   * Computes value for conditions containg documentation block.
   * It always returns false if `noDocs` is true. Otherwise it returns
   * boolean value of the `value` argument
   *
   * @param {Boolean} noDocs Value of the `noDocs` property
   * @param {Boolean|String} value Docs value
   * @return {Boolean}
   */
  _computeHasDoc(noDocs, value) {
    if (noDocs) {
      return false;
    }
    return !!value;
  }
}
