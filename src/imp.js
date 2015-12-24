var imp = {};

(function()
{
	this.collector = require("./collector");
	
	this.pattern = {}; //컴포넌트 로딩용 패턴
	
	this.vars = {}; //고정치환변수
	
	this.getHtml = function(componentName, params, callback)
	{
		try
		{
			var that = this;
			
			var url = this.getUrl(componentName);
			
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
	
	this.getUrl = function(componentName)
	{
		var url = "";
		
		var prefix = "";
		if(componentName.indexOf(":") != -1)
		{
			//prefix가 붙어있다면
			var split = componentName.split(":");
			prefix = split[0];
			componentName = split[1];
			
			if(!prefix) // ${:test} 뭐 이런식으로 입력된 경우.
			{
				url = this.pattern[prefix].replace(/{{name}}/gi, componentName);
			}
			else
			{
				//prefix가 정말로 있으면. 먼저 일치하는거 우선
				if(this.pattern[prefix])
				{
					url = this.pattern[prefix].replace(/{{name}}/gi, componentName).replace(/{{prefix}}/gi, prefix);
				}
				else
				{
					//일치하는게 없으면 key를 다 돌려서 일치하는거 찾아야함. 등록한 순서대로.
					for(var key in this.pattern)
					{
						if(key)
						{
							var regex = new RegExp(key, "gi");
							if(regex.test(prefix))
							{
								//일치하는 prefix 패턴이 있으면
								url = this.pattern[key].replace(/{{name}}/gi, componentName).replace(/{{prefix}}/gi, prefix);
								break;
							}
						}
					}
				}
			}
		}
		else
		{
			//prefix가 없다면
			url = this.pattern[prefix].replace(/{{name}}/gi, componentName);
		}
		
		return url;
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
	
	this.setPattern = function(pattern, prefix)
	{
		if(prefix)
			this.pattern[prefix] = pattern;
		else
			this.pattern[''] = pattern;
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