import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../axios";
import moment from "moment";
import Swal from "sweetalert2";

export default function Table() {
  const navigate = useNavigate();
  const [allMeeting, setAllMeeting] = useState([]);
  const [status, setStatus] = useState(false);
  const getMeetings = async () => {
    const res = await axios.get("/admin/GetAllMeeting");
    console.log(res.data.data);
    setAllMeeting(res.data.data);
  };
  useEffect(() => {
    getMeetings();
  }, [status]);

  const cancelMeeting = async (id) => {
    await axios.post(`/admin/CancelMeeting/${id}`);
  };

  return (
    <div>
      <div className="headWrap d-flex justify-content-between">
        <div className="card-header py-3">
          <h2 className="m-0 font-weight-bold text-primary">Meetings</h2>
        </div>
        <div className="AddMeeting mb-3 mr-3">
          <Link className="btn btn-primary p-2 shadow " to="/admin/AddMeeting">
            Add New Meeting
          </Link>
        </div>
      </div>
      <div className="col-lg-12 mb-4">
        <div className="card shadow mb-4">
          <div className="card-body">
            {allMeeting.map((value, i) => {
              return (
                <table className="table" key={i}>
                  <thead>
                    <tr>
                      <th scope="col" className="text-center">
                        #
                      </th>
                      <th scope="col" className="text-center">
                        Name Of Meeting
                      </th>
                      <th scope="col" className="text-center">
                        Host
                      </th>
                      <th scope="col" className="text-center">
                        Participants
                      </th>
                      <th scope="col" className="text-center">
                        Scheduled Time
                      </th>
                      <th scope="col" className="text-center">
                        Status
                      </th>
                      <th scope="col" className="text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th className="text-center" scope="row">
                        {i + 1}
                      </th>
                      <td className="text-center">{value.meetName}</td>
                      <td className="text-center" key={i}>
                        {value.host.map((data, i) => {
                          return (
                            <div
                              className="testName"
                              key={i}
                            >{`${data.firstName} ${data.lastName}`}</div>
                          );
                        })}
                      </td>
                      <td className="text-center" key={i + 1}>
                        {value.participants.map((data, i) => {
                          return (
                            <div
                              className="testName"
                              key={i}
                            >{`${data.firstName} ${data.lastName}`}</div>
                          );
                        })}
                      </td>
                      <td className="text-center">
                        {moment(value.scheduledTime).format(
                          "DD/MM/YYYY - HH:MM A"
                        )}
                      </td>
                      <td className="text-center">{value.status}</td>
                      <td className="action d-flex justify-content-around">
                        <div className="edit btn btn-primary">
                          <span
                            onClick={() => {
                              navigate(`/admin/EditMeeting/${value._id}`);
                            }}
                          >
                            <i className="fas fa-edit"></i>
                          </span>
                        </div>
                        <div className="delete btn btn-danger">
                          <span
                            onClick={() => {
                              Swal.fire({
                                title: "Cancelling Meeting !",
                                text: "Do you want to cancel this Meeting?",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#DD6B55",
                                confirmButtonText: "Yes, I am sure!",
                                cancelButtonText: "No",
                                closeOnConfirm: false,
                                closeOnCancel: false,
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  Swal.fire(
                                    "Deleted!",
                                    "Meeting has been Cancelled.",
                                    "success"
                                  );
                                  cancelMeeting(value._id);
                                  setStatus(true);
                                }
                              });
                            }}
                          >
                            <i className="fa fa-trash"></i>
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
