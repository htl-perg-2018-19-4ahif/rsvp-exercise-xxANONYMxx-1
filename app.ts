import * as express from 'express';
import * as loki from 'lokijs';
import {CREATED, BAD_REQUEST, UNAUTHORIZED} from 'http-status-codes';

var app = express();
app.use(express.json());

const db = new loki(__dirname + '/db.dat', {autosave: true, autoload: true});
let guests = db.getCollection('guests');
if (!guests) {
  guests = db.addCollection('guests');
}

app.get('/guests', (req, res) => {
    res.send(guests.find());
});

app.get('/party', (req, res, next) => {
    res.send({
        title: 'Silvester Party!!!',
        location: 'At my home',
        date: new Date(12,31,2018)
    })
})

app.post('/register', (req, res, next) => {
    if(req.body.firstname === null || req.body.lastname === null){
        res.status(BAD_REQUEST).send('Missing Data');
    }else{
        if(guests.count() < 10){
            let newGuest = guests.insert({firstName: req.body.firstName, lastName: req.body.lastName});
            res.status(CREATED).send(newGuest);
        }else{
            res.status(UNAUTHORIZED).send('Max number reached');
        }
    }
})

app.listen(8080, () => console.log('API is listening'));