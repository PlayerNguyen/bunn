import * as vscode from "vscode";

import { suggestInstallBun, warningWindowsPlatform } from "./platform";
import { didBunInstalled, getBunVersion, installBunAsProcess } from "./bunHook";
import scriptSelection from "./scriptSelection";

export function activate(context: vscode.ExtensionContext) {
  // Bun debug
  console.log(`bun install env: ${process.env.BUN_INSTALL}`);

  // If the operating system is windows 32
  warningWindowsPlatform();

  /**
   * bunn.runFocusFile
   * Uses to run the focusing file
   */
  context.subscriptions.push(
    vscode.commands.registerCommand("bunn.runFocusFile", async () => {
      console.log(`Starting to run the bun...`);

      // If the bun is not found
      if (!(await didBunInstalled())) {
        suggestInstallBun();
        return;
      }

      const currentActiveTextEditor = vscode.window.activeTextEditor;

      // If no file was opened
      if (!currentActiveTextEditor) {
        vscode.window
          .showErrorMessage(
            "Not open any file to run the bun environment.",
            "Open"
          )
          .then((value) => {
            //  On click open button
            if (value === "Open") {
              vscode.window
                .showOpenDialog({
                  canSelectFiles: true,
                  canSelectFolders: false,
                  openLabel: "Open file",
                })
                .then((uris) => {});
            }
          });
        return;
      }

      const focusingFileName = currentActiveTextEditor.document.fileName;

      // Execute the bun with current file
      const terminal = vscode.window.createTerminal({
        name: "Run bun",
      });

      terminal.sendText(`bun "${focusingFileName}"`);
      terminal.show();
    })
  );

  /**
   * bunn.upgrade
   * Uses to upgrade a new version of bun
   */
  context.subscriptions.push(
    vscode.commands.registerCommand("bunn.upgrade", async () => {
      console.log("Running `bun upgrade`...");

      // If the bun is not found
      if (!(await didBunInstalled())) {
        suggestInstallBun();
        return;
      }

      // Upgrade bun using terminal
      const terminal = vscode.window.createTerminal({
        name: "Upgrade bun",
      });

      terminal.show();
      terminal.sendText("bun upgrade", true);
      terminal.sendText("sleep 2", true);
      terminal.sendText("exit", true);
    })
  );

  /**
   * bunn.version
   * Uses to get a version of bun that currently installed
   */
  context.subscriptions.push(
    vscode.commands.registerCommand("bunn.version", async () => {
      console.log("Running `bun version`...");

      // If the bun is not found
      if (!(await didBunInstalled())) {
        suggestInstallBun();
        return;
      }

      // Get bun version
      try {
        const bunVersion = await getBunVersion();
        vscode.window.showInformationMessage(
          `The current bun version is ${bunVersion}`
        );
      } catch (err: any) {
        return vscode.window.showErrorMessage(
          `Error to get bun version ${err.message}`
        );
      }
    })
  );

  /**
   * bunn.runProject
   * Scans for package.json in project workspace and show selection scripts that can runnable
   */
  context.subscriptions.push(
    vscode.commands.registerCommand("bunn.runProject", async () => {
      // If the bun is not found
      if (!(await didBunInstalled())) {
        suggestInstallBun();
        return;
      }

      // Determine the project package.json
      const currentWorkspaceFolders = vscode.workspace.workspaceFolders;
      if (currentWorkspaceFolders === undefined) {
        // TODO: turn to open workspace (later)
        vscode.window.showErrorMessage(`No workspace available.`);

        return;
      }

      // Display a script selection
      scriptSelection(currentWorkspaceFolders);
    })
  );

  /**
   * bunn.installBun
   * Installs bun if the platform has no bun installed
   */
  context.subscriptions.push(
    vscode.commands.registerCommand("bunn.installBun", async () => {
      // If the bun was install before
      if (await didBunInstalled()) {
        // Get version
        try {
          const bunVersion = await getBunVersion();
          return vscode.window.showInformationMessage(
            `Bun was already installed (version ${bunVersion})`
          );
        } catch (err: any) {
          return vscode.window.showErrorMessage(
            `Error to get bun version ${err.message}`
          );
        }
      }

      // Otherwise, run install bun as process
      await installBunAsProcess();
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
