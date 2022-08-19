# ride

Monkey-patch stuff at will!

```javascript
var ride = require('ride')
var fs = require('fs')

ride(fs, 'readFile').before(function (filename) {
  console.log('You are reading ' + filename + ', huh?')
})
```

## API reference

<https://apiref.page/package/ride>

[![API reference screenshot](https://ss.dt.in.th/api/screenshots/apiref-ride.png)](https://apiref.page/package/ride)
