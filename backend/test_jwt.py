from jose import jwt
import enum

class UserRole(str, enum.Enum):
    STARTUP = "startup"
    DEPARTMENT = "department"

try:
    encoded = jwt.encode({"role": UserRole.STARTUP}, "secret", algorithm="HS256")
    print("SUCCESS", encoded)
except Exception as e:
    print("FAILED", repr(e))
