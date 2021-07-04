// Initializes the `lists` service on path `/lists`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Lists } from './lists.class';
import hooks from './lists.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'lists': Lists & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/lists', new Lists(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('lists');

  service.hooks(hooks);
}
