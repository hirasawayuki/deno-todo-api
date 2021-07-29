# deno-todo-api

<div align="center">
  <a href="https://deno.land/">
    <img src="https://user-images.githubusercontent.com/48427044/125017828-dc4e9180-e0ae-11eb-9d6f-c2826606bc37.png" width="240"/>
  </a>
</div>

## Usage

### install deno

```
$ brew install deno
```

### start deno server

```
$ deno run --allow-net --allow-env --allow-read --allow-write --unstable server.ts
```

or [Using denon]

```
$ deno install --allow-read --allow-run --allow-write --allow-net -f -q --unstable https://deno.land/x/denon@2.4.7/denon.ts
$ denon start
```

or [Docker]

```
$ docker-compose up -d
```

## Endpoint

- Home: GET: localhost:port/v1
- Signup: POST: localhost:port/v1/signup
- Login: POST: localhost:port/v1/login
- Logout: POST: localhost:port/v1/logout
- Get Me: GET: localhost:port/v1/user
- GetAll Todo: GET: localhost:port/v1/todos
- Get Todo: GET: localhost:port/v1/todos/{id}
- Create Todo: POST: localhost:port/v1/todos
- Update Todo: PUT: localhost:port/v1/todos/{id}
- Delete Todo: DELETE: localhost:port/v1/todos/{id}
