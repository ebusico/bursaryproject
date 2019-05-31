import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { authService } from './modules/authService';

import AccessDenied from './modules/AccessDenied';
import ListTrainee from './standalone-list-trainee.component.js';
import ExportDates from './exportDates..component.js';
import CostReports from './cost-Report.component.js';
import '../css/tabs.css';

export default class TabList extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
	  currentUser: authService.currentUserValue
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
      
    }
  }

  render() {
		if(this.state.currentUser.token.role === 'finance') {
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
              CSV Reports
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '3' })}
              onClick={() => { this.toggle('3'); }}
            >
              Cost Report
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
          <ListTrainee />
          </TabPane>
          <TabPane tabId="2">
          <ExportDates />
          </TabPane>
          <TabPane tabId="3">
            <CostReports />
          </TabPane>
        </TabContent>
      </div>
    );
		}else{
			return (
			<AccessDenied/>
		);
  }
}
}
