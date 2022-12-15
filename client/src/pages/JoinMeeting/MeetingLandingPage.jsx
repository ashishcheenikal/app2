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
  setMuteAudio,
  setMuteCamera,
  muteAudio,
  muteCamera,
}) {
  const videoRef = useRef(null);
  const volumeMeterEl = useRef(null);
  const [audioInputSelect, setAudioInputSelect] = useState([]);
  const [audioOutputSelect, setAudioOutputSelect] = useState([]);
  const [videoSelect, setVideoSelect] = useState([]);

  function gotDevices(deviceInfos) {
    setAudioInputSelect([]);
    setAudioOutputSelect([]);
    setVideoSelect([]);
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

  const devicesList = () => {
    navigator.mediaDevices
      .enumerateDevices()
      .then()
      .then(gotDevices)
      .catch(handleError);
  };

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
            start();
          }, 5000);
        }
      });
    } else {
      Swal.fire(`${error.message}!`, `${error.name}`, "error");
    }
  }

  function gotStream(stream) {
    window.stream = stream;
    videoRef.current.srcObject = window.stream;
    console.log( window.stream," window.stream 777777777777777")
    const audioContext = new AudioContext();
    const mediaStreamAudioSourceNode =
      audioContext.createMediaStreamSource(stream);
    const analyserNode = audioContext.createAnalyser();
    mediaStreamAudioSourceNode.connect(analyserNode);
    const pcmData = new Float32Array(analyserNode.fftSize);
    const onFrame = () => {
      analyserNode.getFloatTimeDomainData(pcmData);
      let sumSquares = 0.0;
      for (const amplitude of pcmData) {
        sumSquares += amplitude * amplitude;
      }
      volumeMeterEl.current.value = Math.sqrt(sumSquares / pcmData.length);
      window.requestAnimationFrame(onFrame);
    };
    window.requestAnimationFrame(onFrame);
  }

  function start() {
    if (window.stream) {
      window.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    console.log(audioInput, video, "audio and video start");
    const audioSource = audioInput[0]?.value;
    const videoSource = video[0]?.value;
    const constraints = {
      audio: {
        deviceId: audioSource ? { exact: audioSource } : undefined,
        echoCancellation: true,
      },
      video: { deviceId: videoSource ? { exact: videoSource } : undefined },
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(gotStream)
      .catch(handleError);
  }

  useEffect(() => {
    start();
    devicesList();
    console.log("first");
  }, []);

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
    start();
  }, [audioInput, audioOutput, video]);

  const joinAction = () => {
    if (audioInput.length && audioOutput.length && video.length !== 0) {
      setMeetingVisibility((prev) => !prev);
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

  const muteAudioFn = () => {
    console.log("muteAudio");
    window.stream.getTracks().forEach((track) => {
      if (track.kind === "audio") {
        track.enabled = !track.enabled;
        setMuteAudio((prev) => !prev);
        console.log(track.enabled, "track.enabled audio");
      }
    });
  };
  const muteCameraFn = () => {
    console.log("muteCamera");
    window.stream.getTracks().forEach((track) => {
      if (track.kind === "video") {
        track.enabled = !track.enabled;
        setMuteCamera((prev) => !prev);
        console.log(track.enabled, "track.enabled video");
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

        <meter ref={volumeMeterEl} high="0.25" max="1" value="0"></meter>

        <div className="muteBtn">
          <button className="btn-mute" onClick={muteAudioFn}></button>
          <button className="btn-camera" onClick={muteCameraFn}></button>
        </div>
        <button className="btn btn-primary btnMPL" onClick={joinAction}>
          Join Meeting
        </button>
      </div>
    </div>
  );
}
