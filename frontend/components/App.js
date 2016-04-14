import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import User from "./User";
import Message from "./Message";
import OnCall from "./OnCall";
import Dialpad from "./Dialpad";
import Login from "./Login";
import * as navActions from "../actions/Nav";
import Nav from "react-bootstrap/lib/Nav";
import NavItem from "react-bootstrap/lib/NavItem";
import Glyphicon from "react-bootstrap/lib/Glyphicon";

let map = {
    messages: Message,
    dialpad: Dialpad,
    calls: Message,
    contacts: Message
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
            
            <Nav className="x-bottom-nav" bsStyle="pills" justified activeKey={page} onSelect={::this.navigate}>
                <NavItem eventKey="messages"><Glyphicon glyph="inbox"/><br/>Messages</NavItem>
                <NavItem eventKey="dialpad"><Glyphicon glyph="th"/><br/>Dialpad</NavItem>
                <NavItem eventKey="calls"><Glyphicon glyph="earphone"/><br/>Calls</NavItem>
                <NavItem eventKey="contacts"><Glyphicon glyph="user"/><br/>Contacts</NavItem>
            </Nav>

        </div>: <Login/>;

        return <div className="container-fluid">

            <User />

            {content}

        </div>;

    }
}