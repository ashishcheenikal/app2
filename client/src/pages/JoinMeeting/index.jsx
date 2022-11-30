import useEffect from "react";

export default function JoinMeeting() {
  useEffect(() => {
    const url = window.location.href;
    sessionStorage.setItem("url", url);
  }, []);

  return <div>JoinMeeting</div>;
}
