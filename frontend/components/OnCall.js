import React, {PropTypes, Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as userActions from "../actions/User";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import Button from "react-bootstrap/lib/Button";
import Input from "react-bootstrap/lib/Input";
import Row from "react-bootstrap/lib/Row";
import Col from "react-bootstrap/lib/Col";

function mapStateToProps(state) {
    return {...state.user}
}

function mapDispatchToProps(dispatch) {
    return {...bindActionCreators(userActions, dispatch)}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class OnCall extends Component {

    static propTypes = {
        callState: PropTypes.string,
        session: PropTypes.any,
        acceptCall: PropTypes.func.isRequired
    };

    acceptCall(e) {
        e.preventDefault();
        const {acceptCall, session} = this.props;
        acceptCall(session);
    }

    rejectCall(e) {
        e.preventDefault();
        const {session} = this.props;
        session.reject();
    }

    endCall(e) {
        e.preventDefault();
        const {session} = this.props;
        session.bye();
    }

    render() {

        const {callState, session} = this.props;

        if (callState == 'accepted') {

            return <div>

                <Row>
                    <Col xs={4}><Button bsSize="large" bsStyle="default" block><Glyphicon glyph="eye-close"/><br/><small>Mute</small></Button></Col>
                    <Col xs={4}><Button bsSize="large" bsStyle="default" block><Glyphicon glyph="pushpin"/><br/><small>Hold</small></Button></Col>
                    <Col xs={4}><Button bsSize="large" bsStyle="default" block><Glyphicon glyph="sort"/><br/><small>Transfer</small></Button></Col>
                </Row>

                <br/>

                <Button bsStyle="danger" bsSize="large" onClick={::this.endCall} block><Glyphicon glyph="ban-circle"/> End Call</Button>

            </div>;

        } else if (callState == 'created') {

            return <div>

                Calling...

                <br/>

                <Button bsStyle="danger" bsSize="large" onClick={::this.endCall} block><Glyphicon glyph="ban-circle"/> End Call</Button>

            </div>;

        } else {

            return <Row>
                <Col xs={6}>
                    <Button bsStyle="success" bsSize="large" onClick={::this.acceptCall} block><Glyphicon glyph="earphone"/> Accept</Button>
                </Col>
                <Col xs={6}>
                    <Button bsStyle="danger" bsSize="large" onClick={::this.rejectCall} block><Glyphicon glyph="ban-circle"/> Voicemal</Button>
                </Col>
            </Row>;

        }

    }
}