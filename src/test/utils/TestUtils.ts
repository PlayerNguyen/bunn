import { existsSync, rm, rmSync } from "fs";

async function getBunDirectory(): Promise<string | undefined> {
  return process.env.BUN_INSTALL;
}

async function removeBun(): Promise<void> {
  const bunDirectory = await getBunDirectory();
  if ((await hasBunDirectory()) && bunDirectory !== undefined) {
    rmSync(bunDirectory, { force: true, recursive: true });
  }
}

async function hasBunDirectory() {
  let bunDirectory = await getBunDirectory();
  return bunDirectory !== undefined && existsSync(bunDirectory);
}

async function installBun() {}

export const testUtils = {
  bun: {
    removeBun,
    hasBunDirectory,
    getBunDirectory,
  },
};
