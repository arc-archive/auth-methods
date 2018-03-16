[![Build Status](https://travis-ci.org/advanced-rest-client/auth-methods.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/auth-methods)

## undefined component
Tag: `<auth-method-basic>`

### Installation
Using bower:
```
bower install --save advanced-rest-client/auth-method-basic
```

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

## API
### Component properties (attributes)

#### attrForOpened
- Type: `string`
An attribute name describing if the element is currently displayed.
If set, the element will not compute values until the attribute becomes truly.

This is helpful when this editor is used alongside other payload editors and only one
at the time should perform a computation.

Note that setting a property instead of attribute will not work. It must be an
attribute.

#### eventsTarget
- Type: `Object`
Events handlers target. By default the element listens on
`window` object. If set, all events listeners will be attached to this
object instead of `window`.

#### stepStartIndex
- Type: `number`
- Default: `1`
A start index for elements step counter.
Basic assumption is that this elements are used inside the
`authorization` panel which has the first step (auth type selector).
If the element is to be used as a standalone element then this
should be set to `0` (zero) so the number for the first step will be
`1`.
Basic and NTLM auth elements has only one step. Other elements, with
more complex structure has more steps.

#### noStepper
- Type: `boolean`
If true then the auth method will not render progress bar (stepper).

#### hash
- Type: `string`
base64 hash of the uid and passwd. When set it will override current username and password.

#### password
- Type: `string`
- Default: `""`
The password.

#### username
- Type: `string`
- Default: `""`
The username.

#### settings
- Type: `Function`
Gets a map of current settings (user provided data).


### Component methods

#### validate
- Return type: `Boolean`
Validate the form.
#### reset
- Return type: `undefined`

#### restore
- Return type: `undefined`
Restores settings from stored value.
#### hashData
- Return type: `String`
Computes hash value for given username or password.
It computes value if at least one value for username and password is
provided. Otherwise it sets hash to empty string.
#### clearUsername
- Return type: `undefined`


## undefined component
Tag: `<auth-method-ntlm>`

### Installation
Using bower:
```
bower install --save advanced-rest-client/auth-method-ntlm
```

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

## API
### Component properties (attributes)

#### attrForOpened
- Type: `string`
An attribute name describing if the element is currently displayed.
If set, the element will not compute values until the attribute becomes truly.

This is helpful when this editor is used alongside other payload editors and only one
at the time should perform a computation.

Note that setting a property instead of attribute will not work. It must be an
attribute.

#### eventsTarget
- Type: `Object`
Events handlers target. By default the element listens on
`window` object. If set, all events listeners will be attached to this
object instead of `window`.

#### stepStartIndex
- Type: `number`
- Default: `1`
A start index for elements step counter.
Basic assumption is that this elements are used inside the
`authorization` panel which has the first step (auth type selector).
If the element is to be used as a standalone element then this
should be set to `0` (zero) so the number for the first step will be
`1`.
Basic and NTLM auth elements has only one step. Other elements, with
more complex structure has more steps.

#### noStepper
- Type: `boolean`
If true then the auth method will not render progress bar (stepper).

#### domain
- Type: `string`
- Default: `""`
The domain parameter for the request.

#### password
- Type: `string`
- Default: `""`
The password.

#### username
- Type: `string`
- Default: `""`
The username.

#### settings
- Type: `Function`
Gets a map of current settings (user provided data).


### Component methods

#### validate
- Return type: `Boolean`
Validate the form.
#### restore
- Return type: `undefined`
Restores settings from stored value.

## undefined component
Tag: `<auth-method-oauth1>`

### Installation
Using bower:
```
bower install --save advanced-rest-client/auth-method-oauth1
```

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

## API
### Component properties (attributes)

#### attrForOpened
- Type: `string`
An attribute name describing if the element is currently displayed.
If set, the element will not compute values until the attribute becomes truly.

This is helpful when this editor is used alongside other payload editors and only one
at the time should perform a computation.

Note that setting a property instead of attribute will not work. It must be an
attribute.

#### eventsTarget
- Type: `Object`
Events handlers target. By default the element listens on
`window` object. If set, all events listeners will be attached to this
object instead of `window`.

#### stepStartIndex
- Type: `number`
- Default: `1`
A start index for elements step counter.
Basic assumption is that this elements are used inside the
`authorization` panel which has the first step (auth type selector).
If the element is to be used as a standalone element then this
should be set to `0` (zero) so the number for the first step will be
`1`.
Basic and NTLM auth elements has only one step. Other elements, with
more complex structure has more steps.

#### noStepper
- Type: `boolean`
If true then the auth method will not render progress bar (stepper).

#### consumerKey
- Type: `string`
Client ID aka consumer key

#### consumerSecret
- Type: `string`
The client secret aka consumer secret

#### token
- Type: `string`
Oauth 1 token (from the oauth console)

#### tokenSecret
- Type: `string`
Oauth 1 token secret (from the oauth console)

#### timestamp
- Type: `number`
Timestamp

#### nonce
- Type: `string`
The nonce generated for this request

#### realm
- Type: `string`
Optional realm

#### signatureMethod
- Type: `string`
- Default: `"HMAC-SHA1"`
Signature method. Enum {`HMAC-SHA256`, `HMAC-SHA1`, `PLAINTEXT`}

#### redirectUrl
- Type: `string`
Authorization callback URL

#### requestTokenUrl
- Type: `string`
OAuth1 endpoint to obtain request token to request user authorization.

#### accessTokenUrl
- Type: `string`
Endpoint to authorize the token.

#### authTokenMethod
- Type: `string`
- Default: `"POST"`
HTTP method to obtain authorization header.
Spec recommends POST

#### authParamsLocation
- Type: `string`
- Default: `"authorization"`
A location of the OAuth 1 authorization parameters.
It can be either in the URL as a query string (`querystring` value)
or in the authorization header (`authorization`) value.

#### authorizationUrl
- Type: `string`
An URL to authentication endpoint where the user should be redirected
to auththorize the app.

#### ramlSettings
- Type: `Object`
RAML `securedBy` obejct definition.
If set, it will prefill the settings in the auth panel.

#### signatureMethods
- Type: `Array`
List of currently support signature methods.
This can be updated when `ramlSettings` property is set.

#### defaultSignatureMethods
- Type: `Function`
Returns default list of signature methods for OAuth1

#### settings
- Type: `Function`
Gets a map of current settings (user provided data).


### Component methods

#### validate
- Return type: `Boolean`
Validate the form.
#### restore
- Return type: `undefined`
Restores settings from stored value.
#### authorize
- Return type: `undefined`
Handler for "authorize" button click. Sends the `oauth2-token-requested` event.
#### preFill
- Return type: `undefined`
Pre fills the form with RAML defined settings.

## undefined component
Tag: `<auth-method-oauth2>`

### Installation
Using bower:
```
bower install --save advanced-rest-client/auth-method-oauth2
```

The `<auth-method-oauth2>` element displays a form to provide the OAuth 2.0 settings.

### Example

```
<auth-method-oauth2></auth-method-oauth2>
```

This element uses `oauth2-scope-selector` so the `allowedScopes`, `preventCustomScopes` and
`scopes` properties will be set on this element. See documentation of `oauth2-scope-selector`
for more description.

### Forcing the user to select scope from the list

```html
<auth-method-oauth2 prevent-custom-scopes></auth-method-oauth2>
```

```javascript
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

### OAuth 2.0 extensibility

As per [RFC6749, section 8](https://tools.ietf.org/html/rfc6749#section-8) OAuth 2.0
protocol can be extended by custom `grant_type`, custom query parameters and custom headers.

This is not yet supported in RAML. However, working together with RAML spec creators,
an official RAML annotation to extend OAuth 2.0 settings has been created.
The annotation source can be found in the [RAML organization repository](https://github.com/raml-org/raml-annotations/blob/master/annotations/security-schemes/oauth-2-custom-settings.raml).

When the annotation is applied to the `ramlSettings` property, this element renders
additional form inputs to support custom schemes.

This produces additional property in the token authorization request: `customData`.
The object contains user input from custom properties.

#### `customData` model

```json
customData: {
  auth: {
    parameters: Array|undefined
  },
  token: {
    parameters: Array|undefined,
    headers: Array|undefined,
    body: Array|undefined
  }
}
```
Each array item is an object with `name` and `value` property.
`value` can be empty if the property is required. Otherwise it will be ignored.

The `parameters` property contains all query parameters to be applied to the request.
Query parameters can be applied to bothe token and authorization requests.
The `headers` property contains all headers that can be applied to token
request. `body` can be only applied to the token request.

Note: body content type is always `application/x-www-form-urlencoded`.

#### Annotation example

```yaml
annotationTypes:
  customSettings: !include oauth-2-custom-settings.raml
securitySchemes:
  oauth2:
    type: OAuth 2.0
    describedBy:
      headers:
        Authorization:
          example: "Bearer token"
    settings:
      (customSettings):
        authorizationSettings:
          queryParameters:
            resource:
              type: string
              required: true
              description: |
                A resource ID that defines a domain of authorization.
        accessTokenSettings:
          body:
            resource:
              type: string
              required: true
              description: |
                A resource ID that defines a domain of authorization.
      accessTokenUri: https://auth.domain.com/authorize
      authorizationUri: https://auth.domain.com/token
      authorizationGrants: [code]
      scopes: profile
```

### Styling
`<auth-methods>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--auth-method-oauth2` | Mixin applied to the element. | `{}`
`--auth-method-panel` | Mixin applied to all auth elements. | `{}`
`--auth-grant-dropdown` | Mixin applied to the authorization grants dropdown list | `{}`

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
`--auth-redirect-section` | Mixin applied to the redirect uri section | `{}`

## API
### Component properties (attributes)

#### attrForOpened
- Type: `string`
An attribute name describing if the element is currently displayed.
If set, the element will not compute values until the attribute becomes truly.

This is helpful when this editor is used alongside other payload editors and only one
at the time should perform a computation.

Note that setting a property instead of attribute will not work. It must be an
attribute.

#### eventsTarget
- Type: `Object`
Events handlers target. By default the element listens on
`window` object. If set, all events listeners will be attached to this
object instead of `window`.

#### stepStartIndex
- Type: `number`
- Default: `1`
A start index for elements step counter.
Basic assumption is that this elements are used inside the
`authorization` panel which has the first step (auth type selector).
If the element is to be used as a standalone element then this
should be set to `0` (zero) so the number for the first step will be
`1`.
Basic and NTLM auth elements has only one step. Other elements, with
more complex structure has more steps.

#### noStepper
- Type: `boolean`
If true then the auth method will not render progress bar (stepper).

#### grantType
- Type: `string`
- Default: `""`
Seleted authorization grand type.

#### isCustomGrant
- Type: `boolean`
- Default: `false`
- Read only property
Computed value, true if the grant type is a cutom definition.

#### isSelectedType
- Type: `boolean`
- Default: `false`
- Read only property
Computed value, true if the `grantType` is set.

#### forceHideTypeSelector
- Type: `boolean`
- Default: `false`
If true, OAuth flow selector will be collapsed.

#### typeSelectorOpened
- Type: `boolean`
- Default: `false`
- Read only property
Computed value, true if the type selector is allowd to be hidden

#### clientId
- Type: `string`
- Default: `""`
The client ID for the auth token.

#### clientSecret
- Type: `string`
- Default: `""`
The client secret. It to be used when selected server flow.

#### authUrl
- Type: `string`
- Default: `""`
The authorization URL to initialize the OAuth flow.

#### accessTokenUrl
- Type: `string`
- Default: `""`
The access token URL to exchange code for token. It is used in server flow.

#### password
- Type: `string`
- Default: `""`
The password. To be used with the password flow.

#### username
- Type: `string`
- Default: `""`
The password. To be used with the password flow.

#### redirectUrl
- Type: `string`
A callback URL to be used with this element.
User can't change the callback URL and it will inform the user to setup OAuth to use
this value.

This is relevant when selected flow is the browser flow.

#### scopes
- Type: `Array`
List of user selected scopes.
It can be pre-populated with list of scopes (array of strings).

#### allowedScopes
- Type: `Array`
List of pre-defined scopes to choose from. It will be passed to the `oauth2-scope-selector`
element.

#### preventCustomScopes
- Type: `boolean`
If true then the `oauth2-scope-selector` will disallow to add a scope that is not
in the `allowedScopes` list. Has no effect if the `allowedScopes` is not set.

#### tokenValue
- Type: `string`
- Default: `""`
When the user authorized the app it should be set to the token value.
This element do not perform authorization. Other elements must intercept
`oauth2-token-requested` and perform the authorization. As a result the element
performing an authorization should set back the auth token on the event target object
(this element).

#### hasTokenValue
- Type: `boolean`
- Default: `false`
- Read only property
Computed value, true if access token is set.

#### ramlSettings
- Type: `Object`
RAML `securedBy` obejct definition.
If set, it will prefill the settings in the auth panel.

#### grantTypes
- Type: `Array`
Currently available grant types.

#### noAuto
- Type: `boolean`
The element will automatically hide following fileds it the element has been initialized
with values for this fields (without user interaction):

- autorization url
- token url
- scopes

If all this values are set then the element will set `isAdvanced` attribute and set
`advancedOpened` to false

Setting this property will prevent this behavior.

#### isAdvanced
- Type: `boolean`
If set it will render autorization url, token url and scopes as advanced options
activated on user interaction.

#### advancedOpened
- Type: `boolean`
If true then the advanced options are opened.

#### noGrantType
- Type: `boolean`
If set, the grant typr selector will be hidden from the UI.

#### authQueryParameters
- Type: `Array`
- Read only property
List of query parameters to apply to authorization request.
This is allowed by the OAuth 2.0 spec as an extension of the
protocol.
This value is computed if the `ramlSettings` contains annotations
and one of it is `customSettings`.
See https://github.com/raml-org/raml-annotations for definition.

#### tokenQueryParameters
- Type: `Array`
- Read only property
List of query parameters to apply to token request.
This is allowed by the OAuth 2.0 spec as an extension of the
protocol.
This value is computed if the `ramlSettings` contains annotations
and one of it is `customSettings`.
See https://github.com/raml-org/raml-annotations for definition.

#### tokenHeaders
- Type: `Array`
- Read only property
List of headers to apply to token request.
This is allowed by the OAuth 2.0 spec as an extension of the
protocol.
This value is computed if the `ramlSettings` contains annotations
and one of it is `customSettings`.
See https://github.com/raml-org/raml-annotations for definition.

#### tokenBody
- Type: `Array`
- Read only property
List of body parameters to apply to token request.
This is allowed by the OAuth 2.0 spec as an extension of the
protocol.
This value is computed if the `ramlSettings` contains annotations
and one of it is `customSettings`.
See https://github.com/raml-org/raml-annotations for definition.

#### settings
- Type: `Function`
Gets a map of current settings (user provided data).


### Component methods

#### validate
- Return type: `Boolean`
Validate the form.
#### authorize
- Return type: `undefined`
Handler for "authorize" button click. Sends the `oauth2-token-requested` event.
#### generateState
- Return type: `String`
Generates `state` parameter for the OAuth2 call.
#### restore
- Return type: `undefined`
Restores settings from stored value.
#### preFill
- Return type: `undefined`


## undefined component
Tag: `<auth-method-digest>`

### Installation
Using bower:
```
bower install --save advanced-rest-client/auth-method-digest
```

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

## API
### Component properties (attributes)

#### attrForOpened
- Type: `string`
An attribute name describing if the element is currently displayed.
If set, the element will not compute values until the attribute becomes truly.

This is helpful when this editor is used alongside other payload editors and only one
at the time should perform a computation.

Note that setting a property instead of attribute will not work. It must be an
attribute.

#### eventsTarget
- Type: `Object`
Events handlers target. By default the element listens on
`window` object. If set, all events listeners will be attached to this
object instead of `window`.

#### stepStartIndex
- Type: `number`
- Default: `1`
A start index for elements step counter.
Basic assumption is that this elements are used inside the
`authorization` panel which has the first step (auth type selector).
If the element is to be used as a standalone element then this
should be set to `0` (zero) so the number for the first step will be
`1`.
Basic and NTLM auth elements has only one step. Other elements, with
more complex structure has more steps.

#### noStepper
- Type: `boolean`
If true then the auth method will not render progress bar (stepper).

#### password
- Type: `string`
- Default: `""`
The password.

#### username
- Type: `string`
- Default: `""`
The username.

#### fullForm
- Type: `boolean`
- Default: `false`
If set then it will display all form fields.

#### realm
- Type: `string`
- Default: `""`
Server issued realm.

#### nonce
- Type: `string`
- Default: `""`
Server issued nonce.

#### algorithm
- Type: `string`
- Default: `""`
The realm value for the digest response.

#### qop
- Type: `string`
- Default: `""`
The quality of protection value for the digest response.
Either '', 'auth' or 'auth-int'

#### nc
- Type: `number`
- Default: `1`
Nonce count - increments with each request used with the same nonce

#### cnonce
- Type: `string`
- Default: `""`
Client nonce

#### opaque
- Type: `string`
- Default: `""`
A string of data specified by the server

#### response
- Type: `string`
- Default: `""`
Hashed response to server challenge

#### httpMethod
- Type: `string`
- Default: `""`
Request HTTP method

#### requestUrl
- Type: `string`
- Default: `""`
Current request URL.

#### requestBody
- Type: `string`
- Default: `""`
Current request body.

#### settings
- Type: `Function`
Gets a map of current settings (user provided data).


### Component methods

#### validate
- Return type: `Boolean`
Validate the form.
#### restore
- Return type: `undefined`
Restores settings from stored value.
#### clearUsername
- Return type: `undefined`

#### generateCnonce
- Return type: `undefined`
Generates client nonce.
#### generateResponse
- Return type: `String`
Generates the response header based on the parameters provided in the
form.

See https://en.wikipedia.org/wiki/Digest_access_authentication#Overview

## undefined component
Tag: `<auth-method-custom>`

### Installation
Using bower:
```
bower install --save advanced-rest-client/auth-method-custom
```

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

## API
### Component properties (attributes)

#### attrForOpened
- Type: `string`
An attribute name describing if the element is currently displayed.
If set, the element will not compute values until the attribute becomes truly.

This is helpful when this editor is used alongside other payload editors and only one
at the time should perform a computation.

Note that setting a property instead of attribute will not work. It must be an
attribute.

#### eventsTarget
- Type: `Object`
Events handlers target. By default the element listens on
`window` object. If set, all events listeners will be attached to this
object instead of `window`.

#### stepStartIndex
- Type: `number`
- Default: `1`
A start index for elements step counter.
Basic assumption is that this elements are used inside the
`authorization` panel which has the first step (auth type selector).
If the element is to be used as a standalone element then this
should be set to `0` (zero) so the number for the first step will be
`1`.
Basic and NTLM auth elements has only one step. Other elements, with
more complex structure has more steps.

#### noStepper
- Type: `boolean`
If true then the auth method will not render progress bar (stepper).

#### ramlSettings
- Type: `Object`
RAML `securedBy` obejct definition.

#### headers
- Type: `Array`
- Read only property
List of headers to render in the form.
Note, this value will be computed from the `ramlSettings` object after any change to it.

#### queryParameters
- Type: `Array`
- Read only property
List of query parameters to render.
Note, this value will be computed from the `ramlSettings` object after any change to it.

#### hasHeaders
- Type: `boolean`
- Read only property
Computed value, true if headers are defined in RAML settings.

#### hasQueryParameters
- Type: `boolean`
- Read only property
Computed value, true if query parameters are defined in RAML settings.

#### settings
- Type: `Function`
Gets a map of current settings (user provided data).


### Component methods

#### validate
- Return type: `Boolean`
Validate the form.
#### restore
- Return type: `undefined`
Restores settings from stored value.
For custom methods this is dummy function.
#### notifySettingsChanged
- Return type: `undefined`


