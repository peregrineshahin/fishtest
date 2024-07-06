<%inherit file="base.mak"/>

<link
  rel="stylesheet"
  href="/css/flags.css?v=${cache_busters['css/flags.css']}"
  integrity="sha384-${cache_busters['css/flags.css']}"
  crossorigin="anonymous"
>

<h2>Stockfish Testing Queue</h2>

% if page_idx == 0:
  <div class="mw-xxl">
    <div class="row g-3 mb-3">
      <div class="col-6 col-sm">
        <div class="card card-lg-sm text-center">
          <div class="card-header text-nowrap" title="Cores">Cores</div>
          <div class="card-body">
            <h4 class="card-title mb-0 monospace">${cores}</h4>
          </div>
        </div>
      </div>
      <div class="col-6 col-sm">
        <div class="card card-lg-sm text-center">
          <div class="card-header text-nowrap" title="Nodes per second">Nodes / sec</div>
          <div class="card-body">
            <h4 class="card-title mb-0 monospace">${f"{nps / (1000000 + 1):.0f}"}M</h4>
          </div>
        </div>
      </div>
      <div class="col-6 col-sm">
        <div class="card card-lg-sm text-center">
          <div class="card-header text-nowrap" title="Games per minute">Games / min</div>
          <div class="card-body">
            <h4 class="card-title mb-0 monospace">${games_per_minute}</h4>
          </div>
        </div>
      </div>
      <div class="col-6 col-sm">
        <div class="card card-lg-sm text-center">
          <div class="card-header text-nowrap" title="Time remaining">Time remaining</div>
          <div class="card-body">
            <h4 class="card-title mb-0 monospace">${pending_hours}h</h4>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    let fetchedMachinesBefore = false;
    let machinesSkeleton = null;
    let machinesBody = null;
    async function handleRenderMachines(){
        await DOMContentLoaded();
        machinesBody = document.getElementById("machines");
        if (!machinesSkeleton) {
          machinesSkeleton = document.querySelector("#machines .ssc-wrapper").cloneNode(true);
        }
        const machinesButton = document.getElementById("machines-button");
        machinesButton?.addEventListener("click", async () => {
          await toggleMachines();
        })
        if (${str(machines_shown).lower()})
          await renderMachines();
      }

    function handleMachinesGrouping() {
      document.querySelectorAll('.group-row').forEach(function(row) {
        row.addEventListener('click', function() {
          let groupKey = this.dataset.groupKey;
          let groupBy = this.dataset.groupBy;
          fetchText('/tests/machines_grouped/' + groupBy)
            .then(response => response.json())
            .then(data => {
              
              toggleView('details');
            })
            .catch(error => console.error('Error fetching group details:', error));
        });
      });

      document.getElementById('back-button').addEventListener('click', function () {
        toggleView('summary');
      });

      document.getElementById('group-by-select').addEventListener('change', function () {
        debugger;
        let groupBy = this.value;
        fetchText('/tests/machines_grouped/' + groupBy)
          .then(data => {
            debugger;
          })
          .catch(error => console.error('Error fetching machines group:', error));
      });
      
      function updateSummaryView(items_summary, groupBy) {
        let tbody = document.getElementById('summary-tbody');
        tbody.innerHTML = ''; // Clear the current contents

        if (!items_summary.length) {
          let noItemsRow = document.createElement('tr');
          noItemsRow.id = 'no-items';
          let noItemsCell = document.createElement('td');
          noItemsCell.colSpan = 4;
          noItemsCell.textContent = 'No items found';
          noItemsRow.appendChild(noItemsCell);
          tbody.appendChild(noItemsRow);
          return;
        }

        items_summary.forEach(item => {
          let row = document.createElement('tr');
          row.className = 'group-row';
          row.dataset.groupKey = item.group_key;
          row.dataset.groupBy = groupBy;

          let cells = [
            item.group_key,
            item.cores,
            item.machines,
          ];

          cells.forEach(cellContent => {
            let td = document.createElement('td');
            td.textContent = cellContent;
            row.appendChild(td);
          });

          row.addEventListener('click', function() {
            let groupKey = this.dataset.groupKey;
            let groupBy = this.dataset.groupBy;
            fetch('/tests/machines_grouped' + groupBy + '/' + encodeURIComponent(groupKey))
              .then(response => response.json())
              .then(data => {
                toggleView('details');
              })
              .catch(error => console.error('Error fetching group details:', error));
          });

          tbody.appendChild(row);
        });
      }

      function toggleView(view) {
        const summaryView = document.getElementById('summary-view');
        const detailsView = document.getElementById('details-view');

        if (view === 'details') {
          summaryView.style.display = 'none';
          detailsView.style.display = 'block';
        } else {
          summaryView.style.display = 'block';
          detailsView.style.display = 'none';
        }
      }
    };

    async function renderMachines() {
      await DOMContentLoaded();
      if (fetchedMachinesBefore) {
        return Promise.resolve();
      }
      try {
        if (document.querySelector("#machines .retry")) {
          machinesBody.replaceChildren(machinesSkeleton);
        }
        const html = await fetchText("/tests/machines_grouped/username");
        machinesBody.replaceChildren();
        machinesBody.insertAdjacentHTML("beforeend", html);
        handleMachinesGrouping();
        const machinesTbody = document.querySelector("#machines tbody");
        let newMachinesCount = machinesTbody?.childElementCount;

        if (newMachinesCount === 1) {
          const noMachines = document.getElementById("no-machines");
          if (noMachines) newMachinesCount = 0;
        }

        const countSpan = document.getElementById("workers-count");
        countSpan.textContent = `Workers - ${"${newMachinesCount}"} machines`;
        fetchedMachinesBefore = true;
      } catch (error) {
        console.log("Request failed: " + error);
        machinesBody.replaceChildren();
        createRetryMessage(machinesBody, renderMachines);
      }
    }

    async function toggleMachines() {
      const button = document.getElementById("machines-button");
      const active = button.textContent.trim() === "Hide";
      if (active) {
        button.textContent = "Show";
      }
      else {
        button.textContent = "Hide";
        await renderMachines();
      }

      document.cookie =
        "machines_state" + "=" + button.textContent.trim() + "; max-age=${60 * 60}; SameSite=Lax";
    }

    handleRenderMachines();
  </script>

  <h4>
    <a id="machines-button" class="btn btn-sm btn-light border"
      data-bs-toggle="collapse" href="#machines" role="button" aria-expanded="false"
      aria-controls="machines">
      ${'Hide' if machines_shown else 'Show'}
    </a>
    <span id="workers-count">
      Workers - ${machines_count} machines
    </span>
  </h4>
  <%
    height = str(machines_count * 37) + "px"
    min_height = str(37) + "px"
    max_height = str(34.7) + "vh"
  %>
  <section id="machines"
      class="overflow-auto ${'collapse show' if machines_shown else 'collapse'}">
      <div class="ssc-card ssc-wrapper">
        <div class="ssc-head-line"></div>
        <div
          class="ssc-square"
          style="height: clamp(${min_height}, ${height}, ${max_height});">
          </div>
      </div>
  </div>
% endif

<%include file="run_tables.mak"/>
