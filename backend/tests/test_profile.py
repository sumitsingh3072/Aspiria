def test_profile_get_not_found(client, mocker):
    """
    Should return 404 if the user hasn't setup a profile.
    """
    mocker.patch("backend.db.crud.get_profile_by_user_id", return_value=None)
    response = client.get("/api/v1/profile/me")
    assert response.status_code == 404

def test_profile_create(client, mocker):
    """
    Tests profile creation logic returns the created json structure.
    """
    payload = {
        "education_level": "Bachelors",
        "career_aspirations": "CEO"
    }
    mocker.patch("backend.db.crud.get_profile_by_user_id", return_value=None)
    
    # Configure mock profile object aligning to Pydantic profile schema
    mock_profile = mocker.MagicMock(id=1, user_id=1, education_level="Bachelors", career_aspirations="CEO", interests=[], skills=[], field_of_study=None)
    mocker.patch("backend.db.crud.create_user_profile", return_value=mock_profile)
    
    response = client.post("/api/v1/profile/me", json=payload)
    assert response.status_code == 200
    assert response.json()["education_level"] == "Bachelors"
