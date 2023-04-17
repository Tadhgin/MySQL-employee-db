const prompt = {};

firstprompt = {
  type: 'list',
  name: 'task',
  message: 'Make a selection:',
  choices: [
    'View Employees',
    'View Employees by Manager',
    'View Employees by Department',
    'View Departments',
    'View Roles',
    'View Department Budget',
    'Add Employee',
    'Add Department',
    'Add Role',
    'Update Employee Role',
    'Update Employee Manager',
    'Remove Employee',
    'Remove Department',
    'Remove Role',
    'Exit'
  ]
};

prompt.viewManagerPrompt = function(managerChoices) {
  return [
    {
      // Select Manager
      type: 'list',
      name: 'managerId',
      message: 'Which manager will you choose?',
      choices: managerChoices
    }
  ];
};

prompt.departmentPrompt = function(departmentChoices) {
  return [
    {
      // Select Department
      type: 'list',
      name: 'departmentId',
      message: 'Which department will you choose?',
      choices: departmentChoices
    }
  ];
};

prompt.insertEmployee = function(departmentArray, roleArray, managerArray) {
  return [
    {
      // Create Employee's First Name
      name: 'firstName',
      type: 'input',
      message: "Enter employee's first name:"
    },
    {
      // Create Employee's Last Name
      name: 'lastName',
      type: 'input',
      message: "Enter employee's last name:"
    },
    {
      // Select Employee's Department
      name: 'department',
      type: 'list',
      message: "Choose employee's department",
      choices: departmentArray
    },
    {
      // Select Employee's Role
      name: 'role',
      type: 'list',
      message: "Choose employee's job position",
      choices: roleArray
    },
    {
      // Select Employee's Manager
      name: 'manager',
      type: 'list',
      message: 'Choose the manager of this employee:',
      choices: managerArray
    }
  ];
};

prompt.insertDepartment = {
  // Create New Departments Name
  name: 'department',
  type: 'input',
  message: 'What is the name of the new department?'
};

prompt.insertRole = function(departmentChoices) {
  return [
    {
      // Create New Role's Name
      type: 'input',
      name: 'roleTitle',
      message: 'Role title?'
    },
    {
      // Create New Role's Salary Budget
      type: 'input',
      name: 'roleSalary',
      message: 'Role Salary'
    },
    {
      // Select New Role's Department
      type: 'list',
      name: 'departmentId',
      message: 'Department?',
      choices: departmentChoices
    }
  ];
};

prompt.updateRole = function(employees, job) {
  return [
    {
      // Select Employee to Update
      name: 'update',
      type: 'list',
      message: 'Choose the employee whose role is to be updated:',
      choices: employees
    },
    {
      // Select Employee's New Role
      name: 'role',
      type: 'list',
      message: "Choose employee's job position",
      choices: job
    }
  ];
};

prompt.updateManager = function(employees) {
  return [
    {
      // Select Employee to Update
      name: 'update',
      type: 'list',
      message: 'Choose the employee whose manager is to be updated:',
      choices: employees
    },
    {
      // Select Employee's New Manager
      name: 'manager',
      type: 'list',
      message: "Choose employee's new manager",
      choices: employees
    }
  ];
};

prompt.deleteEmployeePrompt = function(deleteEmployeeChoices) {
  return [
    {
      // Select Employee to Remove
      type: 'list',
      name: 'employeeId',
      message: 'Which employee do you want to remove?',
      choices: deleteEmployeeChoices
    }
  ];
};

prompt.deleteDepartmentPrompt = function(deleteDepartmentChoices) {
  return [
    {
      // Select Department to Remove
      type: 'list',
      name: 'departmentId',
      message: 'Which department do you want to remove?',
      choices: deleteDepartmentChoices
    }
  ];
};

prompt.deleteRolePrompt = function(deleteRoleChoices) {
  return [
    {
      // Select Role to Remove
      type: 'list',
      name: 'roleId',
      message: 'Which role do you want to remove?',
      choices: deleteRoleChoices
    }
  ];
};

module.exports = prompt;