import React, {PropTypes, Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as userActions from "../actions/User";
import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavbarBrand from 'react-bootstrap/lib/NavbarBrand';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

function mapStateToProps(state) {
    return {...state.user}
}

function mapDispatchToProps(dispatch) {
    return {...bindActionCreators(userActions, dispatch)}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class User extends Component {

    static propTypes = {
        user: PropTypes.any,
        handleLogout: PropTypes.func.isRequired
    };

    logout() {
        this.props.handleLogout();
    }

    render() {

        const {user} = this.props;

        return <Navbar fixedTop>

            <NavbarBrand>
                <span className="navbar-brand">Brand</span>
            </NavbarBrand>

            {!!user ? <Nav pullRight>
                <NavItem onClick={::this.logout}><Glyphicon glyph="log-out"/> Logout ({user.name})</NavItem>
            </Nav> : null}

        </Navbar>;

    }
}