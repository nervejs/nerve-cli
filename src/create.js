var fs = require('fs'),
    path = require('path'),
    spawn = require('child_process').spawn;

module.exports = function (project) {
    if (project) {

        fs.mkdirSync(project);
        fs.mkdirSync(path.resolve(project, 'bin'));
        fs.mkdirSync(path.resolve(project, 'src'));
        fs.mkdirSync(path.resolve(project, 'tmpl'));

        fs.createReadStream(path.resolve(__dirname, '../data/Gruntfile.js')).pipe(fs.createWriteStream(path.resolve(project, 'Gruntfile.js')));
        fs.createReadStream(path.resolve(__dirname, '../data/run.js')).pipe(fs.createWriteStream(path.resolve(project, 'bin', project + '.js')));
        fs.chmod(path.resolve(project, 'bin', project + '.js'), '775');

        fs.writeFile(path.resolve(project, 'nerve.json'), JSON.stringify({
            dev: {
                frontendDir: './dist/',
                apiHost: 'http://127.0.0.1:4444',
                staticHost: 'http://127.0.0.1:4445'
            }
        }, ' ', 2));

        npmInit(npmUpdate(npmInstall));

        routesInit();
    }

    function npmInit(callback) {
        fs.writeFile(path.resolve(project, 'package.json'), JSON.stringify({
            devDependencies: {
                "grunt": "^0.4.5",
                "grunt-nerve-handlebars": "^0.0.3"
            },
            dependencies: {
                "handlebars": "^4.0.3"
            }
        }, ' ', 2));
    }

    function npmUpdate(callback) {
        var child = spawn('npm', ['update'], {
            cwd: path.resolve(process.cwd(), project)
        });

        child.stdout.pipe(process.stdout);

        child.stdout.on('end', function () {
            callback && callback();
        });
    }

    function npmInstall(callback) {
        var child = spawn('npm', ['install'], {
            cwd: path.resolve(process.cwd(), project)
        });

        child.stdout.pipe(process.stdout);

        child.stdout.on('end', function () {
            callback && callback();
        });
    }

    function routesInit() {
        var routes = {
            '/': 'src/pages/main'
        };

        fs.writeFile(path.resolve(project, 'src/routes.js'), 'module.exports = ' + JSON.stringify(routes, ' ', 2) + ';');
    }
};