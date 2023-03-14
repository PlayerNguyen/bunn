import { Uri, workspace } from "vscode";

/**
 * Check if the Uri file is exists or not.
 *
 * @param uri the uri file to test exists
 * @returns a promise resolve boolean that true if the file is exists, false otherwise
 */
export async function exists(uri: Uri) {
  try {
    await workspace.fs.stat(uri);
    return true;
  } catch {
    return false;
  }
}
