# Project Instructions

## Project Purpose
Build a high-fidelity mobile banking AI assistant demo for executive presentation in the domestic China banking context. The demo should show how a trusted in-app AI assistant can help users complete high-frequency banking tasks with less friction while preserving account security, privacy, and auditability.

The core product idea is a trusted AI task-card assistant, not a generic customer-service chatbot. Users should be able to ask natural-language questions and receive structured, actionable, copyable result cards.

## Current Stories / Issues
Current priority is a prototype covering these scenarios:

1. Generate domestic receipt information for payroll, reimbursement, school, employer, or personal transfer scenarios.
2. Query account branch /开户行/网点/联行号/CNAPS-style information directly.
3. Search transfers or spending related to a specific person, merchant, or counterparty.
4. Explain unfamiliar card charges and recurring app deductions.
5. Summarize recent spending with categories, high-frequency merchants, subscriptions, and unusual transactions.

## Domestic China Banking Context
The demo should be localized for domestic banking language and workflows:

- Demo presentation should use Huzhou Bank as the single bank context. Use only fictional/demo account, branch, CNAPS, transaction, authorization, and customer data, and do not imply official partnership, endorsement, production access, or real bank integration.
- Domestic transfer receipt info should distinguish account name, account number, bank name, branch name, province/city, CNAPS/联行号, and applicable scenarios such as payroll, reimbursement, school refunds, and interbank transfers.
- Account branch /开户行/联行号 queries are real user needs in China. The demo should avoid only returning menu paths such as "go to account management" or "call customer service"; it should show direct verified results when available.
- Domestic bank app patterns already include account query, transaction details, transfer/remittance, online customer service, voice control, AI assistants, and OCR/识图转账. This demo should go further by turning those needs into safe, structured task cards.
- The ordinary-user benchmark is: one natural-language request, one necessary authentication step if sensitive, and one structured result card with copy/share/reveal actions.

## Acceptance Criteria
A change is acceptable only if it supports the executive-demo narrative:

- The first-screen experience clearly shows a visible AI assistant entry point inside a banking app.
- The assistant returns direct structured answers, not only step-by-step menu instructions.
- Sensitive information uses explicit security treatment: identity verification, masking, reveal controls, and audit messaging.
- The demo distinguishes low-risk informational answers from sensitive account and transaction data.
- Domestic receipt, branch, card-number, charge-explanation, and recurring-deduction scenarios are clearly separated so the user gets only the fields needed for the current task.
- Core tasks can be completed within one natural-language request, one necessary authentication step, and one structured result card.
- Result cards support appropriate actions such as copy, share, masked reveal, generate receipt-info sheet, view source, and safe next steps.
- The prototype is mobile-first, polished, and credible for a bank executive audience.
- All banking data in the demo is fictional and clearly mock data.
- No real bank API, real account data, credentials, or personal identifiers are used.

## Tech Stack
Unknown until implementation is scaffolded.

Expected direction: a mobile-first web prototype is preferred unless the user asks for native iOS/Android. Use the project's actual stack once created.

## Environment Policy
No canonical environment exists yet.

Do not add Docker, CI, deployment, backend services, AI-service SDKs, or external runtime dependencies without explicit user approval.

## Key Paths
Current project is empty except for this instruction file.

Expected future paths may include:

- `AGENTS.md` - project-level Codex rules.
- `docs/` - product specs, demo script, architecture notes.
- `src/` or app framework directory - frontend prototype source.
- `public/` or assets directory - non-sensitive demo assets.

## Commands
No commands are currently available.

## Command Status
- Project inspection: verified, workspace was empty before `AGENTS.md` was created.
- Build/test/lint/dev commands: unknown, not yet created.
- Git commands: unavailable, current directory is not a Git repository.

## Test / Lint / Build Policy
After a stack exists, Codex should run the most relevant available checks before claiming work is complete:

- Typecheck if available.
- Lint if available.
- Build if available.
- Browser smoke test for frontend work when a local target is available.
- Visual verification for high-fidelity UI changes.

If commands are missing, fail, or cannot run, report that explicitly.

## Commit / PR Checklist
No Git repository exists yet.

Before any future commit or PR:

- Summarize changed files and user-facing behavior.
- Verify no real secrets, account numbers, customer data, or personal identifiers were added.
- Verify demo data is fictional.
- Run available checks and report results.
- Keep implementation scoped to the banking AI assistant demo.

