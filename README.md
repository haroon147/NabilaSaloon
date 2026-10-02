# NabilaSaloon

Salon booking and management project with a React web app, a Flutter mobile app, and a Node.js backend.

## Project structure

- `backend/` - Express and MongoDB REST API. See [backend setup](backend/README.md).
- `web/` - React, TypeScript, and Vite web app.
- `mobile/` - Flutter mobile app and platform projects.
- [Developer manual](DEVELOPER_MANUAL.md) - Project documentation.
- `mock-data.json` - Sample data.

## Getting started

Copy `backend/.env.example` to `backend/.env` and `web/.env.example` to `web/.env`, then configure them for your environment.

Start the backend:

```sh
cd backend
npm install
npm run dev
```

Start the web app in a separate terminal:

```sh
cd web
npm install
npm run dev
```

Run the Flutter app:

```sh
cd mobile
flutter pub get
flutter run
```

Local environment files, dependencies, and generated build outputs are excluded from version control.
