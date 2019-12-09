var AWS = require('aws-sdk');
var sns = new AWS.SNS( { region: "us-east-2" });
var s3 = new AWS.S3();
var glue = new AWS.Glue({apiVersion: '2017-03-31'});
	exports.handler = function(event, context, callback) {
	console.log(JSON.stringify(event, null, 3));
		var params = {
			JobName: 'GlueSalesJob',
			Timeout: 20,
		};
		glue.startJobRun(params, function(err1, data1) {
			if (err1) {
				console.log(err1, err1.stack);}
			else {
				console.log(data1);}
		});
		console.log(JSON.stringify(event, null, 3));
	};
