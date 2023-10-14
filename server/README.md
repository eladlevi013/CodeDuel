# CodeDuel⚔️ - Server

Welcome to the server component of **CodeDuel⚔️**. This is the backbone of our dynamic platform, handling everything from user authentication to real-time dueling and code evaluation.

## Features

- **HTTP Gateway:** Efficiently manages requests & responses from the web client.
- **Real-Time Sync:** Provides a WebSocket connection for instant updates and dynamic dueling experiences.
- **Quick-Match Algorithm:** Intelligent pairing of users for duels based on skill levels.
- **Code Submission Handling:** Evaluates user-submitted code against predefined test cases to determine correctness.
- **Room Management:** Facilitates the creation of dueling rooms with unique room codes for easy joining.
- **User Authentication:** Securely handles user registration and login processes.

## API Documentation with Swagger 📜

To provide clearer insights into the server's endpoints and functionalities, we have integrated Swagger for API documentation. This ensures developers and users alike can understand and interact with the platform with ease.

- **Accessing the API Documentation:** Visit `http://localhost:3001/api-doc` to explore the comprehensive API endpoints, models, and request-response details.

Integrating Swagger not only boosts the clarity of our system's operations but also facilitates a smoother onboarding experience for developers looking to extend or integrate with CodeDuel⚔️.

## Quick-Match Algorithm: Best Fit Room Selection 🎯

One of the standout features of our server is the quick-match algorithm. This algorithm is designed to match users for a duel in a way that ensures balanced competition.
The quick-match algorithm navigates through available rooms and pairs users in the best fit room. This ensures that your opponent is neither too challenging nor too easy for your current skill level.

To give you a clearer picture, here's a flowchart of the quick-match algorithm:

<p align="center">
  <img src="https://github.com/eladlevi013/CodeDuel/blob/master/docs/quick-match-flowchart.png?raw=true" alt="Quick-Match Algorithm Flowchart" width="80%">
  </br>
</p>

By integrating this algorithm into our server-side operations, we not only ensure smooth and fast matching but also provide users with a consistently challenging and rewarding experience.
