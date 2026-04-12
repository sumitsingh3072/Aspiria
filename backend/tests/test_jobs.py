def test_auto_apply_not_found(client, mocker):
    """
    Since our MockDB returns None for `.first()` on Job queries, 
    we expect a 404 Job not found.
    """
    # Overriding profile to avoid profile not found errors
    mocker.patch("backend.db.crud.get_profile_by_user_id", return_value="dummy_profile")
    
    response = client.post("/api/v1/jobs/1/auto-apply")
    assert response.status_code == 404
    assert response.json()["detail"] == "Job not found"
