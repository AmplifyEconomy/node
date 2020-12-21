import 'colors';
import Express from 'express';
import { program as Command } from 'commander';
import { ConfigureServer } from './util/Server.util';
import { DeployCommand } from './service/Command.service';

export const Server = Express();
export { Command };

ConfigureServer(Server);
DeployCommand(Command);

Command.parse(process.argv);