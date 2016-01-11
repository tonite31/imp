# imp

is a nodejs module for html templating.

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