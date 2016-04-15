import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import User from "./User";
import Message from "./Message";
import Contact from "./Contact";
import Call from "./Call";
import OnCall from "./OnCall";
import Dialpad from "./Dialpad";
import Login from "./Login";
import * as navActions from "../actions/Nav";
import Navbar from "react-bootstrap/lib/Navbar";
import Nav from "react-bootstrap/lib/Nav";
import NavItem from "react-bootstrap/lib/NavItem";
import Glyphicon from "react-bootstrap/lib/Glyphicon";

let map = {
    messages: Message,
    dialpad: Dialpad,
    calls: Call,
    contacts: Contact,
    user: User
};

function mapStateToProps(state) {
    return {
        nav: state.nav,
        phone: state.phone,
        user: state.user,
        message: state.message
    }
}

function mapDispatchToProps(dispatch) {
    return {
        navActions: bindActionCreators(navActions, dispatch)
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {

    //TODO PropTypes

    navigate(page) {
        this.props.navActions.navigate(page);
    }

    render() {

        const {user: {user}, phone: {session}, nav: {page}} = this.props;

        let Cmp = map[page] || Message;

        if (!!user && session) {
            Cmp = OnCall;
        }

        let content = !!user ? <div>

            <Cmp/>

            <Navbar fixedBottom fluid inverse>
                <Nav activeKey={page} onSelect={::this.navigate}>
                    <NavItem eventKey="messages"><Glyphicon glyph="inbox"/><br/>Messages</NavItem>
                    <NavItem eventKey="dialpad"><Glyphicon glyph="th"/><br/>Dialpad</NavItem>
                    <NavItem eventKey="calls"><Glyphicon glyph="earphone"/><br/>Calls</NavItem>
                    <NavItem eventKey="contacts"><Glyphicon glyph="book"/><br/>Contacts</NavItem>
                    <NavItem eventKey="user"><Glyphicon glyph="user"/><br/>Me</NavItem>
                </Nav>
            </Navbar>

        </div> : <Login/>;

        return <div className="container-fluid">

            {content}

        </div>;

    }
}