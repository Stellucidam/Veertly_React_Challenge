import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import {PartcipantElement, Partcipant} from './Participant';
import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

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

    this.setState({
      participants: result
      });
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

  handleLimitChange(event) {
    console.log(event.target.value);
    this.setState({limit: event.target.value}, () => this.renderParticipants());
  }

  handleClick(i) {
    this.selectedParticipant = i;
    this.setState({selectedParticipant: i});
  }

  previousPage() {
    const page = this.state.pageNumber - 1;
    this.setState({pageNumber: page}, () => this.renderParticipants());
  }

  nextPage() {
    const page = this.state.pageNumber + 1;
    this.setState({pageNumber: page}, () => this.renderParticipants());
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
          <body className="App-body">
            <div className="ParticipantList">
              <ul>
                {this.state.participants.map(p => this.renderParticipant(p))}
              </ul>            
            </div>
          </body>
          <footer className="App-footer">
            <div className="LimitChanger">
              <label>
                <input min="1" max="50" type="number" value={this.state.limit} onChange={(value) => this.handleLimitChange(value)} />
                 Names per page
              </label>
            </div>

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
          </footer>
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
          <body className="App-body">
            <div className="ParticipantList">
              <Partcipant
                value={this.selectedParticipant}
              />
            </div>
          </body>
          <footer className="App-footer">
          </footer>
        </div>
    );
  }
}

export default App;
