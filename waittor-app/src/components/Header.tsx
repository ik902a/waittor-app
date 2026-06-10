import { useEffect, useState } from "react";
import logo from "/favicon.svg";

function Header() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])
  

  return (
    <header>
      <img src={logo} alt="" />
      <span>Time: {now.toLocaleTimeString()}</span>
    </header>
  );
}

export default Header;
