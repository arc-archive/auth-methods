import { html } from 'lit-html';
import '@api-components/api-headers-editor/api-headers-editor.js';
import '../auth-method-basic.js';
import { DemoBase } from './demo-base.js';

class ComponentDemo extends DemoBase {
  constructor() {
    super();
    this._componentName = 'auth-method-basic';
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      outlined,
      legacy,
      readOnly,
      disabled
    } = this;
    return html `
    <section class="documentation-section">
    <h3>Interactive demo</h3>
    <p>
      This demo lets you preview the basic authorization method element with various
      configuration options.
    </p>

    <arc-interactive-demo
      .states="${demoStates}"
      @state-chanegd="${this._demoStateHandler}"
      ?dark="${darkThemeActive}"
    >

      <auth-method-basic
        slot="content"
        ?outlined="${outlined}"
        ?legacy="${legacy}"
        ?readOnly="${readOnly}"
        ?disabled="${disabled}"
        username="test"
        password="test"
        @auth-settings-changed="${this._authSettingsChanged}"></auth-method-basic>

      ${this._baseMainOptions()}
    </arc-interactive-demo>
    </section>`;
  }

  _introductionTemplate() {
    return html `
      <section class="documentation-section">
        <h3>Introduction</h3>
        <p>
          A web component to render accessible basic authorization form.
        </p>
        <p>
          This component implements Material Design styles.
        </p>
      </section>
    `;
  }

  _usageTemplate() {
    return html `
      <section class="documentation-section">
        <h2>Usage</h2>
        <p>Anypoint dropdown menu comes with 3 predefied styles:</p>
        <ul>
          <li><b>Filled</b> (default)</li>
          <li><b>Outlined</b></li>
          <li>
            <b>Legacy</b> - To provide compatibility with legacy Anypoint design
          </li>
        </ul>

        <h3>Settings data model</h3>
        <p>
          After updating a value in the editor it produces a data model:
        </p>

        <output>
${this.authSettingsValue ? this.authSettingsValue : 'Model not ready'}
        </output>

        <h3>Working with headers editor</h3>

        <p>
          The element communicates with the headers editor to update value on
          headers editor. Note, the communication is from the authorization method
          to the headers editor only. Changing state on headers panel won't change
          authorization values.
        </p>

        <api-headers-editor
          allowdisableparams
          allowcustom
          allowhideoptional></api-headers-editor>
      </section>`;
  }


  contentTemplate() {
    return html `
      <h2>Auth method basic</h2>
      ${this._demoTemplate()}
      ${this._introductionTemplate()}
      ${this._usageTemplate()}
    `;
  }
}
const instance = new ComponentDemo();
instance.render();
window.demo = instance;
