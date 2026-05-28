import logo from "/favicon.svg";

function Header() {
  const now = new Date();

  return (
    <header>
      <img src={logo} alt="" />
      <span>Time: {now.toLocaleTimeString()}</span>
    </header>
  );
}

export default Header;
