const { Pool } = require('pg');
const inquirer = require('inquirer');
const express = require('express');
const { default: Choices } = require('inquirer/lib/objects/choices');

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
};

const viewAllDepartments = function () {
    pool.query(`
        SELECT * FROM departments
        `, function (err, { rows }) {
        console.table(rows)
    })
};

const viewAllRoles = function () {
    pool.query(`
        SELECT * roles.title, roles.id, departments.name, roles.salary 
        FROM roles 
        JOIN departments 
        ON roles.department_id = departments.id
        `, function (err, { rows }) {
        console.table(rows)
    })
};

const viewAllEmployees = function () {
    pool.query(`
        SELECT epmployees.id, epmployees.first_name, epmployees.last_name, roles.title, department.name, roles.salary, managers.first_name, managers.last_name
        FROM employees
        JOIN roles ON employees.role_id = roles.id
        JOIN departments ON roles.departments_id = departments.id
        LEFT JOIN employess managers ON employee.manager_id = managers.id       
        `, function (err, { rows }) {
        console.table(rows)
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
                INSERT INTO departments (name) 
                VALUES ('${answers.name}')
                `, function (err, { rows }) {
                console.log(`Added ${answers.departmentName} to departments`);
            })
        })
};

const addRole = function () {
    pool.query(`
        SELECT *
        FROM departments
        `, function (err, { rows }) {
        if (err) {
            return (err);
        }

        const choices = rows.map(departments => ({
            name: departments.name,
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
                    type: 'input',
                    message: 'What department does this role belong to?',
                    choices: choices
                }
            ])
            .then((answers) => {
                pool.query(`
                        INSERT INTO roles (title, salary, departments_id)
                        VALUES ${answers.roleName, answers.salary, answers.departmentName}
                        `, function (err, { rows }) {
                    if (err) {
                        return (err);
                    }
                });
            });
    });
};

const addEmployee = function () {

};

const updateEmployeeRole = function () {

};

app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


init();