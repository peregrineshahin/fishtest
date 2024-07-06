<%!
  from fishtest.util import delta_date
  from fishtest.util import diff_date
  from fishtest.util import worker_name
%>

<div>
  <label for="group-by-select">Group by:</label>
  <select id="group-by-select">
    <option value="username" data-group-key="username" ${"selected" if group_by == "username" else ""}>Username</option>
    <option value="python_version" data-group-key="python_version" ${"selected" if group_by == "python_version" else ""}>Python Version</option>
    <!-- Add other grouping options here -->
  </select>
</div>

<div id="summary-view">
  <table class="table table-striped table-sm">
    <thead class="sticky-top">
      <tr>
        <th>Group Key</th>
        <th>Total Cores</th>
        <th>Total Machines</th>
        <th>Last Updated</th>
      </tr>
    </thead>
    <tbody id="summary-tbody">
      % for item in items_summary:
        <%
          diff_time = diff_date(item["last_updated"])
          delta_time = delta_date(diff_time)
        %>
        <tr class="group-row" data-group-key="${item['group_key']}" data-group-by="${group_by}">
          <td>${item['group_key']}</td>
          <td>${item['cores']}</td>
          <td>${item['machines']}</td>
          <td>${delta_time}</td>
        </tr>
      % endfor
      % if not items_summary:
        <tr id="no-items">
          <td colspan=4>No items found</td>
        </tr>
      % endif
    </tbody>
  </table>
</div>

<div id="details-view" style="display:none;">
  <button id="back-button" class="btn btn-primary mb-3">&larr; Back to Summary</button>
  <div id="machine-details"></div>
</div>
