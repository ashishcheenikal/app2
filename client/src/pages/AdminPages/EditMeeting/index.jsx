import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../AdHome/Header";
import SideBar from "../AdHome/SideBar";
import EditForm from "./editForm";

export default function EditMeeting() {
    const navigate = useNavigate();
    const {id} = useParams();
    const handleLogout = () => {
      sessionStorage.removeItem("adminData");
      sessionStorage.clear()
      navigate("/admin/login");
    };
  return (
    <div>
      <div id="wrapper">

        <SideBar/>

        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Header/>

            <div className="container-fluid">
              <EditForm id={id}/>
            </div>
          </div>

          <footer className="sticky-footer bg-white">
            <div className="container my-auto">
              <div className="copyright text-center my-auto">
                <span>Copyright &copy; Your Website 2020</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
      <a className="scroll-to-top rounded" href="#page-top">
        <i className="fas fa-angle-up"></i>
      </a>

      <div
        className="modal fade"
        id="logoutModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Ready to Leave?
              </h5>
              <button
                className="close"
                type="button"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              Select "Logout" below if you are ready to end your current
              session.
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                type="button"
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
