# Serverless Debugging Guide: The "Detective" Flow

When a Serverless application shows "Site Can't Be Reached" or "502 Bad Gateway," you shouldn't guess. You should follow a layer-by-layer investigation from the **User** down to the **Database**.

---

## Layer 1: The Gateway (DNS & SSL)
**Thinking**: Is the user's traffic even hitting AWS?

### 1. Dig (DNS Lookup)
Check if your domain points to the correct CloudFront address (`xxxx.cloudfront.net`).
```bash
# Check if the domain exists and where it points
dig techjournal.nvbinhsoft.cloud +short
```
*   **Result**: If it's empty (NXDOMAIN), your DNS panel isn't set up.
*   **Result**: If it's an IP, it might be an old server (EC2).

### 2. Curl (SSL & Header Check)
Verify if CloudFront is responding and if the SSL certificate is valid.
```bash
curl -vI https://www.nvbinhsoft.cloud
```
*   **SSL Handshake Failure?** Means your ACM Certificate doesn't cover this domain name (e.g., you have `domain.com` but not `www.domain.com`).
*   **Server: CloudFront?** If you see this in the headers, CloudFront received the request.

---

## Layer 2: The Infrastructure (CloudFront)
**Thinking**: Is AWS configured to "listen" for your domain?

### 1. Check Distribution Config
CloudFront ignores domains unless they are listed in its "Aliases" (Alternate Domain Names).
```bash
aws cloudfront get-distribution-config --id YOUR_DIST_ID --query "DistributionConfig.Aliases"
```
*   **The Fix**: If your domain isn't in the list, CloudFront will reject the connection even if DNS is correct.

---

## Layer 3: The Application (Lambda Logs)
**Thinking**: The request reached AWS, but the code crashed. Why?

### 1. Locate the Logs
Lambda output goes to CloudWatch. First, find the log group.
```bash
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/your-service-api
```

### 2. Follow the "Error Trail"
Find the latest log stream and read the events.
```bash
# Get the latest stream name
aws logs describe-log-streams --log-group-name /aws/lambda/your-service-api --order-by LastEventTime --descending --limit 1

# Read the events
aws logs get-log-events --log-group-name /aws/lambda/xxxx --log-stream-name "yyyy"
```
*   **Runtime.ImportModuleError**: Your code is missing files. In monorepos, this is usually because dependencies weren't zipped.
    *   **The Fix**: Use a bundler like `esbuild` to pack everything into one file.
*   **ModuleNotFoundError: bcrypt**: Native binaries compiled on Mac don't work on Lambda (Linux).
    *   **The Fix**: Use `bcryptjs` (pure JavaScript).

---

## Layer 4: The Environment (Environment Variables)
**Thinking**: The code starts, but it can't talk to the database.

### 1. Inspect Live Variables
Check what variables are actually inside the running Lambda function.
```bash
aws lambda get-function-configuration --function-name your-api-name --query "Environment.Variables"
```
*   **Common Trap**: Your `MONGODB_URI` might just be a password or a truncated string because of a copy-paste error in GitHub Secrets.

---

## Summary of the "Mental Map"

| If you see... | Check this... | Command |
| :--- | :--- | :--- |
| "Site not found" | DNS Records | `dig` |
| "SSL/Handshake Error" | ACM Certificate & CF Aliases | `curl -vI` |
| "502 Bad Gateway" | Lambda Execution Logs | `aws logs get-log-events` |
| "Internal Server Error" | Database connection string | `aws lambda get-function-configuration` |

### Why we used `esbuild`?
In your project, the 502 error was caused by **hoisting**. NestJS was looking for its files in a folder that didn't exist inside the Lambda zip. `esbuild` solved this by "flattening" the code and its 1,000+ dependencies into a single logic bundle that Lambda can easily understand.
