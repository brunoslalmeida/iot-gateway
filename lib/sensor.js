const Events = require('events');
const FS = require('fs');
const Interface = require('../tools/interface');

const FILENAME = __dirname + '/../data/sensors.json';

class Sensor extends Events {  
    constructor() {    
        super();
        this.sensors = [];
    }   

    init (){
        this.sensors = JSON.parse(FS.readFileSync(FILENAME));
    }

    getSensorsByType(type, id = null){
        return this.sensors.filter(sensor => {
            if (sensor.type != type){
                return false;
            }

            if (id === null){
                return true;
            }

            return id == id;
        });
    }

    addSensor(){
        console.clear();
        console.log('Para adiconar um sensor digite: ID, Nome, Tipo (pub | sub), Tópico (pubsub)')
        Interface.question('', str => {
            let split = str.split(',');

            if (split.length != 4){
                this.emit('end', '\x1b[31mQuantidade de parâmetros inválido, todos os 4 são obrigatórios.\x1b[0m');
                return;
            }

            let id = split[0].trim();
            let name = split[1].trim();
            let type = split[2].toLowerCase().trim();
            let topic = split[3].trim();

            
            this.sensors.push = {id: id, name: name, type: type, topic: topic};
            FS.writeFileSync(FILENAME, JSON.stringify(this.sensors));

            this.emit('end', '\x1b[32mSensor ' + id + ' - ' + name + ' adicionado com sucesso \x1b[0m');
            
        });
    }

    listSensors(){
        console.clear();
        this.printAllSensors();
        console.log('');

        Interface.question('Precione enter para voltar.', _ => {this.emit('end')});
    }

    removeSensor(){
        console.clear();
        this.printAllSensors();

        Interface.question('Digite o ID do sensor que deseja remover', id => {
            if (this.sensors[id] == undefined){
                this.emit('end', '\x1b[31mNão existe sensor com o id: '+ id +' \x1b[0m');
            }else {
                let name = this.sensors[id].name;

                delete this.sensors[id];
                this.emit('end', '\x1b[32mSensor ' + id + ' - ' + name + ' removido com sucesso \x1b[0m');
            }
        });
    }

    printAllSensors(){
        console.log('\x1b[34mOs sensores cadastrados são: '+' \x1b[0m\n');        

        for (let key in this.sensors){
            console.log ('\x1b[34m' + this.sensors[key].id + ' - ' + this.sensors[key].name+ ' - ' + this.sensors[key].type+ ' - ' + this.sensors[key].topic+' \x1b[0m');
        }
    }
}

const sensor = new Sensor()
module.exports = sensor;