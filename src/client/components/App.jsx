import React, { Component } from 'react';
import axios from 'axios';

const API_URL = '/api/items?=';

class App extends Component {
 
  constructor(props){
    super(props);
    
    this.state= {
              query: '',
              results: []
            };
  }

 getInfo()  {
   console.log("voy a buscar: ", this.state.query);
   fetch(API_URL+this.state.query)
   .then(result=>result.json())
   .then(items=>this.setState({
                           results: items
                      }))
  }

  handleInputChange() {
    
    this.setState({
      query: this.refs.search.value
    });
  }

  handleSubmit(event) {
    
    console.log('A name was submitted: ' + this.state.query);
    event.preventDefault();
    this.getInfo();

  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input
          placeholder="Search for..."
          ref="search"
          onChange={this.handleInputChange.bind(this)}
          onKeyPress={this.buscar}
        />
        <p>{this.state.query}</p>
        <input type="submit" value="Submit" />
      </form>
    )
  }

}

export default App;