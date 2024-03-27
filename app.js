import inquirer from 'inquirer';
import fs from 'fs';

const notesFilePath = 'notes.json';

// Function to load notes from file
function loadNotes() {
  try {
    const data = fs.readFileSync(notesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Function to save notes to file
function saveNotes(notes) {
  fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));
}

// Function to add a new note
function addNote() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of the note:'
    },
    {
      type: 'input',
      name: 'content',
      message: 'Enter the content of the note:'
    }
  ]).then(answers => {
    const notes = loadNotes();
    notes.push({ title: answers.title, content: answers.content });
    saveNotes(notes);
    console.log('Note added successfully!');
  });
}

// Function to view all notes
function viewNotes() {
  const notes = loadNotes();
  if (notes.length === 0) {
    console.log('No notes found.');
    return;
  }
  notes.forEach(note => {
    console.log(`Title: ${note.title}`);
    console.log(`Content: ${note.content}`);
    console.log('----------------------');
  });
}

// Function to update a note by title
function updateNote() {
  const notes = loadNotes();
  const titles = notes.map(note => note.title);
  inquirer.prompt([
    {
      type: 'list',
      name: 'title',
      message: 'Select the note you want to update:',
      choices: titles
    },
    {
      type: 'input',
      name: 'content',
      message: 'Enter the updated content of the note:'
    }
  ]).then(answers => {
    const index = notes.findIndex(note => note.title === answers.title);
    if (index !== -1) {
      notes[index].content = answers.content;
      saveNotes(notes);
      console.log('Note updated successfully!');
    } else {
      console.log('Note not found.');
    }
  });
}

// Main menu prompt
function mainMenu() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: 'Choose an option:',
      choices: ['Add a note', 'View all notes', 'Update a note', 'Exit']
    }
  ]).then(answer => {
    switch (answer.option) {
      case 'Add a note':
        addNote();
        break;
      case 'View all notes':
        viewNotes();
        break;
      case 'Update a note':
        updateNote();
        break;
      case 'Exit':
        console.log('Goodbye!');
        break;
    }
  });
}

// Entry point
mainMenu();
