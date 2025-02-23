# Discovery-App-be

## Description

Discovery-App-be is the backend service for the Discovery App, which provides APIs for user management, content discovery, and other functionalities.

## Features

- Content discovery
- RESTful API endpoints
- Database integration

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/Ruthuwamahoro/Discovery-App-Be
   ```

2. Navigate to the project directory:

   ```sh
   cd Discovery-App-Be
   ```

3. Install dependencies:
   ```sh
   pnpm install
   ```

## Configuration

1. Create a `.env` file in the root directory and add the following environment variables:

   ```env
   DATABASE_URL=your_database_url
   PORT=3000
   ```

2. Update the configuration files as you want.

## Usage

1. Start the development server:

   ```sh
   pnpm run dev
   ```

2. The server will be running at `http://localhost:3000`.

## API Endpoints

- `GET /api/users` - Get all users
- `GET /api/users/:id` - get single user
- `POST /api/register` - register new user
- `POST /api/login` - login account
- `GET /api/books` - Get all content
- `POST /api/books` - Add new content
- `GET /api/books/:id` - Add single book
- `PATCH /api/books/:id` - Add update single book
- `DELETE /api/books/:id` - Add delete single book
- `GET /api/books/recommendations` - Get all recommendations

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## Contact

For any inquiries, please contact [r.uwamahoro@alustudent.com].
