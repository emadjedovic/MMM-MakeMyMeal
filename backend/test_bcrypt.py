# version 3.2.2 of bcrypt
from passlib.hash import bcrypt

password = "mysecretpassword"
hashed = bcrypt.hash(password)
print(hashed)
