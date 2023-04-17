# MySQL Employee Database
The MySQL-employee-db repository is a simple employee database application built with MySQL and Node.js. The application allows you to view, add, update, and delete employees, departments, and roles.

## User Story
````
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
````
## Acceptance Criteria
````
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database
````
## Mock-Up
The following video shows an example of the application being used from the command line:
![msql-db](https://user-images.githubusercontent.com/117637052/232490224-f72e0f02-eb80-4cad-87cf-8a471e2a808f.gif)

## Video link
https://youtu.be/8dPU8iifMN4

## Installation

To run this project on your local machine, follow these steps:

   1. Clone the repository to your local machine by running the following command in your terminal:

    git clone https://github.com/Tadhgin/MySQL-employee-db.git

   2. Navigate to the project directory in your terminal:

    cd MySQL-employee-db

   3. Install the dependencies by running the following command:

    npm install

   4. Set up the MySQL database by importing the schema and seed data from the db folder by the following commands in your terminal:

    mysql -u <username> -p < db/schema.sql
    mysql -u <username> -p < db/seeds.sql
    Make sure to replace <username> with your MySQL username.

   5. Start the application by running the following command:

    npm start

   6. Use the arrow keys to navigate the menu and select actions like adding employees, updating roles, and deleting departments.

That's it! You should now be able to use the MySQL-employee-db application on your local machine. :)

The application will prompt you to choose from a list of actions, including viewing employees, departments, and roles, adding employees, departments, and roles, updating employee roles, and deleting employees.

## Credits

This application was created by Tadhgin White.

## License

This application is licensed under the MIT License.
