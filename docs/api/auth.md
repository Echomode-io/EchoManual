## Auth

Registration, login, SSO, password management, and account deletion.

### Supported values

Use these exact conventions when calling auth endpoints.

| Field / concept | Accepted values | Notes |
|-----------------|-----------------|-------|
| `provider` (SSO) | `"google"`, `"googleoauth"` | Case-insensitive. Only Google sign-in is supported today. Any other value returns `400` with `"Only Google SSO is supported"`. |
| `username` / `email` (login) | Valid email address | The server field is `email`; `username` is accepted as an alias. Trimmed and lowercased server-side. |
| `email` (register) | Valid email address | Trimmed and lowercased server-side. Must be unique. |
| `password` (register, change, set, reset) | 10–128 characters | Must include at least one uppercase letter, one lowercase letter, one digit, and one special character. |
| `token_type` (response) | `"bearer"` | Always `bearer` on successful token responses. |
| `organization.tier` (response) | `"free"`, `"pro"`, `"max"` | Assigned by EchoMode; new self-serve orgs start on `"free"`. |
| `redirect_uri` (SSO) | Absolute HTTPS/HTTP URL | Optional on `POST /auth/sso/authorize`. When omitted, the deployment default callback URL is used. Must match an allowlisted origin for your environment or the request returns `400`. |

**SSO sign-in flow**

1. `POST /auth/sso/authorize` with `provider: "google"` (or `"googleoauth"`) and an optional `redirect_uri`.
2. Redirect the user's browser to the returned `authorization_url`.
3. After Google sign-in, the browser lands on your callback URL with `code` and `state` query parameters.
4. Exchange them via `GET /auth/sso/callback?code=...&state=...` to receive the same token payload as password login.

If Google SSO is not enabled on the deployment, `POST /auth/sso/authorize` returns `501`.

---

### POST /auth/register

Create a new account and organization.

**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | yes | Account email (normalized to lowercase) |
| password | string | yes | 10–128 chars; uppercase, lowercase, digit, and special character required |
| first_name | string | no | |
| last_name | string | no | |
| display_name | string | no | |
| org_name | string | no | Organization name |

**Response** `201`

```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "eyJ...",
  "organization": {
    "org_id": "uuid",
    "name": "Example Org",
    "tier": "free",
    "is_org_admin": true
  },
  "is_new_user": true,
  "needs_profile_completion": false
}
```

### POST /auth/login

Authenticate with email and password.

**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| username | string | yes | Account email (same value used at registration). The server field is `email`; `username` is accepted as an alias for backwards compatibility. Must be a valid email address. |
| password | string | yes | Account password |

**Response** `200` — same shape as register.

### POST /auth/refresh_tokens

Exchange a refresh token for a new token pair.

**Request body**

| Field | Type | Required |
|-------|------|----------|
| refresh_token | string | yes |

**Response** `200` — same shape as register.

### POST /auth/logout

Revoke the current refresh token.

**Request body**

| Field | Type | Required |
|-------|------|----------|
| refresh_token | string | yes |

**Response** `204` No content.

### POST /auth/sso/authorize

Start Google sign-in and receive an authorization URL.

**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| provider | string | yes | `"google"` or `"googleoauth"` (case-insensitive) |
| redirect_uri | string | no | OAuth callback URL where Google returns `code` and `state`. Uses the deployment default when omitted. |

**Example request**

```json
{
  "provider": "google",
  "redirect_uri": "https://app.example.com/auth/sso/callback"
}
```

**Response** `200`

```json
{
  "authorization_url": "https://accounts.google.com/o/oauth2/..."
}
```

### GET /auth/sso/callback

Complete Google sign-in after the browser redirect.

**Query parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| code | string | yes | Authorization code from Google |
| state | string | yes | CSRF state issued during `POST /auth/sso/authorize` |

**Response** `200` — same token shape as login, including:

| Field | Description |
|-------|-------------|
| `is_new_user` | `true` on first Google sign-in (account and org auto-created) |
| `needs_profile_completion` | `true` when the user should finish profile details in your UI |

### POST /auth/change-password

Change the current user's password.

**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| current_password | string | yes | Existing account password |
| new_password | string | yes | 10–128 chars; uppercase, lowercase, digit, and special character required |

**Response** `204` No content.

### POST /auth/set-password

Set an initial password on an SSO-only account.

**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| password | string | yes | 10–128 chars; uppercase, lowercase, digit, and special character required |

**Response** `204` No content.

### DELETE /auth/account

Soft-delete the current account and invalidate all sessions.

**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| password | string | no | Current account password for verification. Required for password-based accounts; omit for SSO-only accounts. |

**Response** `204` No content.

---

### Auth implementation notes

EchoMode uses RS256-signed JWTs (asymmetric key pair) with refresh-token rotation. Access tokens include `org_id`, `team_ids`, and admin flags as custom claims. Refresh tokens are tracked server-side and revoked on password change or account deletion.

**Current auth methods:**

| Method | Status | Flow |
|--------|--------|------|
| Email + password | Supported | `POST /auth/register` or `POST /auth/login` |
| Google OAuth (SSO) | Supported | `POST /auth/sso/authorize` &rarr; redirect &rarr; `GET /auth/sso/callback` |
| Refresh token rotation | Supported | `POST /auth/refresh_tokens` |

**Rate limiting:** Auth endpoints are rate-limited per IP (refresh, SSO callback) or per IP+email (login, register) to prevent credential-stuffing and brute-force attacks.

---
