# Doomsday Ready

## 1. AI Usage Disclosure

AI assistance was used for UI design, project planning, development guidance, debugging and resolving errors, understanding problems and application logic, and code explanations.

## 2. Data Model Diagram

```mermaid
erDiagram
    MOVIE {
        ObjectId _id PK
        string title UK
        number releaseYear
        number runtime
        ObjectId[] prerequisites FK
        boolean watched
    }

    CINEMA {
        ObjectId _id PK
        string name UK
        number[] bundleSizes
    }

    MOVIE }o--o{ MOVIE : prerequisites
```

## 3. Technology Stack

- NestJS
- TypeScript
- MongoDB
- Mongoose
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Docker
- Docker Compose