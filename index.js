// Import dependencies
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import MySQL connection
const connection = require("./config/connection");

// Import prompts
const prompt = require("./config/prompts");

// Display banner
console.log();

// Launch app
firstPrompt();

// Import dependencies
const inquirer = require("inquirer");
const prompt = require("./config/prompts");
const {
  viewEmployee,
  viewEmployeeByManager,
  viewEmployeeByDepartment,
  viewDepartments,
  viewRoles,
  viewDepartmentBudget,
  addEmployee,
  addDepartment,
  addRole,
  updateEmployeeRole,
  updateEmployeeManager,
  deleteEmployee,
  deleteDepartment,
  deleteRole
} = require("./config/actions");

// Define main prompt function
function firstPrompt() {
  // Prompt user for task selection
  inquirer.prompt(prompt.firstPrompt).then(function ({ task }) {
    // Execute selected task
    switch (task) {
      case "View Employees":
        viewEmployee();
        break;
      case "View Employees by Manager":
        viewEmployeeByManager();
        break;
      case "View Employees by Department":
        viewEmployeeByDepartment();
        break;
      case "View Departments":
        viewDepartments();
        break;
      case "View Roles":
        viewRoles();
        break;
      case "View Department Budget":
        viewDepartmentBudget();
        break;
      case "Add Employee":
        addEmployee();
        break;
      case "Add Department":
        addDepartment();
        break;
      case "Add Role":
        addRole();
        break;
      case "Update Employee Role":
        updateEmployeeRole();
        break;
      case "Update Employee Manager":
        updateEmployeeManager();
        break;
      case "Remove Employee":
        deleteEmployee();
        break;
      case "Remove Department":
        deleteDepartment();
        break;
      case "Remove Role":
        deleteRole();
        break;
      case "Exit":
        console.log(
          `\n"Thank you :)"\n\n`
        );
        // End MySQL connection
        connection.end();
        break;
    }
  });
}

// Import dependencies
const consoleTable = require("console.table");
const connection = require("./connection");

// Define viewEmployee function
function viewEmployee() {
  console.log("Employee Rota:\n");

  // Define SQL query
  const query = `
    SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON d.id = r.department_id
    LEFT JOIN employee m ON m.id = e.manager_id
  `;

  // Execute SQL query
  connection.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    console.log("\n<\n");

    // Prompt user for next action
    firstPrompt();
  });
}

// Import dependencies
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const connection = require("./connection");
const prompt = require("./prompts");

// Define viewEmployeeByManager function
function viewEmployeeByManager() {
  console.log("Manager Rota:\n");

  // Define SQL query to select managers and their IDs
  const query1 = `
    SELECT e.manager_id, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON d.id = r.department_id
    LEFT JOIN employee m ON m.id = e.manager_id
    GROUP BY e.manager_id
  `;

  // Execute SQL query to select managers and their IDs
  connection.query(query1, function (err, res) {
    if (err) throw err;

    // Filter out NULL values and create choices for inquirer prompt
    const managerChoices = res
      .filter((mgr) => mgr.manager_id)
      .map(({ manager_id, manager }) => ({
        value: manager_id,
        name: manager,
      }));

    // Prompt user to select a manager
    inquirer
      .prompt(prompt.viewManagerPrompt(managerChoices))
      .then(function (answer) {
        // Define SQL query to select subordinates of selected manager
        const query2 = `
          SELECT e.id, e.first_name, e.last_name, r.title, CONCAT(m.first_name, ' ', m.last_name) AS manager
          FROM employee e
          JOIN role r ON e.role_id = r.id
          JOIN department d ON d.id = r.department_id
          LEFT JOIN employee m ON m.id = e.manager_id
          WHERE m.id = ?
        `;

        // Execute SQL query to select subordinates of selected manager
        connection.query(query2, answer.managerId, function (err, res) {
          if (err) throw err;

          console.table("\nManager's subordinates:", res);
          console.log("\n<\n");

          // Prompt user for next action
          firstPrompt();
        });
      });
  });
}

// Import dependencies
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const connection = require("./connection");
const prompt = require("./prompts");

// Define viewEmployeeByDepartment function
function viewEmployeeByDepartment() {
  console.log("View employees by department\n");

  // Define SQL query to select departments and their IDs
  const query1 = `
    SELECT d.id, d.name
    FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON d.id = r.department_id
    GROUP BY d.id, d.name
  `;

  // Execute SQL query to select departments and their IDs
  connection.query(query1, function (err, res) {
    if (err) throw err;

    // Create choices for inquirer prompt
    const departmentChoices = res.map((data) => ({
      value: data.id,
      name: data.name,
    }));

    // Prompt user to select a department
    inquirer
      .prompt(prompt.departmentPrompt(departmentChoices))
      .then(function (answer) {
        // Define SQL query to select employees in selected department
        const query2 = `
          SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department 
          FROM employee e
          JOIN role r ON e.role_id = r.id
          JOIN department d ON d.id = r.department_id
          WHERE d.id = ?
        `;

        // Execute SQL query to select employees in selected department
        connection.query(query2, answer.departmentId, function (err, res) {
          if (err) throw err;

          console.table("\nDepartment Rota: ", res);
          console.log("\n<\n");

          // Prompt user for next action
          firstPrompt();
        });
      });
  });
}

