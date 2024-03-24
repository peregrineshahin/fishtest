export function workerName(workerInfo, short) {
  let name = `${workerInfo.username}-${workerInfo.concurrency}cores`;
  const { unique_key: uuid, modified } = workerInfo;

  if (uuid.length !== 0) {
    const uuidSplit = uuid.split("-");
    if (uuidSplit.length >= 1) {
      name += `-${uuidSplit[0]}`;
    }
    if (uuidSplit.length >= 2 && !short) {
      name += `-${uuidSplit[1]}`;
    }
  }

  if (modified && !short) {
    name += "*";
  }

  return name;
}

export function diffDate(isoDate) {
  const utcDate = new Date(isoDate);
  const currentDate = new Date();

  if (!isNaN(utcDate.getTime())) {
    const diffMilliseconds = currentDate.getTime() - utcDate.getTime();
    return new Date(diffMilliseconds);
  } else {
    return new Date(8640000000000000); // Equivalent to Python's timedelta.max
  }
}

export function deltaDate(diff) {
  const maxMilliseconds = 8640000000000000; // Equivalent to Python's timedelta.max in milliseconds

  if (diff === maxMilliseconds) {
    return "Never";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const timeValues = [days, hours, minutes];
  const timeUnits = ["day", "hour", "minute"];

  for (let i = 0; i < timeValues.length; i++) {
    if (timeValues[i] >= 1) {
      return `${timeValues[i]} ${
        timeValues[i] > 1 ? timeUnits[i] + "s" : timeUnits[i]
      } ago`;
    }
  }

  return "seconds ago";
}

export function parseStyle(htmlStyle) {
  const stylePairs = htmlStyle.split(";").filter(Boolean);
  const styleObject = {};
  stylePairs.forEach((pair) => {
    const [property, value] = pair.split(":");
    styleObject[property.trim()] = value.trim();
  });
  return styleObject;
}

// Gets from the bowser the value of a saved cookie
export function getCookie(cookieName) {
  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("="))
    .find(([name]) => name === cookieName)?.[1];
}

export function setTheme(theme) {
  // Remember the theme for 30 days
  document.cookie = `theme=${theme}; path=/; max-age=${
    30 * 24 * 60 * 60
  }; SameSite=Lax`;
}

// Gets prefered theme based on user's system
export function mediaTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
