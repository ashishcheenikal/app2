// MIT License
//
// Copyright (c) 2012 Universidad Politécnica de Madrid
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0

// This file is borrowed from lynckia/licode with some modifications.

'use strict';
const myHost = "https://mcu5.enfinlabs.com:3004"
var conference;
var publicationGlobal;
const runSocketIOSample = function() {

    let localStream;
    let showedRemoteStreams = [];
    let myId;
    let subscriptionForMixedStream;
    let myRoom;

    function getParameterByName(name) {
        name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
            results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(
            /\+/g, ' '));
    }

    var subscribeForward = getParameterByName('forward') === 'true'?true:false;
    var isSelf = getParameterByName('self') === 'false'?false:true;
    conference = new Owt.Conference.ConferenceClient();
    function createResolutionButtons(stream, subscribeResolutionCallback) {
        let $p = $(`#${stream.id}resolutions`);
        if ($p.length === 0) {
            $p = $(`<div id=${stream.id}resolutions> </div>`);
            $p.appendTo($('body'));
        }
        // Resolutions from settings.
        for (const videoSetting of stream.settings.video) {
            const resolution = videoSetting.resolution;
            if (resolution) {
                const button = $('<button/>', {
                    text: resolution.width + 'x' +
                        resolution.height,
                    click: () => {
                        subscribeResolutionCallback(stream, resolution);
                    }
                });
                button.prependTo($p);
            }
        }
        // Resolutions from extraCapabilities.
        for (const resolution of stream.extraCapabilities.video.resolutions.reverse()) {
            const button = $('<button/>', {
                text: resolution.width + 'x' +
                    resolution.height,
                click: () => {
                    subscribeResolutionCallback(stream, resolution);
                }
            });
            button.prependTo($p);
        };
        return $p;
    }
    function subscribeAndRenderVideo(stream){
        let subscirptionLocal=null;
        function subscribeDifferentResolution(stream, resolution){
            subscirptionLocal && subscirptionLocal.stop();
            subscirptionLocal = null;
            const videoOptions = {};
            videoOptions.resolution = resolution;
            conference.subscribe(stream, {
                audio: true,
                video: videoOptions
            }).then((
                subscription) => {
                    subscirptionLocal = subscription;
                $(`#${stream.id}`).get(0).srcObject = stream.mediaStream;
            });
        }
        let $p = createResolutionButtons(stream, subscribeDifferentResolution);
        conference.subscribe(stream)
        .then((subscription)=>{
            subscirptionLocal = subscription;
            let $video = $(`<video controls autoplay id=${stream.id} style="display:block" >this browser does not supported video tag</video>`);
           $video.get(0).srcObject = stream.mediaStream;
           $p.append($video);
        }, (err)=>{ console.log('subscribe failed', err);
        });
        stream.addEventListener('ended', () => {
            removeUi(stream.id);
            $(`#${stream.id}resolutions`).remove();
        });
        stream.addEventListener('updated', () => {
            // Update resolution buttons
            $p.children('button').remove();
            createResolutionButtons(stream, subscribeDifferentResolution);
        });
    }
    function removeUi(id){
        $(`#${id}`).remove();
    }

    conference.addEventListener('streamadded', (event) => {
        console.log('A new stream is added ', event.stream.id);
        isSelf = isSelf?isSelf:event.stream.id != publicationGlobal.id;
        subscribeForward && isSelf && subscribeAndRenderVideo(event.stream);
        mixStream(myRoom, event.stream.id, 'common', myHost);
        event.stream.addEventListener('ended', () => {
            console.log(event.stream.id + ' is ended.');
        });
    });

    window.onload = function() {
        var simulcast = getParameterByName('simulcast') || false;
        var shareScreen = getParameterByName('screen') || false;
        myRoom = getParameterByName('room');
        var isHttps = (location.protocol === 'https:');
        var mediaUrl = getParameterByName('url');
        var isPublish = getParameterByName('publish');
        createToken(myRoom, 'user', 'presenter', function(response) {
            var token = response;
            conference.join(token).then(resp => {
                myId = resp.self.id;
                myRoom = resp.id;
                // if(mediaUrl){
                //      startStreamingIn(myRoom, mediaUrl, myHost);
                // }
                if (isPublish !== 'false') {
                    // audioConstraintsForMic
                    let audioConstraints = new Owt.Base.AudioTrackConstraints(Owt.Base.AudioSourceInfo.MIC);
                    // videoConstraintsForCamera
                    let videoConstraints = new Owt.Base.VideoTrackConstraints(Owt.Base.VideoSourceInfo.CAMERA);
                    if (shareScreen) {
                        // audioConstraintsForScreen
                        audioConstraints = new Owt.Base.AudioTrackConstraints(Owt.Base.AudioSourceInfo.SCREENCAST);
                        // videoConstraintsForScreen
                        videoConstraints = new Owt.Base.VideoTrackConstraints(Owt.Base.VideoSourceInfo.SCREENCAST);
                    }

                    let mediaStream;
                    Owt.Base.MediaStreamFactory.createMediaStream(new Owt.Base.StreamConstraints(
                        audioConstraints, videoConstraints)).then(stream => {
                        let publishOption;
                        // if (simulcast) {
                        //     publishOption = {video:[
                        //         {rid: 'q', active: true/*, scaleResolutionDownBy: 4.0*/},
                        //         {rid: 'h', active: true/*, scaleResolutionDownBy: 2.0*/},
                        //         {rid: 'f', active: true}
                        //     ]};
                        // }
                        mediaStream = stream;
                        localStream = new Owt.Base.LocalStream(
                            mediaStream, new Owt.Base.StreamSourceInfo(
                                'mic', 'camera'));
                        $('.local video').get(0).srcObject = stream;
                        conference.publish(localStream, publishOption).then(publication => {
                            publicationGlobal = publication;
                            mixStream(myRoom, publication.id, 'common')
                            publication.addEventListener('error', (err) => {
                                console.log('Publication error: ' + err.error.message);
                            });
                        });
                    }, err => {
                        console.error('Failed to create MediaStream, ' +
                            err);
                    });
                }
                var streams = resp.remoteStreams;
                for (const stream of streams) {
                    if(!subscribeForward){
                      if (stream.source.audio === 'mixed' || stream.source.video ===
                        'mixed') {
                        subscribeAndRenderVideo(stream);
                      }
                    } else if (stream.source.audio !== 'mixed') {
                        subscribeAndRenderVideo(stream);
                    }
                }
                console.log('Streams in conference:', streams.length);
                var participants = resp.participants;
                console.log('Participants in conference: ' + participants.length);
            }, function(err) {
                console.error('server connection failed:', err);
                if (err.message.indexOf('connect_error:') >= 0) {
                    const signalingHost = err.message.replace('connect_error:', '');
                    const signalingUi = 'signaling';
                    removeUi(signalingUi);
                    let $p = $(`<div id=${signalingUi}> </div>`);
                    const anchor = $('<a/>', {
                        text: 'Click this for testing certificate and refresh',
                        target: '_blank',
                        href: `${signalingHost}/socket.io/`
                    });
                    anchor.appendTo($p);
                    $p.appendTo($('body'));
                }
            });
        }, myHost);
    };
};
window.onbeforeunload = function(event){
    conference.leave()
    publicationGlobal.stop();
}

