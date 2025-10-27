//Create web server
const http = require('http');
const fs = require('fs');
const path = require('path');

//Define port
const PORT = 3000;

//Create server
const server = http.createServer((req, res) => {
    //Set header
    res.setHeader('Content-Type', 'application/json');

    //Handle different routes
    if (req.method === 'GET' && req.url === '/comments') {
        //Read comments from file
        fs.readFile(path.join(__dirname, 'comments.json'), 'utf8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Failed to read comments' }));
                return;
            }
            res.statusCode = 200;
            res.end(data);
        });
    } else if (req.method === 'POST' && req.url === '/comments') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const newComment = JSON.parse(body);
            fs.readFile(path.join(__dirname, 'comments.json'), 'utf8', (err, data) => {
                if (err) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: 'Failed to read comments' }));
                    return;
                }
                const comments = JSON.parse(data);
                comments.push(newComment);
                fs.writeFile(path.join(__dirname, 'comments.json'), JSON.stringify(comments), err => {
                    if (err) {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: 'Failed to save comment' }));
                        return;
                    }
                    res.statusCode = 201;
                    res.end(JSON.stringify(newComment));
                });
            });
        });
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

