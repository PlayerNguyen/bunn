import { window } from "vscode";

/**
 * Spawn a new terminal and execute scripts
 * @param title a title to create terminal
 * @param script a script to send to terminal
 * @returns a created terminal
 */
export function spawnScriptOnTerminal(title: string, script: string[]) {
  let terminal = window.createTerminal(title);

  script.forEach((value) => {
    terminal.sendText(value);
  });

  terminal.show();

  return terminal;
}
