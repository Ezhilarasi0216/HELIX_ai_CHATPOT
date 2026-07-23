import hashlib
import base64
from passlib.context import CryptContext
import traceback

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    # Pre-hash with SHA-256 and base64 to bypass bcrypt 72-char limit
    shash = base64.b64encode(hashlib.sha256(password.encode()).digest()).decode()
    print(f"Pre-hashing '{password}' -> '{shash}' (len: {len(shash)})")
    return pwd_context.hash(shash)

def verify_password(plain_password, hashed_password):
    # Try with SHA-256 pre-hash
    shash = base64.b64encode(hashlib.sha256(plain_password.encode()).digest()).decode()
    try:
        if pwd_context.verify(shash, hashed_password):
            return True
    except Exception as e:
        print(f"Pre-hash verify failed: {e}")
    
    # Fallback to direct verify for old passwords
    if len(plain_password) <= 72:
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except Exception as e:
            print(f"Direct verify failed: {e}")
    return False

if __name__ == "__main__":
    try:
        print("Test 1: Normal password")
        pw = "mypassword"
        h = get_password_hash(pw)
        print(f"Hash: {h}")
        res = verify_password(pw, h)
        print(f"Verify: {res}")
        
        print("\nTest 2: Very long password")
        pw_long = "a" * 100
        h_long = get_password_hash(pw_long)
        print(f"Hash: {h_long}")
        res_long = verify_password(pw_long, h_long)
        print(f"Verify: {res_long}")
        
        print("\nTest 3: Short password (2 chars like 'vk')")
        pw_short = "vk"
        h_short = get_password_hash(pw_short)
        print(f"Hash: {h_short}")
        res_short = verify_password(pw_short, h_short)
        print(f"Verify: {res_short}")

    except Exception as e:
        print(f"\nCRITICAL FAILURE: {e}")
        traceback.print_exc()
