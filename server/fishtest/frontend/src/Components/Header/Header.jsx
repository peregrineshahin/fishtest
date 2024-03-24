import { useContext, useEffect, useState } from "react";
import { Context } from "../../Components/Context/Context";

function Header() {
  const context = useContext(Context);

  function handleThemeToggle(theme) {
    context.setTheme(theme);

    document.cookie = `theme=${theme}; path=/; max-age=${
      30 * 24 * 60 * 60
    }; SameSite=Lax`;
  }

  return (
    <>
      <header className="navbar navbar-expand-lg sticky-top shadow-sm">
        <nav
          className="container-fluid flex-wrap flex-lg-nowrap"
          aria-label="Main navigation"
        >
          <button
            className="navbar-toggler p-2"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#leftsidebar"
            aria-controls="leftsidebar"
            aria-expanded="false"
            aria-label="Toggle left sidebar navigation"
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          <a
            className="navbar-brand p-0 me-0 me-lg-2 d-flex align-items-center"
            href="/"
            aria-label="Bootstrap"
          >
            <div className="d-inline me-lg-2">
              <img className="brand-logo" src="/public/img/stockfish.png"></img>
            </div>
            <p className="d-none d-lg-inline h-5 mb-0">
              Stockfish Testing Framework
            </p>
          </a>

          <button
            className="navbar-toggler d-flex d-lg-none order-3 p-2"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#rightsidebar"
            aria-controls="rightsidebar"
            aria-expanded="false"
            aria-label="Toggle user navigation"
          >
            <i className="fa-solid fa-ellipsis"></i>
          </button>

          <div
            className="offcanvas-lg offcanvas-end flex-grow-1"
            id="rightsidebar"
            aria-labelledby="rightsidebarOffcanvasLabel"
            data-bs-scroll="true"
          >
            <div className="offcanvas-header px-4 pb-0">
              <h5 className="offcanvas-title" id="rightsidebarOffcanvasLabel">
                User
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
                data-bs-target="#rightsidebar"
              ></button>
            </div>

            <div className="offcanvas-body p-4 pt-0 p-lg-0">
              <hr className="d-lg-none" />

              <ul className="navbar-nav flex-row flex-wrap ms-md-auto">
                <li className="nav-item col-6 col-lg-auto order-lg-2">
                  <a
                    className="nav-link py-2 px-0 px-lg-2"
                    href="/tests/user/Peregrine"
                    title="My Tests"
                  >
                    <i className="fa-solid fa-flask d-inline me-2 mx-lg-1"></i>
                    <span className="d-inline d-lg-none">My Tests</span>
                  </a>
                </li>
                <li className="nav-item col-6 col-lg-auto order-lg-1">
                  <a
                    className="nav-link py-2 px-0 px-lg-2"
                    href="/tests/run"
                    title="New Test"
                  >
                    <i className="fa-solid fa-plus d-inline me-2 mx-lg-1"></i>
                    <span className="d-inline d-lg-none">New Test</span>
                  </a>
                </li>
                <li className="nav-item col-6 col-lg-auto order-lg-0">
                  <a
                    className="nav-link py-2 px-0 px-lg-2"
                    href="/upload"
                    title="Upload Neural Network"
                  >
                    <i className="fa-solid fa-cloud-arrow-up d-inline me-2 mx-lg-1"></i>
                    <span className="d-inline d-lg-none">NN Upload</span>
                  </a>
                </li>
                <li className="nav-item py-1 col-12 col-lg-auto order-lg-2">
                  <div className="vr d-none d-lg-flex h-100 mx-lg-2"></div>
                  <hr className="d-lg-none" />
                </li>
                <li className="nav-item col-6 col-lg-auto order-lg-2">
                  <a className="nav-link py-2 px-0 px-lg-2" href="/user">
                    <i className="fa-solid fa-user d-inline d-lg-none me-2"></i>
                    Profile
                  </a>
                </li>
                <li className="nav-item col-6 col-lg-auto order-lg-2">
                  <a
                    className="nav-link py-2 px-0 px-lg-2"
                    href="/logout"
                    id="logout"
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket d-inline d-lg-none me-2"></i>
                    Logout
                  </a>
                </li>
                <li className="nav-item py-1 col-12 col-lg-auto order-lg-2">
                  <div className="vr d-none d-lg-flex h-100 mx-lg-2"></div>
                  <hr className="d-lg-none" />
                </li>
                <li
                  className="nav-item col-6 col-lg-auto order-lg-2"
                  id="change-color-theme"
                >
                  {context.theme === "light" && (
                    <div
                      id="moon"
                      onClick={() => handleThemeToggle("dark")}
                      className="nav-link py-2 px-0 px-lg-2"
                      title="Dark Theme"
                    >
                      <i className="fa fa-moon"></i>
                      <span className="d-inline d-lg-none ms-2">
                        Dark Theme
                      </span>
                    </div>
                  )}
                  {context.theme === "dark" && (
                    <div
                      id="sun"
                      onClick={() => handleThemeToggle("light")}
                      className="nav-link py-2 px-0 px-lg-2"
                      title="Light Theme"
                    >
                      <i className="fa fa-sun"></i>
                      <span className="d-inline d-lg-none ms-2">
                        Light Theme
                      </span>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
