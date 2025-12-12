# API Documentation Rules

**Category:** Documentation  
**Tags:** #documentation #api #openapi #swagger

## Description

Standards for documenting APIs to ensure they are easy to understand and use.

## Rules

### API Documentation Must Include
- Endpoint URL and HTTP method
- Request parameters (path, query, body)
- Request/response examples
- Authentication requirements
- Error codes and messages
- Rate limits (if applicable)
- Versioning information

### Documentation Format
- Use OpenAPI/Swagger specification
- Keep documentation close to code
- Auto-generate when possible
- Version documentation with API

### Request Documentation
- Parameter names and types
- Required vs optional parameters
- Default values
- Validation rules
- Example values

### Response Documentation
- Success response format
- Error response format
- Status codes used
- Response headers
- Pagination details

## Examples

### Good API Documentation
```yaml
paths:
  /users/{userId}:
    get:
      summary: Get user by ID
      description: Returns detailed information about a specific user
      parameters:
        - name: userId
          in: path
          required: true
          description: The unique identifier of the user
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
              example:
                id: "123e4567-e89b-12d3-a456-426614174000"
                name: "John Doe"
                email: "john@example.com"
        '404':
          description: User not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
```

### Bad API Documentation
```
GET /users/123
Returns user data
```

## Documentation Tools
- Swagger/OpenAPI
- Postman Collections
- API Blueprint
- RAML
- GraphQL Schema

## Keep Updated
- Update docs with code changes
- Review docs in code reviews
- Test examples regularly
- Version documentation

## Benefits
- Faster integration for consumers
- Fewer support requests
- Better developer experience
- Clear API contracts
