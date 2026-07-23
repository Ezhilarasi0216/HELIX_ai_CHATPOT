from passlib.context import CryptContext

try:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    h = pwd_context.hash("test")
    print(f"Hash success: {h}")
    v = pwd_context.verify("test", h)
    print(f"Verify success: {v}")
    
    # Test long password
    long_pass = "a" * 73
    print(f"Testing long password length: {len(long_pass)}")
    try:
        h2 = pwd_context.hash(long_pass)
        print(f"Long pass hash success: {h2}")
    except ValueError as e:
        print(f"Expected failure for long pass: {e}")
except Exception as e:
    print(f"Test failed with: {e}")
