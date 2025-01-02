# Clean Architecture Guide for Node.js Applications

## Project Structure

### Root Directory

- `Dockerfile`: Configuration for Docker containers
- `example.env`: Example values for environment variables
- `package.json`: npm dependencies and script configurations
- `tsconfig.json`: TypeScript configuration

### src/adapters/

- `middlewares/`: HTTP request processing middleware (e.g., authentication)
- `routes/`: Application route definitions
    - `index.ts`: Main entry point exposing all primary routes
    - `userRoutes/`: User-specific route modules

### src/app/

- `main.ts`: Configures and launches the application (web server, DB connection, etc.)

### src/core/

- `container/`
    - `userContainer.ts`: Dependency injection container definitions for user use cases and controllers
- `controllers/`
    - `userController.ts`: Handles HTTP requests for users, utilizing use cases
- `entities/`
    - `user.ts`: Defines the User entity structure in the domain
- `use-cases/`
    - `userUseCase.ts`: Business logic for user-related operations

### src/infrastructure/

- `config/`: General configuration files
- `database/`: Database connection configuration and implementation
    - `mongo/`, `pg/`, `sql/`: Specific implementations for different database types
- `env/`: Environment-based configuration storage
- `package/`
    - `axios/index.ts`: Axios configuration and encapsulation for HTTP requests
- `server/`
    - `expressServer.ts`: Express server configuration and execution
- `service/`
    - `email/`: Email-related services (e.g., using nodemailer)

### test/

- `integration/`: Integration tests validating interaction between multiple components or systems
    - `userRoute.test.ts`: Verifies complete user route interaction
- `unit/`: Unit tests for validating individual use case or controller logic
    - `userUseCase.test.ts`: Tests user use case methods

## Workflow and Import Flow

1. `main.ts` (Entry point)

    - Imports configurations from `infrastructure/config` and `server/expressServer.ts`
    - Imports dependency containers from `core/container/userContainer.ts`

2. `routes/index.ts` and `userRoutes`

    - Import controllers from `core/controllers`
    - Define routes using middlewares from `adapters/middlewares`

3. Controllers (e.g., `userController.ts`)

    - Import use cases from `core/use-cases`
    - May use services from `infrastructure/service`

4. Use cases

    - Import entities from `core/entities`
    - May import interfaces from `core/ports` (if exists)

5. Entities

    - Imported by use cases or controllers

6. `infrastructure/database` and `infrastructure/package`

    - Implement interfaces defined in `core/ports`

7. Services
    - Provide additional functionalities used by controllers or use cases

## Decoupling Rules

1. Use cases should not import directly from:

    - `src/infrastructure/`
    - `src/adapters/`

2. Controllers should not import directly from:

    - `src/infrastructure/`
    - `src/adapters/` (implementation)

3. Entities should not import from any other layers

4. Adapters should not import:

    - Use cases (except for route configuration)
    - Entities directly (unless strictly necessary)

5. Infrastructure should not import:

    - Use cases and entities directly

6. Dependency Direction:

    - Flow should move towards the business core
    - Keep the business core (use cases and entities) technology-independent

7. Invert Dependencies:

    - Use interfaces in the core to abstract external service interactions

8. Domain Isolation:

    - Keep entities and use cases free from side effects not explicitly handled in their logic

9. Adapters as Bridges:

    - Act as intermediaries between the external world and business logic

10. Single Responsibility Layers:

    - Each layer should have a clear focus (e.g., controllers coordinate, use cases contain application logic)

11. Cohesion and Coupling:
    - Aim for high cohesion within modules and avoid unnecessary coupling

By following these principles, you can maintain a healthy and sustainable workflow, making your application easier to maintain, understand, and extend over time.
