import {Link} from "react-router-dom";
import styled from "styled-components";

const NavContainer = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${(props) => props.theme.color.PRIMARY};
    padding: 1rem 2rem;
`;

const Logo = styled.div`
    font-size: 1.5rem;
    color: ${(props) => props.theme.color.WHITE};
    font-weight: bold;
`;

const Menu = styled.div` 
    a {
        margin-left: 1rem;
        color: ${(props) => props.theme.color.WHITE};
        font-weight: 500; 
        &:hover {
            text-decoration: underline;

        } 
    }
`;

const NavBar = () => {
    return (
        <NavContainer>
            <Link to="/">
                <Logo>WiseShop</Logo>
            </Link>
            <Menu>
                <Link to="/signin">Sign In</Link>
                <Link to="/signup">Sign Up</Link>
            </Menu>
        </NavContainer>
    );
}

export default NavBar;