import "./table.css";

export default function Table() {
  return (
    <div>
      <div className="btnWrap">
        <div className="AddMeeting mb-4">
          <button className="btn btn-primary p-2 shadow meet">
            Add New Meeting
          </button>
        </div>
      </div>
      <div className="col-lg-12 mb-4">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Projects</h6>
          </div>
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Host</th>
                  <th scope="col">Participants</th>
                  <th scope="col">slug</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                  <td
                    className="action d-flex "
                    style={{ justifyContent: "space-around" }}
                  >
                    <div className="edit btn btn-primary">Edit</div>
                    <div className="delete btn btn-danger">Delete</div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">2</th>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                </tr>
                <tr>
                  <th scope="row">3</th>
                  <td>Larry</td>
                  <td>the Bird</td>
                  <td>@twitter</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
