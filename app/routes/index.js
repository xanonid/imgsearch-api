'use strict';

var fs=require("fs");
var renderme = require("renderme");
var path = require("path");

var cwd = process.cwd();
var ApiHandler = require(cwd + '/app/controllers/apiController.js');

module.exports = function (app) {

	var apiHandler = new ApiHandler();

    app.route("/").
    get(function(req,res) {

      renderme({
        readme: fs.readFileSync(path.join(__dirname,"../..","README.md"),'utf-8'),
        readmeFilename: 'README.md'
        },
        function rendered(err, html) {
          if (err) { throw err; }
          else {
            res.end(html);
          }
        }
      );
    });

	 app.route('/latest')
	 .get(apiHandler.getLatest);
	 
	 app.route('/search/:expression')
	 .get(apiHandler.search);
		
}
