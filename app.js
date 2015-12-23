var imp = require("./src/imp");
imp.setPattern(__dirname + "/test/{{name}}.html");
imp.setVars({path : {module : "모듈", lib : "립"}});

imp.getHtml("index", {component : {body : "oday"}}, function(err, html)
{
	if(err)
	{
		console.error("오류", err.stack);
	}
	else
	{
		console.log("결과 : ", html);
	}
});