from contextlib import asynccontextmanager
from pathlib import Path

import duckdb
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from db import DB_PATH, init_schema
from routers import todos

DIST_DIR = Path(__file__).parent.parent / "web-frontend" / "dist"


@asynccontextmanager
async def lifespan(app: FastAPI):
    conn = duckdb.connect(str(DB_PATH))
    init_schema(conn)
    conn.close()
    yield


app = FastAPI(title="My Basic Project API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(todos.router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}


if DIST_DIR.exists():
    app.mount("/", StaticFiles(directory=DIST_DIR, html=True), name="static")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
