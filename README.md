React Piex
-----------
Hierarchical Dependency Injection for React.

## Install

```bash
npm install react-piex
yarn add react-piex
```

## Example

```js
// App.jsx
import React, { Component } from 'react';
import { Provider, Context, Listener  } from 'react-piex';

import Header from './Header';

@Provider('app')
export default class App extends Component {
  @Context title = "awesome";
  @Context number = 1;
  @Listener titleChang;
  
  componentDidMount() {
    this.titleChang.subscribe(x=>{
      this.number=x
    })
  }

  render() {
    return (
      <div>
        <Header />
        {this.number}
      </div>
     )
  }
}


// Header.jsx
import Title from './Title';

export default () => {
  return (
    <header>
      <Title />
    </header>
  )
}

// Title.jsx
import { Consumer } from 'react-piex';

@Consumer('app', ['title', 'number','titleChang'])
export default class Title extends Component {

  render() {
    const { title, number, titleChang } = this.props;
    
    return (
      <header>
        <h1>{title}</h1>
        <button onClick={() => titleChang(number+1)}>{number}</button>
      </header>
    )
  }
}
```