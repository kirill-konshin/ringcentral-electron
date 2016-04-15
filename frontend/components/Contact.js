import React, {PropTypes, Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as contactActions from "../actions/Contact";
import Alert from "react-bootstrap/lib/Alert";
import Table from "react-bootstrap/lib/Table";

function mapStateToProps(state) {
    return {...state.contact}
}

function mapDispatchToProps(dispatch) {
    return {...bindActionCreators(contactActions, dispatch)}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Contact extends Component {

    static propTypes = {
        records: PropTypes.array.isRequired,
        paging: PropTypes.any.isRequired,
        getContacts: PropTypes.func.isRequired,
        error: PropTypes.string
    };

    onPageClick(e) {
        this.props.getContacts(+e.target.innerText)
    }

    componentWillMount() {
        this.props.getContacts();
    }

    render() {

        const {paging, records, fetching, error} = this.props;

        if (error) return <Alert bsStyle="danger">Can't load contacts: {error}</Alert>;

        return <Table striped>
                <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                </tr>
                </thead>
                <tbody>
                {fetching ? <tr>
                    <td colspan="3">Loading...</td>
                </tr>
                    : records.map((entry, index) => {
                        return <tr key={index}>
                            <td>{entry.firstName}</td>
                            <td>{entry.lastName}</td>
                        </tr>;
                    }
                )}

                </tbody>
                <tfoot>
                <tr>
                    <td colspan="3">
                        Total calls: {records.length} of {paging.totalElements}, page {paging.page}
                        of {paging.totalPages}
                        ({paging.perPage} per page)
                    </td>
                </tr>
                </tfoot>
            </Table>;
    }
}