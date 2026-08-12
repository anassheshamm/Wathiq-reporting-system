# Recovery Reporting System — Backend

Production-oriented Express.js backend scaffold for the internal Recovery Reporting System of an Arabic rehabilitation organization.

## Folder Structure

```text
backend/
├── src/
│   ├── config/              # Application configuration
│   ├── constants/           # Shared constants
│   ├── middlewares/         # Express middleware
│   ├── modules/             # Feature modules
│   │   ├── auth/            # Authentication module scaffold
│   │   ├── patient/         # Patient module scaffold
│   │   ├── report/          # Reporting module scaffold
│   │   └── dashboard/       # Dashboard module scaffold
│   ├── shared/              # Cross-cutting application code
│   │   ├── utils/           # General utilities
│   │   ├── helpers/         # Reusable helpers
│   │   ├── errors/          # Error definitions
│   │   └── responses/       # Response helpers
│   ├── validators/          # Shared validation definitions
│   ├── app.js               # Express application bootstrap
│   └── routes.js            # Root route registry
├── tests/                   # Test files
├── server.js                # Server bootstrap
├── .env.example             # Environment-variable template
├── .gitignore
└── package.json
```

Each feature module contains controller, service, routes, and validation files only. Data models are intentionally not included.

## Tech Stack

- Runtime: _To be defined_
- Framework: _To be defined_
- Database: _To be defined_
- Validation: _To be defined_
- Testing: _To be defined_

## Getting Started

## Environment Variables

