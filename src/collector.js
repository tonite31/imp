var request = require('request');
var fs = require('fs');

var collector = {};

(function()
{
	//콜렉터는 컴포넌트 이름과 실제 url이 맵핑되어야 한다.
	//그런데 보통 패턴으로 처리할듯하다.
	//pattern에 name을 replace한다.
	
	//그리고 로컬파일인경우와 remote파일 혹은 request url인 경우가 있겠지.
	
	this.pattern = "";
		
	//컴포넌트 이름을 받아서 실제 string을 돌려주는 착한아이.
	//컴포넌트 이름과 실제 url의 매핑을 가지고 있어야 할것이다?
	//config 파일을 통해 입력을 받을 수 있게끔 합시다.
	//1:1맵핑이나, 패턴맵핑.
	
	this.getComponent = function(name, callback)
	{
		try
		{
			if(this.pattern)
			{
				
			}
			var url = this.pattern.replace(/{{name}}/gi, name);
			
			//가져온다.
			if(url.match(/^https?:\/\//gi))
			{
				var param = {};
				param.url = url;
				param.method = "GET";
				
				var that = this;
				request(param, function(error, response, body)
				{
				    if(error)
				    {
				    	that.parent.logger.error(error);
				    	callback(error);
				    }
				    else
				    {
				    	that.parent.logger.log(response.statusCode, body);
				        callback(null, body);
				    }
				});
			}
			else
			{
				//로컬파일로 접근한다.
				try
				{
					var stats = fs.statSync(url);
					if(stats.isFile())
					{
						//파일인경우만 읽어서 스트링 리턴이다.
						var data = fs.readFileSync(url, 'utf8');
						callback(null, data);
					}
				}
				catch(err)
				{
					callback(err);
				}
				finally
				{
					return null;
				}
			}
		}
		catch(err)
		{
			callback(err);
		}
		finally
		{
			return null;
		}
	};
	
	this.setPattern = function(pattern)
	{
		this.pattern = pattern;
	};
	
}).call(collector);

module.exports = collector;