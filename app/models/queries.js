'use strict';

var mongoose = require('mongoose');
//var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;


var Query = new Schema({
	querytext: {
		type: String,
		validate:{
		    validator: function(v) {
                return v.length>0;
            },
            message: '{VALUE} is not a valid query.'
		},
		required : true,
		//unique: true
	}
},
{
    timestamps: true
});

//autoIncrement.initialize(mongoose.connection);
//Query.plugin(autoIncrement.plugin, 'Query');

module.exports = mongoose.model('Query', Query);
