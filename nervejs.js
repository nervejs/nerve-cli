#!/usr/bin/env node

const programm = require('commander'),
    fs = require('fs'),
    path = require('path'),
    spawn = require('child_process').spawn;

let cli;

class NerveCli {

    constructor() {
        let pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json')).toString()),
            nerveConfigPath = path.resolve('nerve.json'),
            isExistNerveConfig = fs.existsSync(nerveConfigPath),
            argv = process.argv.slice();

        this.nerveConfig = isExistNerveConfig ? JSON.parse(fs.readFileSync(nerveConfigPath).toString()) : {};

        this.programmOptions = programm
            .version(pkg.version)
            .option('-f, --frontend', 'init frontend cli')
            .option('-n, --node', 'init nodejs cli');

        programm
            .command('new')
            .description('create new Nerve application')
            .action(() => {
                this.install()
            });

        programm.on('--help', () => {
            this.initCli();

            if (this.programmOptions.node) {
                console.log('node', this.nodeCli);
            } else if (this.programmOptions.frontend) {
                this.frontendCli.help();
            }
        });

        programm.parse(argv);

        this.initCli();

        if (!process.argv.slice(2).length) {
            programm.outputHelp();
        }
    }

    initCli() {
        if (this.programmOptions.node && this.programmOptions.args.indexOf('new') === -1) {
            if (this.checkInstalledNode()) {
                this.initNodeCli();
            } else {
                console.log('\nLocal node-nerve not found. For install run:\n$ nervejs new --node\n');
            }
        } else if (this.programmOptions.frontend && this.programmOptions.args.indexOf('new') === -1) {
            if (this.checkInstalledFrontend()) {
                this.initFrontendCli();
            } else {
                console.log('\nLocal nervejs not found. For install run:\n$ nervejs new --frontend\n');
            }
        }
    }

    checkInstalledNode() {
        return fs.existsSync('./node_modules/node-nerve/utils/cli.js');
    }

    checkInstalledFrontend() {
        return fs.existsSync('./node_modules/nervejs/utils/cli.js');
    }

    install() {
        if (this.programmOptions.node) {
            this.installNode()
                .then(() => {
                    this.initNodeCli();
                    this.nodeCli.createApp();
                })
                .catch((err) => console.error(err));
        } else if (this.programmOptions.frontend) {
            this.installFrontend()
                .then(() => {
                    this.initFrontendCli();
                    this.frontendCli.createApp();
                })
                .catch((err) => console.error(err));
        } else {
            this.installNode()
                .then(() => {
                    this.initNodeCli();
                    this.nodeCli.createApp();
                })
                .catch((err) => console.error(err));

            this.installFrontend()
                .then(() => {
                    this.initFrontendCli();
                    this.frontendCli.createApp();
                })
                .catch((err) => console.error(err));
        }
    }

    installNpm(pkgName) {
        return new Promise((resolve, reject) => {
            let child = spawn('npm', ['install', pkgName], {
                cwd: process.cwd(),
                stdio: 'inherit'
            });

            child.on('exit', resolve);
            child.on('error', reject);
        });
    }

    installNode() {
        return this.installNpm('node-nerve');
    }

    initNodeCli() {
        const NodeNerveCli = require(path.resolve(process.cwd(), './node_modules/node-nerve/utils/cli'));

        this.nodeCli = new NodeNerveCli(this.nerveConfig);
    }

    installFrontend() {
        return this.installNpm('nervejs');
    }

    initFrontendCli() {
        const FrontendCli = require(path.resolve(process.cwd(), './node_modules/nervejs/utils/cli'));

        this.frontendCli = new FrontendCli(this.nerveConfig);
    }

}

new NerveCli();