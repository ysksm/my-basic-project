from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/todos", tags=["todos"])

# In-memory store
_todos: dict[int, dict] = {}
_next_id = 1


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


@router.get("", response_model=list[Todo])
def list_todos():
    return list(_todos.values())


@router.post("", response_model=Todo, status_code=201)
def create_todo(body: TodoCreate):
    global _next_id
    todo = {
        "id": _next_id,
        "title": body.title,
        "completed": False,
        "created_at": datetime.now(timezone.utc),
    }
    _todos[_next_id] = todo
    _next_id += 1
    return todo


@router.get("/{todo_id}", response_model=Todo)
def get_todo(todo_id: int):
    todo = _todos.get(todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.put("/{todo_id}", response_model=Todo)
def update_todo(todo_id: int, body: TodoUpdate):
    todo = _todos.get(todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    if body.title is not None:
        todo["title"] = body.title
    if body.completed is not None:
        todo["completed"] = body.completed
    return todo


@router.delete("/{todo_id}", status_code=204)
def delete_todo(todo_id: int):
    if todo_id not in _todos:
        raise HTTPException(status_code=404, detail="Todo not found")
    del _todos[todo_id]