## Dependency Policy
Ask before adding any new runtime, build, test, infrastructure, AI-service, analytics, authentication, or UI-framework dependency.

Prefer lightweight, local, mock-driven implementation for the first demo.

## Do Not Touch
Unless the user explicitly asks:

- Do not connect to real banking APIs.
- Do not implement real money movement.
- Do not store or process real account data.
- Do not add real authentication providers.
- Do not add payment, transfer, KYC, AML, or compliance integrations.
- Do not add deployment, CI/CD, Docker, or cloud configuration.
- Do not use screenshots containing real personal or financial data as shipped assets.

## Project Conventions
Product conventions:

- Frame the assistant as a trusted banking task assistant, not a generic chatbot.
- Favor direct result cards over instructions and menu paths.
- Use progressive disclosure for sensitive information.
- Show data source, timestamp, and privacy/audit hints on sensitive cards.
- Keep copy concise, credible, and bank-appropriate.
- Demonstrate convenience and reliability together; do not sacrifice safety for speed.
- Use domestic banking terms naturally: 开户行, 支行, 网点, 联行号, 收款信息, 交易明细, 转账记录, 工资卡, 报销, 跨行转账, 自动扣款.
- Design for ordinary users, including low-patience users and older users: plain language, visible confirmation, minimal menu depth, low jargon, clear privacy reassurance, and optional voice/quick-question entry points.
- Do not make the assistant feel like a marketing feature. It should solve concrete banking tasks that users already search for, call about, or visit branches to handle.

Security conventions:

- Use mock identity verification for sensitive actions.
- Mask account numbers by default.
- Require explicit reveal for full account details.
- Show audit messaging when full sensitive data is displayed.
- Keep high-risk actions read-only in the first demo.
- Treat display, reveal, copy, share, export, and generate-share-sheet as separate risk levels.
- Require stronger verification or explicit audit messaging for full account-number reveal, receipt-info sharing, transaction-detail export, and sensitive counterparty search.
- Prefer read-only task completion first. Do not simulate actual money movement unless the user explicitly asks and the demo clearly separates it from production behavior.

AI engineering conventions:

- Treat LLM behavior as bounded by policy and structured tools.
- Use deterministic mock responses for the first prototype unless the user approves real AI integration.
- Separate intent understanding, permission checks, and result rendering conceptually.
- Design as if production would require policy checks, data adapters, audit logs, observability, and evaluation.
- AI must never invent account, branch, CNAPS/联行号, SWIFT/BIC, address, counterparty, or transaction data.
- If the requested banking data cannot be verified from mock source data, the assistant must say it cannot confirm the answer and provide a safe fallback, such as contacting official customer service or visiting a verified in-app page.
- Keep source-of-truth boundaries visible: account data, branch data, transaction data, and policy text should be conceptually separate from the assistant's language generation.

## Sensitive Data / Secrets
Never commit or display real:

- Account numbers
- Routing numbers tied to a real person
- SWIFT/wire details tied to a real personal account
- CNAPS/联行号 details tied to a real personal account
- Customer names, addresses, phone numbers, or emails
- ID numbers, mobile numbers, biometrics, device identifiers, or authentication factors
- Transaction records or counterparties tied to a real person
- Bank credentials, tokens, API keys, `.env` values
- Private screenshots with personal financial details

Use fictional demo names, accounts, merchants, and transactions.

## Codex Working Rules
Before non-trivial edits, state the files or areas expected to change.

For frontend work:

- Build the actual mobile banking assistant experience, not a marketing landing page.
- Verify UI in a browser when a local target is available.
- Keep text readable and non-overlapping on mobile-sized viewports.
- Use polished, restrained banking-product design.

For product/architecture work:

- Clearly separate verified facts, assumptions, and design recommendations.
- Explain banking risk tradeoffs when changing security or data-handling behavior.
- Prefer a credible MVP over overbuilt production claims.

## Current Unknowns
- Final implementation stack is not chosen.
- No package manager or runtime version is defined.
- No dev/build/test commands exist.
- No Git repository exists in the project directory.
- Final visual style is not yet fixed; demo bank context is Huzhou Bank.
- Whether the first implementation should be pure static prototype or interactive web app remains to be confirmed.
