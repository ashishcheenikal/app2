import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "../../../axios";
import TextField from "@mui/material/TextField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";



export default function EditForm({id}) {
    const navigate = useNavigate();
  const [meeting, setMeeting] = useState([]);
  const [users, setUsers] = useState([]);
  const [host, setHost] = useState([]);
  const [participants, setParticipant] = useState([]);
  const [meetName, setMeetName] = useState("");
  const [currentDate, setCurrentData] = useState(new Date());

  const detailMeeting = async () => {
    const res = await axios.get(`/admin/DetailMeeting/${id}`);
    const resData = res.data.data;
    setMeeting(resData);
    return;
  };
  const allUsers = async () => {
    const res = await axios.get("/admin/AllUsers");
    const resData = res.data.data;
    const userList = resData.filter((value) => {
      return value.admin !== true;
    });
    setUsers(userList);
    return;
  };

  useEffect(() => {
    allUsers();
    detailMeeting();
  }, []);
  const options = users.map((value) => {
    return { value: value._id, label: `${value.firstName} ${value.lastName}` };
  });
  const defaultValue = meeting.host?.map((value)=>{
    return { value: value._id, label: `${value.firstName} ${value.lastName}` };
  })
  {let result = Array.isArray(defaultValue)
    console.log(defaultValue,"isArray")
  }
  const handleChangeHost = (e) => {
    setHost(
      e.map((value) => {
        return value.value;
      })
    );
  };

  const handleChangeParti = (e) => {
    setParticipant(
      e.map((value) => {
        return value.value;
      })
    );
  };

  const handleChange = (e) => {
    setMeetName(e.target.value);
  };

  const user = {
    meetName,
    host,
    participants,
    currentDate,
  };
  console.log(user,'final user')
  const editMeeting = async () => {
    const res = await axios.post(`/admin/EditMeeting/${id}`, { user });
    return res.data;
  };
  const SubmitHandler = async (e) => {
    e.preventDefault();
    // const res = await editMeeting();
    console.log("submitted")
    // if (res.success) {
    //   alert("Meeting Scheduled Successfully");
    // } else {
    //   alert("Error in Scheduling Meeting");
    // }
    // navigate("/admin/");
  };
console.log(host)
console.log(participants)
console.log(currentDate)
console.log(meetName)
  return (
    <div>
      <div className="container">
        <div className="headWrap d-flex justify-content-center">
          <div className="card-header py-5">
            <h2 className="m-0 font-weight-bold text-primary">
              Change Meeting Details
            </h2>
          </div>
        </div>
        <div className="card-body d-flex justify-content-center">
          <div className="row">
            <form
              action=""
              className="d-flex flex-column"
              style={{ width: "550px" }}
              onSubmit={SubmitHandler}
            >
              <label className="label" htmlFor="meetName">
                Enter the Name of the Meeting
              </label>
              <input
                className=""
                type="text"
                name="meetName"
                id="meetName"
                defaultValue={meeting.meetName}
                onChange={handleChange}
              />
              <label className="label" htmlFor="meetName">
                Select the Host fot the Meeting
              </label>
              <Select
                isMulti
                name="host"
                placeholder="Host.."
                defaultValue={[{value:'asdf',label:'asdf'}]}
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleChangeHost}
              />
              <label className="label" htmlFor="meetName">
                Select the Participants for Meeting
              </label>
              <Select
                isMulti
                name="participants"
                placeholder="Participants.."
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleChangeParti}
              />
              <label className="label" htmlFor="meetName">
                Schedule the Date and Time for the Meeting
              </label>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="DateTimePicker"
                  value={currentDate}
                  onChange={(newValue) => {
                    setCurrentData(newValue._d);
                  }}
                />
              </LocalizationProvider>
              <button
                type="submit"
                className="btn btn-primary mt-5 "
                style={{ width: "100px" }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
