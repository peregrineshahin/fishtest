import { useContext, useEffect, useState } from "react";
import { Context } from "../../Components/Context/Context";

function DeleteButton(props) {
  const { run } = props;
  return (
    <td style={{ width: "1%" }} className="run-button run-deny">
      <div className="dropdown">
        <button
          type="submit"
          className="btn btn-danger btn-sm"
          data-bs-toggle="dropdown"
        >
          <i className="fas fa-trash-alt"></i>
        </button>
        <div className="dropdown-menu" role="menu">
          <form
            action="/tests/delete"
            method="POST"
            style={{ display: "inline" }}
            onSubmit="handleStopDeleteButton('${run['_id']}'); return true;"
          >
            <input
              type="hidden"
              name="csrf_token"
              value="${request.session.get_csrf_token()}"
            />
            <input type="hidden" name="run-id" value={run["_id"]} />
            <button type="submit" className="btn btn-danger btn-mini">
              Confirm
            </button>
          </form>
        </div>
      </div>
    </td>
  );
}

export default DeleteButton;
