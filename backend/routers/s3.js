// const S3 = require("aws-sdk/clients/s3");
// const dotenv = require("dotenv").config();
// const fs = require("fs");

// const bucketName = process.env.AWS_BUCKETNAME;
// const region = process.env.AWS_region;
// const accessKeyId = process.env.AWS_accessKey;
// const secretAcessKey = process.env.AWS_secretAccessKey;

// console.log(bucketName, region, accessKeyId, secretAcessKey);

// const s3 = new S3({
//   region,
//   accessKeyId,
//   secretAcessKey,
// });

// export function upload(file) {
//   const fileStream = fs.createReadStream(file.path);

//   const uploadParams = {
//     Bucket: bucketName,
//     Body: fileStream,
//     key: file.filename,
//   };

//   return s3.upload(uploadParams).promise();
// }

// exports.uploadFile = uploadFile;
