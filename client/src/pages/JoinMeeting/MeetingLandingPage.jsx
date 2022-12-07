import { useEffect, useRef, useState } from "react";
import MeetingTemplate from "./MeetingTemplate";
import Select from 'react-select'

export default function MeetingLandingPage({
  detailMeeting,
  slug,
  userID,
  setMeeting,
}) {
  const videoRef = useRef(null);
  const [meetingVisibility, setMeetingVisibility] = useState(false);
  const [audioInputSelect, setAudioInputSelect] = useState([]);
  const [audioOutputSelect, setAudioOutputSelect] = useState([]);
  const [videoSelect, setVideoSelect] = useState([]);
  // const [deviceInfos, setDeviceInfos] = useState([]);

  // const selectors = [audioInputSelect, audioOutputSelect, videoSelect];
  // console.log(selectors);

  function gotDevices(deviceInfos) {
    console.log(deviceInfos, "deviceInfos");
    deviceInfos?.map((select) => {
      if (select.kind === "audioinput") {
        const options = {
          value: select.deviceId,
          label: select.label,
        };
        setAudioInputSelect((list)=>[...list,options]); 
      } else if (select.kind === "audiooutput") {
        const options = {
          value: select.deviceId,
          label: select.label,
        };
        setAudioOutputSelect((list)=>[...list,options]);
      } else if (select.kind === "videoinput") {
        const options = {
          value: select.deviceId,
          label: select.label,
        };
        setVideoSelect((list)=>[...list,options]);
      } else {
        console.log("Some other kind of source/device: ", select);
      }
    });
  }

  function gotStream(stream) {
    window.stream = stream;
    console.log(window.stream, "window.stream");
    videoRef.current.srcObject = stream;
    return navigator.mediaDevices.enumerateDevices();
  }

  function handleError(error) {
    console.log(
      "navigator.MediaDevices.getUserMedia error: ",
      error.message,
      error.name
    );
  }

  function start() {
    const constraints = {
      audio: true,
      video: {
        mandatory: {
          minWidth: 640,
          minHeight: 360,
        },
      },
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(gotStream)
      .then(gotDevices)
      .catch(handleError);
  }
  useEffect(() => {
    start();
    console.log(audioInputSelect,"audioInputSelect")
  }, [])
  

  return (
    <div id="container">
      <div className="select">
        <label htmlFor="audioSource">Audio input source: </label>
        <Select options={audioInputSelect}/>
      </div>

      <div className="select">
        <label htmlFor="audioOutput">Audio output destination: </label>
        <Select options={audioOutputSelect}/>
      </div>

      <div className="select">
        <label htmlFor="videoSource">Video source: </label>
        <Select options={videoSelect}/>
      </div>

      {/* <video id="video" playsInline autoPlay></video> */}
      <video ref={videoRef} autoPlay />

      <button
        onClick={() => {
          setMeetingVisibility((prev) => !prev);
        }}
      >
        Join Meeting
      </button>

      {meetingVisibility && (
        <MeetingTemplate
          detailMeeting={detailMeeting}
          slug={slug}
          userID={userID}
        />
      )}
    </div>
  );
}
