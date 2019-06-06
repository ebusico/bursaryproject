import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { authService } from './modules/authService';

import AccessDenied from './modules/AccessDenied';
import ListUser from './list-user.component.js';
import ExportDates from './exportDates..component.js';
import ListTrainee from './standalone-list-trainee.component.js';
import CostReports from './cost-Report.component.js';
import '../css/tabs.css';
import TraineeSettings from './TraineeSettings.component';

export default class TabList extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
	  currentUser: authService.currentUserValue
    };
  }

  componentDidMount(){
    let tab = localStorage.getItem('tab'); 
    if(tab != null){
      this.setState(()=>({
          activeTab: tab
      })
      );
    }
  }
  

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
      localStorage.setItem('tab', tab);
    }
  }

  render() {
		if(this.state.currentUser.token.role === 'admin') {
    return (
      <div className="QATabs">
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              Trainees
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              Users
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '3' })}
              onClick={() => { this.toggle('3'); }}
            >
              CSV Reports
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink              
              className={classnames({ active: this.state.activeTab === '4' })}
              onClick={() => { this.toggle('4'); }}>
              Cost Report
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
          <ListTrainee />
          </TabPane>
          <TabPane tabId="2">
          <ListUser />
          </TabPane>
          <TabPane tabId="3">
          <ExportDates />
          </TabPane>
          <TabPane tabId="4">
            <CostReports />
          </TabPane>
        </TabContent>
      </div>
    );
    }
    else{
			return (
			<AccessDenied/>
		);
  }
}
}