// Import dependencies
const consoleTable = require("console.table");
const connection = require("./connection");

// Define viewDepartments function
function viewDepartments() {
  // Define SQL query to select all departments
  const query = "SELECT * FROM department";

  // Execute SQL query to select all departments
  connection.query(query, function (err, res) {
    if (err) throw err;

    // Display results as a table in the console
    console.log(`\nDEPARTMENTS:\n`);
    console.table(res);
    console.log("\n<\n");

    // Prompt user for next action
    firstPrompt();
  });
}

// Import dependencies
const consoleTable = require("console.table");
const connection = require("./connection");

// Define viewRoles function
function viewRoles() {
  // Define SQL query to select all roles
  const query = "SELECT * FROM role";

  // Execute SQL query to select all roles
  connection.query(query, function (err, res) {
    if (err) throw err;

    // Display results as a table in the console
    console.log(`\nROLES:\n`);
    console.table(res);
    console.log("\n<\n");

    // Prompt user for next action
    firstPrompt();
  });
}

// Import dependencies
const consoleTable = require("console.table");
const connection = require("./connection");

// Define viewDepartmentBudget function
function viewDepartmentBudget() {
  // Define SQL query to select department names and budgets
  const query = `
    SELECT d.name, r.salary, SUM(r.salary) AS budget
    FROM employee e 
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
    GROUP BY d.name
  `;

  // Execute SQL query to select department names and budgets
  connection.query(query, function (err, res) {
    if (err) throw err;

    // Display results as a table in the console
    console.log(`\nDEPARTMENT BUDGETS:\n`);
    console.table(res);
    console.log("\n<\n");

    // Prompt user for next action
    firstPrompt();
  });
}

// Import dependencies
const inquirer = require("inquirer");
const connection = require("./connection");
const prompt = require("./prompts");

// Define addEmployee function
const addEmployee = () => {
  // Select employee's department
  connection.query(`SELECT * FROM department`, (err, departments) => {
    if (err) throw err;

    const departmentChoices = departments.map((department) => ({
      value: department.id,
      name: department.name,
    }));

    // Select employee's role
    connection.query(`SELECT * FROM role`, (err, roles) => {
      if (err) throw err;

      const roleChoices = roles.map((role) => ({
        value: role.id,
        name: role.title,
      }));

      // Select employee's manager
      connection.query(`SELECT * FROM employee`, (err, employees) => {
        if (err) throw err;

        const managerChoices = employees.map((employee) => ({
          value: employee.id,
          name: `${employee.first_name} ${employee.last_name}`,
        }));

        // Prompt user to enter employee information
        inquirer
          .prompt(
            prompt.insertEmployee(departmentChoices, roleChoices, managerChoices)
          )
          .then((response) => {
            // Insert new employee into the database
            const newEmployee = {
              first_name: response.firstName,
              last_name: response.lastName,
              role_id: response.role,
              manager_id: response.manager || null,
            };

            connection.query(
              "INSERT INTO employee SET ?",
              newEmployee,
              (err, res) => {
                if (err) throw err;

                console.log(
                  `\n${res.affectedRows} employee created\n\n<\n`
                );

                // Display updated employee table
                viewEmployee();
              }
            );
          });
      });
    });
  });
};

// Import dependencies
const inquirer = require("inquirer");
const connection = require("./connection");
const prompt = require("./prompts");

// Define addDepartment function
function addDepartment() {
  // Prompt user to enter new department name
  inquirer
    .prompt(prompt.insertDepartment)
    .then((response) => {
      // Insert new department into the database
      const newDepartment = {
        name: response.department,
      };

      connection.query(
        "INSERT INTO department SET ?",
        newDepartment,
        (err, res) => {
          if (err) throw err;

          console.log(
            `\nYou have added this department: ${newDepartment.name.toUpperCase()}.`
          );
          console.log("\n<\n");

          // Display updated department table
          viewDepartments();
        }
      );
    });
}

// Import dependencies
const inquirer = require("inquirer");
const connection = require("./connection");
const prompt = require("./prompts");

// Define addRole function
function addRole() {
  // Select department for new role
  connection.query(`SELECT * FROM department`, (err, departments) => {
    if (err) throw err;

    const departmentChoices = departments.map((department) => ({
      value: department.id,
      name: `${department.id} ${department.name}`,
    }));

    // Prompt user to enter new role information
    inquirer
      .prompt(prompt.insertRole(departmentChoices))
      .then((response) => {
        // Insert new role into the database
        const newRole = {
          title: response.roleTitle,
          salary: response.roleSalary,
          department_id: response.departmentId,
        };

        connection.query("INSERT INTO role SET ?", newRole, (err, res) => {
          if (err) throw err;

          console.log(
            `\n${res.affectedRows} role created\n\n<\n`
          );

          // Display updated role table
          viewRoles();
        });
      });
  });
}

// Import dependencies
const inquirer = require("inquirer");
const connection = require("./connection");
const prompt = require("./prompts");

