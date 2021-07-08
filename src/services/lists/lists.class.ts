import { NullableId, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import {
  createRelation,
  getList, getRelations,
  IList,
  List,
  newList,
  RequestError,
} from '../../db/sequelize';
import { v4 as uuidv4 } from 'uuid';
import isUUID from 'validator/lib/isUUID';

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

  async checkUser (list_id: string, user_id: string): Promise<boolean> {
    const rel = await getRelations(user_id);
    let inLib = false;
    Object.keys(rel).forEach((item) => {
      if (rel[item].list_id === list_id) inLib = true;
    });
    return inLib;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find (params?: Params): Promise<Data[]> {
    const rel = await getRelations(params?.user?.uuid);

    const lists = [];
    for (const key of Object.keys(rel)) {
      lists.push(await getList(rel[key].dataValues.list_id));
    }

    return lists;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get (list_id: string, params?: Params): Promise<Data> {
    return await getList(list_id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create (data: IList, params?: Params): Promise<Record<string, any>> {
    ['name', 'starred'].forEach((item: string) => {
      if (!data.hasOwnProperty(item)) {
        return Promise.reject(new RequestError('TypeError', 'data has to be type of object (IList)', 400, { correct: 'name: string; starred: boolean;' }));
      }
    });


    const uuid = uuidv4();
    await newList(params?.user?.uuid, data.name, data.pinned, {
      data: []
    }, uuid);

    await createRelation(params?.user?.uuid, uuid, {});

    return { message: 'Created a new list.', data };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update (id: string, data: Data, params?: Params): Promise<Data> {
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
    if (!isUUID((id as string), 4)) return Promise.reject('id has to be type of uuidv4');
    await List.sync();
    await List.destroy({
      where: { list_id: id },
    });

    return { message: 'destroyed' };
  }
}
