import * as core from '@actions/core';
import { exec, ExecOptions } from '@actions/exec';
import * as tc from '@actions/tool-cache';
import { wait } from './wait';

const GO_VERSION = '1.21.5';

async function downloadDeadcode() {
  const goPath = await tc.downloadTool(
    `https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz`
  );
  const goExtractedDir = await tc.extractTar(goPath, process.env.HOME);
  const options: ExecOptions = {};
  await exec(
    `${goExtractedDir}/go/bin/go`,
    ['install', 'golang.org/x/tools/cmd/deadcode@latest'],
    options
  );
  core.addPath(`${goExtractedDir}/go/bin`);
}

async function runDeadcode() {
  await exec('deadcode');
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds');

    await downloadDeadcode();
    await runDeadcode();

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Waiting ${ms} milliseconds ...`);

    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString());
    await wait(parseInt(ms, 10));
    core.debug(new Date().toTimeString());

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
