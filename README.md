## Generate secret_key 
```js
require("crypto").randomBytes(64).toString("hex")
```

- if we don't provide expire time then the token will valid for lifetime

## Run the redis commander
open the terminal and write
```
redis-commander
```