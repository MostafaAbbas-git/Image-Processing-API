# Image Processing API

This is a simple image processing api that resizes any given image to a specified size using query parameters.

## Table of Contents

- [Toolbox](#toolbox)
- [Setting Up the Environment](#setting-up-the-environment)
- [Endpoints ](#endpoints)
- [Author](#Author)
- [About](#about)

## Toolbox

- Typescript
- Express

## Setting Up the Environment

1. Install the requirements and dependancies\

   ```sh
   npm install
   ```

2. Build the project first

   ```sh
   npm run build
   ```

3. Run the project

   ```sh
   node dist/index
   ```

4. Run tests\
   _PS:_ Running this scipt will build the project first, and then it will run jasmine test script.
   ```sh
   npm run test
   ```

## Endpoints

- http://localhost:3000/api/images
  <br>
- to run a test query you can use the following url:

  ```sh
  http://localhost:3000/api/images?filename=palmtunnel&width=200&height=200
  ```

## Author

- Mostafa M. Abbas- (https://github.com/MostafaAbbas-git)
- Udacity email: mostafa.abdelsadek99@eng-st.cu.edu.eg

## About

This project is a part of Advanced Full-Stack Web Development Nanodegree Program by Udacity and FWD.\
Instructor: Mohamed Elshafeay
