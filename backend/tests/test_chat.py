def test_chat_history_empty(client, mocker):
    """
    Tests the chat history endpoint when no chats exist.
    """
    mocker.patch("backend.db.crud.get_all_user_chats", return_value=[])
    response = client.get("/api/v1/chat/history")
    assert response.status_code == 200
    assert response.json() == {"sessions": {}}

def test_chat_post_message(client, mocker):
    """
    Tests posting a message to the AI advisor.
    The response should return a valid session ID.
    """
    # Mocking out the dependencies so we do not actually charge gemini credits
    mocker.patch("backend.db.crud.get_profile_by_user_id", return_value=None)
    mocker.patch("backend.db.crud.get_chat_history", return_value=[])
    mocker.patch("backend.db.crud.create_chat_message", return_value=mocker.MagicMock(id=99))
    mocker.patch("backend.app.services.ai_advisor.get_ai_response", return_value="This is a mocked AI response")
    
    payload = {"message": "Hello AI"}
    response = client.post("/api/v1/chat/", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["response"] == "This is a mocked AI response"
    assert "session_id" in data
    assert data["message_id"] == 99
