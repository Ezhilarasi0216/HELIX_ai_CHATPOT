from passlib.context import CryptContext
import traceback

print("Initializing CryptContext...")
try:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    print("Testing 'test' password...")
    try:
        h = pwd_context.hash("test")
        print(f"Hash success: {h}")
        v = pwd_context.verify("test", h)
        print(f"Verify success: {v}")
    except Exception as e:
        print(f"Failed to hash/verify 'test': {e}")
        traceback.print_exc()

    print("\nTesting 73-character password...")
    long_pass = "a" * 73
    try:
        h2 = pwd_context.hash(long_pass)
        print(f"Long pass hash success: {h2}")
    except ValueError as e:
        print(f"Expected failure (ValueError) for long pass: {e}")
    except Exception as e:
        print(f"Unexpected failure for long pass: {e}")
        traceback.print_exc()

except Exception as e:
    print(f"Initialization failed: {e}")
    traceback.print_exc()
