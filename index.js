const express = require('express');
const server = express();

server.use(express.json());

let requests = 0;

// Middlewares
function validateProject(req, res, next) {
    const { id } = req.params;

    const project = projects.find((p) => {
        return p.id == id;
    });

    if(!project) {
        res.status(400).json({ error: "Project does not exists! "});
    }

    return next();

}

function logRequests(req, res, next) {
    requests++;

    console.log(`O numero de requisições até aqui é: ${requests}`);
    
    return next();
}

server.use(logRequests);


const projects = []

// GET
server.get('/projects', (req, res) => {
    return res.json(projects);
});

// POST
server.post('/projects', (req, res) => {
    const { id, title, tasks } = req.body;

    const project = {
        id,
        title,
        tasks
    }

    projects.push(project);

    return res.json(projects);
});

// DELETE
server.delete('/projects/:id', validateProject, (req, res) => {
    const { id } = req.params;

    const projectIndex = projects.findIndex((p) => {
       return p.id == id;
    });

    projects.splice(projectIndex, 1);

    return res.send();
});

// UPDATE
server.put('/projects/:id', validateProject, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find((p) => {
        return p.id == id;
    });

    project.title = title;

    return res.json(project);

});

// POST - TASKS
server.post('/projects/:id/tasks', validateProject, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find((p) => {
        return p.id == id;
    });

    project.tasks.push(title);

    res.json(project);
});

server.listen(3000);