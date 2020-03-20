const app = require('express')();

app.get('/test', (req, res) => {
    res.send({ name: 'hankang', age: 10 });
})

app.listen(3000, () => {
    console.log('server is running on port 3000');
    
});