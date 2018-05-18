[![Build Status](https://travis-ci.org/advanced-rest-client/auth-methods.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/auth-methods)  
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/auth-methods)

## &lt;auth-methods&gt;

A set of components to request authorization credentials from the user.

It includes the following forms:
- basic authorization
- digest authorization
- NTLM authorization
- OAuth 1.0
- OAuth 2.0
- custom authorization method defined in RAML spec (custom security scheme)

<!---
```
<custom-element-demo>
  <template>
    <link rel="import" href="auth-method-basic.html">
    <link rel="import" href="auth-method-oauth2.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<h3>Basic authorization</h3>
<auth-method-basic username="test" password="test"></auth-method-basic>
<h3>OAuth 2.0</h3>
<auth-method-oauth2
  access-token-uri="https://www.googleapis.com/oauth2/v4/token"
  authorization-uri="https://accounts.google.com/o/oauth2/v2/auth"></auth-method-oauth2>
```

## Dependencies

Digest method requires `CryptoJS.MD5`. This is not included in the component by default.
Use `advanced-rest-client/cryptojs-lib` component to include the library if your project doesn't use crypto libraries already.

## OAuth authorization

OAuth 1 and OAuth 2.0 elements works with `advanced-rest-client/oauth-authorization` element to authorize the user and request token data.

### API components

This components is a part of API components ecosystem: https://elements.advancedrestclient.com/
