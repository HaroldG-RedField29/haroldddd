//const { patch } = require('./app');
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const app = require('./app');

app.listen(app.get('port'), () =>{
    console.log('Serve on port ', app.get('port'));
    console.log('Envionment: ', process.env.NODE_ENV);
});