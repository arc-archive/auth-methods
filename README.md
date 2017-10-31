[![Build Status](https://travis-ci.org/advanced-rest-client/auth-methods.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/auth-methods)  

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
`--auth-method-panel` | Mixin applied to all auth elements. | `{}`

This is very basic element. Style inputs using `paper-input`'s or `paper-toggle`'s css variables.



### Events
| Name | Description | Params |
| --- | --- | --- |
| auth-settings-changed | Fired when the any of the auth method settings has changed. This event will be fired quite frequently - each time anything in the text field changed. With one exception. This event will not be fired if the validation of the form didn't passed. | settings **Object** - Current settings containing hash, password and username. |
type **String** - The authorization type - basic |
valid **Boolean** - True if the form has been validated. |
| error | Fired when error occured when decoding hash. | error **Error** - The error object. |
# auth-method-ntlm

The `<auth-method-ntlm>` element displays a form to provide the NTLM auth credentials.
It only provides data since NTLM authentication and all calculations must be conducted
when working on socket.

This form requires to provide at least username and password. The domain parameter is not required
in NTLM so it may be empty.

### Example
```
<auth-method-basic username="john" password="doe" domain="my-nt-domain"></auth-method-basic>
```
### Styling
`<auth-methods>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--auth-method-panel` | Mixin applied to the element. | `{}`
`--auth-method-ntlm` | Mixin applied to all uath elements. | `{}`

This is very basic element. Style inputs using input's or toggle's css variables.



### Events
| Name | Description | Params |
| --- | --- | --- |
| auth-settings-changed | Fired when the any of the auth method settings has changed. This event will be fired quite frequently - each time anything in the text field changed. With one exception. This event will not be fired if the validation of the form didn't passed.  The `domain` field is not required in the form so check for missing `domain` value if it's required in your application. | settings **Object** - Current settings containing domain, password and username. |
type **String** - The authorization type - ntlm |
valid **Boolean** - True if the form has been validated. |
| error | Fired when error occured when decoding hash. | error **Error** - The error object. |
# auth-method-oauth1

The `<auth-method-oauth1>` element displays a form to provide the OAuth 1a settings.

### Example

```
<auth-method-oauth1 consumer-key="xyz"></auth-method-oauth1>
```

### Required form fields
- Consumer key
- Timestamp
- Nonce
- Signature method

## Authorizing the user

This element displays form for user input only. To perform authorization and
later to sign the request, add `oauth-authorization/oauth1-authorization.html`
to the DOM. This element sends `oauth1-token-requested` that is handled by
autorization element.

Note that the OAuth1 authorization wasn't designed for browser. Most existing
OAuth1 implementation disallow browsers to perform the authorization by
not allowing POST requests to authorization server. Therefore receiving token
may not be possible without using browser extensions to alter HTTP request to
enable CORS.
If the server disallow obtaining authorization token and secret from clients
then the application should listen for `oauth1-token-requested` custom event
and perform authorization on the server side.

When application is performing authorization instead of `oauth1-authorization`
element then the application should dispatch `oauth1-token-response` custom event
with `oauth_token` and `oauth_token_secret` properties set on detail object.
This element handles the response to reset UI state and to updates other elements
status that works with authorization.

## Signing the request

See description for `oauth-authorization/oauth1-authorization.html` element.

### Styling
`<auth-methods>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--auth-method-oauth1` | Mixin applied to the element. | `{}`
`--auth-method-panel` | Mixin applied to all auth elements. | `{}`

### Theming
Use this mixins as a theming option across all ARC elements.

Custom property | Description | Default
----------------|-------------|----------
`--icon-button` | Mixin applied to `paper-icon-buttons`. | `{}`
`--icon-button-hover` | Mixin applied to `paper-icon-buttons` when hovered. | `{}`
`--input-line-color` | Mixin applied to the input underline | `{}`
`--auth-button` | Mixin applied to authorization and next buttons` | `{}`
`--auth-button-hover` | Mixin for :hover state for authorization and next buttons` | `{}`
`--auth-button-disabled` | Mixin for disabled state for authorization and next buttons` | `{}`



### Events
| Name | Description | Params |
| --- | --- | --- |
| auth-settings-changed | Fired when the any of the auth method settings has changed. This event will be fired quite frequently - each time anything in the text field changed. With one exception. This event will not be fired if the validation of the form didn't passed. | settings **Object** - Current settings. See the `oauth1-token-requested` for detailed description. |
type **String** - The authorization type - oauth1 |
| oauth1-token-requested | Fired when user requested to perform an authorization. The details object vary depends on the `grantType` property. However this event always fire two properties set on the `detail` object: `type` and `clientId`. | consumerKey **String** - The consumer key. May be undefined if not provided. |
consumerSecret **String** - May be undefined if not provided. |
token **String** - May be undefined if not provided. |
tokenSecret **String** - May be undefined if not provided. |
timestamp **String** - May be undefined if not provided. |
nonce **String** - May be undefined if not provided. |
realm **String** - May be undefined if not provided. |
signatureMethod **String** - May be undefined if not provided. |
type **String** - Always `oauth1` |
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
<auth-method-oauth2 prevent-custom-scopes></auth-method-oauth2>
```
```
var form = document.querySelector('auth-method-oauth2');
form.allowedScopes = ['profile', 'email'];
```

## Authorizing the user
The element sends the `oauth2-token-requested` with the OAuth settings provided with the form.
Any element / app can handle this event and perform authorization.

When the authorization is performed the app / other element should set back `tokenValue` property
of this element or send the `oauth2-token-response` with token response value so the change will
can reflected in the UI.
ARC provides the `oauth2-authorization` element that can handle this events.

### Example
```
<auth-method-oauth2></auth-method-oauth2>
<oauth2-authorization></oauth2-authorization>
```
The `oauth2-authorization` can be set anywhere in the DOM up from this element siblings to the
body. See demo for example usage.

## Redirect URL
Most OAuth 2 providers requires setting the redirect URL with the request. This can't be changed
by the user and redirect URL can be only set in the provider's settings panel. The element
accepts the `redirectUrl` property which will be displayed to the user that (s)he has to set up
this callback URL in the OAuth provider settings. It can be any URL where token / code will be
handled properly and the value returned to the `oauth2-authorization` element.
See `oauth2-authorization` documentation for more information.

If you going to use `oauth2-authorization` popup then the redirect URL value must be set to:
`/bower_components/oauth-authorization/oauth-popup.html`. Mind missing `2` in `oauth-authorization`.
This popup is a common popup for auth methods.

### Styling
`<auth-methods>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--auth-method-oauth2` | Mixin applied to the element. | `{}`
`--auth-method-panel` | Mixin applied to all auth elements. | `{}`

### Theming
Use this mixins as a theming option across all ARC elements.

Custom property | Description | Default
----------------|-------------|----------
`--icon-button` | Mixin applied to `paper-icon-buttons`. | `{}`
`--icon-button-hover` | Mixin applied to `paper-icon-buttons` when hovered. | `{}`
`--input-line-color` | Mixin applied to the input underline | `{}`
`--form-label` | Mixin applied to form labels. It will not affect `paper-*` labels | `{}`
`--auth-button` | Mixin applied to authorization and next buttons` | `{}`
`--auth-button-hover` | Mixin for :hover state for authorization and next buttons` | `{}`
`--auth-button-disabled` | Mixin for disabled state for authorization and next buttons` | `{}`



### Events
| Name | Description | Params |
| --- | --- | --- |
| auth-settings-changed | Fired when the any of the auth method settings has changed. This event will be fired quite frequently - each time anything in the text field changed. With one exception. This event will not be fired if the validation of the form didn't passed.  This event will set current settings as a detail object which are the same as for the `oauth2-token-requested` event. Additionally it will contain a `tokenValue` property. This valye can be `undefined` if token hasn't been requested yet by the user. Clients should support a situaltion when the user do not request the token before requesting the resource and perform authorization. | settings **Object** - See the `oauth2-token-requested` for detailed description |
type **String** - The authentication type selected by the user. |
valid **Boolean** - True if the form has been validated. |
| oauth2-token-ready | Fired when the request token has been obtained and it's ready to serve. Because only one auth panel can be displayed ad a time it can be assumed that if new token has been obtained then it is current authorization method. | token **String** - The OAuth 2.0 token |
| oauth2-token-requested | Fired when user requested to perform an authorization. The details object vary depends on the `grantType` property. However this event always fire two properties set on the `detail` object: `type` and `clientId`. | type **String** - The type of grant option selected by the user. `implicit` is the browser flow where token ir requested. `authorization_code` or server flow is where client asks for the authorization code and exchange it later for the auth token using client secret. Other options are `password` and `client_credentials`. |
clientId **String** - Every type requires `clientId`. |
authorizationUrl **String** - Token authorization URL. Used in `implicit` and `authorization_code` types. In both cases means the initial endpoint to request for token or the authorization code. |
scopes **Array.<String>** - A list of scopes seleted by the user. Used in `implicit` and `authorization_code` types. |
redirectUrl **String** - A redirect URL of the client after authorization (or error). This must be set in the provider's OAuth settings. Callback URL must communicate with the app to pass the information back to the application. User can't change the `redirectUrl` but the app shouldn't rely on this value since in browser environment it is possible to temper with variables. The `redirectUrl` must be set to this element by owner app (which must know this value). A `redirectUrl` is set for `implicit` and `authorization_code` types. |
clientSecret **String** - The client secret that user can get from the OAuth provider settings console. User in `authorization_code` and `client_credentials` types. |
accessTokenUrl **String** - An URL to exchange code for the access token. Used by `authorization_code`, `client_credentials` and `password` types. |
username **String** - Used with `password` type. |
password **String** - Used with `password` type. |
# auth-method-digest

The `<auth-method-digest>` element displays a form for digest authentication.
The user have to choose is he want to provide username and password only or
all digest parameters to calculate final authorization header.

In first case, the listeners and the transport method must perform handshake
by it's own. Otherwise authorization header should be set with calculated value.

### Example
```
<auth-method-digest username="john" password="doe"></auth-method-digest>
```

The `settings` property (of the element or even detail property) for full form
has the following structure:

```
{
  "username": String,
  "realm": String,
  "nonce": String,
  "uri": String,
  "response": String,
  "opaque": String,
  "qop": String - can be empty,
  "nc": String,
  "cnonce": String
}
```

## Response calculation
Depending on the algorithm and quality of protection (qop) properties the hasing
algorithm may need following data:
- request URL
- request payload (body)
- request HTTP method

The element should be provided with this information by setting it's properties.
However, the element will listen for `url-value-changed`, `http-method-changed`
and `body-value-changed` events on the window object. Once the event is handled
it will set up corresponding properties.
All this events must have a `value` property set on event's detail object.

### Styling
`<auth-methods>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--auth-method-digest` | Mixin applied to the element. | `{}`
`--auth-method-panel` | Mixin applied to all auth elements. | `{}`



### Events
| Name | Description | Params |
| --- | --- | --- |
| auth-settings-changed | Fired when the any of the auth method settings has changed. This event will be fired quite frequently - each time anything in the text field changed. With one exception. This event will not be fired if the validation of the form didn't passed. | settings **Object** - Current settings containing hash, password and username. |
type **String** - The authorization type - basic |
valid **Boolean** - True if the form has been validated. |
| error | Fired when error occured when decoding hash. | error **Error** - The error object. |
# auth-method-custom

The `<auth-method-custom>` element displays a form to provide the authorization details for RAML's
custom security scheme.

This element works differently than other authorization panels because it sends
`request-header-changed` and `query-parameter-changed` custom events directly and it doesn't
care if it's wrapped with the `authorization-panel` element that will handle this.
This element will also listen for this events and if the application uses other ARC elements
that use this events to communicate (like `raml-request-panel`) then the value for headers or query
parameters will be updated when event occur.

Besides events listed above it will also fire the `auth-settings-changed` custom event as other
authorization methods.

This element will rended empty if `ramlSettings` property is not set or is empty.
Parent element should check if `securedBy` property of RAML method contains values.

### Example
```
<auth-method-custom raml-settings="{...}"></auth-method-custom>
```

### Styling
`<auth-methods>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--auth-method-custom` | Mixin applied to the element. | `{}`
`--auth-method-panel` | Mixin applied to all auth elements. | `{}`
`--inline-help-icon-color` | Color of the icon button to display help | `rgba(0, 0, 0, 0.24)`
`--inline-help-icon-color-hover` | Color of the icon button to display help when hovered | `--accent-color` or `rgba(0, 0, 0, 0.74)`
`--raml-headers-form-input-label-color` | Color of the lable of the `paper-input` element. | `rgba(0, 0, 0, 0.48)`
`raml-headers-form-input-label-color-required` | Color of the lable of the `paper-input` element when it's required. | `rgba(0, 0, 0, 0.72)`

Input styles are consistent with `raml-headers-form` element.



### Events
| Name | Description | Params |
| --- | --- | --- |
| auth-settings-changed | Fired when the any of the auth method settings has changed. This event will be fired quite frequently - each time anything in the text field changed. With one exception. This event will not be fired if the validation of the form didn't passed. | settings **Object** - Current settings containing hash, password and username. |
type **String** - The authorization type - basic |
valid **Boolean** - True if the form has been validated. |
name **String** - Name of the custom method to differeciante them if many. |
| query-parameter-changed | Fired when the header value has changed. | name **String** - Name of the parameter |
value **String** - Value of the parameter |
| request-header-changed | Fired when the header value has changed. | name **String** - Name of the header |
value **String** - Value of the header |
