from fastapi.testclient import TestClient


def test_list_empty(client: TestClient):
    resp = client.get("/api/todos")
    assert resp.status_code == 200
    assert resp.json() == []


def test_create(client: TestClient):
    resp = client.post("/api/todos", json={"title": "Buy milk"})
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Buy milk"
    assert data["completed"] is False
    assert "id" in data
    # created_at must include a UTC offset
    assert data["created_at"].endswith("Z") or "+00:00" in data["created_at"]


def test_list_after_create(client: TestClient):
    client.post("/api/todos", json={"title": "Task 1"})
    client.post("/api/todos", json={"title": "Task 2"})
    resp = client.get("/api/todos")
    assert resp.status_code == 200
    titles = [t["title"] for t in resp.json()]
    assert titles == ["Task 1", "Task 2"]


def test_get(client: TestClient):
    created = client.post("/api/todos", json={"title": "Task"}).json()
    resp = client.get(f"/api/todos/{created['id']}")
    assert resp.status_code == 200
    assert resp.json()["id"] == created["id"]


def test_get_not_found(client: TestClient):
    resp = client.get("/api/todos/999")
    assert resp.status_code == 404


def test_update_title(client: TestClient):
    created = client.post("/api/todos", json={"title": "Old"}).json()
    resp = client.put(f"/api/todos/{created['id']}", json={"title": "New"})
    assert resp.status_code == 200
    assert resp.json()["title"] == "New"
    assert resp.json()["completed"] is False


def test_update_completed(client: TestClient):
    created = client.post("/api/todos", json={"title": "Task"}).json()
    resp = client.put(f"/api/todos/{created['id']}", json={"completed": True})
    assert resp.status_code == 200
    assert resp.json()["completed"] is True
    assert resp.json()["title"] == "Task"


def test_update_both(client: TestClient):
    created = client.post("/api/todos", json={"title": "Old"}).json()
    resp = client.put(f"/api/todos/{created['id']}", json={"title": "New", "completed": True})
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "New"
    assert data["completed"] is True


def test_update_not_found(client: TestClient):
    resp = client.put("/api/todos/999", json={"title": "X"})
    assert resp.status_code == 404


def test_delete(client: TestClient):
    created = client.post("/api/todos", json={"title": "Task"}).json()
    resp = client.delete(f"/api/todos/{created['id']}")
    assert resp.status_code == 204


def test_delete_removes_item(client: TestClient):
    created = client.post("/api/todos", json={"title": "Task"}).json()
    client.delete(f"/api/todos/{created['id']}")
    assert client.get(f"/api/todos/{created['id']}").status_code == 404
    assert client.get("/api/todos").json() == []


def test_delete_not_found(client: TestClient):
    resp = client.delete("/api/todos/999")
    assert resp.status_code == 404
