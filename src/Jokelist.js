import React, { Component } from 'react' //React Import
import "./Jokelist.css" // files import
import axios from "axios"   // Npm Import
import uuid from "uuid/v4"
import Joke from './Joke'   //Componant Import

 class Jokelist extends Component {
    static defaultProps = {
        NumJokesGet :10,
    }
    constructor(props){
        super(props);
        this.state={
            jokes : JSON.parse(window.localStorage.getItem("jokes") || "[]"),
        }
        this.handleClick = this.handleClick.bind(this)
    }
    async componentDidMount(){
        if(this.state.jokes.length === 0 ) this.getJokes()

    } 
    async getJokes(){
        let jokes =[]
        while(this.props.NumJokesGet > jokes.length){
            let res = await axios.get('https://icanhazdadjoke.com/',{
            headers:{Accept : "application/json"}
            })
            jokes.push({id: uuid() ,text : res.data.joke, vote:0})
        }
        this.setState(st =>({jokes:[...st.jokes,...jokes]}),/** use spread oprator cause jokes is an array it will add new array in state jokes i.e nested arrays */
        () => window.localStorage.setItem("jokes",JSON.stringify(this.state.jokes))
        )
        window.localStorage.setItem(
            "jokes",
            JSON.stringify(jokes)
        )
    }
    handleVote(id, delta){
        this.setState(
            st => ({
              jokes: st.jokes.map(j =>
                j.id === id ? { ...j, vote: j.vote + delta } : j
              )
            }),
            () => window.localStorage.setItem("jokes",JSON.stringify(this.state.jokes)))
    }
    handleClick(){
        this.getJokes()
    }
    render() {
        let jokes = this.state.jokes.sort((a,b) => b.vote - a.vote)
        return (
            <div className="JokeList">
                <div className="JokeList-sidebar">
                    <h1 className="JokeList-title">
                        <span>Jokes</span>
                    </h1>
                    <img alt="14451" src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' />
                    <button className='JokeList-getmore' onClick = {this.handleClick}>
                    Fetch Jokes
                    </button>
                </div>
                <div className="JokeList-jokes">{
                    jokes.map(j => (
                        <Joke 
                        text = {j.text} 
                        vote={j.vote} 
                        upvote ={() => this.handleVote(j.id, 1)}
                        downvote ={() => this.handleVote(j.id, -1)}
                        />
                    ))
                }</div>
            </div>
        )
    }
}

export default Jokelist;
