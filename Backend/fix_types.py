from app.database import engine
from sqlalchemy import text
with engine.connect() as conn:
    conn.execute(text("ALTER TABLE products ALTER COLUMN width TYPE double precision USING NULLIF(width, '')::double precision;"))
    conn.execute(text("ALTER TABLE products ALTER COLUMN height TYPE double precision USING NULLIF(height, '')::double precision;"))
    conn.execute(text("ALTER TABLE products ALTER COLUMN depth TYPE double precision USING NULLIF(depth, '')::double precision;"))
    conn.execute(text("ALTER TABLE products ALTER COLUMN weight TYPE double precision USING NULLIF(weight, '')::double precision;"))
    conn.commit()
print("Типы колонок изменены")
