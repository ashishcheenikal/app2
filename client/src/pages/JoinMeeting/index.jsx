import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";
import Swal from "sweetalert2";
import MeetingTemplate from "./MeetingTemplate";

export default function JoinMeeting() {
  const [meeting, setMeeting] = useState(false);
  const navigate = useNavigate();
  const { slug } = useParams();
  console.log(slug);
  const meetingDetails = () => {
    return new Promise(async (res, rej) => {
      try {
        const result = await axios.get(`/meeting/${slug}`);
        res(result.data);
      } catch (error) {
        console.log("Message :", error.message);
      }
    });
  };

  useEffect(() => {
    meetingDetails().then((check) => {
      console.log(check, "check");
      if (check.success) {
        Swal.fire(
          "Joined the Meeting successfully",
          "Join Now!",
          "success"
        ).then((result) => {
          if (result.isConfirmed) {
           setMeeting(check.success)
          }
        });
      } else {
        Swal.fire(
          "You are not invited to this Meeting!",
          "Go Back to Home!",
          "error"
        ).then((result) => {
          if (result.isConfirmed) {
            navigate("/");
          }
        });
      }
    });
  }, []);

  return (
    <div>
     {meeting && <MeetingTemplate />}
    </div>
  );
  
}
