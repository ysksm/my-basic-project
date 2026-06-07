from pathlib import Path

import duckdb

DB_PATH = Path(__file__).parent / "todos.duckdb"


def init_schema(conn: duckdb.DuckDBPyConnection) -> None:
    conn.execute("CREATE SEQUENCE IF NOT EXISTS todos_id_seq START 1")
    conn.execute("""
        CREATE TABLE IF NOT EXISTS todos (
            id       BIGINT DEFAULT nextval('todos_id_seq') PRIMARY KEY,
            title    VARCHAR   NOT NULL,
            completed BOOLEAN  NOT NULL DEFAULT FALSE,
            created_at TIMESTAMP NOT NULL
        )
    """)


def get_db():
    conn = duckdb.connect(str(DB_PATH))
    try:
        yield conn
    finally:
        conn.close()
