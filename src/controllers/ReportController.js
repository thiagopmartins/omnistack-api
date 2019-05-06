const Report = require('../models/Report'); 

const request = require('request');
const diff = require('deep-diff').diff;
const schedule = require('node-schedule');


const json = `{"period":{"dtInicial":null,"dtFinal":null},"projectYear":null,"asset":[],"area":[],"city":[],"status":[],"contractor":[],"contracted":[],"projectType":[{"id":2,"description":"Investimento","selected":true}]}`;

class ReportController {

    async execute(executionTime) {

        let startTime = new Date(Date.now() + executionTime);
        schedule.scheduleJob(startTime, () => {
            console.log(startTime);
            this.store();
        });
    }

    async store() {
        this.execute(5000);
        let differences;
        request.post({
            'headers': { "content-type": "application/json" },
            'url': 'http://www.sicop.sc.gov.br/sef-map-backend/source/map/project/list',
            'body': json
        }, async (err, res, body) => {
            if (err) return console.dir(err);
            let jsonBody = JSON.parse(body);

            for (const obra of jsonBody) {
                const recentReport = await Report.Report.findOne({ 'id_obra': '' + obra.id });
                if (recentReport !== null && recentReport.length !== 0)
                    differences = diff(JSON.parse(JSON.stringify(recentReport.content)), JSON.parse(JSON.stringify(obra)));

                if (recentReport === null || recentReport.length === 0) {
                    console.dir('Criando um item novo: ', obra);
                    const report = Report.Report.create({ content: JSON.parse(JSON.stringify(obra)), id_obra: obra.id });
                } else if (differences !== null && differences !== undefined) {
                    console.dir('Atualizando um item: ', obra);
                    console.dir(differences);
                    Report.Report.update({ 'id_obra': `${obra.id}` }, { content: JSON.parse(JSON.stringify(obra)) }, (err) => {
                        console.log(err);
                    });
                    Report.ReportUpdated.create({ oldContent: JSON.parse(JSON.stringify(obra)), newContent: JSON.parse(JSON.stringify(recentReport.content)), difference: JSON.parse(JSON.stringify(differences)), idObra: recentReport._id } )
                }
            }
            
        });
    }

}

module.exports = new ReportController();