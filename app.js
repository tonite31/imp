global._path =
{
	home : __dirname,
	props : __dirname + "/properties",
	src : __dirname + "/src"
};

var Imp = require(_path.src + "/imp");
Imp.setLayoutMap({"/[a-z0-9]*" : "index"});
Imp.setComponentPattern("test/{{name}}.html");
Imp.setVars({path : {module : "모듈", lib : "립"}});

Imp.getPage("/", function(html)
{
	console.log("결과 : ", html);
});