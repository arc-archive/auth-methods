[![Build Status](https://travis-ci.org/advanced-rest-client/auth-methods.svg?branch=master)](https://travis-ci.org/advanced-rest-client/auth-methods)  

# auth-method-basic

The `<auth-method-basic>` element displays a form to provide the Basic auth credentials.
It calculates base64 has while typing into username or password field.

It accepts `hash` as a property and once set it will atempt to decode it and set username and
paswword.

### Example
```
<auth-method-basic hash="dGVzdDp0ZXN0"></auth-method-basic>
```
This example will produce a form with prefilled username and passowrd with value "test".

### Styling
`<auth-methods>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--auth-method-basic` | Mixin applied to the element. | `{}`
`---auth-method-panel` | Mixin applied to all uath elements. | `{}`

This is very basic element. Style inputs using input's or toggle's css variables.



### Events
| Name | Description | Params |
| --- | --- | --- |
| authorization-disabled | Fired when the auth method has been disabled. | settings **Object** - Current settings at the moment of disabling the auth method. |
| authorization-enabled | Fired when the auth method has been enabled. | settings **Object** - Current settings at the moment of enabling the auth method. Don't rely on this values to construct auth data since it may change later during runetime. |
| error | Fired when error occured when decoding hash. | error **Error** - The error object. |
# auth-method-ntlm

The `<auth-method-ntlm>` element displays a form to provide the NTLM auth credentials.
It only provides data since NTLM authentication and all calculations must be conducted
when working on socket.

### Example
```
<auth-method-basic username="john" password="doe" domain="my-nt-domain"></auth-method-basic>
```
### Styling
`<auth-methods>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--auth-method-basic` | Mixin applied to the element. | `{}`
`---auth-method-ntlm` | Mixin applied to all uath elements. | `{}`

This is very basic element. Style inputs using input's or toggle's css variables.



### Events
| Name | Description | Params |
| --- | --- | --- |
| authorization-disabled | Fired when the auth method has been disabled. | settings **Object** - Current settings at the moment of disabling the auth method. |
| authorization-enabled | Fired when the auth method has been enabled. | settings **Object** - Current settings at the moment of enabling the auth method. Don't rely on this values to construct auth data since it may change later during runetime. |
| error | Fired when error occured when decoding hash. | error **Error** - The error object. |
# auth-method-oauth1

The `<auth-method-oauth1>` element displays a form to provide the OAuth 1a settings.

### Example
```
<auth-method-oauth1></auth-method-oauth1>
```






### Styling
`<auth-methods>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--basic-auth-panel` | Mixin applied to the element. | `{}`
`---auth-method-panel` | Mixin applied to all uath elements. | `{}`

### Theming
Use this mixins as a theming option across all ARC elements.

Custom property | Description | Default
----------------|-------------|----------
`--icon-button` | Mixin applied to `paper-icon-buttons`. | `{}`
`--icon-button-hover` | Mixin applied to `paper-icon-buttons` when hovered. | `{}`
`--input-line-color` | Mixin applied to the input underline | `{}`



### Events
| Name | Description | Params |
| --- | --- | --- |
| authorization-disabled | Fired when the auth method has been disabled. | settings **Object** - Current settings at the moment of disabling the auth method. |
| authorization-enabled | Fired when the auth method has been enabled. | settings **Object** - Current settings at the moment of enabling the auth method. Don't rely on this values to construct auth data since it may change later during runetime. |
# auth-method-oauth2

The `<auth-method-oauth2>` element displays a form to provide the OAuth 2.0 settings.

### Example
```
<auth-method-oauth2></auth-method-oauth2>
```

This element uses `oauth2-scope-selector` so the `allowedScopes`, `preventCustomScopes` and
`scopes` properties will be set on this element. See documentation of `oauth2-scope-selector`
for more description.

### Forcing the user to select scope from the list
```
<auth-method-oauth2 allowed-scopes="['profile']" prevent-custom-scopes></auth-method-oauth2>
```

## Authorization
This element do not perform user authorization. It is only a UI for the auth settings form.
This element fires `oauth2-token-requested` event that shoule be intercepted by other elements
or the app. When the authorization is performed the app / other element should set back
`tokenValue` property of this element so the change will be reflected in the UI.


### Styling
`<auth-methods>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--basic-auth-panel` | Mixin applied to the element. | `{}`
`---auth-method-panel` | Mixin applied to all uath elements. | `{}`

### Theming
Use this mixins as a theming option across all ARC elements.

Custom property | Description | Default
----------------|-------------|----------
`--icon-button` | Mixin applied to `paper-icon-buttons`. | `{}`
`--icon-button-hover` | Mixin applied to `paper-icon-buttons` when hovered. | `{}`
`--input-line-color` | Mixin applied to the input underline | `{}`



### Events
| Name | Description | Params |
| --- | --- | --- |
| authorization-disabled | Fired when the auth method has been disabled. | settings **Object** - Current settings at the moment of disabling the auth method. |
| authorization-enabled | Fired when the auth method has been enabled. | settings **Object** - Current settings at the moment of enabling the auth method. Don't rely on this values to construct auth data since it may change later during runetime. |
| oauth2-token-requested | Fired when user requested to perform an authorization. The details object vary depends on the `grantType` property. However this event always fire two properties set on the `detail` object: `type` and `clientId`. | type **String** - The type of grant option selected by the user. `access_token` is the browser flow where token ir requested. `authorization_code` or server flow is where client asks for the authorization code and exchange it later for the auth token using client secret. Other options are `password` and `client_credentials`. |
clientId **String** - Every type requires `clientId`. |
authorizationUrl **String** - Token authorization URL. Used in `access_token` and `authorization_code` types. In both cases means the initial endpoint to request for token or the authorization code. |
scopes **Array.<String>** - A list of scopes seleted by the user. Used in `access_token` and `authorization_code` types. |
redirectUrl **String** - A redirect URL of the client after authorization (or error). This must be set in the provider's OAuth settings. Callback URL must communicate with the app to pass the information back to the application. User can't change the `redirectUrl` but the app shouldn't rely on this value since in browser environment it is possible to temper with variables. The `redirectUrl` must be set to this element by owner app (which must know this value). A `redirectUrl` is set for `access_token` and `authorization_code` types. |
clientSecret **String** - The client secret that user can get from the OAuth provider settings console. User in `authorization_code` and `client_credentials` types. |
accessTokenUrl **String** - An URL to exchange code for the access token. Used by `authorization_code`, `client_credentials` and `password` types. |
username **String** - Used with `password` type. |
password **String** - Used with `password` type. |
