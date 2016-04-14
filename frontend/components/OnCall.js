import React, {PropTypes, Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as phoneActions from "../actions/Phone";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import Button from "react-bootstrap/lib/Button";
import Row from "react-bootstrap/lib/Row";
import Col from "react-bootstrap/lib/Col";

function mapStateToProps(state) {
    return {...state.phone}
}

function mapDispatchToProps(dispatch) {
    return {...bindActionCreators(phoneActions, dispatch)}
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

        const {callState, session: {request}, iceStatus} = this.props;

        const callInfo = request ? <p>
            From: {request.from.displayName}, {request.from.friendlyName}
            To: {request.to.displayName}, {request.to.friendlyName}
        </p> : null;

        if (callState == 'accepted') {

            return <div>

                {callInfo}

                <Row>
                    <Col xs={4}><Button bsSize="large" bsStyle="default" block>
                        <Glyphicon glyph="eye-close"/><br/>
                        <small>Mute</small>
                    </Button></Col>
                    <Col xs={4}><Button bsSize="large" bsStyle="default" block>
                        <Glyphicon glyph="pushpin"/><br/>
                        <small>Hold</small>
                    </Button></Col>
                    <Col xs={4}><Button bsSize="large" bsStyle="default" block>
                        <Glyphicon glyph="sort"/><br/>
                        <small>Transfer</small>
                    </Button></Col>
                </Row>

                <br/>

                <Button bsStyle="danger" bsSize="large" onClick={::this.endCall} block>
                    <Glyphicon glyph="ban-circle"/> End Call
                </Button>

            </div>;

        } else if (callState == 'created') {

            return <div>

                {callInfo}

                Calling... {iceStatus}

                <br/>

                <Button bsStyle="danger" bsSize="large" onClick={::this.endCall} block>
                    <Glyphicon glyph="ban-circle"/> End Call
                </Button>

            </div>;

        } else {

            return <div>
                {callInfo}
                <Row>
                    <Col xs={6}>
                        <Button bsStyle="success" bsSize="large" onClick={::this.acceptCall} block>
                            <Glyphicon glyph="earphone"/> Accept
                        </Button>
                    </Col>
                    <Col xs={6}>
                        <Button bsStyle="danger" bsSize="large" onClick={::this.rejectCall} block>
                            <Glyphicon glyph="ban-circle"/> Voicemal
                        </Button>
                    </Col>
                </Row>
            </div>;

        }

    }
}