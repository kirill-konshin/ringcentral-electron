import React, {PropTypes, Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as userActions from "../actions/User";
import Button from "react-bootstrap/lib/Button";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import Media from "react-bootstrap/lib/Media";
import {platform} from "../utils/rc";

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

        return <div>

            <Media>
                <Media.Left>
                    <img width={64} height={64} src={platform.createUrl(user.profileImage.uri, {addToken: true})} alt="Image"/>
                </Media.Left>
                <Media.Body>
                    <Media.Heading>{user.name}</Media.Heading>
                    <p>{user.contact.company}</p>
                    <p>{user.contact.email}</p>
                </Media.Body>
            </Media>

            <p><Button onClick={::this.logout} bsStyle="danger" block><Glyphicon glyph="log-out"/> Logout</Button></p>

        </div>;

    }
}