# CodeDuel⚔️

Engage in real-time coding battles with **CodeDuel⚔️**! A dynamic platform for programmers of all skill levels to challenge peers and sharpen their coding prowess.

## 🌟 Features
- 🚀 Engage in real-time coding duels
- 💡 Challenge programmers of all skill levels
- 📊 Monitor your progress with dynamic leaderboards
- 📝 Sharpen your skills through continuous challenges

## 📐 System Architecture
Embrace the scalability, resilience, and agility offered by our microservices-based system architecture. Each component of CodeDuel operates as a standalone service, ensuring smooth performance and optimal resource utilization.

<p align="center">
  <img src="https://github.com/eladlevi013/CodeDuel/blob/master/docs/system_architecture.png?raw=true" alt="CodeDuel System Architecture" width="100%">
  </br>
</p>

### 🌐 Web Client 
- **Interface:** Intuitive and user-centric.
- **Duel Operations:** Seamlessly create/join battles, submit codes, and witness outcomes.

### 🖥 Node.js Express Server
- **HTTP Gateway:** Efficiently manages requests & responses from the web client.
- **Real-Time Sync:** Provides a WebSocket connection for instant updates.

### 🚀 RedisStore
- **Session Management:** Uses express-session to securely and efficiently manage user sessions, optimizing the user experience by remembering user states and preferences.
- **High-Speed Cache:** With its in-memory nature, Redis offers lightning-fast data access, minimizing latency and accelerating response times for session-related operations.

### 🗄 MongoDB
- Safeguards user profiles and tracks scores.

> 💡 _Unleash the power of microservices with CodeDuel and redefine your coding experience!_

