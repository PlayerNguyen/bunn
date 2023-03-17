import * as open from "open";
import { platform } from "os";
import * as vscode from "vscode";
import { installBunAsProcess } from "./bunHook";

/**
 * Warning if the platform is win32 (Windows) since the
 * bun is currently not supporting Windows OS
 */
export function warningWindowsPlatform() {
  if (platform() === "win32") {
    vscode.window
      .showWarningMessage(
        "Bun JS is currently not working on Windows system.",
        "Follow this issue",
        "Hide"
      )
      .then((value) => {
        if (value === "Follow this issue") {
          open("https://github.com/oven-sh/bun/issues/43");
        }
      });
  }
}

export function suggestInstallBun() {
  vscode.window
    .showInformationMessage(
      `Bun is not found on your device, click to install or using Bun: Install bun from Command Palette`,
      `Install`
    )
    .then(async (value) => {
      if (value === "Install") {
        await installBunAsProcess();
      }
    });
}
