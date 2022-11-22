import { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { Link } from 'react-router-dom'
import Select from 'react-select';
import axios from '../../../axios'
import TextField from '@mui/material/TextField';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';




export default function MeetingForm() {
  const [users, setUsers] = useState([])
  const [host, setHost] = useState([])
  const [participant, setParticipant] = useState([])
  const [meetName, setMeetName] = useState('')
  const [currentDate, setCurrentData] = useState(new Date());
  const allUsers = async () => {
    const res = await axios.get("/admin/AllUsers")
    const resData = res.data.data;
    const userList = resData.filter((value) => {
      return value.admin !== true
    })
    setUsers(userList)
    return;
  }
  useEffect(() => {
    allUsers();
  }, [])
  const options = users.map((value) => {
    return { value: value._id, label: value.firstName }
  })
  const { register, handleSubmit, formState: { error } } = useForm({
    resolver: yupResolver()
  })
  const handleChangeHost = (e) => {
    console.log(e, 'as')
    setHost(e.map((value) => {
      return { ...host, 'host': value.value }
    }))
  }
  const handleChangeParti = (e) => {
    console.log(e, 'df')
    setParticipant(e.map((value) => {
      return { ...participant, 'participant': value.value }
    }))
  }
  const handleChange = (e) => {
    setMeetName({ ...meetName, [e.target.name]: e.target.value })
  }
  const SubmitHandler = () => {

  }
  console.log(host, 'host')
  console.log(participant, "participant")
  console.log(meetName, "meetName")
  console.log(currentDate, "date")
  return (
    <div>
      <div className="container">
        <div className="headWrap d-flex justify-content-center">
          <div className="card-header py-5">
            <h2 className="m-0 font-weight-bold text-primary">Schedule New Meetings</h2>
          </div>
        </div>
        <div className="card-body d-flex justify-content-center">
          <div className="row">
            <form action="" className='d-flex flex-column' style={{ width: "550px" }}>
              <label className='label' htmlFor='meetName'>Enter the Name of the Meeting</label>
              <input className='' type="text" name='meetName' id='meetName' onChange={handleChange} />
              <label className='label' htmlFor='meetName'>Select the Host fot the Meeting</label>
              <Select
                isMulti
                name="host"
                placeholder="Host.."
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleChangeHost}
              />
              <label className='label' htmlFor='meetName'>Select the Participants for Meeting</label>
              <Select
                isMulti
                name="participants"
                placeholder="Participants.."
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleChangeParti}
              />
              <label className='label' htmlFor='meetName'>Schedule the Date and Time for the Meeting</label>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="DateTimePicker"
                  // value={value}
                  onChange={(newValue) => {
                    setCurrentData(newValue);
                  }}
                />
              </LocalizationProvider>
              <button type='submit' className='btn btn-primary mt-5 ' style={{ width: "100px" }}>Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
