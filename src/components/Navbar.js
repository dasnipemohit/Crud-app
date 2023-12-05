import React from 'react'
import { Menu, Container, Image, Button } from "semantic-ui-react";
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <Menu inverted borderless style={{ padding: "0.3rem", marginBottom: "20px" }} attached>
            <Container>
                <Menu.Item name='home'>
                    <Link>
                        <Image size='mini' src="logo512.png" alt="name" />
                    </Link>

                </Menu.Item>
                <Menu.Item>
                    <h1>React Firebase CRUD With Upload Image `---_---`</h1>
                </Menu.Item>
                <Menu.Item position='right'>
                    <Button size='mini' primary onClick={() => navigate("/add")}>
                        Add User

                    </Button>
                </Menu.Item>
            </Container>
        </Menu>
    )
}

export default Navbar