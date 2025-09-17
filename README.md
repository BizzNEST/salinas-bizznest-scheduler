# Nest Meetup

The goal of this project is to develop a randomized scheduling application using only frontend technologies (HTML, CSS, and JavaScript). The application will allow users to pair interns or group interns from different locations and departments based on customizable rules. It will provide flexibility to include or exclude interns from the schedule with simple selection controls.

### [Designs](https://www.figma.com/design/1nsYgWIN5bC7NnnVApTcK4/Salinas---bizzNest-Scheduler?node-id=0-1&t=TLQ1O5AYgPPOLJtm-0)

### [Mock-Ups](https://excalidraw.com/#json=hXikrerg9aW93NtIB4y55,HiubrShERrkbW7idVJSJiA)

### [Live Site](https://bizznest.github.io/salinas-bizznest-scheduler/)

## Table of Contents

- [Nest Meetup](#nest-meetup)
- [Table of Contents](#table-of-contents)
- [Project Requirements](#project-requirements)
- [Project Set Up](#project-set-up)
- [Development Process](#development-process)
- [Deployment Instructions](#deployment-instructions)

## Project Set Up 

Step-by-step instructions on how to get the development environment running.

1. Clone the repository:
    ```sh
    git clone git@github.com:BizzNEST/salinas-bizznest-scheduler.git
    ```
2. Navigate to the project directory:
    ```sh
    cd salinas-bizznest-scheduler
    ```
3. Install dependencies:
    ```sh
    npm install
    ```
4. Run the development server:
   - Download "Live Server" extension on VScode
   - After download is complete, a "Go Live" button will appear in the bottom right.
   - Click "Go Live" to locally run project
   - If successful, the button should read "Port: 5500"

5. To Run our Test / Accuracy:
   ```sh
   npm run test
   ```

## Project Requirements

### Key Features and Functional Requirements

#### Intern Data Management:
- Store all intern data in a static JSON object that is embedded or loaded into the application.
- Provide an interface to display intern details, such as name, department, and location, pulled from the JSON object.
  
#### Randomized Scheduling:
- The application should randomly generate a schedule that pairs or groups interns according to specified rules.
Pairing rules should include:
  - Different city pairing: Interns are paired with others from different cities.
  - Different department pairing: Interns are paired with others from different departments.
- Users should be able to turn these rules on or off depending on their requirements.
  
#### Selection and Filtering:
- Provide a user interface for selecting which interns to include or exclude from the scheduling.
- Include “Select All” and “Deselect All” options for easy management of selections.
- Allow filtering of interns by location and department.

#### Rule Configuration:
- Provide a simple UI to set and modify rules for pairing:
    - Toggle city-based pairing on or off.
    - Toggle department-based pairing on or off.
- Allow users to add or remove custom rules directly from the UI.
  
#### Manual Override:
- Enable users to manually adjust the random pairings after they are generated, providing flexibility to accommodate specific needs or preferences.
  
#### Edge Case Handling:
- The application must accommodate edge cases, such as:
    - An uneven number of interns, where one or more interns may not be paired.
    - Interns who meet multiple criteria that could lead to conflicts (e.g., limited availability). 
    - Scenarios where all pairing rules cannot be satisfied, requiring fallback or best-effort solutions.
- Clearly communicate to users when edge cases are encountered and how they are resolved.

#### User Interface:
- A clean, intuitive interface that is responsive and accessible on both desktop and mobile devices.
The dashboard should provide a clear overview of the current schedule, available pairing rules, and options to select or deselect interns.

#### Accessibility:
- Ensure the application is compliant with accessibility standards (e.g., WCAG 2.1) for visually impaired users.

#### GitHub Integration and Practices:
- Interns must create and write GitHub issues to track tasks, bugs, and enhancements for the project.
- Interns are required to read and follow established commit messages, branching strategies, and coding practices to maintain consistency and quality in the codebase.

### Technical Requirements

#### Platform and Technology:
- Frontend Technologies Only: The application will be built using HTML, CSS, and JavaScript.
- Use JavaScript to handle the logic for schedule generation, rule application, selection management, and edge case handling.
- CSS for styling to create a responsive and visually appealing user interface.

#### Data Storage:
- Use a static JSON file or object to store intern data. 
- Intern data should be loaded into the application using JavaScript and manipulated within the client-side environment.

#### No Backend or Database:
- This will be a frontend-only project with no backend server or database.
- All data and logic are handled on the client side.

#### Integration:
- Optionally, provide an export feature to download the generated schedule as a file (e.g., CSV or PDF) or print it directly from the browser.

### Non-Functional Requirements

#### Performance:
- The application should be lightweight and optimized for fast loading and execution.
- Schedule generation, including handling edge cases, should be quick, with a target response time of under a second for most operations.

#### Scalability:
- Design the application to handle up to 100 interns without performance degradation.
- Ensure the UI remains responsive and easy to use, even with large amounts of data.

#### Usability:
- Provide a user-friendly and intuitive experience for users, requiring minimal training or documentation.
- Include tooltips or help text where necessary to explain different features and controls.


## Development Process

All of the process is completed following [bizzNest GitHub Branching/Commit/PR Standards](https://github.com/BizzNEST/Standards-and-Practices/tree/main/standards)

* Create feature branch from `main`
* Implement changes and commit frequently
* Open PR into `main` when ready


## Deployment Instructions

* Through [GitHub Pages](https://bizznest.github.io/salinas-bizznest-scheduler/)



