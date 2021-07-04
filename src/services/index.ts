import { Application } from '../declarations';
import users from './users/users.service';
import lists from './lists/lists.service';
import listitem from './listitem/listitem.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(lists);
  app.configure(lists);
  app.configure(listitem);
}
