# Learning Labyrinth :robot:

## Project Overview

Learning Labyrinth is an interactive Java learning application designed to help junior developers test and improve their Java skills. Users can log in and solve mazes by writing Java code that navigates a robot through the maze. This project is aimed at providing a fun and educational experience for those interested in Java programming.

## Features

- **Login System**: Users can create accounts and log in as either an admin or a user.
- **Admin Users**: Admins can create and manage existing mazes in the catalog.
- **Maze Challenges**: Players solve increasingly difficult mazes by writing Java code.
- **Real-time Feedback**: The app compiles and runs the user's code, and animates the robot using the code results.
- **Code Editor**: Integrated code editor for users to write and test their Java solutions.
- **Performance Tracking**: Users can view statistics on their maze attempts, such as number of moves and their most efficient code.
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

## How to Use

### Admins

- **Create Account**: On the login page, sign up by creating a username and password, and select the `Admin` role.
- **Browse the catalog**: On the homepage, explore the maze catalog, which is sorted from simple to complex mazes.
- **Create New Mazes**: Click the `+` button to design a new maze. Use the maze grid to designate walls, paths, the start point, and the end point by clicking on the respective cells.
- **Edit Existing Mazes**:  To modify a maze, simply click on any maze in the catalog. This will open the maze editor, where you can adjust the layout or delete the maze.

### Users

- **Create Account**: On the login page, sign up by creating a username and password, and select the `User` role.
- **Browse the Catalog**: On the homepage, scroll through the maze catalog, organized by difficulty from simple to complex. A sidebar also highlights the three most popular mazes.
- **Attempt A Maze**: Click on a maze to open the attempt page. Here, you can write Java code in the provided text field. The code can be compiled or saved. The page will display your best, most recent, and current code attempts. Clicking `Play` will animate the robot through the maze, and the MAZER bot will provide feedback on your submission.

## Development Intent

This application was developed by my team of student developers as part of our Introduction to Software Engineering class (CS506) at the University of Wisconsin - Madison. Our team consisted of five developers, with the other four members focusing on backend development. I was solely responsible for developing the frontend using React and Redux.

For code related to my work, please refer to the `./learning-labyrinth-frontend` directory.

## Prerequisites

- **Docker**: The app is containerized, so Docker is required for running the application locally.

## Installation and Running the Game

1. Clone the repository:
```bash
git clone https://github.com/alexgreen0606/Learning-Labyrinth.git
```

2. From the root folder, navigate to the docker compose folder:
```bash
cd db
```

3. Run Docker Compose:
```bash
docker compose up
```

4. Open `localhost:3000` in your browser to start using the app!
