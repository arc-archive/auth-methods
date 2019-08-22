import { html } from 'lit-html';
import '../auth-method-digest.js';
import { DemoBase } from './demo-base.js';

class ComponentDemo extends DemoBase {
  constructor() {
    super();
    this._componentName = 'auth-method-digest';

    this.initObservableProperties([
      'requestUrl'
    ]);

    this.requestUrl = 'https://httpbin.org/digest-auth/auth/';
    this.httpMethod = 'GET';
    this.requestBody = '';
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      outlined,
      legacy,
      readOnly,
      disabled,
      requestUrl,
      httpMethod,
      requestBody
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

      <auth-method-digest
        slot="content"
        ?outlined="${outlined}"
        ?legacy="${legacy}"
        ?readOnly="${readOnly}"
        ?disabled="${disabled}"
        .requestUrl="${requestUrl}"
        .httpMethod="${httpMethod}"
        .requestBody="${requestBody}"
        @auth-settings-changed="${this._authSettingsChanged}"></auth-method-digest>

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
