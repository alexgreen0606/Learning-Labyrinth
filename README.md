# Labyrinth Learner for Junior Java Developers

## Project Overview

Labyrinth Learner is an interactive Java learning application designed to help junior developers test and improve their Java skills. Users can log in and solve mazes by writing Java code that navigates a robot through the maze. This project is aimed at providing a fun and educational experience for those interested in Java programming.

## Features

- **Login System**: Users can create accounts and log in to track their progress.
- **Maze Challenges**: Players solve increasingly difficult mazes by writing Java code.
- **Real-time Feedback**: The app provides feedback on whether the robot successfully navigated the maze or not.
- **Code Editor**: Integrated code editor for users to write and test their Java solutions.
- **Performance Tracking**: Users can view statistics on their maze-solving attempts.
- **Dockerized Setup**: Easy deployment with Docker.

## Technology Stack

### Frontend

- **React**: The user interface is built using React, enabling dynamic rendering and a seamless user experience.
- **Redux**: For state management, ensuring that the app can handle complex UI logic.
- **CSS**: Provides styling and animations for a polished look and feel.
- **HTML5**: Lays the foundation for the frontend structure.

### Backend

- **Java Spring Boot**: The main framework that handles the server-side logic, routing, and API endpoints.
- **JPA Repository**: Used for interacting with the database, providing an abstraction layer to manage persistent data.

## How to Play

- todo

## Development Intent

This application was developed by a team of student developers as part of the Introduction to Software Engineering class (CS506) at the University of Wisconsin - Madison. The team consisted of five developers, with four members focusing on backend development. I was solely responsible for developing the frontend using React and Redux.

For code related to my work, please refer to the ./learning-labyrinth-frontend directory.

## Prerequisites

- **Docker**: The app is containerized, so Docker is required for running the application locally.

## Installation and Running the Game

1. Clone the repository:
```bash
git clone https://github.com/alexgreen0606/Learning-Labyrinth.git
```

2. Run Docker Compose:
```bash
docker compose up
```

4. Open `localhost:3000` URL in your browser to start using the app!# Labyrinth-Learner