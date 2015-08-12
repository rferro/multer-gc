# multer-gc

Express middleware to clean req.files and req.file after request end

## Install

```shell
npm install --save multer-gc
```

## Example

```js
var express  = require("express")
var multergc = require("multer-gc")
var app      = express();

app.use(multergc());

app.listen(process.env.PORT)
```

## License

MIT
