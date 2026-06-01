# Huzhou Bank AI Assistant Demo

Mobile-first static prototype for a trusted banking AI assistant in a domestic China banking app context.

## Important Notice

This is a demonstration prototype only.

- All account, card, branch, CNAPS, transaction, authorization, and user data is fictional.
- The prototype does not connect to any real bank system, API, database, payment network, or authentication provider.
- It does not perform real transfers, card freezes, dispute submissions, subscription cancellations, or customer-service actions.

## Demo Focus

- Natural-language banking task entry through 小X.
- Structured result cards for receipt information, card number plus branch, branch/CNAPS lookup, transfer search, charge explanation, and automatic-deduction review.
- Sensitive-data handling through mock verification, masking, reveal controls, and lightweight trust/audit messaging.

## Local Preview

```bash
python3 -m http.server 4175
```

Then open:

```text
http://localhost:4175
```
