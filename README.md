# JWT authentication using Node.js with accesstoken and refreshtoken
Understanding the “AccessToken” and “RefreshToken” model and JWT to secure your REST API.
## 🚀 Describe token-based authentication in web application
Token-based authentication is a passwordless security mechanism that validates a user's identity through the use of tokens. A token is a unique piece of data, often a string of characters, that acts as a stand-in for the user's credentials, which are typically generated and verified by the server to authenticate users. There are various types of tokens, such as **JSON Web Tokens (JWT)** and **OAuth tokens**. In this chapter, we will focus on JSON Web Tokens.


## 🚀 Types of tokens that can be used for authentication
### Access token
- Access tokens are perhaps the most common type of digital token. They act as digital keys that provide short-term access to secured resources, such as APIs or websites after the user has been authenticated. 
-  Due to their short validity period, they minimize the risk of unauthorized access if intercepted.

### Refresh token
- Refresh tokens complement access tokens. They have a longer lifespan and serve a singular purpose: to obtain a new access token when the current one expires.
- They are vital for maintaining a user's session without requiring the user to re-authenticate frequently. 
- When an access token expires, the client application can present the refresh token to the server to get a fresh access token, thus ensuring continued access to resources without interrupting the user experience.
- Refresh tokens enhance security by limiting the lifespan of access tokens and reducing the exposure time of active credentials.
- Refresh token deployments can further be enhanced by implementing refresh token rotation or reuse detection to ensure protection against token theft and malicious use.

### ID token
- ID tokens are used primarily in identity protocols like OpenID Connect, where they serve as proof of the user's identity.
- They are issued alongside access tokens when a user authenticates with an identity provider.
- ID tokens typically follow the JSON Web Token (JWT) format, carrying information about the user's identity, such as their username and the time at which they logged in. 
- Clients can use ID tokens to verify the identity of the user and to tailor the user experience accordingly. For example, an application could extract the user's name from an ID token and display it on the dashboard.




## 🚀 Advantages of token-based auth
### Enhanced security: 
Tokens are much tougher to duplicate or compromise compared to traditional passwords. Since each token contains a unique identifier, it significantly reduces the risk of unauthorized access.

### No need for passwords:
With token-based authentication, the need for remembering complex passwords or storing them insecurely is eliminated. This reduces the risk of password theft or phishing attacks.

### Scalability: 
Token-based systems are highly scalable, making it easier for businesses to manage access as they grow. They can quickly add or revoke token access for users.

### Statelessness: 
Tokens are stateless; they carry all the necessary information within them. This means the server does not need to keep a session store, making the system more efficient and scalable.

### Multi-factor authentication: 
Token-based authentication easily integrates with MFA methods, adding an extra layer of security. Users might first log in with a password and then use a token for further validation.

### Federated authentication: 
This system allows for delegated or federated authentication, where a third-party service can authenticate a user on behalf of the primary service. This is highly beneficial for services that rely on other platforms for user authentication (like social media logins).

## Better user experience: 
Users enjoy a smoother experience since they no longer need to log in every time they access an app or service. As long as their token is valid, they are granted access, simplifying the user experience.


## 🚀 Generate secret_key 
```js
require("crypto").randomBytes(64).toString("hex")
```

- if we don't provide expire time then the token will valid for lifetime

## Run the redis commander
open the terminal and write
```
redis-commander
```
