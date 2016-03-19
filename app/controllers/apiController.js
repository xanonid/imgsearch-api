'use strict';

var Query = require("../models/queries.js");

var google = require('googleapis');
var customsearch = google.customsearch('v1');

function ApiHandler() {
	var API_KEY = process.env.API_KEY;
	var CX_KEY = process.env.CX_KEY;

	this.search = function(req, res) {
		var querystring = req.params.expression;
		if (!querystring)
			{
					res.status(400).json({
					"error:": "Please specify a query term."
				});
			}
			
		var current_start = req.params.offset | 1;

		var dataset = Query({
			querytext: querystring
		});
		dataset.save(function(err) {
			if (err) {
				console.log(err);
				return;
			}
		});

		var query_options = {
			auth: API_KEY,
			q: querystring,
			searchType: 'image',
			num: 10,
			start: current_start,
			cx: CX_KEY
		};

		var resultData = [];

		customsearch.cse.list(query_options, function(err, query_result) {
			if (err) {
				res.status(400).json({
					"error:": err.message
				});
				return;
			}
			if (query_result.items && query_result.items.length > 0) {
				query_result.items.forEach(function(i) {
					resultData.push({
						url: i.link,
						snippet: i.snippet,
						thumbnail: i.image.thumbnailLink,
						context: i.image.contextLink
					});
				});
				res.send(resultData);
			}
			else {
				res.send(resultData);
			}
		});

	};

	this.getLatest = function(req, res) {
		Query.find({}).sort('-createdAt').limit(10).exec(function(err, docs) { 
			if (err) {
				console.log(err);
				return res.sendStatus(400);
			}	
			var results=[];
			docs.forEach(function(item){
				results.push({term:item.querytext,when:item.createdAt })
				}
			);
			res.send(results);
		});
	}

}

module.exports = ApiHandler;
