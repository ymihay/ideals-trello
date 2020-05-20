import '../App.css'

import React, { Component } from 'react'
import Board from 'react-trello'
import CustomCard from "./CustomCard";
import axios from "axios"
import { find, remove } from 'lodash'


const data = require('../data.json')
const ES_URL = 'http://localhost:9200'

const handleDragStart = (cardId, laneId) => {
    console.log('drag started')
    console.log(`cardId: ${cardId}`)
    console.log(`laneId: ${laneId}`)
}

const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
    console.log('drag ended')
    console.log(`cardId: ${cardId}`)
    console.log(`sourceLaneId: ${sourceLaneId}`)
    console.log(`targetLaneId: ${targetLaneId}`)
}

class KanbanBoard extends Component {
    state = {
        //boardData: { lanes: [] },
        data: { lanes: [] }
    }

    // componentDidMount () {
    //     this.getTodos();
    // }

    setEventBus = (eventBus) => {
        this.setState({ eventBus })
    }

    // async componentWillMount () {
    //     const response = await this.getBoard()
    //     this.setState({ boardData: response })
    // }
    getBoard () {
        return new Promise((resolve) => {
            resolve(data)
        })
    }

    async componentWillMount () {
        // const response = await this.getTodos()
        // this.setState({ data: response })
    }


    completeCard = () => {
        this.state.eventBus.publish({
            type: 'ADD_CARD',
            laneId: 'COMPLETED',
            card: {
                id: 'Milk',
                title: 'Buy Milk',
                label: '15 mins',
                description: 'Use Headspace app',
            },
        })
        this.state.eventBus.publish({
            type: 'REMOVE_CARD',
            laneId: 'PLANNED',
            cardId: 'Milk',
        })
    }

    addCard = () => {
        this.state.eventBus.publish({
            type: 'ADD_CARD',
            laneId: 'BLOCKED',
            card: {
                id: 'Ec2Error',
                title: 'EC2 Instance Down',
                label: '30 mins',
                description: 'Main EC2 instance down',
            },
        })
    }

    shouldReceiveNewData = (nextData) => {
        console.log('New card has been added')
        console.log(nextData)
    }

    handleCardAdd = (card, laneId) => {
        console.log(`New card added to lane ${laneId}`)
        console.dir(card)

        this.getLane(laneId)
            .then(lane => {
                    //console.log("GET!", lane)
                    if (lane && lane.cards) {
                        lane.cards.push(card)
                        this.saveLane(lane)
                    }
                }
            )
            .catch(error => {
                console.error(error);
            });
    }

    handleLaneAdd = (params) => {
        console.log('New lane added', params)

        const lane = {
            id: (params.title) ? params.title : '',
            title: (params.title) ? params.title : '',
            cards: (params.cards) ? params.cards : [],
            label: (params.label) ? params.label : ''
        }

        this.saveLane(lane)
    }

    handleCardDelete = (cardId, laneId) => {
        console.log(`Card deleted ${cardId} from lane ${laneId}`)
        return this.getLane(laneId)
            .then(lane => {
                    if (lane && lane.cards) {
                        const removed = remove(lane.cards, {
                            id: cardId
                        });
                        console.log("REMOVED, ", removed)
                        this.saveLane(lane)
                        return removed;
                    }
                }
            )
            .catch(error => {
                console.error(error);
                return null;
            });
    }

    handleLaneDelete = (laneId) => {
        console.log(`Delete lane ${laneId}`)
        //const url = lane && lane.id ? `${ES_URL}/lanes/default/${lane.id}` : `${ES_URL}/lanes/default`
        axios
            .delete(`${ES_URL}/lanes/default/${laneId}`)
            .then(res => {
                console.log(res)
            })
            .catch(error => {
                console.error(error);
            });
    }

    handleCardMoveAcrossLanes = (fromLaneId, toLaneId, cardId, index) => {
        console.log(`Move card ${cardId} from lane ${fromLaneId} to lane ${toLaneId}`)
        // Delete
        this.handleCardDelete(cardId, fromLaneId).then(
            cards => {
                if (cards && cards.length > 0) {
                    const card = cards[0]
                    console.log("!!!!!", card)
                    this.handleCardAdd(card, toLaneId)
                }
            }
        )
    }

    componentDidMount () {
        this.getTodos();
    }

    getTodos = () => {
        axios
            .get(`${ES_URL}/lanes/default/_search`)
            .then(res => {
                console.log(res)
                const data = {
                    lanes: res.data.hits.hits.map(hit => ({
                        id: hit._source.id,
                        title: hit._source.title,
                        label: (hit._source.label) ? hit._source.label : '',
                        cards: (hit._source.cards) ? hit._source.cards : []
                    }))
                };

                this.setState({ data });
            })
            .catch(error => {
                this.setState({ data: { lanes: [] } });
                console.error(error);
            });
    };

    saveLane = (lane) => {
        const url = lane && lane.id ? `${ES_URL}/lanes/default/${lane.id}` : `${ES_URL}/lanes/default`
        console.log('data: ', lane)
        axios
            .post(url,
                lane
            )
            .then(res => {
                console.log(res)
            })
            .catch(error => {
                console.error(error);
            });
    };

    getLane = (laneId) => {
        return axios
            .get(`${ES_URL}/lanes/default/${laneId}`)
            .then(res => {
                console.log('Get lane:', res)
                return res.data._source
            })
            .catch(error => {
                console.error(error);
                return {}
            });
    };


    render () {
        const { data } = this.state;
        return (
            <div className="App">
                <div className="App-header">
                    <h3>React Trello Demo</h3>
                </div>
                <div className="App-intro">
                    <Board
                        editable
                        canAddLanes={true}
                        editLaneTitle={true}
                        draggable
                        onCardAdd={this.handleCardAdd}
                        onCardDelete={this.handleCardDelete}
                        onCardMoveAcrossLanes={this.handleCardMoveAcrossLanes}
                        onLaneAdd={this.handleLaneAdd}
                        onLaneDelete={this.handleLaneDelete}
                        data={data}
                        components={{ Card: CustomCard }}
                        onDataChange={this.shouldReceiveNewData}
                        eventBusHandle={this.setEventBus}
                        handleDragStart={handleDragStart}
                        handleDragEnd={handleDragEnd}
                    />
                </div>
            </div>
        )
    }
}

export default KanbanBoard
