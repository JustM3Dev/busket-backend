import { Sequelize, Model, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';

const sequelize = new Sequelize('sqlite:lists.sqlite', { logging: false });

export class RequestError {
  constructor (name: string, message: string, code: number, additional: any) {
    return {
      name,
      message,
      code,
      additional
    };
  }
}

export interface Item {
  name: string,
  id: string,
  list_id: string,
}

export interface IList {
  order: number;
  name: string;
  starred: boolean;
  items: Record<any, string>;
  share_id: string;
  list_id: string;

  created_at: Date;
  updated_at: Date;
}

export class List extends Model {
}

List.init({
  order: DataTypes.INTEGER,
  name: DataTypes.STRING,
  starred: DataTypes.BOOLEAN,
  items: DataTypes.JSON,
  share_id: DataTypes.UUIDV4,
  list_id: DataTypes.UUIDV4,
}, {
  sequelize,
  modelName: 'list',
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export async function newList (order?: number, name?: string, starred?: boolean, items?: Record<string, unknown>, share_id?: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    List.sync(/* { force: true } */).then(async () => {
      const uuid = uuidv4();
      const res = await List.create({
        order: order === null ? 0 : order,
        name: name === null ? '' : name,
        starred: starred === null ? false : starred,
        items: items === null ? [] : items,
        share_id: share_id === null ? '' : share_id,
        list_id: uuid,
      }).catch(reject);
      console.log(res);
      resolve(uuid);
    }).catch(reject);
  });
}

export async function modifyList (list_id: string, order?: number | null, name?: string | null, starred?: boolean | null, items?: Record<string, unknown> | null, share_id?: string | null): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    List.sync().then(async () => {
      const list = await getList(list_id);
      List.update({
        order: order ?? list.order,
        name: name ?? list.name,
        starred: starred ?? list.starred,
        items: items ?? list.items,
        share_id: share_id ?? list.share_id,
      }, {
        where: { list_id }
      }).then(resolve).catch(reject);
    }).catch(reject);
  });
}

export async function getList (list_id: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    List.sync().then(() => {
      List.findOne({ where: { list_id } }).then(resolve).catch(reject);
    }).catch(reject);
  });
}

export async function customGetList (options = {}): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    List.sync().then(() => {
      List.findAll(options).then(resolve).catch(reject);
    }).catch(reject);
  });
}


export class UserRelation extends Model {
}

UserRelation.init({
  user_id: DataTypes.UUIDV4,
  list_id: DataTypes.INTEGER,
  permissions: DataTypes.JSON,
}, {
  sequelize,
  modelName: 'user_relation',
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export async function createRelation (user_id: string, list_id: string, permissions: Record<string, boolean>): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    UserRelation.sync().then(() => {
      UserRelation.create({
        user_id,
        list_id,
        permissions
      }).then(resolve).catch(reject);
    }).catch(reject);
  });
}

export async function getRelations (user: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    UserRelation.sync().then(() => {
      UserRelation.findAll({ where: { user_id: user } }).then(resolve).catch(reject);
    });
  });
}

// General
export async function flushDB (): Promise<any> {
  await List.destroy({ truncate: true });
  await UserRelation.destroy({ truncate: true });
  return Promise.resolve();
}


// Debugging
export async function printDb (options: Record<string, any> = {}): Promise<any> {
  const res = await customGetList(options);
  const spacers = {
    listName: { min: 4, max: 26, truncate: true },
    listOrder: { min: 4, max: 26, truncate: false },
    listStarred: { min: 4, max: 26, truncate: false },
    listItems: { min: 4, max: 26, truncate: true },
  };

  // How to space: (python code yoinked from one of my shit)
  // max_spaces = 26
  // min_spaces = 5
  // spaces = " " * ((max_spaces - min_spaces) - len(item))
  // msg += f"|  [{i}] {item}{spaces}|\n"


  res.forEach((item: IList) => {
    item.name = 'A so long name noone shouldve to read it lol dsdsasadasdasdddddddddd';

    // while (item.name.length >= (spacers.listName.max + spacers.listName.min)) {
    //   item.name = `${item.name.slice(0, item.name.length - 1)}…`;
    // }

    const stringTruncate = (str: string, length: number) => {
      const dots = str.length > length ? '...' : '';
      return str.substring(0, length)+dots;
    };

    stringTruncate(item.name, spacers.listName.max - spacers.listName.min);

    const spaces = ' '.repeat(((spacers.listName.max - spacers.listName.min) - item.name.length) / 2);
    console.log(`${chalk.bgGreen.black(`${(spaces)}${item.name}${spaces}`)}`);
  });
}
