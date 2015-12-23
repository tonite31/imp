var imp = {};

(function()
{
	this.collector = require("./collector");
	
	this.pattern = "";
	
	this.vars = {}; //고정치환변수
	
	this.getHtml = function(componentName, params, callback)
	{
		try
		{
			var that = this;
			
			var url = this.pattern.replace(/{{name}}/gi, componentName);
			this.collector.getComponent(url, function(err, data)
			{
				if(err)
				{
					callback(err);
					return;
				}
				
				data = this.replaceVars(this.extend({}, this.vars, params), data);
				
				//데이터 바인드를 했다고 치고
				var matchList = data.match(/\$\{[a-zA-Z0-9\_\-\(\):\/]*\}/gi);
				if(matchList)
				{
					var forEach = require('async-foreach').forEach;
					forEach(matchList, function(match, index)
					{
						var done = this.async();
						var name = match.replace("${", "").replace("}", "");
						that.getHtml(name, params, function(err, html)
						{
							if(err)
							{
								data = data.replace(match, "<!-- no such component, " + match + " -->");
							}
							else if(html)
							{
								//여기서 component에 대한 데이터바인딩을 해야한다.
								data = data.replace(match, html);
							}
							
							done();
						});
					},
					function(){
						callback(null, data);
					});
				}
				else
				{
					//컴포넌트가 없으면
					callback(null, data);
				}
				
			}.bind(this));
		}
		catch(err)
		{
			callback(err);
		}
	};

	this.replaceVars = function(vars, data)
	{
		var matchList = data.match(/#{[a-zA-Z0-9\.]*}/gi);
		if(matchList)
		{
			for(var i=0; i<matchList.length; i++)
			{
				var value = null;
				
				var key = matchList[i].replace("#{", "").replace("}", "");
				if(key.indexOf("\.") != -1)
				{
					value = vars;
					var split = key.split("\.");
					for(var j=0; j<split.length; j++)
					{
						if(value.hasOwnProperty(split[j]))
						{
							value = value[split[j]];
						}
						else
						{
							value = null;
							break;
						}
					}
				}
				else
				{
					if(vars.hasOwnProperty(key))
						value = vars[key];
				}
				
				if(value)
					data = data.replace(matchList[i], value);
			}
		}
		
		return data;
	};
	
	this.setVars = function(vars)
	{
		this.vars = vars;
	};
	
	this.setPattern = function(pattern)
	{
		this.pattern = pattern;
	};
	
	this.extend = function(target)
	{
	    var sources = [].slice.call(arguments, 1);
	    sources.forEach(function (source) {
	        for (var prop in source) {
	            target[prop] = source[prop];
	        }
	    });
	    return target;
	}
	
}).call(imp);

module.exports = imp;