//////////////////////////////////////////////////////////////////////////////////////////


import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import RemoteStream from "./RemoteStream";
import "./MeetingPage.css"
const room = "63a3f13e106dea69e54af02d";

export default function MeetingPage() {
  const { roomID } = useParams();
  const videoRef = useRef(null);
  const videoRef2 = useRef(null);

  let localStream;
  let myId;
  let myRoom;
  let subscribeForward = false;
  let isSelf = false;
  let publicationGlobal;

  const [conference, setConference] = useState(
    new window.Owt.Conference.ConferenceClient()
  );

  const [remoteStream, setRemoteStream] = useState([]);

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

  const subscribeAndRenderVideo = (stream, from) => {
    console.log(from, "+-+-+-+-+-+-+-+-+-+-+-+");
    conference.subscribe(stream).then(
      (subscription) => {
        // videoRef2.current.srcObject = stream.mediaStream;
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

    mixStream(myRoom, event.stream.id, "common");
    event.stream.addEventListener("ended", () => {
      console.log(event.stream.id + " is ended.");
    });
  });

  const createToken = async () => {
    const res = await axios.post("https://mcu.spjain.org:3004/tokens/", {
      role: "presenter",
      room: room,
      user: "user",
    });
    return res.data;
  };

  const isPublish = (resp) => {
    // audioConstraintsForMic
    let audioConstraints = new window.Owt.Base.AudioTrackConstraints(
      window.Owt.Base.AudioSourceInfo.MIC
    );
    // videoConstraintsForCamera
    let videoConstraints = new window.Owt.Base.VideoTrackConstraints(
      window.Owt.Base.VideoSourceInfo.CAMERA
    );

    let mediaStream;

    /// alternative for navigator.mediaDevices.getUserMedia(constraints)

    window.Owt.Base.MediaStreamFactory.createMediaStream(
      new window.Owt.Base.StreamConstraints(audioConstraints, videoConstraints)
    ).then((stream) => {
      let publishOption = {
        audio: true,
        video: true,
      };
      console.log(stream, "steam120120");
      mediaStream = stream;
      let obj = {
        user : "AshishJoshy",
      }
      /// creating a local stream for publishing your video and audio streams
      localStream = new window.Owt.Base.LocalStream(
        mediaStream,
        new window.Owt.Base.StreamSourceInfo("mic", "camera"),
        obj
      );

      console.log(localStream, "localStream789789");

      videoRef.current.srcObject = stream; /// rendering selfVideo from stream
      
      /// publishing our stream by passing local video and publishOptions
      conference.publish(localStream, publishOption,).then((publication) => {
        console.log(publication, "publication1231231232132");

        publicationGlobal = publication;

        mixStream(myRoom, publication.id, "common");

        publication.addEventListener("error", (err) => {
          console.log("Publication error: " + err.error.message);
        });
      });
    });

    let streams = resp.remoteStreams;
    console.log(resp.remoteStreams, "resp.remoteStreams");

    for (const stream of streams) {
      // if (!subscribeForward) {
      //   if (
      //     stream.source.audio === "mixed" ||
      //     stream.source.video === "mixed"
      //   ) {
      //     console.log(stream.mediaStream,"852852")
      //     subscribeAndRenderVideo(stream);// subscribing the video from room (other participants video which are published earlier)
      //   }
      // } else
      if (stream.source.audio !== "mixed") {
        subscribeAndRenderVideo(stream, "fromRemoteResponse");
      }
    }
    console.log("Streams in conference:", streams.length);
    var participants = resp.participants;
    console.log("Participants in conference: " + participants.length);
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

  const streamEnd = (id) => {
    const remainingStreams = remoteStream.filter((val) => {
      if (val.id !== id) {
        return val;
      }
    });
    setRemoteStream(remainingStreams);
  };

  useEffect(() => {
    createToken().then((res) => {
      resFun(res);
    });
    console.log(conference, "conference963963");
  }, []);

  window.onbeforeunload = function (event) {
    conference.leave();
    publicationGlobal.stop();
  };

  return (
    <div>
      <video ref={videoRef} playsInline autoPlay />
      <video ref={videoRef2} playsInline autoPlay />
      <ul className="list-group">
      {remoteStream?.map((stream, i) => (
            <li className="list-group-item col-4" key={i}>
              Rendering Individual video stream
              <RemoteStream
                stream={stream}
                conference={conference}
                streamEnd={streamEnd}
              />
            </li>
      ))}
      </ul>
    </div>
  );
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



import { useEffect, useRef } from "react";

export default function RemoteStream({ conference, stream, streamEnd }) {
  const ref = useRef(null);

  useEffect(() => {
    conference.subscribe(stream).then((subscription) => {
      ref.current.srcObject = stream.mediaStream;
      console.log(stream,"RemoteStreamRemoteStreamRemoteStreamRemoteStreamRemoteStreamRemoteStream")
      stream.addEventListener("ended", () => {
        subscription.stop();
        streamEnd(stream.id);
      });
    });
  }, [stream]);

  return (
    <div>
      <h5>{stream.attributes.user}</h5>
      <video ref={ref} playsInline autoPlay className="videoRef2"/>
    </div>
  );
}
