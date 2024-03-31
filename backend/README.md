# backend intellico

Ho usato reactjs su vite per frontend, fastapi, jwt, e mysql

### Setup virtual environment dependencies

you are at the root of the ./backend project
```
$ python3 -m venv venv
```

## Activate virtual environment

```
Linux
$ python source ./venv/bin/activate
```

### Setup container
```
containerizza backend
$ docker build -t intellico-fastapi .
$ docker build -t intellico-adminer -f Dockerfile.adminer .
containerizza frontend
```
$ cd client
$ docker build -t intellico-frontend -f Dockerfile.client .
```
$ docker-compose --env-file ./.env up

oppure
$ docker-compose up --build

```
### init db
```
$ chmod +x ./utils/db/create_tables.sh
```

--------------------

## alcuni tests
```
$ pytest tests/test_user_routes/test_refresh_token.py  --log-cli-level=INFO
$ pytest ./tests/test_user_routes/test_get_user.py 
$ pytest ./tests/test_user_routes/test_user_login.py 
```

## Extra Info

### run server
```
$ uvicorn main:app
```

User Data Example
```
{
  "first_name": "string",
  "last_name": "string",
  "email": "user@example.com",
  "password": "string"
}

```