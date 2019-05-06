const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const ReportController = require('./controllers/ReportController')


const app = express();

app.use(cors());

const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
    socket.on('connectRoom', box => {
        socket.join(box);
    });
});

mongoose.connect('mongodb://localhost:27017/app', {
    useNewUrlParser: true
});

app.use((req, res, next) => {
    req.io = io;

    return next();
});

//app.use - CADASTRAR UM MÓDULO DENTRO DO APP
//express.json - PARA O SERVIDOR ENTENDER AS REQUISIÇÕES JSON
app.use(express.json());

//express.urlencoded - PERMITE OS ENVIOS DE ARQUIVOS NAS REQUISIÇÕES
app.use(express.urlencoded({ extended: true }));

app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));

app.use(require('./routes'));

ReportController.execute(1000);

server.listen(process.env.PORT||3333);