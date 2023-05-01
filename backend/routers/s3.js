const { S3Client } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv").config();

const bucketName = process.env.AWS_BUCKETNAME;
const region = process.env.AWS_region;
const accessKeyId = process.env.AWS_accessKey;
const secretAcessKey = process.env.AWS_secretAccessKey;

 const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKeyId,
    secretAcessKey: secretAcessKey,
  },
  region: region,
});


module.exports = s3