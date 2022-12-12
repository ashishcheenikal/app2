import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import LiveChat from "./LiveChat";
import "./style.css";

export default function MeetingTemplate({
  detailMeeting,
  slug,
  userID,
  userName,
  audioInput,
  audioOutput,
  video,
  setAudioInput,
  setAudioOutput,
  setVideo,
  setMuteAudio,
  setMuteCamera,
  muteAudio,
  muteCamera,
}) {
  const [visibleChat, setVisibleChat] = useState(false);

  const videoRef = useRef(null);

  function gotStream(stream) {
    window.stream = stream;
    videoRef.current.srcObject = window.stream;
  }

  function handleError(error) {
    console.log(
      "navigator.MediaDevices.getUserMedia error: ",
      error.message,
      error.name
    );
    if (error.name == "NotAllowedError") {
      Swal.fire(
        "Camera or Microphone Permission denied!",
        "Please change the settings!",
        "error"
      ).then((result) => {
        if (result.isConfirmed) {
          setTimeout(() => {
            start();
          }, 5000);
        }
      });
    } else {
      Swal.fire(`${error.message}!`, `${error.name}`, "error");
    }
  }

  function start() {
    if (window.stream) {
      window.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    const audioSource = audioInput[0]?.value;
    const videoSource = video[0]?.value;
    const constraints = {
      audio: { exact: audioSource, echoCancellation: true },
      video: {
        exact: videoSource,
        width: { exact: 1280 },
        height: { exact: 720 },
      },
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(gotStream)
      .catch(handleError);
  }
  useEffect(() => {
    start();
     window.stream.getTracks().forEach((track) => {
      if (track.kind == "audio") {
        console.log(muteAudio,"muteAudio")
        console.log(track.enabled, "track.enabled audio MeetingTemplate")
        track.enabled = muteAudio;
      }
      if (track.kind == "video") {
        console.log(muteCamera,"muteCamera")
         console.log(track.enabled, "track.enabled video MeetingTemplate")
        track.enabled = muteCamera;
      }
    });
    console.log(audioInput, "audioInput MeetingTemplate");
    console.log(audioOutput, "audioOutput MeetingTemplate");
    console.log(video, "video MeetingTemplate");
  }, []);

  const muteAudioFn = () => {
    console.log("muteAudio");
    window.stream.getTracks().forEach((track) => {
      if (track.kind == "audio") {
        track.enabled = !track.enabled;
        // setMuteAudio(track.enabled)
        console.log(track.enabled, "track.enabled audio");
      }
    });
  };
  const muteCameraFn = () => {
    console.log("muteCamera");
    window.stream.getTracks().forEach((track) => {
      if (track.kind == "video") {
        track.enabled = !track.enabled;
        // setMuteCamera(track.enabled)
        console.log(track.enabled, "track.enabled video");
      }
    });
  };
////////////////////Screen Sharing////////////////////

function handleSuccess(stream) {
  window.stream = stream;
  videoRef.current.srcObject = window.stream;
  // demonstrates how to detect that the user has stopped
  // sharing the screen via the browser UI.
  // stream.getVideoTracks()[0].addEventListener('ended', () => {
  //   console.log('The user has ended sharing the screen');
  // });
}


  const screenCapturing = () => {
    const options = {audio: false, video: true, cursor: true};
  // const displaySurface = 
  // if (displaySurface !== 'default') {
  //   options.video = {displaySurface};
  // }
  navigator.mediaDevices.getDisplayMedia(options)
      .then(handleSuccess, handleError);
  };

  return (
    <div>
      <div className="app-container">
        <div className="left-side">
          <div className="navigation">
            <Link className="nav-link icon">
              {/* <!-- Home icon --> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-home"
                viewBox="0 0 24 24"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <path d="M9 22V12h6v10" />
              </svg>
              {/* <!-- Home icon --> */}
            </Link>

            <Link
              className="nav-link icon"
              onClick={() => {
                setVisibleChat((prev) => !prev);
              }}
            >
              {/* <!-- comment icon --> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-message-square"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {/* <!-- comment icon --> */}
            </Link>
          </div>
        </div>
        <div className="app-main">
          <div className="video-call-wrapper">
            <video
              ref={videoRef}
              playsInline
              autoPlay
            />
          </div>

          <div className="video-call-actions">
            <button
              className="video-action-button mic"
              onClick={muteAudioFn}
            ></button>
            <button
              className="video-action-button camera"
              onClick={muteCameraFn}
            ></button>
            <button
              className="video-action-button screenCapturing"
              onClick={screenCapturing}
            ></button>
            <button className="video-action-button endcall">Leave</button>
          </div>
        </div>

        {/* <!-- Right Side --> */}
        <div className="right-side">
          <button className="btn-close-right">
            {/* <!-- Close Icon --> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="feather feather-x-circle"
              viewBox="0 0 24 24"
            >
              <defs></defs>
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M15 9l-6 6M9 9l6 6"></path>
            </svg>
            {/* <!-- Close Icon --> */}
          </button>
          <div className="chat-header"></div>
          {visibleChat && (
            <LiveChat
              detailMeeting={detailMeeting}
              slug={slug}
              userID={userID}
            />
          )}
        </div>
        <button className="expand-btn">
          {/* <!-- expand icon --> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-message-circle"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          {/* <!-- expand icon --> */}
        </button>
      </div>
      ; // <script src="script.js"></script>
    </div>
  );
}
