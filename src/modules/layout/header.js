import React from 'react'
import jQuery from '../../utils/jquery';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';

class Header extends React.Component {
    constructor(props){
        super(props);
        
        this.logout = this.logout.bind(this);
    }
    
    logout(event){
        event.preventDefault();
        
        this.props.dispatch({
            type: "LOGOUT"
        });
    }
    
    render(){   
        return (
            <div className="navbar-nav d-flex flex-column flex-md-row align-items-center px-md-2  bg-white">
              <h5 className="my-0 mr-md-auto font-weight-normal">Boda Telecom Suite - CE</h5>
              <nav className="my-2 my-md-0 mr-md-3">
                <a className="text-dark" href="#"><FontAwesomeIcon icon="home" className="mb-1"/> Dashboard</a>
                <a className="p-2 text-secondary" href="#"><FontAwesomeIcon icon="plug" className="mb-1"/> Modules</a>
                <a className="p-2 text-secondary" href="#"><FontAwesomeIcon icon="cog" className="mb-1"/> Settings</a>
                <a className="p-2 text-secondary" href="#"><FontAwesomeIcon icon="question-circle" className="mb-1"/> Help</a>
                <a className="p-2 text-secondary" href="#"><FontAwesomeIcon icon="user" className="mb-1"/> User</a>
                <a className="p-2 text-secondary" href="#"><FontAwesomeIcon icon="power-off" className="mb-1" onClick={this.logout}/></a>
                
              </nav>
            </div> 
        );
    
    }
    
}


export default connect()(Header);