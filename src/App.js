import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import ListGroup from 'react-bootstrap/ListGroup';


function PartcipantElement(props) {
  return (
    <Card>
      <Card.Body className="participantButton" onClick={props.onClick}>
        {props.name}
      </Card.Body>
    </Card>
  );
}

function Partcipant(props) {
  return (
    <div>
      
      <Breadcrumb>
        <Breadcrumb.Item href=".">Participant List</Breadcrumb.Item>
        <Breadcrumb.Item active>{props.value.firstName} {props.value.lastName}</Breadcrumb.Item>
      </Breadcrumb>

      <ListGroup as="ol">
        <ListGroup.Item
          as="li"
          className="d-flex justify-content-between align-items-start"
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold">Email</div>
            {props.value.email}
          </div>
        </ListGroup.Item>
        <ListGroup.Item
          as="li"
          className="d-flex justify-content-between align-items-start"
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold">Job title</div>
            {props.value.jobTitle}
          </div>
        </ListGroup.Item>
        <ListGroup.Item
          as="li"
          className="d-flex justify-content-between align-items-start"
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold">Company</div>
            {props.value.company}
          </div>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}

// ========================================

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: Array(0),
      pageNumber: 0,
      limit: 10,
      selectedParticipant: null,
    };
  }

  componentDidMount() {
    this.renderParticipants();
  }

  async renderParticipants() {
    const response = await fetch("https://us-central1-veertly-dev-8b81f.cloudfunctions.net/fetchParticipants?offset=" + 
                                  this.state.pageNumber * this.state.limit + 
                                  "&limit=" + this.state.limit);
    const result = await response.json();

    this.setState({participants: result});
  }
  
  renderParticipant(participant) {
    try {
      return (
        <PartcipantElement
          name={participant.firstName + " " + participant.lastName}
          onClick={() => this.handleClick(participant)}
        />
      );
    } catch(error) {
      console.log(error);
    }
  }

  handleClick(i) {
    this.selectedParticipant = i;
    this.setState({selectedParticipant: i});
  }

  previousPage() {
    const page = this.state.pageNumber - 1;
    this.setState({pageNumber: page});
    this.renderParticipants();
  }

  nextPage() {
    const page = this.state.pageNumber + 1;
    this.setState({pageNumber: page});
    this.renderParticipants();
  }

  render() {
    if (this.selectedParticipant == null) {
      return (
        <div className="App">
          <header className="App-header">
            <h1>
              List of participants
            </h1>
          </header>
          <div className="ParticipantList">
            <ul>
              {this.state.participants.map(p => this.renderParticipant(p))}
            </ul>
            <div className="ButtonGroup">
              <ButtonGroup aria-label="Basic example">
                <Button
                  className="PageButton"
                  variant="secondary" 
                  onClick={() => this.previousPage()} 
                  disabled={this.state.pageNumber <= 0}>
                    Previous
                </Button>
                <Button variant="light">{this.state.pageNumber + 1}</Button>
                <Button 
                  className="PageButton"
                  variant="secondary" 
                  onClick={() => this.nextPage()}>
                    Next
                </Button>
              </ButtonGroup>
            </div>            
          </div>
        </div>
      );
    } 
    return (
      <div className="App">
          <header className="App-header">
            <h1>
              {this.selectedParticipant.firstName} {this.selectedParticipant.lastName}
            </h1>
          </header>
          <div className="ParticipantList">
            <Partcipant
              value={this.selectedParticipant}
            />
          </div>
        </div>
    );
  }
}

export default App;
