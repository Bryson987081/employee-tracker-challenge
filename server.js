const { Pool } = require('pg');
const inquirer = require('inquirer');
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const pool = new Pool(
    {
        user: 'postgres',
        password: '',
        host: 'localhost',
        database: 'tracker_db'
    },
    console.log(`Connected to the tracker_db database.`)
)

pool.connect();


const init = function () {
    inquirer
        .prompt({
            type: 'list',
            name: 'mainList',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Role',
            ],
        })
        .then((answers) => {
            switch (answers.mainList) {
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
            }
        })
};

const viewAllDepartments = function () {
    pool.query(`
        SELECT * FROM departments
        `, (err, { rows }) => {
            if (err) {
                console.error(err);
                return init();
            }
        console.table({ rows })
        init();
    });
}

const viewAllRoles = function () {
    pool.query(`
        SELECT roles.title, roles.id, departments.department_name, roles.salary 
        FROM roles 
        JOIN departments 
        ON roles.department_id = departments.id
        `, function (err, { rows }) {
        console.table(rows)
        init();
    })
};

const viewAllEmployees = function () {
    pool.query(`
        SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name, roles.salary, managers.first_name AS manager_first_name, managers.last_name AS manager_last_name
        FROM employees
        JOIN roles ON employees.role_id = roles.id
        JOIN departments ON roles.department_id = departments.id
        LEFT JOIN employees AS managers ON employees.manager_id = managers.id       
        `, (err, { rows }) => {
        if (err) {
            console.error(err);
            return init();
        }
        console.table(rows);
        init();
    })
};

const addDepartment = function () {
    inquirer
        .prompt({
            type: 'input',
            name: 'departmentName',
            message: 'What department would you like to add?',
        })
        .then((answers) => {
            pool.query(`
                INSERT INTO departments (department_name) 
                VALUES ('${answers.departmentName}')
                `, (err) => {
                if (err) {
                    console.error(err);
                    return init();
                }
                console.log(`Added ${answers.departmentName} to departments`);
                init();
            });
        })
};

const addRole = function () {
    pool.query(`
        SELECT *
        FROM departments
        `, (err, { rows }) => {
        if (err) {
            console.error(err);
            return init();
        }

        const choices = rows.map(departments => ({
            name: departments.department_name,
            value: departments.id
        }));
        inquirer
            .prompt([
                {
                    name: 'roleName',
                    type: 'input',
                    message: 'What role would you like to add?',
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'What is the salary?',
                },
                {
                    name: 'departmentName',
                    type: 'list',
                    message: 'What department does this role belong to?',
                    choices: choices
                }
            ])
            .then((answers) => {
                pool.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [answers.roleName, answers.salary, answers.departmentName]
                        ,  (err) => {
                    if (err) {
                        console.error(err);
                        return init();
                    }
                    console.log(`Added ${answers.roleName}`);
                    init();
                });
            });
    });
};

const addEmployee = function () {
    pool.query(`
        SELECT *
        FROM roles
        `, (err, { rows} ) => {
        if (err) {
            console.error(err);
            return init();
        }
        const roleChoice = rows.map(role => ({
            name: role.title,
            value: role.id,
        }))

        pool.query(`
                SELECT *
                FROM employees
                `, (err, { rows }) => {
            if (err) {
                console.error(err);
                return init();
            }

            const managerChoice = rows.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }));

            inquirer
                .prompt([
                    {
                        name: 'firstName',
                        type: 'input',
                        message: 'What is the employees first name?',
                    },
                    {
                        name: 'lastName',
                        type: 'input',
                        message: 'What is the employees last name?',
                    },
                    {
                        name: 'role',
                        type: 'list',
                        message: 'What is the employees role?',
                        choices: roleChoice,
                    },
                    {
                        name: 'manager',
                        type: 'list',
                        message: 'Who is the employees manager?',
                        choices: managerChoice,
                    },
                ])
                .then((answers) => {
                    pool.query(`
                                INSERT INTO employees (first_name, last_name, role_id, manager_id)
                                VALUES ${answers.firstName, answers.lastName, answers.role, answers.manager})
                                `, (err) => {
                        if (err) {
                            console.error(err);
                            return init();
                        }
                        console.log(`Added ${answers.firstName} ${answers.lastName}`);
                        init();
                    });
                });
        });
    });
};

const updateEmployeeRole = function () {

    pool.query(`
        SELECT *
        FROM roles
        `, (err, { rows }) => {
        if (err) {
            console.error(err)
            return init();
        }
        const roleChoice = rows.map(role => ({
            name: role.title,
            value: role.id
        }));

        pool.query(`
                SELECT *
                FROM employees
                `, (err, { rows }) => {
            if (err) {
                console.error(err);
                return init();
            }

            const employeeChoice = rows.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }));
            inquirer
                .prompt([
                    {
                        name: 'employee',
                        type: 'list',
                        message: 'Which employee would you like to update?',
                        choices: employeeChoice,
                    },
                    {
                        name: 'newRole',
                        type: 'list',
                        message: 'What is the new role?',
                        choices: roleChoice,
                    },
                ])
                .then((answers) => {
                    pool.query(`
                        UPDATE employees
                        SET role_id ${answers.newRole}
                        WHERE id = ${answers.employee}
                        `, (err) => {
                        if (err) {
                            console.error(err);
                            return init();
                        }
                        console.log(`Updated ${answers.employee}'s role to ${answers.newRole}`);
                        init();
                    });
                });
        });
    });
}


app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


init();