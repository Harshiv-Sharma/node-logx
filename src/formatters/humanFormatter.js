// human readable formatter for console output

import chalk from "chalk";

export function humanFormatter(info) {
  const ts = chalk.gray(info.timestamp);
  const lvl =
    info.level === "error" ? chalk.red(info.level) :
    info.level === "warn" ? chalk.yellow(info.level) :
    info.level === "debug" ? chalk.blue(info.level) :
    chalk.green(info.level);

  return `${ts} ${lvl}: ${info.message}`;
}
