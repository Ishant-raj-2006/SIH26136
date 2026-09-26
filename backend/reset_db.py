import os
from dotenv import load_dotenv
load_dotenv()

from database import engine, Base
import models

def reset():
    print("Dropping all tables from Neon Database...")
    Base.metadata.drop_all(engine)
    print("Creating all tables...")
    Base.metadata.create_all(engine)
    print("Database reset complete! The database is now entirely empty.")

if __name__ == "__main__":
    reset()
