const Manager = require("./Develop/lib/Manager");
const Engineer = require("./Develop/lib/Engineer");
const Intern = require("./Develop/lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./Develop/lib/htmlRenderer");
const employees = [];

inquirer
    .prompt([
        {
            type: 'input',
            message: 'What is your name?',
            name: 'name',
        },
        {
            type: 'list',
            message: 'What is your role?',
            name: 'role',
            choices: [
                "Engineer",
                "Intern",
                "Manager"
            ],
        },
        {
            type: 'input',
            message: 'What is your ID number?',
            name: 'id',
        },
        {
            type: 'input',
            message: 'What is your email?',
            name: 'email',
        }
    ]).then((response) => {
        switch (response.role) {
          case "Manager":
            inquirer.prompt({
              type: 'number',
              name: 'office',
              message: "What is your office number?",
              validate: value => isNaN(parseInt(value)) ? 'Please enter a number!' : true
            }).then((answer) => {
              employees.push(new Manager(response.name, response.id, response.email, response.role, answer.office));
              askAgain()
            });
            break;
    
          case "Engineer":
            inquirer.prompt({
              type: 'input',
              name: 'github',
              message: 'What is your Github username?',
              validate: (github) => {
                if (github) {
                  return true
                } else {
                  console.log("Enter your username.")
                  return false
                }
              }
            }).then((answer) => {
              employees.push(new Engineer(response.name, response.id, response.email, response.role, answer.github));
              askAgain()
            });
            break;
          case "Intern":
            inquirer.prompt({
              type: 'input',
              name: 'school',
              message: 'What school did you go to?',
              validate: (school) => {
                if (school) {
                  return true
                } else {
                  console.log("Enter your school's name.")
                  return false
                }
              }
            }).then((answer) => {
              employees.push(new Intern(response.name, response.id, response.email, response.role, answer.school));
              askAgain()
            })
            break;
        }
      })

      function askAgain() {
        inquirer.prompt([
          {
            type: 'confirm',
            name: 'again',
            message: "Would you like to enter another employee?"
      
          }
        ]).then((response) => {
          if (response.again === true) {
            askQuestions();
          } else {
            console.log(employees)
            makeTeam();
          }
        })
      };
      
      function makeTeam() {
        fs.writeFile(outputPath, render(employees), function (err) {
          if (err) throw err;
        })
      };