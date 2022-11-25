import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import axios from "../../axios"
import ReactPaginate from "react-paginate";
import axios from 'axios';


export default function Table() {
    const navigate = useNavigate();
  const [allMeeting, setAllMeeting] = useState([]);
  const [pageCount, setPageCount] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  let limit = 3;
  const getMeetings = async (currentPage) => {
    const token = sessionStorage.getItem("userData")
    console.log(token,"token");
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/GetAllMeeting?page=${currentPage}&limit=${limit}`,
      { headers: {Authorization : `${token}`}}
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
  const handlePageClick = async (data) => {
    setCurrentPage(data.selected + 1);
  };
  return (
    <div>
        <div className="headWrap d-flex justify-content-between">
        <div className="card-header py-3">
          <h2 className="m-0 font-weight-bold text-primary">Meetings</h2>
        </div>
        {/* <div className="AddMeeting mb-3 mr-3">
          <Link className="btn btn-primary p-2 shadow " to="/admin/AddMeeting">
            Add New Meeting
          </Link>
        </div> */}
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
                  {/* <th scope="col" className="text-center">
                    Participants
                  </th> */}
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
                      {/* <td className="text-center" key={i + 1}>
                        {value.participants.map((data, i) => {
                          return (
                            <div
                              className="testName"
                              key={i}
                            >{`${data.firstName} ${data.lastName}`}</div>
                          );
                        })}
                      </td> */}
                      <td className="text-center">
                        {moment(value.scheduledTime).format(
                          "DD/MM/YYYY - HH:MM A"
                        )}
                      </td>
                      <td className="text-center">{value.status}</td>
                      <td className="action d-flex justify-content-around">
                        <div className="btn btn-success">
                          <span
                            onClick={() => {
                              navigate(`/meeting/${value.slug}`);
                            }}
                          >JOIN
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
  )
}
 