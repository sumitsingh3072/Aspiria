def test_auth_me(client):
    """
    Since conftest overrides `get_current_active_user`, 
    this should return the mock user.
    """
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 200
    assert response.json()["email"] == "testuser@example.com"
