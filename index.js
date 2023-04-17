const consoleTable = require('console.table');
//const inquirer = require('inquirer');
const connection = require('./config/connection');
const prompt = require('./config/prompts');

console.log('');

const launchApp = async () => {
	async function launchApp() {
		const task = await prompt.firstPrompt();
		await inquirer.prompt(task).then(handleTask);
				  }
				}
launchApp();

function firstPrompt() {
	const handleTask = async ({ task }) => {
	  switch (task) {
		case 'view employee':
		  viewEmployee();
		  break;
		case 'view employee by manager':
		  viewEmployeeByManager();
		  break;
		case 'view employee by department':
		  viewEmployeeByDepartment();
		  break;
		case 'view departments':
		  viewDepartments();
		  break;
		case 'view roles':
		  viewRoles();
		  break;
		case 'view department budget':
		  viewDepartmentBudget();
		  break;
		case 'add employee':
		  addEmployee();
		  break;
		case 'add department':
		  addDepartment();
		  break;
		case 'add role':
		  addRole();
		  break;
		case 'update employee role':
		  updateEmployeeRole();
		  break;
		case 'update employee manager':
		  updateEmployeeManager();
		  break;
		case 'delete employee':
		  deleteEmployee();
		  break;
		case 'delete department':
		  deleteDepartment();
		  break;
		case 'delete role':
		  deleteRole();
		  break;
		case 'Exit':
		  console.log(`\n"Thank you :)"\n\n`);
		  await connection.endAsync();
		  return;
	  }
	  await firstPrompt();
	};

	async function launchApp() {
		const task = await prompt.firstPrompt();
		inquirer.prompt(task).then(handleTask);
	  }
  }
function viewEmployee() {
  console.log('Employee:\n');
}
	const query = `
	  SELECT
		e.id,
		e.first_name,
		e.last_name,
		r.title,
		d.name AS department,
		r.salary,
		CONCAT(m.first_name, ' ', m.last_name) AS manager
	  FROM
		employee e
		LEFT JOIN role r ON e.role_id = r.id
		LEFT JOIN department d ON d.id = r.department_id
		LEFT JOIN employee m ON m.id = e.manager_id
	`;
	connection.query(query, (err, res) => {
		if (err) {
		  console.error(err);
		  return;
		}

		console.table(res);
		console.log('\n\n');

		firstPrompt();
	  });
	  function viewEmployeeByManager() {
		console.log('Manager:\n');

		const query = `
		  SELECT
			e.manager_id,
			CONCAT(m.first_name, ' ', m.last_name) AS manager
		  FROM
			employee e
			LEFT JOIN role r ON e.role_id = r.id
			LEFT JOIN department d ON d.id = r.department_id
			LEFT JOIN employee m ON m.id = e.manager_id
		  GROUP BY
			e.manager_id
		`;

		connection.query(query, (err, res) => {
		  if (err) {
			console.error(err);
			return;
		  }

		  // Select manager to view subordinates
		  const managerChoices = res
			// Filter NULL (prevents selecting employees with no assigned manager)
			.filter((mgr) => mgr.manager_id)
			.map(({ manager_id, manager }) => ({
			  value: manager_id,
			  name: manager,
			}));

		  inquirer.prompt(prompt.viewManagerPrompt(managerChoices)).then(({ managerId }) => {
			const query = `
			  SELECT
				e.id,
				e.first_name,
				e.last_name,
				r.title,
				CONCAT(m.first_name, ' ', m.last_name) AS manager
			  FROM
				employee e
				JOIN role r ON e.role_id = r.id
				JOIN department d ON d.id = r.department_id
				LEFT JOIN employee m ON m.id = e.manager_id
			  WHERE
				m.id = ?
			`;

			connection.query(query, managerId, (err, res) => {
			  if (err) {
				console.error(err);
				return;
			  }

			  console.table("\n Assistant managers:", res);
			  console.log('\n\n');

			  firstPrompt();
			});
		  });
		});
	  }
	  function viewEmployeeByDepartment() {
		console.log('View employees by department\n');

		const query = `
		  SELECT
			d.id,
			d.name
		  FROM
			employee e
			LEFT JOIN role r ON e.role_id = r.id
			LEFT JOIN department d ON d.id = r.department_id
		  GROUP BY
			d.id,
			d.name
		`;

		connection.query(query, (err, res) => {
		  if (err) {
			console.error(err);
			return;
		  }

		  // Select department
		  const departmentChoices = res.map(({ id, name }) => ({
			value: id,
			name,
		  }));

		  inquirer.prompt(prompt.departmentPrompt(departmentChoices)).then(({ departmentId }) => {
			const query = `
			  SELECT
				e.id,
				e.first_name,
				e.last_name,
				r.title,
				d.name AS department
			  FROM
				employee e
				JOIN role r ON e.role_id = r.id
				JOIN department d ON d.id = r.department_id
			  WHERE
				d.id = ?
			`;

			connection.query(query, departmentId, (err, res) => {
			  if (err) {
				console.error(err);
				return;
			  }

			  console.table('\nDepartment: ', res);
			  console.log('\n\n');

			  firstPrompt();
			});
		  });
		});
	  }
