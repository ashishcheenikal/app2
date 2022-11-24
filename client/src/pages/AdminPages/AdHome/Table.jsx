import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../axios";
import moment from "moment";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";

export default function Table() {
  const navigate = useNavigate();
  const [allMeeting, setAllMeeting] = useState([]);
  const [pageCount, setPageCount] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  let limit = 3;

  const getMeetings = async (currentPage) => {
    const res = await axios.get(
      `/admin/GetAllMeeting?page=${currentPage}&limit=${limit}`
    );
    console.log(res.data.data);
    const totalCount = res.data.data.totalCount;
    setPageCount(Math.ceil(totalCount / limit));
    if (res.data.data.results.length < 0) {
      <h2>No Meetings Scheduled till this</h2>;
    } else {
      setAllMeeting(res.data.data.results);
    }
  };
  useEffect(() => {
    getMeetings(currentPage);
  }, [currentPage]);

  const cancelMeeting = async (id) => {
    await axios.post(`/admin/CancelMeeting/${id}`);
  };
  const handlePageClick = async (data) => {
    console.log(data.selected, "dataSelected");
    setCurrentPage(data.selected + 1);
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
            <table className="table">
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
              {allMeeting?.map((value, i) => {
                return (
                  <tbody key={i}>
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
                );
              })}
            </table>

            <ReactPaginate
              previousLabel={"previous"}
              nextLabel={"next"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"pagination justify-content-center"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              breakClassName={"page-item"}
              breakLinkClassName={"page-link"}
              activeClassName={"active"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
