import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import axios from "../../../axios";
import TextField from "@mui/material/TextField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const editFormSchema = yup.object().shape({
  meetName: yup.string().required("This field is required").min(5).max(30),
  host: yup.string().required("This field is required"),
  participants: yup.string().required("This field is required"),
});


export default function EditForm({ id }) {

  const navigate = useNavigate();
  const [meeting, setMeeting] = useState([]);
  const [host, setHost] = useState([]);
  const [participants, setParticipant] = useState([]);
  const [meetName, setMeetName] = useState("");
  const [currentDate, setCurrentData] = useState(new Date());
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editFormSchema),
  });

  const detailMeeting = async () => {
    const res = await axios.get(`/admin/DetailMeeting/${id}`);
    const resData = res.data.data;
    setMeeting(resData);
    return resData;
  };

  let limit = 30;

  useEffect(() => {
    detailMeeting();
  }, [])

  useEffect(() => {
    setHost(meeting.host?.map((value) => {
      return { value: value._id, label: `${value.firstName} ${value.lastName}` };
    }))
    setParticipant(meeting.participants?.map((value) => {
      return { value: value._id, label: `${value.firstName} ${value.lastName}` };
    }))
  }, [meeting])

  const handleChangeHost = (e) => {
    setHost(e);
  };

  const handleChangeParti = (e) => {
    setParticipant(e)
  };

  const handleChange = (e) => {
    setMeetName(e.target.value);
  };

  const promiseOptions = async (inputValue) => {
    const result = await axios.get(
      `/admin/AllUsers?key=${inputValue}&limit=${limit}`
    );
    const resData = result.data.data;
    const users = resData.results;
    return users?.map((value) => {
      return {
        value: value._id,
        label: `${value.firstName} ${value.lastName}`,
      };
    });
  };

  const user = {
    meetName,
    host: host?.map((value) => {
      return value.value;
    }),
    participants: participants?.map((value) => {
      return value.value;
    }),
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
                // {...register("meetName")}
              />
              {/* {errors.meetName ? (
                            <span className="text-red-900" style={{color:"red"}}>{errors.meetName.message}</span>
                          ) : (
                            <></>
                          )} */}
              <label className="label" htmlFor="host">
                Select the Host fot the Meeting
              </label>
              <AsyncSelect
                isMulti
                name="host"
                placeholder="Host.."
                value={host}
                loadOptions={promiseOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                // {...register("host")}
                onChange={handleChangeHost}
              />
              {/* {errors.host ? (
                            <span className="text-red-900" style={{color:"red"}}>{errors.host.message}</span>
                          ) : (
                            <></>
                          )} */}
              <label className="label" htmlFor="participants">
                Select the Participants for Meeting
              </label>
              <AsyncSelect
                isMulti
                name="participants"
                placeholder="Participants.."
                value={participants}
                loadOptions={promiseOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleChangeParti}
                // {...register("participants")}
              />
                {/* {errors.participants ? (
                              <span className="text-red-900" style={{color:"red"}}>{errors.participants.message}</span>
                            ) : (
                              <></>
                            )} */}
              <label className="label" htmlFor="DateTimePicker">
                Schedule the Date and Time for the Meeting
              </label>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="DateTimePicker"
                  value={currentDate}
                  selected={
                    meeting.scheduledTime
                      ? moment(meeting.scheduledTime).format("DD-MM-YYYY")
                      : null
                  }
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