function viewDepartments() {
	var query = "SELECT * FROM department";
	connection.query(query, function (err, res) {
		if (err) throw err;
		console.log(`\nDEPARTMENTS:\n`);
		res.forEach((department) => {
			console.log(`ID: ${department.id} | ${department.name} Department`);
		});
		console.log("\n\n");
		firstPrompt();
	});
}

function viewRoles() {
	var query = "SELECT * FROM role";
	connection.query(query, function (err, res) {
		if (err) throw err;
		console.log(`\nROLES:\n`);
		res.forEach((role) => {
			console.log(
				`ID: ${role.id} | Title: ${role.title}\n Salary: ${role.salary}\n`,
			);
		});
		console.log("\n\n");
		firstPrompt();
	});
}

function viewDepartmentBudget() {
	const query = `
	  SELECT
		d.name,
		r.salary,
		SUM(r.salary) AS budget
	  FROM
		employee e
		LEFT JOIN role r ON e.role_id = r.id
		LEFT JOIN department d ON r.department_id = d.id
	  GROUP BY
		d.name
	`;

	connection.query(query, (err, res) => {
	  if (err) {
		console.error(err);
		return;
	  }

	  console.log(`\n department budget:\n`);
	  res.forEach(({ name, budget }) => {
		console.log(`Department: ${name}\n Budget: ${budget}\n`);
	  });
	  console.log('\n\n');

	  firstPrompt();
	});
  }

  const addEmployee = () => {
	const departmentArray = [];
	connection.query('SELECT * FROM department', (err, res) => {
	  if (err) {
		console.error(err);
		return;
	  }

	  res.forEach(({ id, name }) => {
		departmentArray.push(`${id} ${name}`);
	  });

	  const roleArray = [];
	  connection.query('SELECT id, title FROM role', (err, res) => {
		if (err) {
		  console.error(err);
		  return;
		}

		res.forEach(({ id, title }) => {
		  roleArray.push(`${id} ${title}`);
		});

		const managerArray = [];
		connection.query('SELECT id, first_name, last_name FROM employee', (err, res) => {
		  if (err) {
			console.error(err);
			return;
		  }

		  res.forEach(({ id, first_name, last_name }) => {
			managerArray.push(`${id} ${first_name} ${last_name}`);
		  });

		  inquirer.prompt(prompt.insertEmployee(departmentArray, roleArray, managerArray)).then((response) => {
			const roleCode = parseInt(response.role);
			const managerCode = parseInt(response.manager);

			connection.query(
			  'INSERT INTO employee SET ?',
			  {
				first_name: response.firstName,
				last_name: response.lastName,
				role_id: roleCode,
				manager_id: managerCode,
			  },
			  (err, res) => {
				if (err) {
				  console.error(err);
				  return;
				}

				console.log(`\n${res.affectedRows} employee created\n\n`);
				viewEmployee();
			  }
			);
		  });
		});
	  });
	});
  };
