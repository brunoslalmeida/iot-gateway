const { Fork } = require('child_process');
const {PubSub} = require('@google-cloud/pubsub');
const Sensor = require('./sensor');

const pubsub = new PubSub();

(function start (){
    Sensor.init(); 
    let sensors = Sensor.getSensorsByType('sub');
    sensors.map(sensor => {        
        let subscription = pubsub.subscription(sensor.topic);
        subscription.on('message', message => {handleSubscription(sensor, message)});
        subscription.on('error', console.log);
        subscription.on('close', () => {console.log("On Close")});
    })
    
})();

function handleSubscription(sensor, message){
    console.log(''+
        '\x1b[34mMensagem recebida do Google Cloud Pubsub. '+
        'Sensor: ' + sensor.id +' - ' + sensor.name
    );

    message.ack();
    process.send({sensor: sensor, data: message.data});
}
