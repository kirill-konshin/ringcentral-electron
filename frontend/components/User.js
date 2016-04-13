import React, {PropTypes, Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {reduxForm} from "redux-form";
import * as userActions from "../actions/User";

function mapStateToProps(state) {
    return {...state.user}
}

function mapDispatchToProps(dispatch) {
    return {...bindActionCreators(userActions, dispatch)}
}

@reduxForm({
    form: 'login',
    fields: ['username', 'extension', 'password']
})
@connect(mapStateToProps, mapDispatchToProps)
export default class User extends Component {

    static propTypes = {
        user: PropTypes.any,
        handleLogout: PropTypes.func.isRequired,
        handleLogin: PropTypes.func.isRequired,
        error: PropTypes.string.isRequired
    };

    login(e) {

        e.preventDefault();

        const {handleLogin, fields: {username, extension, password}} = this.props;

        handleLogin({
            username: username.value,
            extension: extension.value,
            password: password.value
        });

    }

    logout() {
        this.props.handleLogout();
    }

    render() {

        const {user, error, fetching, fields: {username, extension, password}} = this.props;

        let template;

        if (user) {

            template = <p>
                Hi, {user.name}!
                <button onClick={::this.logout}>Logout</button>
            </p>;

        } else {

            template = <form onSubmit={::this.login}>

                <input type="text" name="username" {...username} placeholder="Username"/>
                <input type="password" name="password" {...password} placeholder="Password"/>
                <input type="text" name="extension" {...extension} placeholder="Extension"/>

                <button className="btn" type="submit">Login</button>

            </form>;

        }

        return <div className='user'>
            {template}
            {fetching ? <p>Loading...</p> : null}
            {error ? <p className='error'>Failed to login: {error}</p> : null}
        </div>;

    }
}