import { observable, action } from "mobx";

const apis = {
    distanceMatrix(origins, destinations) {

        origins = origins.join('|');
        destinations = destinations.join('|');

        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        let url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=km&origins=${origins}&destinations=${destinations}&key=AIzaSyBgdm_W5sOk4QPdcNRwKZaPJYI1_W6tdSY`;
        return fetch(proxyurl + url)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson.rows[0].elements;
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

//to handle the case for distancematrix response status = "ZERO_RESULTS"
const MAX_DISTANCE = 999999999;

class agentsStore {
    @observable sortedMissions = [];
    @observable missionsList = [
        {
            id: 1,
            agent: '007', country: 'Brazil',
            address: 'Avenida Vieira Souto 168 Ipanema, Rio de Janeiro', date: 'Dec 17, 1995, 9:45:17 PM'
        },
        {
            id: 2,
            agent: '005', country: 'Poland',
            address: 'Rynek Glowny 12, Krakow',
            date: 'Apr 5, 2011, 5:05:12 PM'
        },
        {
            id: 3,
            agent: '007', country: 'Morocco',
            address: '27 Derb Lferrane, Marrakech',
            date: 'Jan 1, 2001, 12:00:00 AM'
        },
        {
            id: 4,
            agent: '005', country: 'Brazil',
            address: 'Rua Roberto Simonsen 122, Sao Paulo',
            date: 'May 5, 1986, 8:40:23 AM'
        },
        {
            id: 5,
            agent: '011', country: 'Poland',
            address: 'swietego Tomasza 35, Krakow',
            date: 'Sep 7, 1997, 7:12:53 PM'
        },
        {
            id: 6,

            agent: '003', country: 'Morocco',
            address: 'Rue Al-Aidi Ali Al-Maaroufi, Casablanca', date: 'Aug 29, 2012, 10:17:05 AM'
        },
        {
            id: 7,
            agent: '008', country: 'Brazil',
            address: 'Rua tamoana 418, tefe',
            date: 'Nov 10, 2005, 1:25:13 PM'
        },
        {
            id: 8,
            agent: '013', country: 'Poland',
            address: 'Zlota 9, Lublin',
            date: 'Oct 17, 2002, 10:52:19 AM'
        },
        {
            id: 9,
            agent: '002', country: 'Morocco',
            address: 'Riad Sultan 19, Tangier',
            date: 'Jan 1, 2017, 5:00:00 PM'
        },
        {
            id: 10,
            agent: '009', country: 'Morocco',
            address: 'atlas marina beach, agadir',
            date: 'Dec 1, 2016, 9:21:21 PM'
        }
    ]

    @action mostIsolatedCountry() {

        let groupedAgents = this.missionsList.reduce((mission, curr) => {
            if (!mission[curr.agent]) mission[curr.agent] = [];
            mission[curr.agent].push(curr);
            return mission;
        }, {});
        let groupedCountries = this.missionsList.reduce((mission, curr) => {
            if (!mission[curr.country]) mission[curr.country] = [];
            mission[curr.country].push(curr);
            return mission;
        }, {});

        let isolatedSumByCountry = {};
        let maxCount = 0;
        let mostIsolatedCountryRes = null;
        for (let [key, value] of Object.entries(groupedCountries)) {
            value.forEach(element => {
                isolatedSumByCountry[key] = (isolatedSumByCountry[key] || 0) + (groupedAgents[element.agent].length === 1 ? 1 : 0);
            });
            if (isolatedSumByCountry[key] > maxCount) {
                maxCount = isolatedSumByCountry[key];
                mostIsolatedCountryRes = key;
            }
        }
        return mostIsolatedCountryRes;
    }

    distanceMatrix(missions) {
        let origins = ["10 Downing st. London"];
        let destinations = missions.map(mission => mission.address)

        return apis.distanceMatrix(origins, destinations).then(res => {
            let closest = res[0].status === "ok" ? res[0].distance.value : MAX_DISTANCE;
            let farthest = closest;
            let farthestId = missions[0].id;
            let closestId = farthestId;
            for (let i = 1; i < res.length; i++) {
                let disValue = res[i].status === "OK" ? res[i].distance.value : MAX_DISTANCE;
                if (disValue > farthest) {
                    farthest = disValue;
                    farthestId = missions[i].id;
                }
                if (disValue < closest) {
                    closest = disValue;
                    closestId = missions[i].id;
                }
            }
            return {
                closestId: closestId,
                farthestId: farthestId
            };
        });
    }

    @action sortAndMark() {
        let sortedByDate = this.missionsList.sort((a, b) => {
            return new Date(a.date).getTime() -
                new Date(b.date).getTime()
        });
        this.distanceMatrix(sortedByDate).then(disRes => {
            this.sortedMissions = sortedByDate.map(mission => {
                if (mission.id === disRes.closestId) {
                    mission.closest = true;
                }
                if (mission.id === disRes.farthestId) {
                    mission.farthest = true;
                }
                return mission;
            })
        });
    }
}
export default new agentsStore();