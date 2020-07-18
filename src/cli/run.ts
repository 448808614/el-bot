import { CAC } from "cac";
import { fork, exec } from "child_process";
import { resolve } from "path";

interface WorkerOptions {
  "--"?: string[];
}

function createWorker(options: WorkerOptions) {
  const child = fork(resolve(__dirname, "worker"), [], {
    execArgv: options["--"],
  });

  child.on("exit", (code) => {
    if (code && code >= 0) process.exit(code);
    createWorker(options);
  });
}

export default function (cli: CAC) {
  cli
    .command("run [file]", "Start a el-bot")
    .alias("start")
    .option("--debug", "Debug mode")
    .action((file, options) => {
      process.env.EL_CONFIG_FILE = file || "";
      createWorker(options);
    });
}
