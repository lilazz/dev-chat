const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

AWS.config.update({
	accessKeyId:process.env.AWS_ACCESSKEYID,
	secretAccessKey:process.env.AWS_SECRET,
	region: process.env.AWS_REGION
});

const S0 = new AWS.S3({});
const upload = multer({
	storage: multerS3({
		s3: S0,
		bucket: 'zmeeva-chatapp',
		acl: 'public-read',

		matadata(req, file, cb) {
			cb(null, {fieldName:file.fieldName});
		},

		key(req, file, cb) {
			cb(null, file.originalname);
		},

		rename(fieldName, fileName){
			return fileName.replace(/\W+/g, '-'); //replace every space into '-'
		}
	})
});

exports.Upload = upload;
