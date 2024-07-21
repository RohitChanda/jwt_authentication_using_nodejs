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

## Setup Express server
```js
require("dotenv").config();
const express = require('express');
const app = express();
const dbConnect = require("./db/db");
const routers = require("./routes");
const client = require("./redis/redis");
const port = 8000;

// ---- || Start Database connection || -------- //
dbConnect();

//-------- || Start the Redis Connection || -------------------- //
client.connect();

// ------ || Adding JSON middleware and Routes Middleware || ---------------------- //
app.use(express.json());
app.use(routers);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

## Create User Model 
```js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
});

// ------------ || Hash the password in Pre save stage || -------------------------- //
UserSchema.pre("save", async function (next) {
  try {
    /* 
      Here first checking if the document is new by using a helper of mongoose .isNew, therefore, this.isNew is true if the document is new else false, and we only want to hash the password if its a new document, else  it will again hash the password if you save the document again by making some changes in other fields incase your document contains other fields.
      */
    if (this.isNew) {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

// ---------- || Adding a method for valid password in login time || ---------------------- //
UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = new mongoose.model("user", UserSchema);
module.exports = User;

```
- Mongoose is a powerful MongoDB object modeling tool for Node.js that provides a straightforward way to interact with MongoDB databases. One of the key features of Mongoose is its support for pre and post hooks, allowing you to execute code before or after specific database operations.
  
### Pre Save Hooks: 
- It is executed just before a document is saved to the database. It’s commonly used for tasks such as data validation, generating timestamps, or modifying the document before saving.
- This middleware is a function defined on the schema-level and is invoked with two arguments: **the event trigger (as a string)** and the **callback function** that is triggered for that particular event. The callback itself takes in an argument of a function, which we typically call next. Invoking this function is critical, mongoose will not proceed if this function is not called. Also, even though it may be obvious, keep in mind that next() will immediately proceed to the next step in the process.
- ```this``` inside of a pre-save hook is the document that is about to be saved.
- if we want to execute the middleware ONLY when this document is new, we can check the ```isNew``` property of the document that’s about to be saved.
```js
if (this.isNew) { }
```

### Schema Methods: 
- Each Schema can define instance and static methods for its model.
- Methods are instance level functions, and can be used only on an object/instance of schema, and not on the Schema directly. They work as an extension function to the instance, providing additional functionality.
```js
UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};
```
- Here, we created a method for our instance by the name, “isValidPassword”.
```js
const user = await User.findOne({ email: body.email });
const verifypassword = await user.isValidPassword(body.password);

```

## 🚀 Setup redis
Redis (Remote Dictionary Server) is an open-source, in-memory, NoSQL key/value store that can be used as a database, cache, or message broke
### Install Redis on Windows
- to install Redis download the msi file from [https://github.com/microsoftarchive/redis/releases](https://github.com/microsoftarchive/redis/releases)
- run the setup file
### Install Redis commander 
- It gives us Redis' GUI experience.
- Install and run
```
npm install -g redis-commander
redis-commander
```

### Configure redis into your project
- Install Redis with npm : ```npm i redis```
- Inside your project
  ```js
  const redis = require("redis");
  const client = redis.createClient({
      // url
      port: 6379,
      host: '127.0.0.1'
  });

  // -------- || Listening on Redis Events || --------- //
  client.on('connect', () => console.log('Connected to redis server....'))
  client.on('ready', () => console.log('Connected to redis server and Ready to use....'))
  client.on('error', (err) => console.log('Redis Client Error', err))
  client.on('end', (err) => console.log('Redis Client Disconnected...'))

  // --------- || Quit the Redis Connection || ---------------- //
  /**
   * When we ctrl+c to stop our application then we need to stop our redis
   * that time SIGINT event fire
   */
  process.on("SIGINT", () => {
      client.quit();
  });
  
  module.exports = client;
  ```
  #### SIGINT event
  - it's a Node.js Process Signal Events.
  - It is supported on all platforms via terminal, It is usually be generated with Ctrl+C (You can change this as well). It is not generated when the terminal raw mode is enabled and Ctrl+C is used. 



## 🚀 What is Bcrypt. How to use it to hash passwords? 
- The bcrypt npm package is a JavaScript implementation of the bcrypt password hashing function that allows you to easily create a hash out of a password string. Unlike encryption which you can decode to get back the original password, **hashing is a one-way function that can’t be reversed once done**.
- learn [more](https://dev.to/documatic/what-is-bcrypt-how-to-use-it-to-hash-passwords-5c0g#:~:text=The%20bcrypt%20npm%20package%20is,t%20be%20reversed%20once%20done.)

### Creating a password hash with bcrypt 
To generate a password using the bycrypt module, you need to call the hash() method which accepts the following parameters:
  - The password string that you wish to hash
  - The number of rounds to secure the hash. The number commonly ranges from 5 to 15
  - **Generating salt for the hash:** A hashing function requires you to add salt into the process. A salt is simply a random data that’s used as an additional input to the hashing function to safeguard your password.The random string from the salt makes the hash unpredictable.
  ```js
  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  const hashedPassword = await bcrypt.hash(this.password, salt);
  ```

## 🚀 create user route 
```js
const createUser = async (req, res) => {
  try {
    const payload = {
      email: req.body.email,
      password: req.body.password,
    };
    const user = new User(payload);

    // Password will hash in pre save method

    await user.save();

    res.status(200).json({ user: payload, msg: "user created succesfully!!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      res: error,
    });
  }
};
```

## 🚀 user login route
```js
const handleUserlogin = async (req, res) => {
  try {
    const body = req.body;
    // console.log(body);
    const user = await User.findOne({ email: body.email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const verifypassword = await user.isValidPassword(body.password);

    if (!verifypassword) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const { accessToken, refreshToken } = await generateUserToken(user);

    res
      .status(200)
      .json({ accessToken, refreshToken, msg: "user loggedin successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      res: error,
    });
  }
};
```
- if the password is valid then we will generate the access token and the refresh token.
- Take a look inside jwt_helper file.
  ```js
  const generateUserToken = async (user) => {
    try {
      const payload = {
        _id: user.id,
        email: user.email,
      };
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1m",
      });

      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "1d",
      });

      //set value in redis
      await client.SET(user.id, refreshToken, {
        EX: 1 * 24 * 60 * 60, // in second
      });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error(error);
    }
  },
  ```
#### jwt.sign(payload, secretOrPrivateKey, [options, callback])
- payload could be an object literal, buffer or string representing valid JSON.
- secretOrPrivateKey is a string (utf-8 encoded), buffer, object, or KeyObject containing either the secret for HMAC algorithms or the PEM encoded private key for RSA and ECDSA.
- options:
  - algorithm (default: HS256)
  - expiresIn: expressed in seconds or a string describing a time span vercel/ms.
  - audience : In the JSON Web Token (JWT) standard, the "aud" (audience) claim is a string or array of strings that identifies the **recipients** that the JWT is intended for
  - ... etc
#### Set Value in redis
```js
await client.set('key', 'value', {
  EX: 1 * 24 * 60 * 60, // in second
  NX: true
});
```

## 🚀 Re Generate tokens after the access token will expire
```js
const handleRegenerateToken = async (req, res) => {
  try {
    const refreshtoken = req.headers["refreshtoken"];
    if (!refreshtoken) {
      return res
        .status(401)
        .json({ msg: "Access Denied. No refresh token provided." });
    }
    const decode = await verifyRefreshToken(refreshtoken);

    const user = {
      id: decode._id,
      email: decode.email,
    };

    const { accessToken, refreshToken } = await generateUserToken(user);
    return res.status(200).json({
      accessToken,
      refreshToken,
      msg: "token generate successfully!!!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      res: error.message,
    });
  }
};
```
In side jwt_helper  file
```js
const verifyRefreshToken = async (refreshToken) => {
    try {
      const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const cacheData = await client.GET(decode._id);
      if (cacheData !== refreshToken) {
        throw new Error("Invalid refresh token!!!");
      }

      return decode;
    } catch (error) {
      throw new Error(error);
    }
  },
```
### jwt.verify(token, secretOrPublicKey, [options, callback])
- token is the JsonWebToken string.
- secretOrPublicKey is a string (utf-8 encoded), buffer, or KeyObject containing either the secret for HMAC algorithms, or the PEM encoded public key for RSA and ECDSA.
- options
  - algorithms: List of strings with the names of the allowed algorithms. For instance, ["HS256", "HS384"].
  - audience:
### Get the value from Redis
- If the refresh token is verified we try to get value from Redis using the user ID as a key.
- Then we check if the value from Redis is the same as the refreshtoken which is passed as an argument in the verifyRefreshToken function.
```js
  const cacheData = await client.GET(decode._id);
  if (cacheData !== refreshToken) {
      throw new Error("Invalid refresh token!!!");
  }
```
  

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
