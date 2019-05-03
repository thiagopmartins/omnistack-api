const Report = require('../models/Report');
const request = require('request');
var diff = require('deep-diff').diff;


const json = `{"period":{"dtInicial":null,"dtFinal":null},"projectYear":null,"asset":[],"area":[],"city":[],"status":[],"contractor":[],"contracted":[],"projectType":[{"id":2,"description":"Investimento","selected":true}]}`;

class ReportController {
    async store() {
        
        const recentReport = await Report.findOne().sort({ createdAt: -1 });
        let differences;
        request.post({
            'headers': { "content-type": "application/json" },
            'url': 'http://www.sicop.sc.gov.br/sef-map-backend/source/map/project/list',
            'body': json
        }, (err, res, body) => {
            if(err) return console.dir(err);
            let jsonBody = JSON.parse(body);

            if (recentReport !== null)
                differences = diff(JSON.parse(JSON.stringify(recentReport.content)), jsonBody);
            
            if (differences !== null && differences !== undefined  || recentReport === null) 
            {
                console.log(differences);
                console.dir('Atualizando a lista de obras...');
                const report = Report.create({ content: JSON.parse(body) });
            }
            else 
            {
                console.log('Não foram encontradas alterações.');
            }
        });


    }

}

module.exports = new ReportController();