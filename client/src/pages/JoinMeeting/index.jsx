import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";
import Swal from "sweetalert2";
import MeetingLandingPage from "./MeetingLandingPage";
import MeetingTemplate from "./MeetingTemplate";

export default function JoinMeeting() {
  const [meetingVisibility, setMeetingVisibility] = useState(false);
  const [detailMeeting, setDetailMeeting] = useState([]);
  const [audioInput, setAudioInput] = useState([]);
  const [audioOutput, setAudioOutput] = useState([]);
  const [video, setVideo] = useState([]);
  const [userID, setUserID] = useState("");
  const navigate = useNavigate();
  const { slug } = useParams();
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
      if (check.success) {
        setDetailMeeting(check.data);
        setUserID(check.userId);
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
      {meetingVisibility ? (
        <MeetingTemplate
          detailMeeting={detailMeeting}
          slug={slug}
          userID={userID}
          audioInput={audioInput}
          audioOutput={audioOutput}
          video={video}
          setAudioInput={setAudioInput}
          setAudioOutput={setAudioOutput}
          setVideo={setVideo}
        />
      ) : (
        <MeetingLandingPage
          setMeetingVisibility={setMeetingVisibility}
          audioInput={audioInput}
          audioOutput={audioOutput}
          video={video}
          setAudioInput={setAudioInput}
          setAudioOutput={setAudioOutput}
          setVideo={setVideo}
        />
      )}
    </div>
  );
}
