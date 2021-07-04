import { NullableId, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { customGetList, flushDB, getList, IList, List, newList, RequestError } from '../../db/sequelize';
import { v4 as uuidv4 } from 'uuid';

interface Data {
}

interface ServiceOptions {
}

export class Lists implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find (params?: Params): Promise<Data[]> {
    console.log(params?.query?.options);
    return await customGetList(params?.query?.options);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get (list_id: string, params?: Params): Promise<Data> {
    console.log(await customGetList());
    return await getList(list_id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create (data: IList, params?: Params): Promise<Record<string, any>> {
    ['name', 'starred'].forEach((item: string) => {
      if (!data.hasOwnProperty(item)) {
        return Promise.reject(new RequestError('TypeError', 'data has to be type of object (IList)', 400, { correct: 'name: string; starred: boolean;' }));
      }
    });

    await newList(0, data.name, data.starred, {
      data: []
    }, uuidv4());
    return { message: 'Created a new list.', data };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update (id: string, data: Data, params?: Params): Promise<Data> {
    console.log(id, data);
    return new Promise((resolve, reject) => {
      List.sync().then(() => {
        List.update(data, { where: { list_id: id } }).then(resolve).catch(reject);
      }).catch(reject);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patch (id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove (id: NullableId, params?: Params): Promise<Data> {
    await flushDB();
    return { message: 'Flushed db' };
  }
}
