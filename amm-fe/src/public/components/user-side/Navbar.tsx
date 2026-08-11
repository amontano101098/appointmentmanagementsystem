interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const isActive = (page: string) => currentPage === page;

  return (
    <header>
      <nav className="navbar">
        <h1 className="logo">GoldenStay</h1>

        <ul className="nav-links">
          <li>
            <a href="#home" onClick={() => onNavigate("home")} className={isActive("home") ? "active" : ""}>
              Home
            </a>
          </li>
          <li>
            <a href="#rooms" onClick={() => onNavigate("rooms")} className={isActive("rooms") ? "active" : ""}>
              Rooms
            </a>
          </li>
          <li>
            <a href="#about" onClick={() => onNavigate("about")} className={isActive("about") ? "active" : ""}>
              About
            </a>
          </li>
          <li>
            <a href="#contact" onClick={() => onNavigate("contact")} className={isActive("contact") ? "active" : ""}>
              Contact
            </a>
          </li>
          <li>
            <button
              onClick={() => onNavigate("book")}
              className="nav-book-btn"
            >
              Book Now
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
