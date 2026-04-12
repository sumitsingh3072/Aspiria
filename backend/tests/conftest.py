import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.app.api.deps import get_db, get_current_active_user
from backend.models.user import User

def override_get_current_active_user():
    return User(id=1, email="testuser@example.com", is_active=True, full_name="Test User")

class MockQuery:
    def filter(self, *args, **kwargs): return self
    def order_by(self, *args, **kwargs): return self
    def limit(self, *args, **kwargs): return self
    def first(self): return None
    def all(self): return []

class MockDB:
    def __init__(self):
        self.added = []
    def query(self, *args, **kwargs):
        return MockQuery()
    def commit(self): pass
    def refresh(self, obj):
        if not hasattr(obj, "id") or not obj.id:
            obj.id = 1
        return obj
    def add(self, obj):
        self.added.append(obj)

def override_get_db():
    yield MockDB()

app.dependency_overrides[get_current_active_user] = override_get_current_active_user
app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c
