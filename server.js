const { Pool } = require('pg');
const inquirer = require('inquirer');
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

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