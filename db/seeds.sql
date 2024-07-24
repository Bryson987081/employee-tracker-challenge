INSERT INTO departments (name)
VALUES
('Marketing & Sales'),
('Operations'),
('Informationn Technology'),
('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES
('Sales', 65000.00, 1),
('Customer Service', 50000.00, 2),
('Cybersecurity',90000.00, ),
('Legal & Compliance',80000.00, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Max', 'Holloway', 1, 1),
('Demetrious', 'Johnson', 2, 2),
('Conor', 'McGregor', 3, 3),
('Sean', "O'Malley", 4, 4);