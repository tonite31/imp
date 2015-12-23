var request = require('request');
var fs = require('fs');

var collector = {};

(function()
{
	this.getComponent = function(url, callback)
	{
		try
		{
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
				    	callback(error);
				    }
				    else
				    {
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