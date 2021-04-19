// import { }

class App {
  id!: string;
  source: string = '';
  name: string = '';
  version: string = '';
  roles: {[key: string]: string[]} = {};
  participantProperties: string[] = [];
  participants: {[key: string]: Participant} = {};

  entrypoint!: string;
  inputPath: string;
  outputPath: string;

  bundlingCommand: string = 'bundle';
  bundlingOutput: string = 'build';



  bundleInstall () {

  }

  bundleWatch () {

  }


  diskEntrypoint ()  {

  }

  webEntrypoint () {

  }

  constructor (id: string, entrypoint: string) {
    this.id = id;
    this.entrypoint = entrypoint;
  }

  loadFromDisk () {

  }

  index (filePath: string, baseDir: string = '/') {
    if (filePath.endsWith('/')) filePath += 'index.html';

    path.join(this.entrypoint)
    const content = Deno.readTextFileSync(filePath);

    return content;
  }

  bundle () {

  }

  monitorChanges () {

  }
}

const emptyAppConfig: App = {
  id: '',
  source: '',
  name: '',
  version: '',
  roles: {},
  entrypoint: '',
  bundlingCommand: '',
  bundlingOutput: '',
  participantProperties: [],
  participants: {}
}

function loadApp(loadedApps: App[], id: string, appPath: string): App | null {
  const appConfig = {
    ...emptyAppConfig,
    ...yamlParse(Deno.readTextFileSync(path.join(appPath, "app.yml"))) as App,
    id,
    entrypoint: appPath
  };

  const errors = [];
  if (!appConfig.id) errors.push('App must have an ID');
  if (!appConfig.name) errors.push('App must have a name');
  if (!appConfig.bundlingCommand) errors.push('App must have a bundling command');
  if (!appConfig.bundlingOutput) errors.push('App must have a bundling output');

  if (!errors.length) {
    errors.forEach((e) => console.error(e));
    console.error(`Could not load app ${id}`);
    return null;
  }

  const participantsFiles = Deno.readDirSync(path.join(appPath, 'participants'));

  for (const participantFile of participantsFiles) {
    if (participantFile.isFile && participantFile.name.endsWith('yml')) {
      yamlParse(Deno.readTextFileSync(path.))
    }
  }
}

function loadAppParticipant(path) {

}

function detectApps(state: State): {[key: string]: App} {
  const appsPath = path.join(state.origin, 'apps');
  const dirEntries = Deno.readDirSync(appsPath);
  const apps: App[] = [];

  for (const dirEntry of dirEntries) {
    if (dirEntry.isDirectory) {
      const loadedApp = loadApp(apps, dirEntry.name, path.join(appsPath, dirEntry.name))
      if (loadedApp) {
        apps.push(loadedApp);
      }
    }
  }
  return {
    identity: {
      id: 'identity',
      name: "Identity Provider",
      labels: ["id", "name", "avatarUrl"],
      entrypoint: path.join(state.origin, 'apps/identity'),
      participants: Participant
    }
  };
}

function loadAppBundle(app: string): string {

}
