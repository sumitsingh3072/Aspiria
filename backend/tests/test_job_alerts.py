def test_job_alerts_unsubscribe_not_found(client):
    """
    Since mock db returns None on `.first()`, user won't have active subscriptions to unsubscribe from.
    """
    response = client.delete("/api/v1/job-alerts/unsubscribe")
    assert response.status_code == 404

def test_job_alerts_subscribe(client):
    """
    Mock DB first returns None, so subscribe creates a new record.
    """
    payload = {
        "location_preference": "Remote",
        "role_keywords": "software engineer",
        "employment_type": "full-time"
    }
    response = client.post("/api/v1/job-alerts/subscribe", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["location_preference"] == "Remote"
    assert data["is_active"] is True
