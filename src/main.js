let notes = [];
const addBtnNote = document.getElementById("addBtnNote");
const noteDialog = document.getElementById("noteDialog");
const closeDialogBtn = document.getElementById("closeDialogBtn");
const cancelBtn = document.getElementById("cancelBtn");
const title = document.querySelector("#title-input");

const closeDialog = () => {
  noteDialog.classList.add("hidden");
  title.value = "";
  document.getElementById("label-content").value = "";
};

if (addBtnNote && noteDialog && closeDialogBtn) {
  addBtnNote.addEventListener("click", () => {
    noteDialog.classList.remove("hidden");
    title.focus();
  });

  closeDialogBtn.addEventListener("click", closeDialog);

  // Handle cancel button
  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeDialog);
  }
} else {
  alert("One or more elements not found");
}

// Close the dialog when clicking outside the dialog content
if (noteDialog) {
  noteDialog.addEventListener("click", (e) => {
    if (e.target === noteDialog) {
      noteDialog.classList.add("hidden");
      console.log("Dialog closed by clicking outside");
    }
  });

  // Alternative method - stop propagation on dialog content
  const dialogContent = noteDialog.querySelector("div > div");
  if (dialogContent) {
    dialogContent.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
}

function saveNote(e) {
  e.preventDefault();

  const title = document.querySelector("#title").value.trim();
  const content = document.querySelector("#content").value.trim();

  notes.unshift({
    id: generatedId(),
    title: title,
    content: content,
  });

  saveNote();
}

function generatedId() {
  return Date.now.toString();
}