function addDepartment() {
	inquirer.prompt(prompt.insertDepartment).then(function (answer) {
		var query = "INSERT INTO department (name) VALUES ( ? )";
		connection.query(query, answer.department, function (err, res) {
			if (err) throw err;
			console.log(
				`You have added this department: ${answer.department.toUpperCase()}.`,
			);
		});
		console.log("\n\n");
		viewDepartments();
	});
}
function addRole() {
	const query = 'SELECT * FROM department';

	connection.query(query, (err, res) => {
	  if (err) {
		console.error(err);
		return;
	  }

	  const departmentChoices = res.map(({ id, name }) => ({
		value: id,
		name: `${id} ${name}`,
	  }));

	  inquirer.prompt(prompt.insertRole(departmentChoices)).then(({ roleTitle, roleSalary, departmentId }) => {
		const query = 'INSERT INTO role SET ?';

		connection.query(query, { title: roleTitle, salary: roleSalary, department_id: departmentId }, (err, res) => {
		  if (err) {
			console.error(err);
			return;
		  }

		  console.log(`\n${res.affectedRows} role created\n\n`);
		  viewRoles();
		});
	  });
	});
  }

  const updateEmployeeRole = () => {
	const employees = [];
	connection.query('SELECT id, first_name, last_name FROM employee', (err, res) => {
	  if (err) {
		console.error(err);
		return;
	  }

	  res.forEach(({ id, first_name, last_name }) => {
		employees.push(`${id} ${first_name} ${last_name}`);
	  });

	  const job = [];
	  connection.query('SELECT id, title FROM role', (err, res) => {
		if (err) {
		  console.error(err);
		  return;
		}

		res.forEach(({ id, title }) => {
		  job.push(`${id} ${title}`);
		});

		inquirer.prompt(prompt.updateRole(employees, job)).then(({ update, role }) => {
		  const idCode = parseInt(update);
		  const roleCode = parseInt(role);

		  connection.query(
			`UPDATE employee SET role_id = ${roleCode} WHERE id = ${idCode}`,
			(err, res) => {
			  if (err) {
				console.error(err);
				return;
			  }

			  console.log(`\n\n${res.affectedRows} Update Successful \n\n`);
			  firstPrompt();
			}
		  );
		});
	  });
	});
  };

const updateEmployeeManager = () => {
  const employees = [];
  connection.query('SELECT id, first_name, last_name FROM employee', (err, res) => {
    if (err) {
      console.error(err);
      return;
    }

    res.forEach(({ id, first_name, last_name }) => {
      employees.push(`${id} ${first_name} ${last_name}`);
    });

    inquirer.prompt(prompt.updateManager(employees)).then(({ update, manager }) => {
      const idCode = parseInt(update);
      const managerCode = parseInt(manager);

      connection.query(
        `UPDATE employee SET manager_id = ${managerCode} WHERE id = ${idCode}`,
        (err, res) => {
          if (err) {
            console.error(err);
            return;
          }

          console.log(`\n\n${res.affectedRows} Update Successful \n\n`);
          firstPrompt();
        }
      );
    });
  });
};

function deleteEmployee() {
	console.log('delete an employee');

	const query = 'SELECT e.id, e.first_name, e.last_name FROM employee e';

	connection.query(query, (err, res) => {
	  if (err) {
		console.error(err);
		return;
	  }

	  const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
		value: id,
		name: `${id} ${first_name} ${last_name}`,
	  }));

	  inquirer.prompt(prompt.deleteEmployeePrompt(deleteEmployeeChoices)).then(({ employeeId }) => {
		const query = 'DELETE FROM employee WHERE ?';

		connection.query(query, { id: employeeId }, (err, res) => {
		  if (err) {
			console.error(err);
			return;
		  }

		  console.log(`\n${res.affectedRows} Employee Successfully Deleted\n\n`);
		  firstPrompt();
		});
	  });
	});
  }

function deleteDepartment() {
	console.log("\n Remove a Department:\n");

	var query = `SELECT e.id, e.name FROM department e`;

	connection.query(query, function (err, res) {
		if (err) throw err;
		// Select Department to Remove
		const deleteDepartmentChoices = res.map(({ id, name }) => ({
			value: id,
			name: `${id} ${name}`,
		}));

		inquirer
			.prompt(prompt.deleteDepartmentPrompt(deleteDepartmentChoices))
			.then(function (answer) {
				var query = `DELETE FROM department WHERE ?`;
				// after prompting, remove item from the db
				connection.query(query, { id: answer.departmentId }, function (
					err,
					res,
				) {
					if (err) throw err;

					console.log("\n" + res.affectedRows + "Department Successfully Deleted");
					console.log("\n\n");

					viewDepartments();
				});
			});
	});
}

function deleteRole() {
	console.log('delete a role');

	const query = 'SELECT e.id, e.title, e.salary, e.department_id FROM role e';

	connection.query(query, (err, res) => {
	  if (err) {
		console.error(err);
		return;
	  }

	  const deleteRoleChoices = res.map(({ id, title }) => ({
		value: id,
		name: `${id} ${title}`,
	  }));

	  inquirer.prompt(prompt.deleteRolePrompt(deleteRoleChoices)).then(({ roleId }) => {
		const query = 'DELETE FROM role WHERE ?';

		connection.query(query, { id: roleId }, (err, res) => {
		  if (err) {
			console.error(err);
			return;
		  }

		  console.log(`\n${res.affectedRows} Role Successfully Deleted\n\n`);
		  viewRoles();
		});
	  });
	});
  }