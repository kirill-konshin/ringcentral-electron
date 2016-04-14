import React, {PropTypes, Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {reduxForm} from "redux-form";
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

@reduxForm({
    form: 'dial',
    fields: ['phoneNumber']
})
@connect(mapStateToProps, mapDispatchToProps)
export default class Dialpad extends Component {

    static propTypes = {
        makeCall: PropTypes.func.isRequired
    };

    makeCall(e) {

        e.preventDefault();

        const {makeCall, fields: {phoneNumber}} = this.props;

        makeCall(phoneNumber.value);

    }

    render() {

        const {fields: {phoneNumber}} = this.props;

        console.log(this.props);

        return <form onSubmit={::this.makeCall}>

            <Input type="text" {...phoneNumber} placeholder="Phone Number" bsSize="large"/>

            <Row>
                <Col xs={4}><Button bsStyle="default" block>1<br/><small>&nbsp;</small></Button></Col>
                <Col xs={4}><Button bsStyle="default" block>2<br/><small>ABC</small></Button></Col>
                <Col xs={4}><Button bsStyle="default" block>3<br/><small>DEF</small></Button></Col>
            </Row>
            <br/>
            <Row>
                <Col xs={4}><Button bsStyle="default" block>4<br/><small>GHI</small></Button></Col>
                <Col xs={4}><Button bsStyle="default" block>5<br/><small>JKL</small></Button></Col>
                <Col xs={4}><Button bsStyle="default" block>6<br/><small>MNO</small></Button></Col>
            </Row>
            <br/>
            <Row>
                <Col xs={4}><Button bsStyle="default" block>7<br/><small>PQRS</small></Button></Col>
                <Col xs={4}><Button bsStyle="default" block>8<br/><small>TUV</small></Button></Col>
                <Col xs={4}><Button bsStyle="default" block>9<br/><small>WXYZ</small></Button></Col>
            </Row>
            <br/>
            <Row>
                <Col xs={4}><Button bsStyle="default" block>*<br/><small>&nbsp;</small></Button></Col>
                <Col xs={4}><Button bsStyle="default" block>0<br/><small>+</small></Button></Col>
                <Col xs={4}><Button bsStyle="default" block>#<br/><small>&nbsp;</small></Button></Col>
            </Row>
            <br/>

            <p className="text-center">
                <Button bsStyle="primary" bsSize="large" type="submit"><Glyphicon glyph="earphone"/> Call</Button>
            </p>

        </form>;

    }
}