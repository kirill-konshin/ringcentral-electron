import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import User from "./User";
import Page from "./Page";
import * as messageActions from "../actions/Message";
import * as userActions from "../actions/User";

function mapStateToProps(state) {
    return {
        user: state.user,
        message: state.message
    }
}

function mapDispatchToProps(dispatch) {
    return {
        messageActions: bindActionCreators(messageActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch)
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {
    render() {

        const {user} = this.props;

        return <div>

            <User />
            {user.user ? <Page/> : null}

        </div>;

    }
}