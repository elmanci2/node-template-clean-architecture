# User

This is a user

## GET /user

Get a user

### Request

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | string | The user id |

### Response

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | string | The user id |
| name | string | The user name |

### Example

```bash
curl -X GET http://localhost:3000/user/1
```

```json
{
    "id": "1",
    "name": "John Doe"
}
```