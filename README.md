# Imp

Imp is a view template engine for nodejs.

## Installation
```
npm install nodejs-imp
```

## Syntax

\#{} : It will be replaced to specific variable.

${} : It will be replaced to specific view.

```html
<!DOCTYPE html>
<html>
<head>
<title>Imp</title>
<script type="text/javascript" src="#{logic}"></script>
</head>
<body>
	<h1>Imp is a view template engine for nodejs</h1>
	${left}
	${remote:body}
</body>
</html>
```

## API
```javascript
var imp = require('nodejs-imp');

//Set path pattern of view directory.
//You can register many pattern of path. If you register a pattern with prefix, then you can use syntax "${prefix:name}".
imp.setPattern(__dirname + "/views/{{name}}.html"); //{{name}} replaced to view name.
imp.setPattern("http://localhost:3001/views/{{name}}.html", "remote"); //You can get a view file from remote server.

//Parameter will be replaced to syntax "#{}". This is fixed variables.
imp.setVars({}/*JSON object parameter*/);

//Parameter will be replaced to syntax "#{}". This is dynamic variables.
//Imp doesn't allow to duplicated key between fixed variables and dynamic variables.
imp.getView("name of view", {}/*JSON object parameter*/, function(err, html)
{
	if(err)
	{
		console.log(err.stack);
	}
	else
	{
		console.log(html);
		
		//Response to client
		//res.writeHead(200, {"Content-Type" : "text/html"});
		//res.end(html);
	}
});
```

## With express
```javascript
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
	res.render("index", {});
});
```