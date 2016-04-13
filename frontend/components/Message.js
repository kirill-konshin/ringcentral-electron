import React, {PropTypes, Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as messageActions from "../actions/Message";
import Panel from "react-bootstrap/lib/Panel";
import Alert from "react-bootstrap/lib/Alert";
import Table from "react-bootstrap/lib/Table";
import helpers from "ringcentral-helpers";

function mapStateToProps(state) {
    return {...state.message}
}

function mapDispatchToProps(dispatch) {
    return {...bindActionCreators(messageActions, dispatch)}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Message extends Component {

    static propTypes = {
        records: PropTypes.array.isRequired,
        paging: PropTypes.any.isRequired,
        getMessages: PropTypes.func.isRequired,
        error: PropTypes.string.isRequired
    };

    onPageClick(e) {
        this.props.getMessages(+e.target.innerText)
    }

    componentWillMount() {
        this.props.getMessages();
    }

    render() {

        const {paging, records, fetching, error} = this.props;

        if (error) return <Alert bsStyle="danger">Can't load messages {error}</Alert>;

        const footer = <div>
            Total calls: {records.length} of {paging.totalElements}, page {paging.page} of {paging.totalPages}
            ({paging.perPage} per page)
        </div>;

        return <Panel header={<h3>Calls</h3>}>

            <Table striped>
                <thead>
                <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Duration</th>
                </tr>
                </thead>
                <tbody>
                {fetching ? <tr>
                    <td colspan="3">Loading...</td>
                </tr>
                    : records.map((entry, index) => {
                        return <tr key={index}>
                            <td>{contact(entry.from)}</td>
                            <td>{contact(entry.to[0])}</td>
                            <td>{helpers.call().formatDuration(entry)}</td>
                        </tr>;
                    }
                )}

                </tbody>
                <tfoot></tfoot>
            </Table>


        </Panel>
    }
}

function contact(rec) {
    return <div>
        {rec.name || rec.phoneNumber || rec.extension}
        {rec.location ? <div><small>{rec.location}</small></div> : null}
    </div>;
}