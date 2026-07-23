from passlib.context import CryptContext

try:
    pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
    h = pwd_context.hash("test_password")
    print(f"Hash success: {h}")
    v = pwd_context.verify("test_password", h)
    print(f"Verify success: {v}")
    
    long_pass = "a" * 100
    h2 = pwd_context.hash(long_pass)
    print(f"Long pass hash success: {len(h2)} chars")
    v2 = pwd_context.verify(long_pass, h2)
    print(f"Long pass verify success: {v2}")
except Exception as e:
    print(f"PBKDF2 Test failed: {e}")
