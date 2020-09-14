import React, { Component } from 'react';
import { inject, observer } from "mobx-react";

import "./agents-list.scss"

@inject('AgentsStore')
@observer
class AgentsList extends Component {


    componentDidMount() {
        this.props.AgentsStore.sortAndMark();
    }

    render() {
        let mostIsolatedCountry = this.props.AgentsStore.mostIsolatedCountry();
        let missionsList = this.props.AgentsStore.sortedMissions;

        return (
            <div className="missions-list-container">
                <div>Most Isolated Country: {mostIsolatedCountry}</div>
                {missionsList && missionsList.length > 0 ?
                    <>
                        <div className="grid header">
                            <div>
                                <strong>Agent Id</strong>
                            </div>
                            <div>
                                <strong>Country</strong>
                            </div>
                            <div>
                                <strong>Address</strong>
                            </div>
                            <div>
                                <strong>Date</strong>
                            </div>
                        </div>
                        {missionsList.map(mission =>
                            <div key={mission.id} className={`grid ${mission.farthest ? "farthest" : ""} ${mission.closest ? "closest" : ""}`}>
                                <div>{mission.agent}</div>
                                <div>{mission.country}</div>
                                <div>{mission.address}</div>
                                <div>{mission.date}</div>
                            </div>
                        )}
                        <div className="footer">
                            <div>{missionsList.length} missions</div>
                        </div>
                    </>
                    : <div className="loader"><div>Loading...</div></div>}
            </div>

        )
    };
}
export default AgentsList;
