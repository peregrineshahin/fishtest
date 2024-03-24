import { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Context } from "../../Components/Context/Context";
import Machines from "../../Components/Machines/Machines";
import RunTable from "../../Components/RunTable/RunTable";
import Card from "../../Components/Card/Card";

const fetchHome = async () => {
  const response = await fetch("http://172.23.43.179/api/tests");

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

function Home() {
  const context = useContext(Context);

  const { data, error, isLoading } = useQuery("home", fetchHome);

  useEffect(() => {
    if (data) {
      context.setTests(data);
    }
  }, [data, context]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching tests:", error.message);
    }
  }, [error]);

  const [showNotification, setShowNotification] = useState(false);
  const [cards, setCards] = useState([]);

  return (
    <div className="row">
      {showNotification && (
        <div className="flash-message mt-3">
          <div
            id="fallback_div"
            className="alert alert-success alert-dismissible alert-success-non-transparent fixed-top"
          >
            <span id="fallback">Notification!</span>
            <button
              type="button"
              id="fallback_button"
              className="btn-close"
              aria-label="Close"
            ></button>
          </div>
        </div>
      )}
      <h2>Stockfish Testing Queue</h2>
      {cards && (
        <div className="mw-xxl">
          <div className="row g-3 mb-3">
            {[
              { Cores: context.tests.cores },
              { "Nodes / sec": context.tests.nps },
              { "Games / min": context.tests.games_per_minute },
              { "Time remaining": context.tests.pending_hours },
            ].map((card, index) => {
              const label = Object.keys(card)[0];
              return (
                <Card key={index} cardName={label} cardContent={card[label]} />
              );
            })}
          </div>
        </div>
      )}
      <Machines machinesCount={context.tests.machines_count} />
      {context.tests != {} &&
        [
          {
            tableId: "pending",
            label: "Pending approval",
            content: context.tests.runs?.pending.filter((run) => !run.approved),
            alt: "No tests pending approval",
          },
          {
            tableId: "paused",
            label: "Paused",
            content: context.tests.runs?.pending.filter((run) => run.approved),
            alt: "No paused tests",
          },
          {
            tableId: "failed",
            label: "Failed",
            content: context.tests.failed_runs,
            alt: "No failed tests on this page",
          },
          {
            tableId: "active",
            label: "Active",
            content: context.tests.runs?.active,
          },
          {
            tableId: "finished",
            label: "Finished",
            content: context.tests.finished_runs,
            alt: "No finished tests yet",
          },
        ].map((runTable, index) => {
          return (
            <RunTable
              key={index}
              tableId={runTable.tableId}
              tableName={runTable.label}
              tableContent={runTable.content}
              alt={runTable.alt}
            />
          );
        })}
    </div>
  );
}

export default Home;
