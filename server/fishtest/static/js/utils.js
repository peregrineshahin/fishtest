function workerName(workerInfo, short = false) {
  // A user-friendly name for the worker.
  let username = workerInfo.username;
  let cores = String(workerInfo.concurrency);
  let uuid = workerInfo.unique_key;
  let modified = workerInfo.modified || false;
  let name = username + "-" + "cores" + "cores";

  if (uuid.length !== 0) {
    let uuidSplit = uuid.split("-");
    if (uuidSplit.length >= 1) {
      name += "-" + uuidSplit[0];
    }
    if (uuidSplit.length >= 2 && !short) {
      name += "-" + uuidSplit[1];
    }
  }

  if (modified && !short) {
    name += "*";
  }

  return name;
}

function clipLong(text, maxLength = 20) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  } else {
    return text;
  }
}