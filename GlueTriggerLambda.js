var AWS = require('aws-sdk');
var glue = new AWS.Glue();
var sqs = new AWS.SQS();
exports.handler = function(event, context,callback) {
    console.log(JSON.stringify(event, null, 3));
    var crawler = event.Records[0].s3.object.key.split("/")[0]
    if(event.Records.length > 0 && event.Records[0].eventSource == 'aws:sqs'){
        startCrawler(crawler, function(err2,data2){
            if(err2) callback(err2)
            else callback(null,data2)
        })
    }else{
        var dbName = 'datacatalog';
        var params = {
            DatabaseInput: {
                Name: dbName,
                Description: 'Rede Post database',
            }
        };
		glue.createDatabase(params, function(err, data) {
            var params1 = {
                DatabaseName: dbName,
                Name: crawler,
                Role: 'service-role/rede-data-lake-GlueLabRole-1OI9OXN93676F',
                Targets: {
                    S3Targets: [{ Path: 's3://rede-data-lake-raws3bucket-1qgllh1leebin/' }]
                },
                Description: 'crawler test'
            };
            glue.createCrawler(params1, function(err1, data1) {
                startCrawler(crawler, function(err2,data2){
                    if(err2) callback(err2)
                    else callback(null,data2)
                })
            });
		});
	};
};
function startCrawler(name,callback){
	var params = {
		Name: name,
	};
	glue.startCrawler(params, function(err, data) {
		if (err){
			console.log(JSON.stringify(err,null,3 ))
			var params1 = {
				MessageBody: 'retry',
				QueueUrl: 'https://sqs.us-east-2.amazonaws.com/094381036356/rede-data-lake-SQSqueue-1AWGW0PCYANIY'
			};
			sqs.sendMessage(params1, function(err1, data1) {
				if (err1) callback(err1);
				else     callback(null, data1)
			});
		}
		else{
			callback(null, data)
		}
	});
	}