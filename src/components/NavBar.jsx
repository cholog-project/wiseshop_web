import {Link} from "react-router-dom";

const NavBar = () => {
    return (
        <nav className="nav-container">
            <div className="nav-logo">
                <Link to="/" className="nav-title">
                    WiseShop
                </Link>
            </div>
            <div className="nav-links">
                <Link to="/signin">Sign In</Link>
                <Link to="/signup">Sign Up</Link>
            </div>
        </nav>
    )
}

export default NavBar;