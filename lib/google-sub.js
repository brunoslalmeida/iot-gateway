const {PubSub} = require('@google-cloud/pubsub');
const Sensor = require('./sensor');
const Serial = require('./serial');

const pubsub = new PubSub();

sub = {};
sub.start = () => {
    Sensor.init(); 
 
		let sensors = Sensor.getSensorsByType('sub');
    sensors.map(sensor => {        
        let subscription = pubsub.subscription(sensor.topic);
        subscription.on('message', message => {handleSubscription(sensor, message)});
        subscription.on('error', console.log);
        subscription.on('close', () => {console.log("On Close")});
    })
    
};

function handleSubscription (sensor, message) {
    console.log(''+
        '\x1b[34mMensagem recebida do Google Cloud Pubsub. '+
        'Sensor: ' + sensor.id +' - ' + sensor.name
		);
		
    message.ack();
		
		let s = Buffer.from(message.data).toString();
		console.log(s);
		Serial.sendToArduino(sensor, s);
}

module.exports = sub;
