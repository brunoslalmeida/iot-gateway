const { fork } = require('child_process');
const {PubSub} = require('@google-cloud/pubsub');
const Sensor = require('./sensor');
const Serial = require('./serial');
const pubsub = new PubSub();

class GooglePub {
    init (){
        Serial.on('arduino', (pkg) => {
            this.handleArduinoPackage(Sensor.getSensorsByType('pub', pkg.id), pkg.message)
        });
    }

    start (){}

    handleArduinoPackage(sensors, message){
        
        sensors.map(sensor => {

            const dataBuffer = Buffer.from(JSON.stringify(message));        
            pubsub.topic(sensor.topic).publish(dataBuffer).then(() => {
                console.log(''+
                    '\x1b[32mMensagem publicada no Google Cloud Pubsub com sucesso.\n'+
                    'Sensor: ' + sensor.id +' - ' + sensor.name + '\n' +
                    'Messagem:' + JSON.stringify(message) +'\x1b[0m'
                );
            }).catch(error => {
                console.log(''+
                    '\x1b[31mFalha ao publicar no Google Cloud Pubsub.\n'+
                    'Sensor: ' + sensor.id +' - ' + sensor.name + '\n' +
                    'Messagem:' + JSON.stringify(message) + '\n' +
                    'Erro:' + error + '\n' +
                    '\x1b[0m'
                );
            }); 
        });
    }
}

const google = new GooglePub();
module.exports = google;