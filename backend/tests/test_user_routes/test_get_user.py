"""
1. Only authenticated user should be able to fetch the user details
2. A request with invalid token should not be entertained.
/users/me
"""

from core.security import add_user_token_and_generate_token


def test_fetch_me(client, user, test_session):
    data = add_user_token_and_generate_token(user, test_session)
    headers = {
        "Authorization": f"Bearer {data['access_token']}"
    }
    response = client.get("/users/me", headers=headers)
    assert response.status_code == 200
    assert response.json()['email'] == user.email
    
def test_fetch_me_invalid_token(client, user, test_session):
    data = add_user_token_and_generate_token(user, test_session)
    headers = {
        "Authorization": f"Bearer {data['access_token'][:-6]}sakd2r"
    }
    response = client.get("/users/me", headers=headers)
    assert response.status_code == 401
    assert 'email' not in response.json()
    assert 'id' not in response.json()
    

def test_fetch_user_detail_by_id(auth_client, user):
    response = auth_client.get(f"/users/{user.id}")
    assert response.status_code == 200
    assert response.json()['email'] == user.email