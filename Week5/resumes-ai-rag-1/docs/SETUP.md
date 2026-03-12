# Setup Instructions for Resume Search Algorithm Project

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (version 14 or higher)
- npm (Node Package Manager)
- MongoDB (either locally or a cloud instance)
- TypeScript (optional, for development)

## Project Setup

1. **Clone the Repository**

   Clone the project repository to your local machine using the following command:

   ```
   git clone <repository-url>
   ```

   Replace `<repository-url>` with the actual URL of the repository.

2. **Navigate to the Project Directory**

   Change your working directory to the project folder:

   ```
   cd resumes-ai-rag
   ```

3. **Install Dependencies**

   Install the required npm packages by running:

   ```
   npm install
   ```

4. **Configure Environment Variables**

   Create a `.env` file in the root of the project based on the provided `.env.example` file. This file should contain your environment-specific variables, such as API keys and database connection strings.

   ```
   cp .env.example .env
   ```

   Open the `.env` file and fill in the necessary values.

5. **Set Up MongoDB**

   Ensure your MongoDB instance is running. If you are using a local MongoDB server, the default connection string is usually `mongodb://localhost:27017`. If you are using a cloud instance, update the connection string in your `.env` file accordingly.

6. **Run the Application**

   Start the application by executing:

   ```
   npm start
   ```

   This command will compile the TypeScript files and start the Express server.

7. **Access the API**

   Once the server is running, you can access the API endpoints. The base URL will typically be `http://localhost:3000/v1/`. You can test the health check endpoint by navigating to:

   ```
   http://localhost:3000/v1/health
   ```

## Development

For development purposes, you can use the following command to run the application in watch mode, which automatically recompiles TypeScript files on changes:

```
npm run dev
```

## Testing

To run tests, use the following command:

```
npm test
```

Ensure you have written tests for your services and endpoints to maintain code quality.

## Additional Resources

Refer to the `docs/API_ENDPOINTS.md` file for detailed information about the available API endpoints and their usage.

For guidance on using Copilot side chat to assist with code generation, editing, and debugging, please refer to the `docs/COPILOT_GUIDE.md` file.

## Conclusion

You are now set up to work on the Resume Search Algorithm project. Happy coding!