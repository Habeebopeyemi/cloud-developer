import { S3Event, SNSEvent, SNSHandler } from "aws-lambda";
import "source-map-support/register";
import * as AWS from "aws-sdk";
import Jimp from "jimp/es";

const s3 = new AWS.S3();

const imagesBucketName = process.env.IMAGES_S3_BUCKET;
const thumbnailBucketName = process.env.THUMBNAILS_S3_BUCKET;

export const handler: SNSHandler = async (event: SNSEvent) => {
  // TODO: get SNS event message
  console.log(`Processing SNS event ${JSON.stringify(event)}`);
  for (const snsRecord of event.Records) {
    const s3EventStr = snsRecord.Sns.Message;
    console.log(`Processing s3 event ${s3EventStr}`);
    const s3Event = JSON.parse(s3EventStr);
    // TODO: process the s3Event to get the uploaded image id
    await processS3Event(s3Event);
  }
};

async function processS3Event(s3Event: S3Event) {
  for (const record of s3Event.Records) {
    const key = record.s3.object.key;
    console.log(`Processing s3 item with key: ${key}`);
    // TODO: retrieve the image from the imagesBucketName and resize it
    await processS3Image(key);
  }
}

// method for retrieving of uploaded image
async function processS3Image(imageKey: string) {
  const response = await s3
    .getObject({
      Bucket: imagesBucketName,
      Key: imageKey,
    })
    .promise();
  const body = response.Body;

  // TODO: resize the image using Jimp library
  const image = await Jimp.read(body);
  console.log(`resizing image`);

  image.resize(150, Jimp.AUTO);
  const convertedBuffer = image.getBufferAsync(Jimp.AUTO);

  // TODO: upload the resized image to thumbnailBucketName
  await thumbnailUpload(convertedBuffer, imageKey);
}

// method for uploading resized image to thumbnailBucket
async function thumbnailUpload(buffer, key) {
  await s3
    .putObject({
      Bucket: thumbnailBucketName,
      Key: `${key}.jpeg`,
      Body: buffer,
    })
    .promise();
}
