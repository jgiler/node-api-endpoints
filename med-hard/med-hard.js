// MEDIUM: Create a JSON file that will have 10 employees in it, their employeeID, their name, their salary and department name.
// Then, create an express API so that when you hit the endpoint with a GET request we want the api to respond with all data on the employees.
// If you hit the endpoint with their employeeID, we want to hand up only the information on that one employee.
// If you hit the endpoint with an incorrect employeeID, send back the correct HTTP status code and an error message stating that the employee was not found.
// GET::myendpointname.com/employees = Json with information from all 10 employees.
// GET::myendpointname.com/employees/<employeeID> = Json with the information from that specific employee.

 
// HARD: Add the remaining CRUD functionality to your medium problem.
// Make sure you return the proper HTTP status codes based on the outcome of the request. Be sure to implement error checking here.
// If an invalid request is made, we want to return some sort of error message and the correct HTTP status code for the situation.
// HTTP Status Codes: http://www.restapitutorial.com/httpstatuscodes.html

 
// POST::myendpointname.com/employees  =  Inserts new employee into your data.
// GET::myendpointname.com/employees = Returns json with information from all employees.
// GET::myendpointname.com/employees/<employeeID>  =  Returns json with the information from that specific employee.
// PUT::myendpointname.com/employees/<employeeID>  =  Updates information for specified employee.
// DELETE::myendpointname.com/employees/<employeeID>  =  Removes the employee with that ID from the data.

// *** At the beginning of your API code, please comment in your endpoints so that I can test your code via Postman.
// You can use a similar technique as the one shown above in the API design.

// localhost:4000/employees/\
// HARD CHALLENGE IS INCLUDED IN THIS FILE AS WELL.

// Importing modules and json file.
const express = require("express");
const app = express();
const data = require("./employees.json");
const Joi = require("joi");
app.use(express.json());

// MEDIUM
// GET::myendpointname.com/employees = Returns json with information from all employees.
app.get("/employees", (req, res) => {
  res.send(data);
});

// GET::myendpointname.com/employees/<employeeID>  =  Returns json with the information from that specific employee.
app.get("/employees/:id", (req, res) => {
  const employee = data.employees.find(
    e => e.employeeID === parseInt(req.params.id)
  );
  // If an invalid request is made, we want to return some sort of error message and the correct HTTP status code for the situation.
  if (!employee) res.status(404).send("the employee was not found");
  res.send(employee);
});

// HARD
// POST::myendpointname.com/employees  =  Inserts new employee into your data.
app.post("/employees/", (req, res) => {
  const { error } = validateEmployees(req.body); // same as doing result.error
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // adds one employee to array with entered params
  const employee = {
    employeeID: data.employees.length + 1,
    name: req.body.name,
    salary: req.body.salary,
    Department: req.body.Department,
  };
  data.employees.push(employee);
  res.send(employee);
});

// PUT::myendpointname.com/employees/<employeeID>  =  Updates information for specified employee.
app.put("/employees/:id", (req, res) => {
  const employee = data.employees.find(
    e => e.employeeID === parseInt(req.params.id)
  );
  if (!employee) return res.status(404).send("the employee was not found");

  const { error } = validateEmployees(req.body); // same as doing result.error
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  employee.name = req.body.name;
  employee.salary = req.body.salary;
  employee.Department = req.body.Department;

  res.send(employee);
});

// DELETE::myendpointname.com/employees/<employeeID>  =  Removes the employee with that ID from the data.
app.delete("/employees/:id", (req, res) => {
  const employee = data.employees.find(
    e => e.employeeID === parseInt(req.params.id)
  );
  if (!employee) return res.status(404).send("the employee was not found");

  // splice deletes from an array.
  const index = data.employees.indexOf(employee);
  data.employees.splice(index, 1);

  employee.name = req.body.name;
  employee.salary = req.body.salary;
  employee.Department = req.body.Department;

  res.send(employee);
});

// makes sure it's required to put in at least 3 characters and string
validateEmployees = e => {
  const schema = {
    name: Joi.string()
      .min(3)
      .required(),
    salary: Joi.string()
      .min(3)
      .required(),
    Department: Joi.string()
      .min(3)
      .required(),
  };
  return Joi.validate(e, schema);
};

// good practice. Makes sure a port is there
const port = process.env.PORT || 4000;

// Starts the http server listening for connections
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
