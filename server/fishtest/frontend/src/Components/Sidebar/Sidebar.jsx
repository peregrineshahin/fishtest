import React, { useEffect, useState } from "react";

function Sidebar() {
  return (
    <>
      <aside className="mainnavbar ps-lg-1">
        <div
          className="offcanvas-lg offcanvas-start"
          id="leftsidebar"
          aria-labelledby="leftsidebarOffcanvasLabel"
        >
          <div className="offcanvas-header border-bottom">
            <h5 className="offcanvas-title" id="leftsidebarOffcanvasLabel">
              Fishtest
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
              data-bs-target="#leftsidebar"
            ></button>
          </div>
          <div className="offcanvas-body pt-lg-2">
            <nav className="links w-100">
              <ul className="links-nav list-unstyled mb-0 pb-3 pb-md-2 pe-lg-1">
                <li className="links-group">
                  <strong className="links-heading d-flex w-100 align-items-center fw-semibold">
                    Tests
                  </strong>
                  <ul className="list-unstyled fw-normal small">
                    <li>
                      <a href="/tests" className="links-link rounded">
                        Overview
                      </a>
                    </li>
                    <li>
                      <a
                        href="/tests/finished?ltc_only=1"
                        className="links-link rounded"
                      >
                        LTC
                      </a>
                    </li>
                    <li>
                      <a
                        href="/tests/finished?success_only=1"
                        className="links-link rounded"
                      >
                        Greens
                      </a>
                    </li>
                    <li>
                      <a
                        href="/tests/finished?yellow_only=1"
                        className="links-link rounded"
                      >
                        Yellows
                      </a>
                    </li>
                  </ul>
                </li>

                <li>
                  <hr className="my-1" />
                </li>

                <li className="links-group">
                  <strong className="links-heading d-flex w-100 align-items-center fw-semibold">
                    Fishtest
                  </strong>
                  <ul className="list-unstyled fw-normal small">
                    <li>
                      <a href="/contributors" className="links-link rounded">
                        Contributors
                      </a>
                    </li>
                    <li>
                      <a
                        href="/contributors/monthly"
                        className="links-link rounded"
                      >
                        Top Month
                      </a>
                    </li>
                    <li>
                      <a href="/actions" className="links-link rounded">
                        Events
                      </a>
                    </li>
                    <li>
                      <a href="/user_management" className="links-link rounded">
                        Users
                      </a>
                    </li>
                    <li>
                      <a href="/workers/show" className="links-link rounded">
                        Blocked Workers
                      </a>
                    </li>
                  </ul>
                </li>

                <li>
                  <hr className="my-1" />
                </li>

                <li className="links-group">
                  <strong className="links-heading d-flex w-100 align-items-center fw-semibold">
                    Stockfish
                  </strong>
                  <ul className="list-unstyled fw-normal small">
                    <li>
                      <a
                        href="https://stockfishchess.org/download/"
                        target="_blank"
                        rel="noopener"
                        className="links-link rounded release"
                      >
                        Official Releases
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://github.com/official-stockfish/Stockfish/releases?q=prerelease%3Atrue"
                        target="_blank"
                        rel="noopener"
                        className="links-link rounded release"
                      >
                        Prerelease
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://stockfishchess.org/get-involved/"
                        target="_blank"
                        rel="noopener"
                        className="links-link rounded get-involved"
                      >
                        Contribute
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://github.com/official-stockfish/Stockfish/wiki/Regression-Tests"
                        target="_blank"
                        rel="noopener"
                        className="links-link rounded regression"
                      >
                        Progress
                      </a>
                    </li>
                    <li>
                      <a href="/nns" className="links-link rounded">
                        NN Repo
                      </a>
                    </li>
                  </ul>
                </li>

                <li>
                  <hr className="my-1" />
                </li>

                <li className="links-group">
                  <strong className="links-heading d-flex w-100 align-items-center fw-semibold">
                    Resources
                  </strong>
                  <ul className="list-unstyled fw-normal small">
                    <li>
                      <a
                        href="https://discord.gg/awnh2qZfTT"
                        target="_blank"
                        rel="noopener"
                        className="links-link rounded discord"
                      >
                        Discord
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://github.com/official-stockfish/fishtest/wiki"
                        target="_blank"
                        rel="noopener"
                        className="links-link rounded wiki"
                      >
                        Fishtest Wiki
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://github.com/official-stockfish/Stockfish/wiki"
                        target="_blank"
                        rel="noopener"
                        className="links-link rounded wiki"
                      >
                        Stockfish Wiki
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://github.com/official-stockfish/nnue-pytorch/wiki"
                        target="_blank"
                        rel="noopener"
                        className="links-link rounded wiki"
                      >
                        NN Trainer Wiki
                      </a>
                    </li>
                    <li>
                      <a href="/sprt_calc" className="links-link rounded">
                        SPRT Calc
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://hxim.github.io/Stockfish-Evaluation-Guide/"
                        target="_blank"
                        rel="noopener"
                        className="links-link rounded eval-guide"
                      >
                        Eval Guide
                      </a>
                    </li>
                  </ul>
                </li>

                <li>
                  <hr className="my-1" />
                </li>

                <li className="links-group">
                  <strong className="links-heading d-flex w-100 align-items-center fw-semibold">
                    Development
                  </strong>
                  <ul className="list-unstyled fw-normal small">
                    <li>
                      <a
                        href="https://github.com/official-stockfish/Stockfish"
                        target="_blank"
                        rel="noopener"
                        className="links-link rounded stockfish-repo"
                      >
                        Stockfish
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://github.com/official-stockfish/fishtest"
                        target="_blank"
                        rel="noopener"
                        className="links-link rounded"
                      >
                        Fishtest
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://github.com/official-stockfish/nnue-pytorch"
                        target="_blank"
                        rel="noopener"
                        className="links-link rounded"
                      >
                        NN Trainer
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://github.com/official-stockfish/books"
                        target="_blank"
                        rel="noopener"
                        className="links-link rounded"
                      >
                        Books
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
