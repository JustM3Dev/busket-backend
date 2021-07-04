// Initializes the `listitem` service on path `/listitem`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Listitem } from './listitem.class';
import hooks from './listitem.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'listitem': Listitem & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/listitem', new Listitem(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('listitem');

  service.hooks(hooks);
}
