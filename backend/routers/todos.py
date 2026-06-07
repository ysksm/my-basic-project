from datetime import datetime, timezone

import duckdb
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from db import get_db

router = APIRouter(prefix="/todos", tags=["todos"])


class TodoCreate(BaseModel):
    title: str


class TodoUpdate(BaseModel):
    title: str | None = None
    completed: bool | None = None


class Todo(BaseModel):
    id: int
    title: str
    completed: bool
    created_at: datetime


def _row_to_todo(row: tuple) -> dict:
    id_, title, completed, created_at = row
    if isinstance(created_at, datetime) and created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)
    return {"id": id_, "title": title, "completed": completed, "created_at": created_at}


@router.get("", response_model=list[Todo])
def list_todos(db: duckdb.DuckDBPyConnection = Depends(get_db)):
    rows = db.execute(
        "SELECT id, title, completed, created_at FROM todos ORDER BY id"
    ).fetchall()
    return [_row_to_todo(r) for r in rows]


@router.post("", response_model=Todo, status_code=201)
def create_todo(body: TodoCreate, db: duckdb.DuckDBPyConnection = Depends(get_db)):
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    row = db.execute(
        "INSERT INTO todos (title, created_at) VALUES (?, ?) RETURNING id, title, completed, created_at",
        [body.title, now],
    ).fetchone()
    return _row_to_todo(row)


@router.get("/{todo_id}", response_model=Todo)
def get_todo(todo_id: int, db: duckdb.DuckDBPyConnection = Depends(get_db)):
    row = db.execute(
        "SELECT id, title, completed, created_at FROM todos WHERE id = ?", [todo_id]
    ).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return _row_to_todo(row)


@router.put("/{todo_id}", response_model=Todo)
def update_todo(
    todo_id: int,
    body: TodoUpdate,
    db: duckdb.DuckDBPyConnection = Depends(get_db),
):
    row = db.execute(
        "SELECT id, title, completed, created_at FROM todos WHERE id = ?", [todo_id]
    ).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    todo = _row_to_todo(row)
    new_title = body.title if body.title is not None else todo["title"]
    new_completed = body.completed if body.completed is not None else todo["completed"]

    row = db.execute(
        "UPDATE todos SET title = ?, completed = ? WHERE id = ? RETURNING id, title, completed, created_at",
        [new_title, new_completed, todo_id],
    ).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return _row_to_todo(row)


@router.delete("/{todo_id}", status_code=204)
def delete_todo(todo_id: int, db: duckdb.DuckDBPyConnection = Depends(get_db)):
    result = db.execute(
        "DELETE FROM todos WHERE id = ? RETURNING id", [todo_id]
    ).fetchone()
    if result is None:
        raise HTTPException(status_code=404, detail="Todo not found")
