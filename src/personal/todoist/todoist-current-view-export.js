// Run from JavaScript Console.
function main() {
  const tasksText = Array
    .from(
      document.getElementsByClassName('task_item_content_text'),
      task => (task.textContent))
    .join('\n');

  // Need permission to write directly to clipboard (?)
  // const success = await navigator.clipboard.writeText(tasksText);

  window.alert(tasksText);

  // Select alert text, copy to clipboard.
  // Won't work in Firefox, may work in Chrome.
  const range = document.createRange();
  range.selectNode(document.querySelector('.text_holder'));

  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();

  // Copy via console.
  copy(tasksText);
}

main();
