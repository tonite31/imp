var Handlebars = require('handlebars');
var cheerio = require('cheerio');

var binder = {};

(function()
{
	this.modules = {};
	
	this.getHtml = function(html, params, callback)
	{
		var $ = cheerio.load(html);
		
		this.databind($, "body", function(html)
		{
			callback(html);
		});
	};
	
	this.databind = function($, selector, callback)
	{
		try
		{
			var that = this;
			
			var list = $(selector).find("*[data-bind]");
			
			var forEach = require('async-foreach').forEach;
			forEach(list, function(element, index)
			{
				var done = this.async();
				
				var moduleName = $(element).attr("data-bind");
				var param = $(element).attr("data-param");
				var templateId = $(element).attr("data-template");
				var template = "";
				
				$(element).removeAttr("data-bind");
				$(element).removeAttr("data-param");
				$(element).removeAttr("data-template");
				
				if(templateId)
				{
					template = $(templateId).html();
					$("head").append($(templateId).remove());
				}
				else
				{
					done();
				}
				
				try
				{
					if(param)
						param = JSON.parse(param);
					else
						param = {}
					
					if(!template)
					{
						//템플릿 없다고 표시.
						$(element).html("Template not found.");
						done();
					}
					
					template = template.replace(/&quot;/gi, "\"").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&apos;/gi, "\'");
					
					template = Handlebars.compile(template);
					
					if(that.modules.hasOwnProperty(moduleName))
					{
						that.modules[moduleName](param, function(data)
						{
							$(element).html(template(data));
							that.databind($, element, function(html)
							{
								done();
							});
						});
					}
					else
					{
						done();
					}
				}
				catch(err)
				{
					//에러 표시를 어딘가 해줘야함.
					console.log(err.stack);
					$(element).html(err.stack);
				}
			},
			function()
			{
				callback($.html());
			});
		}
		catch(err)
		{
			console.log(err.stack);
			callback($.html());
		}
	};
	
}).call(binder);

module.exports = binder;