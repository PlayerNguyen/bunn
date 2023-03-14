import { existsSync } from "fs";
import {
  window,
  QuickPickItem,
  WorkspaceFolder,
  Uri,
  workspace,
  QuickPickOptions,
} from "vscode";
import { PackageJsonScripts, PackageScanner } from "./packageScanner";
import { spawnScriptOnTerminal } from "./spawnScriptOnTerminal";

/**
 * Determine a package.json from workspaces and show
 * a selection on that list.
 *
 * @param workspaces a list of workspaces to select
 */
export default function scriptSelection(
  workspaces: readonly WorkspaceFolder[]
): void {
  // For single workspace
  if (workspaces.length === 1) {
    const firstWorkspace = workspaces[0];
    openQuickPickScriptFromWorkspace(firstWorkspace);

    return;
  }

  // Multiple workspaces
  showWorkspaceQuickPick(
    { canPickMany: false, title: "Select workspace to run" },
    workspaces
  ).then((value) => {
    // If the value is undefined
    if (value === undefined) {
      throw new Error(`cannot select workspace`);
    }

    // const workspace = workspaces.find((e) => e.name === value.label);
    const workspace = workspaces.find(
      (workspace) => workspace.name === value.label
    );
    if (workspace === undefined) {
      window.showErrorMessage(`Workspace not found ${value.label}`);
      return;
    }

    // If
    openQuickPickScriptFromWorkspace(workspace);
  });
}

function showScriptsQuickPick(
  options?: QuickPickOptions,
  packageJsonScripts?: PackageJsonScripts
) {
  // If the package json script not found
  if (!packageJsonScripts) {
    throw new Error("Unable to find package json scripts");
  }

  const quickPick = window.showQuickPick(
    !packageJsonScripts
      ? []
      : packageJsonScripts.keys().map((item) => {
          return {
            label: item,
            description: packageJsonScripts.get(item),
          } as QuickPickItem;
        }),
    options
  );

  return quickPick;
}

function showWorkspaceQuickPick(
  options?: QuickPickOptions,
  workspaces?: readonly WorkspaceFolder[]
) {
  // Workspace list is not found
  if (!workspaces) {
    throw new Error("Workspaces not defined");
  }

  return window.showQuickPick(
    workspaces.map((workspace: WorkspaceFolder) => {
      return {
        label: workspace.name,
        description: workspace.uri.fsPath,
      } as QuickPickItem;
    }),
    options
  );
}

function openQuickPickScriptFromWorkspace(workspaceFolder: WorkspaceFolder) {
  // If the package.json was not existed
  const packageJsonPathUri = Uri.joinPath(workspaceFolder.uri, "package.json");
  if (!existsSync(packageJsonPathUri.fsPath)) {
    window.showErrorMessage(
      `The package.json file not found in workspace ${workspaceFolder.name}.`
    );
    return;
  }

  // Read the package.json
  workspace.fs.readFile(packageJsonPathUri).then((value: Uint8Array) => {
    const packageScanner = new PackageScanner(JSON.parse(value.toString()));
    const scripts = packageScanner.getScripts();

    // Show a quick pick with selection
    showScriptsQuickPick(
      {
        canPickMany: false,
        placeHolder: "Search any script...",
        title: workspaceFolder.name,
      },
      scripts
    ).then((v) => {
      if (v === undefined) {
        // Cancel the selection
        console.log(`Cancel script select`);

        return;
      }

      console.log(`Executing 'bun run ${v.label}'`);
      spawnScriptOnTerminal(`Run "${v.label}"`, [
        // scripts.get(v.label) as string,
        `bun run ${v.label}`,
      ]);
    });
  });
}
