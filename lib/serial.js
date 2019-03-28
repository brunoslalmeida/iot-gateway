const SerialPort = require('serialport');
const Events = require('events');
const Readline = SerialPort.parsers.Readline;

class Serial extends Events {
    init () {
        this.port = new SerialPort(process.env.SERIAL_PORT, {
            baudRate: parseInt(process.env.SERIAL_BOUND_RATE, 10)
        }, (err) => {
            if(err){
                console.log(err);
                process.exit(1);
            }

            this.parser = this.port.pipe(new Readline())
        });

        
    }

    start(){
        let parent = this;
        this.parser.on('data', function (data) {            
            console.log('\x1b[34mMensagem recebida do arduino: ' + data + '\x1b[0m');
            parent.emit('arduino', JSON.parse(data));                   
        });
    }

    sendToArduino(sensor, message){        
        this.port.write(message, function(err) {
            if (err){
                console.log(''+
                    '\x1b[31mNão foi possível enviar mensagem para o arduino.\n'+
                    'Sensor: ' + sensor.id +' - ' + sensor.name + '\n' +
                    'Erro:' + err +
                    '\x1b[0m'
                );

                return;
            }

            console.log(''+
                '\x1b[32mMensagem enviada para o arduino com sucesso.\n'+
                'Sensor: ' + sensor.id +' - ' + sensor.name + '\n' +
                'Messagem:' + message +
                '\x1b[0m'
            );
        });
    }
}
const serial = new Serial();
module.exports = serial;