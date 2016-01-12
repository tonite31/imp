var imp = require("./src/imp");
imp.setPattern(__dirname + "/test/views/{{name}}.html");
imp.setPattern(__dirname + "/test/views/component/{{prefix}}_{{name}}.html", "[a-z0-9]*");

imp.getView("index", {component : {body : "main/today"}}, function(err, html)
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
//
//var regex = new RegExp("[a-z0-9]*", "gi");
//console.log("야야 : ", regex.test("test"));
