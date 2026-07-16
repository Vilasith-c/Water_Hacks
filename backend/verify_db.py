import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from app.core.config import settings
    print("Environment variables loaded successfully.")
    print(f"DATABASE_URL: {settings.DATABASE_URL}")
except Exception as e:
    print(f"Error loading environment settings: {e}")
    sys.exit(1)

# Only attempt connection if not using the placeholder
if "<neon-hostname>" in settings.DATABASE_URL or "<user>" in settings.DATABASE_URL:
    print("\n[!] Connection check skipped: DATABASE_URL still contains placeholder values.")
    print("    Please configure your real Neon connection string in 'backend/.env' and run this script again.")
    sys.exit(0)

print("\nAttempting connection to database...")
try:
    from sqlalchemy import create_engine
    from sqlalchemy.sql import text
    
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT version();")).fetchone()
        print(f"Connection SUCCESS!")
        print(f"PostgreSQL Version: {result[0]}")
        
        # Verify pgvector extension exists
        try:
            vector_check = conn.execute(text("SELECT extname FROM pg_extension WHERE extname = 'vector';")).fetchone()
            if vector_check:
                print("pgvector extension is enabled on this database.")
            else:
                print("[!] pgvector extension is NOT enabled. You may need to run: CREATE EXTENSION IF NOT EXISTS vector;")
        except Exception as ve:
            print(f"Could not check pgvector extension: {ve}")
            
except Exception as e:
    print(f"Connection FAILED: {e}")
    sys.exit(1)
