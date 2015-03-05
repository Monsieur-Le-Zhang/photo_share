var http = require('http');
var fs = require('fs');
var formidable = require('formidable');

http.createServer(function (req, res) {
    switch (req.method) {
        case "GET":
            showUploadForm(req, res);
            break;
        case "POST":
            uploadPhoto(req, res);
            break;
    }
}).listen(3000);

function showUploadForm(req, res) {
    var stream = fs.createReadStream('./upload_form.html');
    stream.pipe(res);
}

function uploadPhoto(req, res) {
    if (!isFormData(req)) {
        res.statusCode = 400;
        res.end('Bad request: expecting multipart/form-data');
    } else {
        // 1. the typic way to handler the form data
        /*
        var form = new formidable.IncomingForm();
        form.on('filed', function (field, value) {
            console.log(fiild, value);
        });
        form.on('file', function (name, file) {
            console.log(name. file);
        });
        form.on('end', function () {
            res.end('Upload complete');
        });
        form.parse(req);
        */

        // 2. the more concise way:
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            console.log(fields);
            console.log(files);
            res.end('Upload complete');
        });
        form.on('progress', function (bytesReceived, bytesExpected) {
            var percent = Math.floor(bytesReceived / bytesExpected * 100);
            console.log(percent);
        });
    }
}

function isFormData(req) {
    var type = req.headers['content-type'] || '';
    return 0 == type.indexOf('multipart/form-data');
}