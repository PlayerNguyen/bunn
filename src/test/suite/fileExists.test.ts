import { expect } from "chai";
import * as mocha from "mocha";
import { homedir } from "os";
import path = require("path");
import { Uri, workspace } from "vscode";
import { exists } from "../../fileExists";

suite("[Unit] fileExists - ", () => {
  const testUri = Uri.file(path.join(homedir(), "cost.dir"));
  mocha.before(async () => {
    expect(await exists(testUri)).to.be.false;
  });

  mocha.after(async () => {
    workspace.fs.delete(testUri);
  });

  test("Should return exactly exists state", async () => {
    expect(await exists(testUri)).to.be.false;

    await workspace.fs.writeFile(testUri, Buffer.from("Hello World", "utf-8"));

    expect(await exists(testUri)).to.be.true;
  });
});
