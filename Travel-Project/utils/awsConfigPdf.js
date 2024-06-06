const { S3Client } = require("@aws-sdk/client-s3");

// Configure the AWS SDK with your credentials and region
const s3ClientPdf = new S3Client({
  region: process.env.AWS_REGION_PDF,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_PDF,
    secretAccessKey: process.env.AWS_SECRET_KEY_PDF,
  },
});

module.exports = s3ClientPdf;
