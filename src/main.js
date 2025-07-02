let notes = [];
const addBtnNote = document.getElementById("addBtnNote");
const noteDialog = document.getElementById("noteDialog");
const closeDialogBtn = document.getElementById("closeDialogBtn");
const cancelBtn = document.getElementById("cancelBtn");
const createFirstNote = document.getElementById("createFirstNote");
const title = document.querySelector("#title");
const content = document.querySelector("#content");
const notesContainer = document.getElementById("notesCardsIn");
const emptyState = document.getElementById("emptyState");

// Function to open dialog
const openDialog = () => {
  noteDialog.classList.remove("hidden");
  title.focus();
};

// Function to close dialog
const closeDialog = () => {
  noteDialog.classList.add("hidden");
  title.value = "";
  content.value = "";
};

// Function to generate unique ID
function generateId() {
  return Date.now().toString();
}

// Function to save notes to localStorage
function saveNotesToStorage() {
  localStorage.setItem("quickNotes", JSON.stringify(notes));
}

// Function to load notes from localStorage
function loadNotesFromStorage() {
  const savedNotes = localStorage.getItem("quickNotes");
  if (savedNotes) {
    notes = JSON.parse(savedNotes);
  }
}

// Function to toggle empty state visibility
function toggleEmptyState() {
  if (notes.length === 0) {
    emptyState.classList.remove("hidden");
    notesContainer.classList.add("hidden");
  } else {
    emptyState.classList.add("hidden");
    notesContainer.classList.remove("hidden");
  }
}

// Function to create note HTML
function createNoteHTML(note) {
  return `
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex flex-col transition-all duration-300 hover:-translate-y-1" data-id="${note.id}">
      <h3 class="font-semibold text-lg mb-2 dark:text-white">${note.title}</h3>
      <p class="text-slate-700 dark:text-slate-200 flex-1 mb-4">${note.content}</p>
      <div class="flex justify-end mt-4 gap-2">
        <button class="edit-btn text-blue-600 hover:underline text-sm" data-id="${note.id}">Edit</button>
        <button class="delete-btn text-red-500 hover:underline text-sm" data-id="${note.id}">Delete</button>
      </div>
    </div>
  `;
}

// Function to render all notes
function renderNotes() {
  notesContainer.innerHTML = "";
  notes.forEach((note) => {
    notesContainer.innerHTML += createNoteHTML(note);
  });

  // Add event listeners to edit and delete buttons
  addNoteEventListeners();
  toggleEmptyState();
}

// Function to add event listeners to note buttons
function addNoteEventListeners() {
  // Delete buttons
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const noteId = e.target.getAttribute("data-id");
      deleteNote(noteId);
    });
  });

  // Edit buttons
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const noteId = e.target.getAttribute("data-id");
      editNote(noteId);
    });
  });
}

// Function to save new note
function saveNote(e) {
  e.preventDefault();

  const titleValue = title.value.trim();
  const contentValue = content.value.trim();

  if (!titleValue || !contentValue) {
    alert("Please fill in both title and content!");
    return;
  }

  const newNote = {
    id: generateId(),
    title: titleValue,
    content: contentValue,
    createdAt: new Date().toISOString(),
  };

  notes.unshift(newNote); // Add to beginning of array
  saveNotesToStorage();
  renderNotes();
  closeDialog();

  console.log("Note saved:", newNote);
}

// Function to delete note
function deleteNote(noteId) {
  if (confirm("Are you sure you want to delete this note?")) {
    notes = notes.filter((note) => note.id !== noteId);
    saveNotesToStorage();
    renderNotes();
    console.log("Note deleted:", noteId);
  }
}

// Function to edit note
function editNote(noteId) {
  const note = notes.find((note) => note.id === noteId);
  if (note) {
    title.value = note.title;
    content.value = note.content;
    openDialog();

    // Remove the old note (will be replaced when saved)
    notes = notes.filter((n) => n.id !== noteId);
    console.log("Editing note:", note);
  }
}

// Event Listeners
if (addBtnNote && noteDialog && closeDialogBtn) {
  // Header "Add Note" button
  addBtnNote.addEventListener("click", openDialog);

  // Empty state "Create Your First Note" button
  if (createFirstNote) {
    createFirstNote.addEventListener("click", openDialog);
  }

  closeDialogBtn.addEventListener("click", closeDialog);

  // Handle cancel button
  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeDialog);
  }
} else {
  console.warn("One or more elements not found");
}

// Close dialog when clicking outside
if (noteDialog) {
  noteDialog.addEventListener("click", (e) => {
    if (e.target === noteDialog) {
      closeDialog();
      console.log("Dialog closed by clicking outside");
    }
  });
}

// Handle form submission
document.addEventListener("DOMContentLoaded", () => {
  // Load existing notes
  loadNotesFromStorage();
  renderNotes();

  // Find the Add Note button in the form
  const addNoteBtn = document.querySelector(
    'button[type="button"]:not(#cancelBtn)'
  );
  if (addNoteBtn) {
    addNoteBtn.addEventListener("click", saveNote);
  }

  console.log("App initialized with", notes.length, "notes");
});
