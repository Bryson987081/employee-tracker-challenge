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


const init = function() {
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

const viewAllDepartments = function() {
    pool.query(`
        SELECT * FROM departments
        `, function (err, {rows}) {
        console.table(rows)
    })
};

const viewAllRoles = function() {
    pool.query(`
        SELECT * roles.title, roles.id, departments.name, roles.salary 
        FROM roles 
        JOIN departments 
        ON roles.department_id = departments.id
        `, function (err, {rows}) {
        console.table(rows)
    })
};

const viewAllEmployees = function() {
    
};

const addDepartment = function() {
    inquirer
        .prompt({
            type: 'input',
            name: 'departmentName',
            message: 'What department would you like to add?',
        })
        .then((answers) => {
            pool.query(`
                INSERT INTO departments (name) 
                VALUES ('${answers.departmentName}')
                `, function (err, {rows}) {
                    console.log(`Added ${answers.departmentName} to departments`);
                })
        })
};

const addRole = function() {
    
};

const addEmployee = function() {
    
};

const updateEmployeeRole = function() {
    
};

app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  

init();