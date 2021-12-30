get posts

```
{
  posts {
    title
  }
}
```

get post

```
{
  post(id: 3) {
    title
  }
}
```

create post

```
mutation {
  createPost(title: "hey hey!") {
    id
  }
}
```

update post

```
mutation {
  updatePost(id: 2, title: "hey hey all!") {
    id
    title
  }
}
```

delete post

```
mutation {
  deletePost(id: 3)
}
```

register user

```
mutation {
  register(options: {username: "john", password: "qwerty"}) {
    user {
      id
      username
    }
    errors {
      field
      message
    }
  }
}
```

login user

```
{
  login(options: {username: "john", password: "qwerty"}) {
    user {
      id
      username
    }
    errors {
      field
      message
    }
  }
}
```

me

```
{
  me {
    username
  }
}
```