import { CopyObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Context, S3CreateEvent } from 'aws-lambda';
import { getFilename, isPrime, splitLines } from "./utils";

const s3 = new S3Client({});

export async function handler(event: S3CreateEvent, context: Context) {
  await Promise.all(
    event.Records.map(
      ({ s3: { bucket, object }}) => handleCreatedObject(bucket.name, object.key)
    )
  );
}

async function handleCreatedObject(Bucket: string, Key: string) {
  console.log(Key);
  try {
    // get file content
    const response = await s3.send(new GetObjectCommand({ Bucket, Key }));
    const str = await response.Body?.transformToString();
    
    // parse number
    const [firstLine, ] = splitLines(str);
    const num = parseInt(firstLine);

    // check number
    if (!isNaN(num)) {
      const primeOrNotprime = isPrime(num) ? 'prime' : 'notprime';
      console.log(`${Key}: ${num} -> ${primeOrNotprime}`);

      // create outgoing object
      await s3.send(new PutObjectCommand({
        Bucket,
        Key: `outgoing/${num}.${primeOrNotprime}`,
        Body: num.toString(),
      }));

    } else {
      throw Error(`Not a number: ${firstLine}`);
    }
  } catch (err) {
    console.error(err);
    // try to handle error
    try {
      await s3.send(new CopyObjectCommand({ 
        CopySource: `${Bucket}/${Key}`,
        Bucket,
        Key: `errors/${getFilename(Key)}`
       }));
    } catch (e) {
      console.error(e);
    }
  }

}
