// Framework
import chalk from 'chalk';

class Test {
  private passed = 0;
  private failed = 0;

  constructor () {
    process.on('exit', () => this.showStats());
  }

  public expect (toCheck: any, toBe: any, typeCheck = true) {
    if (typeof toBe === 'object') return JSON.stringify(toBe) === JSON.stringify(toCheck);
    if (typeCheck) return toBe === toCheck;
    return toBe == toCheck;
  }

  public printExpect (toCheck: any, toBe: any, typeCheck = true) {
    const expString = `Expected: ${chalk.magenta(typeof toCheck)} ${chalk.cyan(typeof toCheck == 'object' ? JSON.stringify(toCheck) : toCheck)}; Got: ${chalk.magenta(typeof toBe)} ${chalk.cyan(typeof toBe == 'object' ? JSON.stringify(toBe) : toBe)};`;
    if (this.expect(toCheck, toBe, typeCheck)) {
      console.log(`${chalk.bgGreen.black(' ✔ Test passed ')} ${expString}`);
      this.passed++;
    } else {
      console.log(`${chalk.bgRed.black(' ❌ Test failed ')} ${expString}`);
      this.failed++;
    }
  }

  private showStats (): void {
    console.log(`\n${chalk.bgCyan.black(' Results ')} ${this.failed === 0 ? chalk.green(this.passed) : chalk.red(this.passed)} out of ${chalk.green(this.passed + this.failed)} tests passed. (${this.failed === 0 ? chalk.green(this.failed) : chalk.red(this.failed)} fails)`);
  }
}

// Actual testing
import { createRelation, getList, getRelations, modifyList, newList } from './sequelize';
import { v4 as uuidv4 } from 'uuid';

async function runTest (): Promise<void> {
  const test = new Test();

  const userId = uuidv4();

  // const uuid = await newList('test');
  const uuid = '';
  const res = await getList(uuid);

  test.printExpect(res.dataValues.name, 'test');

  await modifyList(uuid, undefined, 'changeDDDD');
  test.printExpect((await getList(uuid)).name, 'changeDDDD');

  await createRelation(userId, uuid, { canEdit: true });
  const relation = await getRelations(userId);
  test.printExpect(relation[0].dataValues.permissions.canEdit, true);
}

runTest();