// Define updateEmployeeRole function
function updateEmployeeRole() {
  // Select employee to update
  connection.query("SELECT id, first_name, last_name FROM employee", (err, employees) => {
    if (err) throw err;

    const employeeChoices = employees.map((employee) => ({
      value: employee.id,
      name: `${employee.id} ${employee.first_name} ${employee.last_name}`,
    }));

    // Select new role for employee
    connection.query("SELECT id, title FROM role", (err, roles) => {
      if (err) throw err;

      const roleChoices = roles.map((role) => ({
        value: role.id,
        name: `${role.id} ${role.title}`,
      }));

      // Prompt user to select employee and new role
      inquirer
        .prompt(prompt.updateRole(employeeChoices, roleChoices))
        .then((response) => {
          // Update employee with chosen role
          const employeeId = parseInt(response.update);
          const roleId = parseInt(response.role);

          connection.query(
            `UPDATE employee SET role_id = ? WHERE id = ?`,
            [roleId, employeeId],
            (err, res) => {
              if (err) throw err;

              console.log(`\n${res.affectedRows} employee updated.\n\n<\n`);

              // Display main menu
              firstPrompt();
            }
          );
        });
    });
  });
}

// Import dependencies
const inquirer = require("inquirer");
const connection = require("./connection");
const prompt = require("./prompts");

// Define updateEmployeeManager function
function updateEmployeeManager() {
  // Select employee to update
  connection.query("SELECT id, first_name, last_name FROM employee", (err, employees) => {
    if (err) throw err;

    const employeeChoices = employees.map((employee) => ({
      value: employee.id,
      name: `${employee.id} ${employee.first_name} ${employee.last_name}`,
    }));

    // Select new manager for employee
    inquirer
      .prompt(prompt.updateManager(employeeChoices))
      .then((response) => {
        // Update employee with chosen manager
        const employeeId = parseInt(response.update);
        const managerId = parseInt(response.manager);

        connection.query(
          `UPDATE employee SET manager_id = ? WHERE id = ?`,
          [managerId, employeeId],
          (err, res) => {
            if (err) throw err;

            console.log(`\n${res.affectedRows} employee updated.\n\n<\n`);

            // Display main menu
            firstPrompt();
          }
        );
      });
  });
}

// Import dependencies
const inquirer = require("inquirer");
const connection = require("./connection");
const prompt = require("./prompts");

// Define deleteEmployee function
function deleteEmployee() {
  console.log("Deleting an employee");

  // Select employee to delete
  connection.query("SELECT id, first_name, last_name FROM employee", (err, employees) => {
    if (err) throw err;

    const employeeChoices = employees.map((employee) => ({
      value: employee.id,
      name: `${employee.id} ${employee.first_name} ${employee.last_name}`,
    }));

    // Prompt user to select employee to delete
    inquirer
      .prompt(prompt.deleteEmployeePrompt(employeeChoices))
      .then((response) => {
        // Delete employee from database
        connection.query(
          "DELETE FROM employee WHERE ?",
          { id: response.employeeId },
          (err, res) => {
            if (err) throw err;

            console.log(`\n${res.affectedRows} employee deleted.\n\n<\n`);

            // Display main menu
            firstPrompt();
          }
        );
      });
  });
}

// Import dependencies
const inquirer = require("inquirer");
const connection = require("./connection");
const prompt = require("./prompts");

// Define deleteDepartment function
function deleteDepartment() {
  console.log("\nRemove a Department:\n");

  // Select department to delete
  connection.query("SELECT id, name FROM department", (err, departments) => {
    if (err) throw err;

    const departmentChoices = departments.map((department) => ({
      value: department.id,
      name: `${department.id} ${department.name}`,
    }));

    // Prompt user to select department to delete
    inquirer
      .prompt(prompt.deleteDepartmentPrompt(departmentChoices))
      .then((response) => {
        // Delete department from database
        connection.query(
          "DELETE FROM department WHERE ?",
          { id: response.departmentId },
          (err, res) => {
            if (err) throw err;

            console.log(`\n${res.affectedRows} department deleted.\n\n<\n`);

            // Display departments
            viewDepartments();
          }
        );
      });
  });
}

// Import dependencies
const inquirer = require("inquirer");
const connection = require("./connection");
const prompt = require("./prompts");

// Define deleteRole function
function deleteRole() {
  console.log("Deleting a role");

  // Select role to delete
  connection.query("SELECT id, title FROM role", (err, roles) => {
    if (err) throw err;

    const roleChoices = roles.map((role) => ({
      value: role.id,
      name: `${role.id} ${role.title}`,
    }));

    // Prompt user to select role to delete
    inquirer
      .prompt(prompt.deleteRolePrompt(roleChoices))
      .then((response) => {
        // Delete role from database
        connection.query(
          "DELETE FROM role WHERE ?",
          { id: response.roleId },
          (err, res) => {
            if (err) throw err;

            console.log(`\n${res.affectedRows} role deleted.\n\n<\n`);

            // Display roles
            viewRoles();
          }
        );
      });
  });
}
