import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import User from "../components/User";
import Page from "../components/Page";
import * as messageActions from "../actions/MessagesActions";
import * as userActions from "../actions/UserActions";

class App extends Component {
    render() {

        const {user, message} = this.props;
        const {getMessages} = this.props.messageActions;
        const {handleLogin, handleLogout} = this.props.userActions;

        return <div>

            <User {...user} handleLogin={handleLogin} handleLogout={handleLogout}/>
            {user.user ? <Page {...message} getMessages={getMessages}/> : null}

        </div>;

    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(App)
