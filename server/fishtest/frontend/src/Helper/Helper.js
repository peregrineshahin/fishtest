function testsRepo(run) {
  return (
    run.args.tests_repo || "https://github.com/official-stockfish/Stockfish"
  );
}

function masterDiffUrl(run) {
  return `${testsRepo(run)}/compare/master...${run.args.resolved_base.substring(
    0,
    10
  )}`;
}

export function diffUrl(run) {
  if (run.args.spsa) {
    return masterDiffUrl(run);
  } else {
    return `${testsRepo(run)}/compare/${run.args.resolved_base.substring(
      0,
      10
    )}...${run.args.resolved_new.substring(0, 10)}`;
  }
}
