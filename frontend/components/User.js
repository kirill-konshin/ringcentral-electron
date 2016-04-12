import React, {PropTypes, Component} from "react";

export default class User extends Component {

    static propTypes = {
        user: PropTypes.any,
        handleLogout: PropTypes.func.isRequired,
        handleLogin: PropTypes.func.isRequired,
        error: PropTypes.string.isRequired
    };

    login(e) {

        e.preventDefault();

        this.props.handleLogin({
            username: this.refs.username.value,
            extension: this.refs.extension.value,
            password: this.refs.password.value
        });

    }

    logout(){
        this.props.handleLogout();
    }

    render() {

        const {user, error, fetching} = this.props;

        let template;

        if (user) {

            template = <p>Hi, {user.name}! <button onClick={::this.logout}>Logout</button></p>;

        } else {

            template = <form onSubmit={::this.login}>

                <input type="text" name="username" ref="username"/>
                <input type="password" name="password" ref="password"/>
                <input type="text" name="extension" ref="extension"/>

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