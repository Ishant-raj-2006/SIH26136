from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import declarative_base, sessionmaker
import os
from urllib.parse import urlsplit
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is required. Add your Neon connection string to backend/.env")

if any(value in DATABASE_URL for value in ("YOUR-NEON-HOST", "USER:PASSWORD", "DBNAME")):
    raise RuntimeError(
        "DATABASE_URL still contains placeholders. Copy the real pooled connection string "
        "from Neon Console -> Connect into backend/.env."
    )

if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)
elif DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)

# SQLite needs check_same_thread=False; PostgreSQL does not
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine_options = {
    "connect_args": connect_args,
    "echo": False,
    "pool_pre_ping": True,
}

if DATABASE_URL.startswith("postgresql+"):
    engine_options.update({"pool_size": 5, "max_overflow": 2, "pool_recycle": 300})

engine = create_engine(DATABASE_URL, **engine_options)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create all tables
def init_db():
    try:
        with engine.begin() as connection:
            connection.execute(text("SELECT 1"))
            if connection.dialect.name == "postgresql":
                connection.execute(text("""
                    DO $$
                    BEGIN
                        ALTER TYPE userrole ADD VALUE IF NOT EXISTS 'MAINTENANCE';
                    EXCEPTION
                        WHEN undefined_object THEN NULL;
                    END
                    $$;
                """))
            Base.metadata.create_all(bind=connection)
            
            # Safe auto-migration for SQLite to add new columns to existing startups table
            if connection.dialect.name == "sqlite":
                columns_to_add = [
                    ("company_type", "VARCHAR DEFAULT 'startup'"),
                    ("company_type_other", "VARCHAR"),
                    ("headquarters_city", "VARCHAR"),
                    ("state", "VARCHAR"),
                    ("official_email", "VARCHAR"),
                    ("contact_number", "VARCHAR"),
                    ("founder_ceo_name", "VARCHAR"),
                    ("auth_rep_name", "VARCHAR"),
                    ("auth_rep_designation", "VARCHAR"),
                    ("pan_number", "VARCHAR"),
                    ("aadhaar_number", "VARCHAR"),
                    ("work_description", "TEXT"),
                    ("linkedin_url", "VARCHAR"),
                    ("cin_number", "VARCHAR"),
                    ("dpiit_number", "VARCHAR"),
                    ("gst_number", "VARCHAR"),
                    ("udyam_number", "VARCHAR"),
                    ("incorporation_cert_url", "VARCHAR"),
                    ("relevant_doc_url", "VARCHAR"),
                    ("status", "VARCHAR DEFAULT 'pending'")
                ]
                for col_name, col_type in columns_to_add:
                    try:
                        connection.execute(text(f"ALTER TABLE startups ADD COLUMN {col_name} {col_type}"))
                    except Exception:
                        pass
    except SQLAlchemyError as error:
        raise RuntimeError(
            "Could not connect to Neon PostgreSQL. Check DATABASE_URL, the Neon branch, "
            "network access, and database credentials."
        ) from error


def database_target():
    parsed = urlsplit(DATABASE_URL)
    host = parsed.hostname or "unknown-host"
    database = parsed.path.lstrip("/") or "unknown-database"
    return f"{host}/{database}"
