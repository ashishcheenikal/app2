import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";

export default function MeetingLandingPage({
  setMeetingVisibility,
  audioInput,
  audioOutput,
  video,
  setAudioInput,
  setAudioOutput,
  setVideo,
}) {
  const videoRef = useRef(null);
  const [audioInputSelect, setAudioInputSelect] = useState([]);
  const [audioOutputSelect, setAudioOutputSelect] = useState([]);
  const [videoSelect, setVideoSelect] = useState([]);

  function gotDevices(deviceInfos) {
    console.log(deviceInfos, "deviceInfos");
    deviceInfos?.map((select) => {
      if (select.kind === "audioinput") {
        const options = {
          value: select.deviceId,
          label: select.label,
        };
        setAudioInputSelect((list) => [...list, options]);
      } else if (select.kind === "audiooutput") {
        const options = {
          value: select.deviceId,
          label: select.label,
        };
        setAudioOutputSelect((list) => [...list, options]);
      } else if (select.kind === "videoinput") {
        const options = {
          value: select.deviceId,
          label: select.label,
        };
        setVideoSelect((list) => [...list, options]);
      } else {
        console.log("Some other kind of source/device: ", select);
      }
    });
  }

  function attachSinkId(element, sinkId) {
    if (typeof element.sinkId !== "undefined") {
      element
        .setSinkId(sinkId)
        .then(() => {
          console.log(`Success, audio output device attached: ${sinkId}`);
        })
        .catch((error) => {
          let errorMessage = error;
          if (error.name === "SecurityError") {
            errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
          }
          console.error(errorMessage);
        });
    } else {
      console.warn("Browser does not support output device selection.");
    }
  }

  const changeAudioDestination = (e) => {
    const audioDestination = audioOutput[0]?.value;
    const videoElement = videoRef.current;
    attachSinkId(videoElement, audioDestination);
  };
  function gotStream(stream) {
    window.stream = stream;
    console.log(window.stream.getTracks(), "getTracks");
    console.log(window.stream, "window.stream");
    videoRef.current.srcObject = window.stream;
    return navigator.mediaDevices.enumerateDevices();
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
      audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
      video: { deviceId: videoSource ? { exact: videoSource } : undefined },
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(gotStream)
      .then(gotDevices)
      .catch(handleError);
  }
  useEffect(() => {
    start();
  }, []);

  useEffect(() => {
    setAudioInput([audioInputSelect[0]]);
    setAudioOutput([audioOutputSelect[0]]);
    setVideo([videoSelect[0]]);
  }, [audioInputSelect]);

  const handleInputAudio = (e) => {
    setAudioInput([e]);
  };
  const handleOutputAudio = (e) => {
    setAudioOutput([e]);
    changeAudioDestination(e);
  };
  const handleVideo = (e) => {
    setVideo([e]);
  };
  useEffect(() => {
    console.log(audioInput, "audioInput");
    console.log(audioOutput, "audioOutput");
    console.log(video, "video");
  }, [audioInput, audioOutput, video]);

  const joinAction = () => {
    if (audioInput.length && audioOutput.length && video.length !== 0) {
      setMeetingVisibility((prev) => !prev);
      if (window.stream) {
        window.stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    } else {
      Swal.fire(
        "Please select any devices for Audio and Video!",
        "Redirecting!",
        "error"
      ).then((result) => {
        if (result.isConfirmed) {
          setTimeout(() => {
            start();
          }, 10000);
        }
      });
    } 
  };

  const muteAudio = () => {
    console.log("muteAudio");
    window.stream.getTracks().forEach((track) => {
      if (track.kind == "audio") {
        track.enabled = !track.enabled;
        console.log(track.enabled,"track.enabled audio")
      }
    });
  };
  const muteCamera = () => {
    console.log("muteCamera");
    window.stream.getTracks().forEach((track) => {
      if (track.kind == "video") {
        track.enabled = !track.enabled;
        console.log(track.enabled,"track.enabled video")
      }
    });
  };

  return (
    <div id="containerMLP">
      <div className="selectWrap">
        <div className="select audioSource">
          <label htmlFor="audioSource">Audio input source: </label>
          <Select
            value={audioInput}
            onChange={handleInputAudio}
            options={audioInputSelect}
          />
        </div>

        <div className="select audioOutput">
          <label htmlFor="audioOutput">Audio output destination: </label>
          <Select
            value={audioOutput}
            onChange={handleOutputAudio}
            options={audioOutputSelect}
          />
        </div>

        <div className="select videoSource">
          <label htmlFor="videoSource">Video source: </label>
          <Select value={video} onChange={handleVideo} options={videoSelect} />
        </div>
      </div>
      <div className="videoElement">
        <video ref={videoRef} playsInline autoPlay />
        <div className="muteBtn">
          <button className="btn-mute" onClick={muteAudio}></button>
          <button className="btn-camera" onClick={muteCamera}></button>
        </div>
        <button className="btn btn-primary btnMPL" onClick={joinAction}>
          Join Meeting
        </button>
      </div>
    </div>
  );
}
