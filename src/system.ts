import { spawnSync } from "child_process";
import { window } from "vscode";

/**
 * Check whether or not the bun is existing on the platform by 
 * executing a new terminal process `bun`.
 * 
 * @returns true if the bun is existing, false otherwise
 * 
 */
export function hasBun(): boolean {
  let bunProcess = spawnSync("bun");

  return bunProcess.output !== null && bunProcess.output.length !== 0;
}

/**
 * Install a bun by
 * running a script `curl -fsSL https://bun.sh/install | bash`
 * inside a Integrated Terminal. Then show the version information
 * after finished installed
 */
export function installBun(): void {
  // execute curl -fsSL https://bun.sh/install | bash
  const terminal = window.createTerminal("Install bun");
  terminal.sendText("curl -fsSL https://bun.sh/install | bash");
  terminal.sendText("exit");
  terminal.show();

  window.onDidCloseTerminal((_terminal) => {
    // Successfully install bun
    if (terminal === _terminal && _terminal.exitStatus?.code === 0) {
      const version = getBunVersion();
      window.showInformationMessage(
        `Successfully install bun with version ${version}`
      );
    }
  });
}

/**
 * Getting bun version from command `bun version`.
 * @returns a bun version as semver format
 * @throws when bun is not installed
 */
export function getBunVersion() {
  let bunProcess = spawnSync("bun", ["--version"]);
  if (bunProcess.output === null) {
    throw new Error("Bun is not installed");
  }
  return bunProcess.output[1];
}
