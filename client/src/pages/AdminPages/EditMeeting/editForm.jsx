import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import Select from "react-select";
import AsyncSelect from 'react-select/async';
import axios from "../../../axios";
import TextField from "@mui/material/TextField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import moment from "moment";


export default function EditForm({ id }) {
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

    // const valueHost = meeting.host?.map((value) => {
    //   return { value: value._id, label: `${value.firstName} ${value.lastName}` };
    // })
    // setHost(valueHost)
    return;
  };
  // const allUsers = async () => {
  //   const res = await axios.get("/admin/AllUsers");
  //   const resData = res.data.data;
  //   const userList = resData.filter((value) => {
  //     return value.admin !== true;
  //   });
  //   setUsers(userList);
  //   return;
  // };

  useEffect(() => {
    // allUsers();
    detailMeeting();
  }, []);
  // const options = users?.map((value) => {
  //   return { value: value._id, label: `${value.firstName} ${value.lastName}` };
  // });
  // const valueHost = meeting.host?.map((value) => {
  //   return { value: value._id, label: `${value.firstName} ${value.lastName}` };
  // })
  const valueParticipants = meeting.participants?.map((value) => {
    return { value: value._id, label: `${value.firstName} ${value.lastName}` };
  })

  const handleChangeHost = (e) => {
    // setHost(
    //   e.map((value) => {
    //     return value.value;
    //   })
    // );
    setHost(e)
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

  const promiseOptions = (inputValue) =>
    new Promise(async (res, rej) => {
      const result = await axios.get("/admin/AllUsers");
      const resData = result.data.data;
      const users = resData.filter((value) => {
        return value.admin !== true;
      });
     
    const detailMeeting = await axios.get(`/admin/DetailMeeting/${id}`);
    const data = detailMeeting.data.data;
    setHost(data.host?.map((value) => {
      return { value: value._id, label: `${value.firstName} ${value.lastName}` };
    }))
    res(users?.map((value) => {
      return { value: value._id, label: `${value.firstName} ${value.lastName}` };
    }))
    });


  const user = {
    meetName,
    host,
    participants,
    currentDate,
  };
  const editMeeting = async () => {
    const res = await axios.post(`/admin/EditMeeting/${id}`, { user });
    return res.data;
  };
  const SubmitHandler = async (e) => {
    e.preventDefault();
    const res = await editMeeting();
    if (res.success) {
      alert("Changes Committed Successfully");
    } else {
      alert("Error in Changing Meeting Details");
    }
    navigate("/admin/");
  };
  console.log(host, "host state")
  console.log(participants, "participants")
  console.log(meetName, "participants")
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
              <AsyncSelect
                isMulti
                name="host"
                placeholder="Host.."
                defaultInputValue={host}
                loadOptions={promiseOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleChangeHost}
              />
              <label className="label" htmlFor="meetName">
                Select the Participants for Meeting
              </label>
              <AsyncSelect
                isMulti
                name="participants"
                placeholder="Participants.."
                defaultValue={valueParticipants}
                loadOptions={promiseOptions}
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
                  selected={meeting.scheduledTime
                    ? moment(meeting.scheduledTime).format('DD-MM-YYYY')
                    : null}
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
