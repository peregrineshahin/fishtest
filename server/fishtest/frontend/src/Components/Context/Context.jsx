import { createContext, useState } from "react";
import { getCookie } from "../../Utils/Utils";

const Context = createContext();

const ContextProvider = ({ children }) => {
  const cookieTheme = getCookie("theme");
  const [theme, setTheme] = useState(cookieTheme ? cookieTheme : "light");
  const [tests, setTests] = useState({});
  const [machines, setMachines] = useState([]);
  const [showMachines, setShowMachines] = useState(false);
  const [fetchedMachinesBefore, setFetchedMachinesBefore] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [showTasks, setShowTasks] = useState(false);
  const [fetchedTasksBefore, setFetchedTasksBefore] = useState(false);
  return (
    <Context.Provider
      value={{
        theme,
        setTheme,
        tests,
        setTests,
        machines,
        setMachines,
        showMachines,
        setShowMachines,
        fetchedMachinesBefore,
        setFetchedMachinesBefore,
        tasks,
        setTasks,
        showTasks,
        setShowTasks,
        fetchedTasksBefore,
        setFetchedTasksBefore,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, ContextProvider };
