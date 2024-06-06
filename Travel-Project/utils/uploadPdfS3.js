const s3ClientPdf = require("./awsConfigPdf");
const { PutObjectCommand } = require("@aws-sdk/client-s3");

async function uploadPdfToS3(pdfBuffer, fileName) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME_PDF,
    Key: fileName,
    Body: pdfBuffer,
    ContentType: "application/pdf",
    ACL: "public-read", // or 'private' depending on your requirements
  };

  try {
    const command = new PutObjectCommand(params);
    await s3ClientPdf.send(command);
    const url = `https://${process.env.AWS_BUCKET_NAME_PDF}.s3.${process.env.AWS_REGION_PDF}.amazonaws.com/${fileName}`;
    console.log("File uploaded successfully. Location:", url);
    return url;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

module.exports = uploadPdfToS3;
