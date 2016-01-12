# Imp

Imp is a view template engine for nodejs.

## Installation
```
npm install nodejs-imp
```

## Example
```
var imp = require('nodejs-imp');
imp.setPattern(__dirname + "/views/{{name}}.html");
imp.getHtml("index", {data : "test"}, function(err, html)
{
	if(err)
	{
		console.log(err.stack);
	}
	else
	{
		console.log(html);
	}
});
```

for remote html.
```
imp.setPattern("http://localhost:3001/views/{{name}}.html");
```

for prefix for template name.
```
imp.setPattern(__dirname + "/views/{{name}}.html");
imp.setPattern("http://localhost:3001/views/{{name}}.html", "remote");
```

## How to write a template html.

use ${} syntax.

### index.html
```
<html>
<head>
	${head}
</head>
<body>
	<h1>Header</h1>
	${body}
	<footer>
		${remote:footer}
	</footer>
</body>
</html>
```

### head.html
```
<script type="text/javascript" src="example.js"></script>
<script type="text/javascript" src="example2.js"></script>
	
<link rel="stylesheet" type="text/css" href="index.css" />
```

### footer.html
```
<p>Code licensed under MIT, documentation under CC BY 3.0</p>
```

## Replace data

### Syntax

#### index.html
```
<p>#{testValue}</p>
<p>#{user.name}</p>
```
### Render
```
res.render("index", {testValue : "test", user : {name : "Alprensia"}});
```

## Example with express
```
var express = require('express');
var app = express();
var server = app.listen(3000, function()
{
	console.log('Listening on port %d', server.address().port);
});

var imp = require('nodejs-imp');
imp.setPattern(__dirname + "/views/template/{{name}}.html");

app.use(imp.render);

app.get('/', function(req, res, next)
{
	res.render("index");
});
```