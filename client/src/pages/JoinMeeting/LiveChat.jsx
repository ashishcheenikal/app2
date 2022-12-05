import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { socket } from "../../socket";

export default function LiveChat({ detailMeeting, slug, userID }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const allMembers = detailMeeting.host.concat(detailMeeting.participants);
  const name = allMembers?.map((name) => {
    return name._id == userID ? name.firstName + " " + name.lastName : "";
  });
  const userName = name.filter((val) => val !== "");
  const joinRoom = () => {
    socket.emit("join_room", { userID, slug, userName });
    socket.on("join_message", (data) => {
      console.log(data, "data for receive_message");
      setMessageList((list) => [...list, data]);
    });
  };

  useEffect(() => {
    joinRoom();
  }, []);

  const sendMessage = async () => {
    try {
      if (currentMessage !== "") {
        const messageData = {
          room: slug,
          author: userID,
          authorName: userName[0],
          message: currentMessage,
          time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
        };

        socket.emit("send_message", messageData);
        setMessageList((list) => [...list, messageData]);
        setCurrentMessage("");
      }
    } catch (error) {
      console.log("Message :", error.message);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
    console.log(messageList, "receive_message");
  }, []);

  return (
    <div>
      <div className="chat-container">
        <div className="chat-area">
          {/* <!-- Message 1 --> */}
          <div className="message-wrapper">
            {/* <div className="profile-picture">
              <img
                src="https://images.unsplash.com/photo-1581824283135-0666cf353f35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1276&q=80"
                alt=""
              />
            </div> */}
            <div className="chat-body">
              <ScrollToBottom className="message-container">
                {messageList.map((messageContent) => {
                  return (
                    <div
                      className="message"
                      id={userID === messageContent.author ? "you" : "other"}
                    >
                      <div>
                        <div className="message-meta">
                          <p id="author">{messageContent.authorName}</p>
                          <p id="time">{messageContent.time}</p>
                        </div>
                        <div className="message-content">
                          <p>{messageContent.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </ScrollToBottom>
            </div>
          </div>
        </div>
        <div className="chat-typing-area-wrapper">
          <div className="chat-typing-area">
            <input
              type="text"
              placeholder="Type your message..."
              className="chat-input"
              value={currentMessage}
              onChange={(event) => {
                setCurrentMessage(event.target.value);
              }}
              onKeyPress={(event) => {
                event.key === "Enter" && sendMessage();
              }}
            />
            <button className="send-button" onClick={sendMessage}>
              {/* <!-- Send icon --> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-send"
                viewBox="0 0 24 24"
              >
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
              {/* <!-- Send icon --> */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
