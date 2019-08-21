import { html } from 'lit-html';
import { ArcDemoPage } from '@advanced-rest-client/arc-demo-helper/ArcDemoPage.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '@advanced-rest-client/arc-demo-helper/arc-demo-helper.js';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';

export class DemoBase extends ArcDemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'outlined',
      'legacy',
      'readOnly',
      'disabled'
    ]);
    this.demoStates = ['Filled', 'Outlined', 'Legacy'];
    this._demoStateHandler = this._demoStateHandler.bind(this);
    this._toggleMainOption = this._toggleMainOption.bind(this);
  }

  _demoStateHandler(e) {
    const state = e.detail.value;
    switch (state) {
      case 0:
        this.outlined = false;
        this.legacy = false;
        break;
      case 1:
        this.outlined = true;
        this.legacy = false;
        break;
      case 2:
        this.outlined = false;
        this.legacy = true;
        break;
    }
  }

  _toggleMainOption(e) {
    const { name, checked } = e.target;
    this[name] = checked;
  }

  _baseMainOptions() {
    return html`
    <label slot="options" id="mainOptionsLabel">Options</label>
    <anypoint-checkbox
      aria-describedby="mainOptionsLabel"
      slot="options"
      name="readOnly"
      @change="${this._toggleMainOption}"
      >Read only</anypoint-checkbox
    >
    <anypoint-checkbox
      aria-describedby="mainOptionsLabel"
      slot="options"
      name="disabled"
      @change="${this._toggleMainOption}"
      >Disabled</anypoint-checkbox
    >`;
  }
}
