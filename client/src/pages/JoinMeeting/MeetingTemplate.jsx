import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  // const [muteCam, setMuteCam] = useState(false);
  // const [muteAud, setMuteAud] = useState(false);
  const videoRef = useRef(null); // for Rendering Self video
  const videoRef2 = useRef(null); // for Rendering Mixed video
  const [conference, setConference] = useState(
    new window.Owt.Conference.ConferenceClient()
  ); // conference state
  const [remoteStream, setRemoteStream] = useState([]); // for getting remote streams details (rendering remote streams as separate videos)
  const [publicationGlobal, setPublicationGlobal] = useState({})

  let localStream;
  let myId;
  let myRoom;
  let subscribeForward = false;
  let isSelf = false;
  // let publicationGlobal;

  //////////////////////////////// Intel® Collaboration Suite for WebRTC version 5.0 ///////////////////////////////////////////////////

  const room = "63a3f13e106dea69e54af02d";

  const mixStream = async (room, ID, view) => {
    let jsonPatch = [
      {
        op: "add",
        path: "/info/inViews",
        value: view,
      },
    ];
    await axios.patch(
      `https://mcu.spjain.org:3004/rooms/${room}/streams/${ID}`,
      jsonPatch
    );
  };

  const streamEnd = (id) => {
    const remainingStreams = remoteStream.filter((val) => {
      if (val.id !== id) {
        return val;
      }
    });
    setRemoteStream(remainingStreams);
  };

  const subscribeAndRenderVideo = (stream, from) => {
    console.log(from, "+-+-+-+-+-+-+-+-+-+-+-+");
    conference.subscribe(stream).then(
      (subscription) => {
        videoRef2.current.srcObject = stream.mediaStream;
        setRemoteStream((list) => [...list, stream]);
      },
      (err) => {
        console.log("subscribe failed", err);
      }
    );
    stream.addEventListener("ended", () => {
      // stream.id.stop();
      console.log(remoteStream, "remoteStreamremoteStreamremoteStream");
      streamEnd(stream.id);
    });
  };

  conference.addEventListener("streamadded", (event) => {
    console.log("A new stream is added ", event.stream.id);
    console.log(event, "event 55555555");
    isSelf = isSelf ? isSelf : event.stream.id !== publicationGlobal.id;
    isSelf && subscribeAndRenderVideo(event.stream, "FromEvent");

    // mixStream(myRoom, event.stream.id, "common");

    event.stream.addEventListener("ended", () => {
      console.log(event.stream.id + " is ended.");
    });
  });

  const createToken = async () => {
    const res = await axios.post(`${process.env.REACT_APP_INTEL_URL}tokens/`, {
      role: "presenter",
      room: room,
      user: "user",
    });
    return res.data;
  };

  const resFun = (response) => {
    const token = response;
    conference.join(token).then((resp) => {
      console.log(resp, "resp147147");
      myId = resp.self.id;
      myRoom = resp.id;
      console.log(myId, "myId");
      console.log(myRoom, "myRoom");
      isPublish(resp);
    });
  };

  const isPublish = (resp) => {
    let mediaStream;
    let stream = window.stream;
    console.log(stream, "stream that should be same");
    let publishOption = {
      audio: true,
      video: true,
    };
    console.log(stream, "steam120120");
    mediaStream = stream;
    let obj = {
      user: "AshishJoshy",
    };
    /// creating a local stream for publishing your video and audio streams
    localStream = new window.Owt.Base.LocalStream(
      mediaStream,
      new window.Owt.Base.StreamSourceInfo("mic", "camera"),
      obj
    );

    console.log(localStream, "localStream789789");

    videoRef.current.srcObject = stream; /// rendering selfVideo from stream

    /// publishing our stream by passing local video and publishOptions
    conference.publish(localStream, publishOption).then((publication) => {
      console.log(publication, "publication1231231232132");

      // publicationGlobal = publication;

      setPublicationGlobal(publication)

      mixStream(myRoom, publication.id, "common");

      publication.addEventListener("error", (err) => {
        console.log("Publication error: " + err.error.message);
      });
    });

    let streams = resp.remoteStreams;
    console.log(resp.remoteStreams, "resp.remoteStreams");

    for (const stream of streams) {
      if (!subscribeForward) {
        if (
          stream.source.audio === "mixed" ||
          stream.source.video === "mixed"
        ) {
          console.log(stream.mediaStream, "852852");
          subscribeAndRenderVideo(stream); // subscribing the video from room (other participants video which are published earlier)
        }
      } else if (stream.source.audio !== "mixed") {
        subscribeAndRenderVideo(stream, "fromRemoteResponse");
      }
    }
    console.log("Streams in conference:", streams.length);
    var participants = resp.participants;
    console.log("Participants in conference: " + participants.length);
  };

  window.onbeforeunload = function (event) {
    conference.leave();
    publicationGlobal.stop();
  };

  //////////////////////////////// Intel® Collaboration Suite for WebRTC version 5.0  [END] ////////////////////////////////////////////

  useEffect(() => {
    videoRef.current.srcObject = window.stream;
    console.log(window.stream, " window.stream 66666666");
    console.log(audioInput, "audioInput MeetingTemplate");
    console.log(audioOutput, "audioOutput MeetingTemplate");
    console.log(video, "video MeetingTemplate");
    console.log(muteAudio, "muteAudio MeetingTemplate");
    console.log(muteCamera, "muteCamera MeetingTemplate");
    createToken().then((res) => {
      resFun(res);
    });
    console.log(conference, "conference963963");
  }, []);

  const muteAudioFn = () => {
    console.log("muteAudio");
    // window.stream.getTracks().forEach((track) => {
    //   if (track.kind === "audio") {
    //     track.enabled = !track.enabled;
    //     setMuteAudio(track.enabled);
    //     console.log(track.enabled, "track.enabled audio");
    //   }
    // });
    if (muteAudio) {
      publicationGlobal.unmute("audio");
      setMuteAudio((prev) => !prev);
      console.log("publicationGlobal.unmute()")
    } else {
      publicationGlobal.mute("audio");
      setMuteAudio((prev) => !prev);
      console.log("publicationGlobal.mute()")
    }
  };
  const muteCameraFn = () => {
    console.log("muteCamera", );
    // window.stream.getTracks().forEach((track) => {
    //   if (track.kind === "video") {
    //     track.enabled = !track.enabled;
    //     setMuteCamera(track.enabled);
    //     console.log(track.enabled, "track.enabled video");
    //   }
    // });
    if (muteCamera) {
      publicationGlobal.unmute("video");
      setMuteCamera((prev) => !prev);
      console.log("publicationGlobal.unmute()")
    } else {
      publicationGlobal.mute("video");
      setMuteCamera((prev) => !prev);
      console.log("publicationGlobal.mute()")
    }
  };

  ////////////////////Screen Sharing////////////////////

  function handleError(error) {
    console.log(
      "navigator.MediaDevices.getUserMedia error: ",
      error.message,
      error.name
    );
    if (error.name === "NotAllowedError") {
      Swal.fire(
        "Camera or Microphone Permission denied!",
        "Please change the settings!",
        "error"
      ).then((result) => {
        if (result.isConfirmed) {
          setTimeout(() => {
            // start();
          }, 5000);
        }
      });
    } else {
      Swal.fire(`${error.message}!`, `${error.name}`, "error");
    }
  }

  const restart = () => {
    videoRef.current.srcObject = window.stream;
  };
  function handleSuccess(stream) {
    videoRef.current.srcObject = stream;
    if (stream.getVideoTracks()) {
      stream.getVideoTracks().map((track) => {
        track.onended = (event) => {
          console.log("first Ended");
          restart();
        };
      });
    }
  }

  const screenCapturing = () => {
    const options = { audio: false, video: true, cursor: true };
    navigator.mediaDevices
      .getDisplayMedia(options)
      .then(handleSuccess, handleError);
  };

  ////////////  LeaveMeeting /////////////////////

  const leaveMeet = () => {
    if (window.stream) {
      window.stream.getTracks().forEach((track) => {
        track.stop();
      });
      Swal.fire("Thank You !", "Go Back to Home Page ...", "Success").then(
        (result) => {
          if (result.isConfirmed) {
            navigate("/");
          }
        }
      );
    }
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
            <video className="videoTag" ref={videoRef} playsInline autoPlay />
            <video className="videoTag" ref={videoRef2} playsInline autoPlay />
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
            <button className="video-action-button endcall" onClick={leaveMeet}>
              Leave
            </button>
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
