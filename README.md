[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/auth-methods.svg)](https://www.npmjs.com/package/@api-components/auth-methods)

[![Build Status](https://travis-ci.org/advanced-rest-client/auth-methods.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/auth-methods)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/auth-methods)

# auth-methods

A set of elements that contains an UI to create different authorization headers like Basic, OAuth etc

```html
<h2>Basic</h2>
<auth-method-basic></auth-method-basic>

<h2>OAuth 2</h2>
<auth-method-oauth2></auth-method-oauth2>
```

### API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)

## Usage

### Installation
```
npm install --save @advanced-rest-client/auth-methods
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@advanced-rest-client/auth-methods/auth-methods.js';
    </script>
  </head>
  <body>
    <auth-method-basic></auth-method-basic>
    <auth-method-digest></auth-method-digest>
    <auth-method-ntlm></auth-method-ntlm>
    <auth-method-oauth1></auth-method-oauth1>
    <auth-method-oauth2></auth-method-oauth2>
    <auth-method-custom></auth-method-custom>
  </body>
</html>
```

### In a Polymer 3 element

```js
import {PolymerElement, html} from '@polymer/polymer';
import '@advanced-rest-client/auth-methods/auth-methods.js';

class SampleElement extends PolymerElement {
  static get template() {
    return html`
    <auth-method-basic></auth-method-basic>
    <auth-method-digest></auth-method-digest>
    <auth-method-ntlm></auth-method-ntlm>
    <auth-method-oauth1></auth-method-oauth1>
    <auth-method-oauth2></auth-method-oauth2>
    <auth-method-custom></auth-method-custom>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

### Installation

```sh
git clone https://github.com/advanced-rest-client/auth-methods
cd auth-methods
npm install
npm install -g polymer-cli
```

### Running the demo locally

```sh
polymer serve --npm
open http://127.0.0.1:<port>/demo/
```

### Running the tests
```sh
polymer test --npm
```

## Breaking Changes in v3

Due to completely different dependencies import algorithm the CodeMirror and it's dependencies has to
be included to the web application manually, outside the component.

Web Compoennts are ES6 modules and libraries like CodeMirror are not adjusted to
new spec. Therefore importing the library inside the component won't make it work
(no reference is created).

Use the scripts below to include dependencies into the web page.

**OAuth 1**

```html
<script src="node_modules/cryptojslib/components/core.js"></script>
<script src="node_modules/cryptojslib/rollups/sha1.js"></script>
<script src="node_modules/cryptojslib/components/enc-base64-min.js"></script>
<script src="node_modules/cryptojslib/rollups/md5.js"></script>
<script src="node_modules/cryptojslib/rollups/hmac-sha1.js"></script>
<script src="node_modules/jsrsasign/lib/jsrsasign-rsa-min.js"></script>
```

**Digest**

```html
<script src="node_modules/cryptojslib/rollups/md5.js"></script>
```

The required modules are installed with this element.
