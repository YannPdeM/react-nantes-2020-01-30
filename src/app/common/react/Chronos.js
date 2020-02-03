import React, {useEffect, useReducer} from 'react';
import './Home.css';

const heart = (() => {
   const clients = [];
   const beat = () => {
      const lastHeartbeat = Date.now();
      clients.forEach((setLastHeartbeat) => {
         setLastHeartbeat(lastHeartbeat);
      });
      setTimeout(beat, 1000/60);
   };
   if(typeof window !== 'undefined') {
      setTimeout(beat, 1000/60);
   }

   return {
      addSubscriber: (subscriber) => {
         clients.push(subscriber)
      },
      removeSubscriber: (subscriber) => {
         const position = clients.indexOf(subscriber);
         if(position > -1) {
            clients.splice(position, 1);
         }
      },
   };
})();

const formatElapsedTime = (elapsedTime) => {
   const ONE_SECOND = 1000;
   const ONE_MINUTE = 60 * ONE_SECOND;
   const ONE_HOUR = 60 * ONE_MINUTE;

   const hours = Math.floor(elapsedTime / ONE_HOUR);
   const restAfterHours = elapsedTime - hours * ONE_HOUR;

   const minutes = Math.floor(restAfterHours / ONE_MINUTE);
   const restAfterMinutes = restAfterHours - minutes * ONE_MINUTE;

   const seconds = Math.floor(restAfterMinutes / ONE_SECOND);
   const milliseconds = restAfterMinutes - seconds * ONE_SECOND;


   const formatTo2Digits = (number) => number > 9 ? `${number}` : `0${number}`;

   const formatHours = (hours) => (hours > 0 ? `${hours}:` : '');

   const formatMinutes = (hours, minutes) => hours > 0 ? formatTo2Digits(minutes) : `${minutes}`;

   const formatMilliseconds = (milliseconds) => milliseconds;

   return `${formatHours(hours)}${formatMinutes(hours, minutes)}:${formatTo2Digits(seconds)}.${formatMilliseconds(milliseconds)}`
};

const POSSIBLE_STATES = {
   IDLE: 'idle',
   RUNNING: 'running',
   PAUSED: 'paused'
};
const EVENT_TYPES = {
   STARTED: 'started',
   PAUSED: 'paused',
   RESUMED: 'resumed',
   RESET: 'reset',
   TICKED: 'ticked'
};

const FunctionTimeComponent = ({ heart }) => {
   const initialState = {
      currentState: POSSIBLE_STATES.IDLE,
      isRunning: false,
      accumulatedElapsedTime: 0,
      lastHeartbeat: null,
   };
   const reducer = (state, action) => {
      switch (action.type) {
         case EVENT_TYPES.STARTED:
            return {
               currentState: POSSIBLE_STATES.RUNNING,
               isRunning: true,
               accumulatedElapsedTime: 0,
               lastHeartbeat: action.lastHeartbeat,
            };
         case EVENT_TYPES.PAUSED: {
            return {
               ...state,
               currentState: POSSIBLE_STATES.PAUSED,
               isRunning: false,
            };
         }
         case EVENT_TYPES.RESUMED: {
            return {
               ...state,
               currentState: POSSIBLE_STATES.RUNNING,
               isRunning: true,
               lastHeartbeat: action.lastHeartbeat,
            };
         }
         case EVENT_TYPES.RESET: {
            return {...initialState};
         }
         case EVENT_TYPES.TICKED: {
            return state.isRunning ? {
               ...state,
               accumulatedElapsedTime: state.accumulatedElapsedTime + (action.lastHeartbeat - state.lastHeartbeat),
               lastHeartbeat: action.lastHeartbeat,
            } : state;
         }
         default:
            throw `Unknown event type: ${action.type}`
      }
   };
   const [state, dispatch] = useReducer(reducer, {...initialState});

   const onHeartbeat = (newHeartbeat) => {
      dispatch({
         type: EVENT_TYPES.TICKED,
         lastHeartbeat: newHeartbeat,
      });
   };

   useEffect(() => {
      heart.addSubscriber(onHeartbeat);
      return () => {
         heart.removeSubscriber(onHeartbeat);
      };
   }, []);


   const run = (ev) => {
      ev.preventDefault();
      dispatch({
         type: state.currentState === POSSIBLE_STATES.IDLE ? EVENT_TYPES.STARTED : EVENT_TYPES.RESUMED,
         lastHeartbeat: Date.now()
      });
   };

   const pause = (ev) => {
      ev.preventDefault();
      dispatch({
         type: EVENT_TYPES.PAUSED
      });
   };

   const reset = (ev) => {
      ev.preventDefault();
      dispatch({
         type: EVENT_TYPES.RESET
      });
   };

   return (
      <>
         <h1>{formatElapsedTime(state.accumulatedElapsedTime)}</h1>
         {state.isRunning ? <button onClick={pause}>Pause</button> : <button onClick={run}>Start</button>}
         <button onClick={reset}>Reset</button>
      </>
   );
};

