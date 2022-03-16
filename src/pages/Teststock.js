import React, {useEffect, useState} from 'react'
import protobuf from 'protobufjs';
import './Teststock.css'
const {Buffer} = require('buffer/');

const emojis = {
  '' : '',
  'up' : '🚀',
  'down' : '💩',
}


function formatPrice(price){
  return `$${price.toFixed(2)}`
}

const Teststock = () => {
  const [stonk, setStonk] = useState(null);
  const [direction, setDirection] = useState('');

  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const ws = new WebSocket('wss://streamer.finance.yahoo.com');
    protobuf.load('./YPricingData.proto', (error, root) => {
      if(error){
        return console.log(error);
      }
      const Yaticker = root.lookupType("yaticker");
      ws.onopen = function open() {
        console.log('connected');
        ws.send(JSON.stringify({
          subscribe: [(params.get('name') || 'GME').toUpperCase()],
        }));
        
      };
  
      ws.onclose = function close() {
        console.log('disconnected');
      };
  
      ws.onmessage = function incoming(message) {
        // message.data
        const next = Yaticker.decode(new Buffer(message.data, 'base64'))
        // setPreviousStonk(stonk);
        setStonk((current) => {
          if(current){
            const nextDirection = current.price < next.price ? "up" : current.price > next.price ? 'down' : '' 
            if (nextDirection) {
              setDirection(nextDirection)
            }
          }
          return next;
        });

      };
    });
  }, [])


  return (
    <div>
      <h1>Stocks</h1>
        <p>
          {stonk && <p className={direction}>{stonk.id} {formatPrice(stonk.price)} {emojis[direction]}</p>}
        </p>
    </div>
  )
}

export default Teststock
