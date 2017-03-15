import React, { Component, PropTyeps } from 'react';
import { IndexLink } from 'react-router';
import { NavBar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Helmet from 'react-helmet';
import { Spin } from '../../components';
import config from '../../config';

class Main extends Component {// eslint-disable-line
  static propTypes = {
    children: PropTypes.any.isRequired
  };

  render() {
    require('./Main.less');

    return (
      <div>
        <Helmet {...config.app.head} />
        <Navbar inverse>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to="/">
                <span>{config.app.title}</span>
              </IndexLink>              
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
        </Navbar>

        <Navbar.Collapse>
          <Nav navbar>
            <LinkContainer to="/counter">
              <NavItem evenKey={1}>计数器</NavItem>
            </LinkContainer>
          </Nav>          
        </Navbar.Collapse>
      </div>

      <Spin />

      <div>
        {/* this will render the child routes */}
        {React.cloneElement(this.props.children, this.props)}
      </div>
    );
  }
}

export default Main;