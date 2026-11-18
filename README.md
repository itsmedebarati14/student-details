# AWS Cloud Internship Website — Beginner Task

Responsive static website for the AWS Cloud Engineer beginner task:
- HTML/CSS/JavaScript frontend hosted on Amazon S3
- Contact form and client-side validation
- API Gateway HTTPS endpoint → AWS Lambda (Python) serverless action

## Files
- `index.html` — website
- `styles.css` — responsive styling
- `script.js` — form validation and API call
- `lambda_function.py` — Lambda handler
- `assets/cloud-hero.png` — cloud-themed hero image

## Preview locally
Open `index.html` in a browser. To run a local server:
```bash
python -m http.server 8000
```
Visit `http://localhost:8000`. Form stays in demo mode until API endpoint is configured.

## 1) Create S3 bucket in India
1. AWS Console → S3 → General purpose buckets → Create bucket.
2. Region: **Asia Pacific (Mumbai), `ap-south-1`**.
3. Create a globally unique bucket name, e.g. `yourname-cloud-internship-website`.
4. Keep default encryption enabled. Do not upload `.env`, credentials, or private data.

### Hosting / public access note
For safer hosting, keep S3 private and use **CloudFront + Origin Access Control (OAC)**. CloudFront can serve the website over HTTPS while S3 remains private.

If your mentor specifically requires the direct S3 static website endpoint, enable Static website hosting under bucket Properties and follow the current AWS documentation for public-read website bucket policy. This direct website endpoint normally requires public object access and does not provide HTTPS. Do not make a bucket public unless this is specifically required for your learning task; never store secrets in it.

5. Upload `index.html`, `styles.css`, `script.js`, and the `assets/` folder.

## 2) Create Lambda
1. AWS Console → Lambda → Create function → Author from scratch.
2. Name: `internship-contact-handler`; runtime: Python (choose a currently supported Python runtime).
3. Copy `lambda_function.py` into the Lambda code editor and click Deploy.
4. Test with:
```json
{"body":"{\"name\":\"Demo User\",\"email\":\"demo@example.com\",\"message\":\"Hello from the website\"}"}
```
Expected: 200 response with a success message.

## 3) Create API Gateway
1. API Gateway → Create API → **HTTP API**.
2. Add Lambda integration and select `internship-contact-handler`.
3. Add route `POST /contact`.
4. Create/deploy a stage (for example `prod`); copy the Invoke URL.
5. Configure CORS for your website origin. Allow `POST` and header `content-type`. For a temporary demo, `*` may be used; restrict it to your actual site origin for deployment.
6. Ensure API Gateway has permission to invoke Lambda.

## 4) Connect frontend to Lambda
In `script.js`, replace:
```js
const API_ENDPOINT = "";
```
with your API Gateway invoke URL + `/contact` route, for example:
```js
const API_ENDPOINT = "https://YOUR_API_ID.execute-api.ap-south-1.amazonaws.com/contact";
```
Use the exact URL shown in API Gateway. Upload the updated `script.js` to S3 again and refresh your site.

## 5) Test
- Submit a valid form from the deployed site.
- Check the success response.
- Lambda → Monitor → View CloudWatch logs to verify invocation.
- This sample validates and acknowledges messages but **does not save or email them**. Add a database or notification service if persistence is required.

## Cost and cleanup
- Keep test traffic low and review current AWS pricing/free-tier eligibility.
- Set an AWS Budget alert (it alerts; it does not automatically stop resources).
- Delete unused API Gateway, Lambda, CloudFront, and S3 resources when done. Empty an S3 bucket before deleting it.

## Internship submission reminder
Your uploaded task PDF asks for a GitHub repository containing the task and a **3–5 minute self-recorded demo video** shared through Google Drive link in the submission form. It also lists `g4doubts@shadowfox.in` for mentor questions/task validation.
