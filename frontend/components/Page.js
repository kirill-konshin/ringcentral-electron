import React, {PropTypes, Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as messageActions from "../actions/Message";

function mapStateToProps(state) {
    return {...state.message}
}

function mapDispatchToProps(dispatch) {
    return {...bindActionCreators(messageActions, dispatch)}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Page extends Component {

    static propTypes = {
        messages: PropTypes.array.isRequired,
        paging: PropTypes.any.isRequired,
        getMessages: PropTypes.func.isRequired,
        error: PropTypes.string.isRequired
    };

    onPageClick(e) {
        this.props.getMessages(+e.target.innerText)
    }

    componentWillMount() {
        this.props.getMessages(1);
    }

    render() {

        const {paging, messages, fetching, error} = this.props;

        return <div className='ib page'>

            <h3>Total messages loaded: {messages.length} of {paging.totalElements}, page {paging.page} of {paging.totalPages} ({paging.perPage} per page)</h3>

            { error ? <p className='error'>Can't load messages {error}</p> : '' }

            {fetching
                ? <p>Loading...</p>
                : messages.map((entry, index) =>
                <div key={index} className='photo'>
                    From: {JSON.stringify(entry.from)}
                    To: {JSON.stringify(entry.to)}
                    Subject: {JSON.stringify(entry.subject)}
                </div>
            )}

        </div>
    }
}
