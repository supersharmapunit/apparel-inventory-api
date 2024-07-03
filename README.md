# Apparel Inventory API

This is a REST API for managing apparel inventory and checking order fulfillment.

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. For development with auto-restart: `npm run dev`
5. Test project: `npm test`

## API Endpoints

#### PostMan API import file(test_postman.json) is given, Please open postman and import this file using `import` button.

- BASE URL - `http://localhost:3000/api`
- POST - `/get-lowest-cost`
- POST - `/check-order-fulfillment`
- POST - `/update-multiple-stocks`
- POST - `/update-stock`

## Implementation Details
This API is built using Node.js with TypeScript and Express.js. Here are some key aspects of the implementation:

1. Data Storage: The inventory data is stored in a local JSON file (data/inventory.json). This ensures data persistence across server restarts.
2- TypeScript: The entire application is written in TypeScript, providing strong typing and better developer experience.
3. Modular Structure: The code is organized into separate modules for models, services, controllers, and routes, following the MVC (Model-View-Controller) pattern.
4. Error Handling: A global error handler is implemented to catch and handle unexpected errors.
5. Unit Testing: Jest is used for unit testing, with tests covering the core functionality of the InventoryService.
6. Asynchronous Operations: All database operations (reading from and writing to the JSON file) are handled asynchronously to prevent blocking the event loop.
7. RESTful Design: The API follows RESTful principles, with appropriate HTTP methods and status codes.
8. Input Validation: While not explicitly implemented in this version, it's recommended to add input validation (e.g., using a library like Joi) in a production environment.
9. Scalability Considerations: The current implementation uses a local JSON file for storage. For a production environment with higher scalability requirements, consider using a database like MongoDB or PostgreSQL.

# Future Improvements

- Implement authentication and authorization for secure access to the API.
- Add more comprehensive error handling and logging.
- Implement pagination for endpoints that might return large amounts of data.
- Consider using a database for better performance and scalability in a production environment.
- Add integration tests to test the entire API flow.
- Implement a caching mechanism to improve performance for frequently accessed data.