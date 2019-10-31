const Serial = require('./serial');
const Sensor = require('./sensor');
const GooglePub = require('./google-pub');
const PubSub = require('./google-sub');

const Interface = require('../tools/interface');

class CLI {
    constructor() {
        this.states = [];
        this.states.push(
            { from: Sensor, function: Sensor.addSensor, message: 'Adicionar Sensor / Atuador' },
            { from: Sensor, function: Sensor.listSensors, message: 'Listar Sensores / Atuador' },
            { from: Sensor, function: Sensor.removeSensor, message: 'Remover Sensor  / Atuador' },
            { from: this, function: this.start, message: 'Iniciar Deamon' },
        );
    }

    init() {            
        Sensor.on('end', message => this.printCLIBase(message || ''));
        Serial.init();
        Sensor.init();
        this.printCLIBase();
    }

    processInput(str) {  
			console.log(str);  
        if (this.states[str] == undefined){
            let message = '\x1b[31m' + str + ' é uma opção inválida, tente novamente\x1b[0m'; 
            this.printCLIBase(message);
        }
        else if (typeof(this.states[str].function) != 'function'){
            let message = '\x1b[31mNão existe função cadastrada para opção ' + str + ' ' + this.states[str].message +' \x1b[0m';        
            this.printCLIBase(message);
        }
        else {
            this.states[str].function.call(this.states[str].from);    
        }   
    }

    printStates() {
        this.states.map(
            (state, index) => console.log('\x1b[34m%d - %s\x1b[0m', index, state.message)
        );
    }

    printCLIBase (message = '') {
        console.clear();
        console.log('\x1b[34mO que você deseja fazer?\x1b[0m');

        console.log('');

        console.log(message);
        console.log('');

        this.printStates();

        console.log('');
        Interface.question('', str => this.processInput(str));
    }

    start(){
        Serial.start();
        GooglePub.init();
        PubSub.start();
    }

}

const cli = new CLI();
module.exports = cli;