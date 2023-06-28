const inquirer = require('inquirer');
const questions = [
    {
        type: 'list',
        message: '',
        name: '',
        choices: [],
    }
]

const prompt_questions = () => {
    inquirer
    .prompt(questions)
    .then((answers) => {
     console.log(answers);
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
};

//call prompt questions
prompt_questions ()