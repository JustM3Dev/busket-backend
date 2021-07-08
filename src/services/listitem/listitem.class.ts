import { NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { getList, Item, modifyList, printDb } from '../../db/sequelize';
import { v4 as uuidv4 } from 'uuid';

interface Data {
}

interface ServiceOptions {
}

export class Listitem implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find (params?: Params): Promise<Data[] | Paginated<Data>> {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get (id: string, params?: Params): Promise<Data> {
    return await printDb();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create (itemData: Item, params?: Params): Promise<Data> {
    try {
      const list = await getList(itemData.list_id);
      if (!list) return {};
      if (!list.items.data) list.items = { data: [] };
      list.items.data.push({ checked: false, name: itemData.name, id: uuidv4() });

      await modifyList(list.list_id, null, null, null, list.items);
      return list.items;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update (id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patch (id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove (data: NullableId, user: Data, params?: Params): Promise<Data> {
    try {
      const list_id = (data as unknown as Item).list_id;

      const list = await getList(list_id);
      list.items.data.splice((data as unknown as Record<string, any>).index, 1);

      await modifyList(list_id, null, null, null, list.items);
      return list.items;
    } catch (err) {
      return err;
    }
  }
}
