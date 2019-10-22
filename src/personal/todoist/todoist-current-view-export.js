// Run from JavaScript Console.
var tasksText = Array
  .from(
    document.getElementsByClassName('task_item_content_text'),
    task => (task.textContent))
  .join('\n');

window.alert(tasksText);

// Copy via console.
copy(tasksText);
