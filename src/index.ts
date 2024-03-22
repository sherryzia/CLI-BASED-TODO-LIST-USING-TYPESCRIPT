import * as fs from 'fs';
import inquirer from 'inquirer';

const todoFilePath = 'todo.txt';

// Load tasks from file
function loadTasks(): string[] {
  try {
    const data = fs.readFileSync(todoFilePath, 'utf-8');
    return data.split('\n').filter(Boolean);
  } catch (error) {
    // If file doesn't exist, return an empty array
    return [];
  }
}

// Save tasks to file
function saveTasks(tasks: string[]): void {
  const data = tasks.join('\n');
  fs.writeFileSync(todoFilePath, data);
}

// Function to display tasks
function displayTasks(tasks: string[]): void {
  console.log('\nTasks:');
  tasks.forEach((task, index) => {
    console.log(`${index + 1}. ${task}`);
  });
  console.log('\n');
}

// Function to add a new task
async function addTask(tasks: string[]): Promise<string[]> {
  const { task } = await inquirer.prompt({
    type: 'input',
    name: 'task',
    message: 'Enter a new task:',
  });

  if (task.trim() === '') {
    console.log('You must write something!');
  } else {
    tasks.push(task);
    console.log(`Task added: ${task}`);
  }

  return tasks;
}

// Function to remove a task
async function removeTask(tasks: string[]): Promise<string[]> {
  const choices = tasks.map((task, index) => ({ name: `${index + 1}. ${task}`, value: index }));
  const { taskIndex } = await inquirer.prompt({
    type: 'list',
    name: 'taskIndex',
    message: 'Select a task to remove:',
    choices,
  });

  const removedTask = tasks.splice(taskIndex, 1);
  console.log(`Task removed: ${removedTask[0]}`);

  return tasks;
}

// Main CLI loop
async function main() {
  let tasks = loadTasks();

  while (true) {
    const { action } = await inquirer.prompt({
      type: 'list',
      name: 'action',
      message: 'Choose an action:',
      choices: ['View Tasks', 'Add Task', 'Remove Task', 'Exit'],
    });

    switch (action) {
      case 'View Tasks':
        displayTasks(tasks);
        break;
      case 'Add Task':
        tasks = await addTask(tasks);
        break;
      case 'Remove Task':
        tasks = await removeTask(tasks);
        break;
      case 'Exit':
        console.log('Exiting Todo List. Have a nice day!');
        saveTasks(tasks);
        process.exit(0);
    }
  }
}

// Start the CLI
main();
