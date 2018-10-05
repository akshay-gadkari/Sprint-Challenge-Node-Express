const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const projects = require('./data/helpers/projectModel.js');
const actions = require('./data/helpers/actionModel.js');

const server = express();
server.use(express.json());
server.use(cors({}));

const errorHelper = (status, message, res) => {
    res.status(status).json({ error: message });
};

//==========PROJECTS==========
server.get('/projects', (req, res) => {
    console.log(req.body);
    projects.get()
	.then(projects => {
	    console.log(`\n ** projects ** \n`, projects);
	    res.json(projects);
	})
	.catch(err => res.status(500).send(err));
});


server.post('/projects', (req, res) => {
    console.log(req.body);
    const {name, description} = req.body;
    projects.insert({name, description})
    	.then(response => {
	    const {id} = response;
	    // res.status(201).json(response);
	    projects.get(id)
	    	.then(projectId => {
	    	    if (name.length >= 128 || !name) {
	    	    	return res.status(400).json({
	    	    	    errorMessage: 'Name must be under 128 characters.'
	    	    	});
	    	    }
	    	       res.status(201).json(projectId);
	    	});
	})
	.catch(err => console.error(err));
});

server.delete('/projects/:id', (req, res) => {
    const {id} = req.params;
    projects.remove(id)
	.then(removedProject => {
	    console.log(removedProject);
	    res.status(200).json(removedProject);
	})
	.catch(err => res.status(404));
});

server.put('/projects/:id', (req, res) => {
    const {id} = req.params;
    const {name} = req.body;
    const newUser = {name};
    projects.update(id, newUser)
	.then(project => {
	    res.status(200).json(project);
	})
	.catch(err => console.log(err));
});

server.get('/projects/actions/:id', (req, res) => {
    projects.get(req.params.id)
	.then(projects => {
	    console.log(`\n ** projects ** \n`, projects);
	    res.json(projects);
	})
	.catch(err => res.status(500).send(err));
});


//==========ACTIONS==========
server.get('/actions/:id', (req, res) => {
    actions.get(req.params.id)
	.then(actions => {
	    console.log(`\n ** actions ** \n`, actions);
	    res.json(actions);
	})
	.catch(err => res.status(500).send(err));
});

server.get('/actions', (req, res) => {
    actions
	.get()
	.then(foundActions => {
	    res.json(foundActions);
	})
	.catch(err => res.status(500).send(err));
});

server.post('/actions', (req, res) => {
    console.log(req.body);
    const { project_id, description, notes } = req.body;
    actions.insert({ project_id, description, notes })
    	.then(response => {
	    const {id} = response;
	    // res.status(201).json(response);
	    actions.get(id)
	    	.then(projectId => {
	    	    if (description.length >= 128 || !description || !notes || !project_id) {
	    	    	return res.status(400).json({
	    	    	    errorMessage: 'Youre either missing something or have a description over 128 chr.'
	    	    	});
	    	    }
	    	       res.status(201).json(projectId);
	    	});
	})
	.catch(err => console.error(err));
});

server.put('/actions/:id', (req, res) => {
    const {id} = req.params;
    const { project_id, description, notes } = req.body;
    actions
	.update(id, {project_id, description, notes})
	.then(response => {
	    res.json(id, project_id, description, notes);
	})
    	.catch(err => res.status(404));
});

server.delete('/actions/:id', (req, res) => {
    const {id} = req.params;
    actions.remove(id)
	.then(removedAction => {
	    console.log(removedAction);
	    res.status(200).json(removedAction);
	})
	.catch(err => res.status(404));
});


//===============LISTENING===============
const port = 8010;
server.listen(port, () => {
    console.log(`\n === ${port} === \n`);
});
