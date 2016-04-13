import React, {PropTypes, Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {reduxForm} from "redux-form";
import Input from "react-bootstrap/lib/Input";
import Button from "react-bootstrap/lib/Button";
import Alert from "react-bootstrap/lib/Alert";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
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
export default class Login extends Component {

    static propTypes = {
        user: PropTypes.any,
        handleLogin: PropTypes.func.isRequired,
        error: PropTypes.string.isRequired,
        fetching: PropTypes.bool.isRequired
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

    /**
     * TODO: If extension is between username and password, Chrome's autofill will ignore username and fill extension
     * @return {XML}
     */
    render() {

        const {error, fetching, fields: {username, extension, password}} = this.props;

        return <form onSubmit={::this.login}>

            <Input type="text" name="username" {...username} placeholder="Username"/>
            <Input type="password" name="password" {...password} placeholder="Password"/>
            <Input type="text" name="extension" {...extension} placeholder="Extension"/>

            <p className="text-center">
                {fetching
                    ? <Button disabled>Logging in...</Button>
                    : <Button bsStyle="primary" bsSize="large" type="submit"><Glyphicon glyph="log-in"/> Login</Button>}
            </p>

            {error ? <Alert bsStyle='danger'>Failed to login: {error}</Alert> : null}

        </form>;

    }
}