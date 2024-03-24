import { useContext, useEffect } from "react";
import { Context } from "../Context/Context";
import { getCookie, setTheme, mediaTheme } from "../../Utils/Utils";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

import "./theme.scss";
import "./theme.dark.scss";

function Layout(props) {
  const context = useContext(Context);

  useEffect(() => {
    if (!getCookie("theme")) {
      setTheme(mediaTheme());
    }
    try {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", () => setTheme(mediaTheme()));
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className={context.theme}>
      <Header />
      <div className="container-fluid layout px-0">
        <Sidebar />
        <main className="main order-1">
          <div className="container-fluid">
            <div className="flash-message mt-3">
              <div
                id="fallback_div"
                className="alert alert-success alert-dismissible alert-success-non-transparent fixed-top"
                style={{ display: "none" }}
              >
                <span id="fallback">Notification!</span>
                <button
                  type="button"
                  id="fallback_button"
                  className="btn-close"
                  aria-label="Close"
                ></button>
              </div>
              <div
                id="error_div"
                className="alert alert-danger alert-dismissible alert-danger-non-transparent fixed-top"
                style={{ display: "none" }}
              >
                <span id="error"></span>
                <button
                  type="button"
                  id="error_button"
                  className="btn-close"
                  aria-label="Close"
                ></button>
              </div>
            </div>
            {props.children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
