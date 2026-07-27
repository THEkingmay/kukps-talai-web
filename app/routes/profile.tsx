import { useEffect } from "react";
import apiClient from "~/configs/axios";
import { useState } from "react";

export default function Profile() {
  const [msg, setMsg] = useState("");
  const fetchData = async () => {
    try {
      const res = await apiClient.get("/test-cookie");
      setMsg(res.data.message);
    } catch (error) {
      setMsg("error");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return <div>Mesage : {msg}</div>;
}
