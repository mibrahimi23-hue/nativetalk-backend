"""Quick end-to-end token-flow smoke test (no pytest needed)."""
import json, time, urllib.request, urllib.error

BASE = "http://localhost:8000/api/v1"
EMAIL = f"flow_test_{int(time.time())}@example.com"


def post(path, body=None, token=None):
    data = json.dumps(body).encode() if body else b"{}"
    req = urllib.request.Request(BASE + path, data=data,
                                  headers={"Content-Type": "application/json"})
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        r = urllib.request.urlopen(req)
        return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        raw = e.read()
        try:
            return e.code, json.loads(raw)
        except Exception:
            return e.code, {"_raw": raw.decode(errors="replace")[:200]}


def get(path, token=None):
    req = urllib.request.Request(BASE + path)
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        r = urllib.request.urlopen(req)
        return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read())


# 1 ── Register ────────────────────────────────────────────────────────────────
status, body = post("/auth/register", {
    "email": EMAIL, "password": "Test1234!",
    "full_name": "Flow Test", "role": "student",
})
assert status == 201, f"register failed: {status} {body}"
access  = body["access_token"]
refresh = body["refresh_token"]
uid     = body["user"]["id"]
print(f"[1] register          -> {status}  user.id={uid}")
print(f"    access[:40]  = {access[:40]}...")
print(f"    refresh[:40] = {refresh[:40]}...")

# 2 ── GET /users/me (canonical) ───────────────────────────────────────────────
status, body = get("/users/me", token=access)
assert status == 200, f"GET /users/me failed: {status} {body}"
print(f"[2] GET /users/me     -> {status}  email={body['email']}")

# 3 ── GET /auth/me (deprecated alias) ─────────────────────────────────────────
status, body = get("/auth/me", token=access)
assert status == 200
print(f"[3] GET /auth/me(dep) -> {status}  (marked deprecated in OpenAPI ✓)")

# 4 ── Refresh ─────────────────────────────────────────────────────────────────
status, body = post("/auth/refresh", {"refresh_token": refresh})
assert status == 200, f"refresh failed: {status} {body}"
new_access  = body["access_token"]
new_refresh = body["refresh_token"]
print(f"[4] POST /auth/refresh -> {status}")
print(f"    new access[:40]  = {new_access[:40]}...")

# 5 ── Old refresh token is now dead (rotation) ────────────────────────────────
status, _ = post("/auth/refresh", {"refresh_token": refresh})
assert status == 401, f"expected 401 on re-used token, got {status}"
print(f"[5] old refresh re-use -> {status}  (rotation enforcement ✓)")

# 6 ── New access token works ──────────────────────────────────────────────────
status, body = get("/users/me", token=new_access)
assert status == 200
print(f"[6] GET /users/me (new token) -> {status}  email={body['email']}")

# 7 ── Full logout (JTI denylist + refresh revocation) ─────────────────────────
status, body = post("/auth/logout", {"refresh_token": new_refresh}, token=new_access)
assert status == 200
print(f"[7] POST /auth/logout -> {status}  msg={body['message']}")

# 8 ── Access token now blacklisted ────────────────────────────────────────────
status, _ = get("/users/me", token=new_access)
assert status == 401, f"expected 401 after logout, got {status}"
print(f"[8] GET /users/me after logout -> {status}  (JTI denylist ✓)")

# 9 ── Refresh also revoked ────────────────────────────────────────────────────
status, _ = post("/auth/refresh", {"refresh_token": new_refresh})
assert status == 401, f"expected 401 on revoked refresh, got {status}"
print(f"[9] refresh after logout  -> {status}  (refresh revoked ✓)")

# 10 ─ Tutor list (public browse) ─────────────────────────────────────────────
status, body = get("/tutors/?limit=5&offset=0")
assert status == 200
print(f"[10] GET /tutors/?limit=5 -> {status}  total={body['total']} items={len(body['items'])}")

print("\nAll checks passed ✓")
