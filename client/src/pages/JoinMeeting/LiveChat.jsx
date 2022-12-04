import { useEffect, useState } from "react";

export default function LiveChat({ detailMeeting, slug, userID ,socket}) {
  const [messagesRecieved, setMessagesReceived] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data,"data for receive_message")
      setMessagesReceived(data);
    });
  }, [socket]) 
  
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
            {
            // messagesRecieved?.map((val, i) => {
              <div className="message-content" >
                <p className="name">{messagesRecieved.username}</p>
                <div className="message">{messagesRecieved.message}</div>
              </div>
            // })
            }
          </div>
        </div>
        <div className="chat-typing-area-wrapper">
          <div className="chat-typing-area">
            <input
              type="text"
              placeholder="Type your message..."
              className="chat-input"
            />
            <button className="send-button">
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