class ClassTimeComponent extends React.Component {

   constructor (props) {
      super(props);
      this.initialState = {
         currentState: POSSIBLE_STATES.IDLE,
         isRunning: false,
         accumulatedElapsedTime: 0,
         lastHeartbeat: null,
      };
      this.state = {...this.initialState};
      this.onHeartbeat = this.heartbeatDispatcher.bind(this);
   }

   componentDidMount () {
      this.props.heart.addSubscriber(this.onHeartbeat);
   }

   componentWillUnmount () {
      this.props.heart.removeSubscriber(this.onHeartbeat);
   }

   updateStateFromAction(action) {
      switch (action.type) {
         case EVENT_TYPES.STARTED:
            this.setState({
               ...this.state,
               currentState: POSSIBLE_STATES.RUNNING,
               isRunning: true,
               accumulatedElapsedTime: 0,
               lastHeartbeat: action.lastHeartbeat,
            });
            break;
         case EVENT_TYPES.PAUSED: {
            this.setState({
               ...this.state,
               currentState: POSSIBLE_STATES.PAUSED,
               isRunning: false,
            });
            break;
         }
         case EVENT_TYPES.RESUMED: {
            this.setState({
               ...this.state,
               currentState: POSSIBLE_STATES.RUNNING,
               isRunning: true,
               lastHeartbeat: action.lastHeartbeat,
            });
            break;
         }
         case EVENT_TYPES.RESET: {
            this.setState({...this.initialState});
            break;
         }
         case EVENT_TYPES.TICKED: {
            if(this.state.isRunning) {
               this.setState({
                  ...this.state,
                  accumulatedElapsedTime: this.state.accumulatedElapsedTime + (action.lastHeartbeat - this.state.lastHeartbeat),
                  lastHeartbeat: action.lastHeartbeat,
               });
            }
            break;
         }
         default:
            throw `Unknown event type: ${action.type}`
      }
   }

   heartbeatDispatcher (newHeartbeat) {
      this.updateStateFromAction({
         type: EVENT_TYPES.TICKED,
         lastHeartbeat: newHeartbeat,
      });
   };

   run (ev) {
      ev.preventDefault();
      this.updateStateFromAction({
         type: this.state.currentState === POSSIBLE_STATES.IDLE ? EVENT_TYPES.STARTED : EVENT_TYPES.RESUMED,
         lastHeartbeat: Date.now()
      });
   }

   pause (ev) {
      ev.preventDefault();
      this.updateStateFromAction({
         type: EVENT_TYPES.PAUSED
      });
   }

   reset (ev) {
      ev.preventDefault();
      this.updateStateFromAction({
         type: EVENT_TYPES.RESET
      });
   }

   render () {
      return (
         <>
            <h1>{formatElapsedTime(this.state.accumulatedElapsedTime)}</h1>
            {this.state.isRunning ? <button onClick={(ev) => this.pause(ev)}>Pause</button> : <button onClick={(ev) => this.run(ev)}>Start</button>}
            <button onClick={(ev) => this.reset(ev)}>Reset</button>
         </>
      );
   }
}

export default () => (
   <>
      <FunctionTimeComponent heart={heart} />
      <ClassTimeComponent heart={heart} />
   </>
);
