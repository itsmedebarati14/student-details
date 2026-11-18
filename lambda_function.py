import json, re, logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")

def reply(code, payload):
    return {
        "statusCode": code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
        },
        "body": json.dumps(payload)
    }

def lambda_handler(event, context):
    try:
        raw = event.get("body") or "{}"
        data = json.loads(raw) if isinstance(raw, str) else raw
        name = str(data.get("name", "")).strip()
        email = str(data.get("email", "")).strip()
        message = str(data.get("message", "")).strip()
        if not 2 <= len(name) <= 80:
            return reply(400, {"message": "Name must be 2–80 characters."})
        if len(email) > 120 or not EMAIL_RE.match(email):
            return reply(400, {"message": "Enter a valid email address."})
        if not 5 <= len(message) <= 1000:
            return reply(400, {"message": "Message must be 5–1000 characters."})
        # Do not log contact details. This beginner demo does not persist messages.
        logger.info("Contact submission validated.")
        return reply(200, {"message": "Thanks! Your message was processed by AWS Lambda."})
    except (json.JSONDecodeError, TypeError):
        return reply(400, {"message": "Invalid JSON request."})
    except Exception:
        logger.exception("Unexpected contact form error")
        return reply(500, {"message": "Internal server error."})
