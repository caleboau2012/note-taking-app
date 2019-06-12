var NoteApp = {
  notes: [],
  restore: () => {
    const data = localStorage.getItem("data");
    NoteApp.notes = data === null ? [] : JSON.parse(data);
  },
  saveNotes: () => {
    localStorage.setItem("data", JSON.stringify(NoteApp.notes));
  },
  init: () => {
    NoteApp.restore();
    NoteApp.render();

    $("#create-note").click(() => {
      NoteApp.openEditor($("#create-note-title").val());
    });

    $("#editor-save-note").click(() => {
      NoteApp.saveNote();
    });

    $(document)
      .delegate(".note", "click", function() {
        const title = $(this)
          .find(".note-title")
          .text()
          .trim();
        const id = $(this)
          .find(".note-title")
          .attr("data-id");
        const message = $(this)
          .find(".note-body")
          .text()
          .trim();
        const color = $(this)
          .find(".note-color")
          .val();

        NoteApp.openEditor(title, id, message, color);
      })
      .delegate(".note-color", "click", e => {
        e.stopPropagation();
      })
      .delegate(".note-color", "change", function() {
        const id = $(this).attr("data-id");
        const color = this.value;

        NoteApp.updateColor(id, color);
      })
      .delegate(".note-delete", "click", function(e) {
        e.stopPropagation();
        const id = $(this).attr("data-id");

        NoteApp.deleteNote(id);
      });
  },
  deleteNote: id => {
    if (confirm("Are you sure? This cannot be reversed")) {
      const index = NoteApp.notes.findIndex(n => n.id === id);

      NoteApp.notes.splice(index, 1);
      NoteApp.saveNotes();
      NoteApp.render();
    }
  },
  updateColor: (id, color) => {
    const index = NoteApp.notes.findIndex(n => n.id === id);
    NoteApp.notes[index].color = color;

    NoteApp.saveNotes();
    NoteApp.render();
  },
  openEditor: (title, id = "", message = "", color = "1") => {
    $("#editor-title")
      .attr("data-id", id)
      .val(title);
    $("#editor-body").val(message);
    $("#editor-color").val(color);
    $("#editorModal").modal("show");
  },
  saveNote: () => {
    const title = $("#editor-title").val();
    const body = $("#editor-body").val();
    const id = $("#editor-title").attr("data-id");
    const color = $("#editor-color").val();

    const note = {
      title,
      body,
      id,
      color
    };

    if (id === "") {
      note.id = Date.now() + "";
      NoteApp.notes.push(note);
    } else {
      const index = NoteApp.notes.findIndex(n => n.id === id);
      NoteApp.notes[index] = note;
    }

    NoteApp.saveNotes();
    NoteApp.render();
    $("#editorModal").modal("hide");
  },
  render: () => {
    let noteTemplate;
    $(".notes").empty();

    NoteApp.notes.map(note => {
      noteTemplate = $("#note-template").html();

      switch (note.color) {
        case "1":
          noteTemplate = noteTemplate
            .replace("{{color}}", "primary")
            .replace("{{color}}", "primary")
            .replace("{{1}}", "selected");
          break;
        case "2":
          noteTemplate = noteTemplate
            .replace("{{color}}", "success")
            .replace("{{color}}", "success")
            .replace("{{2}}", "selected");
          break;
        case "3":
          noteTemplate = noteTemplate
            .replace("{{color}}", "warning")
            .replace("{{color}}", "warning")
            .replace("{{3}}", "selected");
          break;
        case "4":
          noteTemplate = noteTemplate
            .replace("{{color}}", "danger")
            .replace("{{color}}", "danger")
            .replace("{{4}}", "selected");
          break;
      }

      noteTemplate = noteTemplate
        .replace("{{note-id}}", note.id)
        .replace("{{note-id}}", note.id)
        .replace("{{note-id}}", note.id)
        .replace("{{note-title}}", note.title)
        .replace("{{note-body}}", note.body);

      $(".notes").append(noteTemplate);
    });
  }
};

$(document).ready(NoteApp.init);
