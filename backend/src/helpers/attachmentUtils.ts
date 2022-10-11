import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
    singnatureVersion: 'v4'
})
// TODO: Implement the fileStogare logic
export class AttachmentUtils{
    s3;
    bucketName: string;
    urlExpiration: string;

    constructor(){
        this.s3 = new XAWS.S3({
            signatureVersion: 'v4',
        })
        this.bucketName = process.env.ATTACHMENT_S3_BUCKET
        this.urlExpiration = process.env.SIGNED_URL_EXPIRATION
    }

    async generateSignedUrl(attachmentId: string){
        const params = {
            Bucket: this.bucketName,
            Key: attachmentId,
            Expires: +this.urlExpiration
        }
        try{
            let signedUrl = s3.getSignedUrl('putObject', params)
            return signedUrl
        }
        catch(error){
            console.log('Failled to get signedURL', error.message)
            return error
        }
    }
}