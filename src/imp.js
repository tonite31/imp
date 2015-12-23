//메인모듈

var imp = {};

(function()
{
	this.logger = console;
	
	this.collector = require(_path.src + "/collector");
	this.collector.parent = this;
	
	this.map = {}; // 레이아웃 이름과 실제 url을 매핑한다. 레이아웃은 화면의 기본틀이 되는 index파일. 여러개가 될수도 있음.
//	this.map['/'] = "index"; // 1:1맵핑
//	this.map['/[a-z]*'] = "index"; // n:1맵핑
//	this.map['*'] = "index"; // n:1맵핑
//	this.map['/([a-z]*)/([0-9]*)'] = "(1)_(2)"; // n:n맵핑
	
	this.vars = {}; //치환변수
//	this.vars = {test : "테스트"}; // #{test}
//	this.vars = {test : {abc : "에이비씨"}}; // #{test.abc}
	
	this.fixedUrlParam = {};
	
	this.getPage = function(url, callback)
	{
		try
		{
			this.parseUrl(url);
			
			var layoutName = "";
			for(var key in this.map)
			{
				var regx = new RegExp(key, "gi");
				var result = regx.exec(url);
				if(result)
				{
					layoutName = this.map[key];
					if(result.length > 2)
					{
						for(var i=1; i<result.length; i++)
						{
							if(result[i].trim())
							{
								layoutName = layoutName.replace("(" + i + ")", result[i].trim());
							}
						}
					}
					
					break;
				}
			}
			
			if(layoutName)
			{
				this.collector.getComponent(layoutName, function(err, data)
				{
					if(err)
					{
						this.logger.error(err);
						return;
					}

					data = this.replaceVars(data);
					
					//데이터 바인드를 했다고 치고
					
					this.parseComponent(data, function(resultData)
					{
						callback(resultData);
					});
					
				}.bind(this));
			}
		}
		catch(err)
		{
			this.logger.error(err.stack);
		}
		finally
		{
			return null;
		}
	};
	
	this.parseUrl = function(url)
	{
		url = url.replace(/^https?:\/\//gi, ""); //앞에 처리하고. //해시는 어떻게 하지?
		
		var split = url.split("?");
		
		// 고정 url 파라미터와 쿼리스트링 분리
		url = url[0];
		var qs = split[1];
		
		var split = url.split("/");
		for(var i=0; i<split.length; i++)
		{
			if(i == split.length-1 && split[i].indexOf("#") != -1)
				split[i] = split[i].split("#")[0];
			
			this.fixedUrlParam[i] = split[i];
		}
		
		this.vars.query = {};
		
		if(qs)
		{
			split = qs.split("&");
			for(var i=0; i<split.length; i++)
			{
				var keyValue = split[i].split("=");
				if(keyValue[1] && keyValue[1].indexOf("#") != -1)
					keyValue[1] = keyValue[1].split("#")[0];

				this.vars.query[keyValue[0]] = decodeURIComponent(keyValue[1]);
			}
		}
	};
	
	this.replaceVars = function(data)
	{
		for(var key in this.vars)
		{
			var matchList = data.match(/#{[a-zA-Z0-9\.]*}/gi);
			if(matchList)
			{
				for(var i=0; i<matchList.length; i++)
				{
					var value = this.vars[key];
					if(matchList[i].indexOf("\.") != -1)
					{
						var split = matchList[i].split("\.");
						
						for(var j=1; j<split.length; j++)
						{
							value = value[split[j].replace("}", "")];
						}
					}
					
					data = data.replace(matchList[i], value);
				}
			}
		}
		
		return data;
	};
	
	this.parseComponent = function(data, callback)
	{
		var that = this;
		
		var matchList = data.match(/\$\{[a-zA-Z0-9\_\-\(\):\/]*\}/gi);
		if(matchList)
		{
			var forEach = require('async-foreach').forEach;
			forEach(matchList, function(match, index)
			{
				try
				{
					var done = this.async();
					
					var name = match.replace("${", "").replace("}", "");
					
					var nameMatchList = name.match(/(\([0-9a-zA-Z-_:\/]*\))/gi);
					if(nameMatchList)
					{
						for(var j=0; j<nameMatchList.length; j++)
						{
							var value = nameMatchList[j].replace("(", "").replace(")", "");
							var split = value.split(":");
							var index = split[0];
							var defaultValue = split[1];
							
							if(that.fixedUrlParam[index])
								value = that.fixedUrlParam[index];
							else if(defaultValue)
								value = defaultValue;
							else
								value = "";

							name = name.replace(nameMatchList[j], value);
						}
					}
					
					that.collector.getComponent(name, function(err, component)
					{
						if(err)
						{
							done();
							return;
						}
						
						//여기서 component에 대한 데이터바인딩을 해야한다.
						
						data = data.replace(match, component);
						
						done();
					});
				}
				catch(err)
				{
					that.logger.error(err.stack);
				}
			},
			function(){
				callback(data);
			});
		}
	};
	
	this.setLayoutMap = function(map)
	{
		this.map = map;
	};
	
	this.setVars = function(vars)
	{
		this.vars = vars;
	};
	
	this.setComponentPattern = function(pattern)
	{
		this.collector.setPattern(pattern);
	};
	
	this.setLogger = function(logger)
	{
		this.logger = logger;
	};
	
}).call(imp);

module.exports = imp;