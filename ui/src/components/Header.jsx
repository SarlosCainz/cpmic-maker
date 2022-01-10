import {useCallback, useContext, useState} from "react";
import {Navbar, Heading, Image, Hero, Container, Element} from "react-bulma-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons";
import logo from "../../icon-192.png";


function Header() {
    return (
        <>
            <Navbar color="light" fixed="top">
                <Navbar.Brand>
                    <Navbar.Item mx={3} href="/">
                        <img src={logo} alt="WMA"/>
                        <Heading ml={2} size={4} textColor="grey-dark" display="flex">
                            誰だぁメーカー
                            <Element textSize={5}ml={2}>+Plus</Element>
                        </Heading>
                    </Navbar.Item>
                </Navbar.Brand>
            </Navbar>
        </>
    );
}

export default Header;
