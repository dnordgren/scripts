// Run from JavaScript Console.
const tasks = document.getElementsByClassName('task_item_content_text');
const output = [];
for (let task of tasks) {
  output.push(task.textContent);
}

alert(output.join("\n"));
