import { useState } from "react";
import { Link } from "react-router-dom";
import LiveChat from "./LiveChat";
import "./style.css";

export default function MeetingTemplate() {
  const [visibleChat, setVisibleChat] = useState(false);
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
              o
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
            {/* <!-- Video Participant 1 --> */}
            <div className="video-participant">
              <div className="participant-action">
                <button className="btn-mute"></button>
                <button className="btn-camera"></button>
              </div>
              <button className="name-tag">Andy Will</button>
              <img
                src="https://images.unsplash.com/photo-1566821582776-92b13ab46bb4?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60"
                alt="participant"
              />
            </div>
          </div>

          <div className="video-call-actions">
            <button className="video-action-button mic"></button>
            <button className="video-action-button camera"></button>
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
          <div className="chat-header">
          </div>
          {visibleChat && <LiveChat />}
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
