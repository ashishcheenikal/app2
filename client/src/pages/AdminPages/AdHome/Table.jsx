// import { useState } from "react";
import { Link } from "react-router-dom";
// import AddMeeting from "../AddMeeting";

export default function Table() {
  // const [addMeeting, setAddMeeting] = useState(false);
  // console.log(addMeeting)
  return (
    <div>
      <div className="headWrap d-flex justify-content-between">
        <div className="card-header py-3">
          <h2 className="m-0 font-weight-bold text-primary">Meetings</h2>
        </div>
        <div className="AddMeeting mb-3 mr-3 ">
          <Link
            className="btn btn-primary p-2 shadow meet"
            to="/admin/AddMeeting"
          >
            Add New Meeting
          </Link>
        </div>
      </div>
      <div className="col-lg-12 mb-4">
        <div className="card shadow mb-4">
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col"className="text-center">#</th>
                  <th scope="col"className="text-center">Name Of Meeting</th>
                  <th scope="col"className="text-center">Host</th>
                  <th scope="col"className="text-center">Participants</th>
                  <th scope="col" className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="text-center" scope="row">1</th>
                  <td className="text-center">Mark</td>
                  <td className="text-center">Otto</td>
                  <td className="text-center">@mdo</td>
                  <td
                    className="action d-flex justify-content-around"
                    
                  >
                    <div className="edit btn btn-primary">Edit</div>
                    <div className="delete btn btn-danger">Delete</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
