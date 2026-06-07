import duckdb
import pytest
from fastapi.testclient import TestClient

from db import get_db, init_schema
from main import app


@pytest.fixture
def db():
    conn = duckdb.connect(":memory:")
    init_schema(conn)
    yield conn
    conn.close()


@pytest.fixture
def client(db):
    app.dependency_overrides[get_db] = lambda: db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
