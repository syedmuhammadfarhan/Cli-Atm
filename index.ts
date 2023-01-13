#! /usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';
import chalkanimation from 'chalk-animation';
import figlet from 'figlet';

function delay() {
    return new Promise(function (resolve) {
        setTimeout(resolve, 4000)
    })
};

console.log(chalk.green(figlet.textSync(`ATM`, 'Standard')));

async function welcome() {
    const credit = chalkanimation.rainbow(`   DEVELOP BY FARHAN\n\n\n`);
    await delay();
    credit.stop();
}
await welcome();

let balance = Math.floor(Math.random() * 56789);


async function login() {
    console.log(chalk.italic.bgBlueBright.underline(`Note: Enter Any Random Username and Password.\n`));
    await inquirer
        .prompt([
            {
                type: 'input',
                name: 'userId',
                message: 'USERNAME:'
            },
            {
                type: 'password',
                name: 'password',
                message: 'PASSWORD:',
                mask: '*',
                validate: (value) => {
                    if (/\w/.test(value) && /\d/.test(value) && value.length >= 8) {
                        return true;
                    }
                    return chalk.red('Password must have atleast a letter, a number and 8 charaters');
                },
            },
        ]) // .prompt end parenthesis
        .then((value) => {
            console.log(chalk.magenta.bold.underline(`\nHELLO ${value.userId.toUpperCase()} \nWELCOME TO ABC BANK ATM\n`));
            console.log(chalk.italic(`YOUR BALANCE IS Rs. ${chalk.green.underline(balance)}.\n`));
        }); //then end
}; // welcome function end

async function menu() {
    await inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'SELECT TRANSACTION',
            choices: ['FAST CASH', 'CASH WITHDRAW', 'BALANCE ENQUIRY', 'FUNDS TRANSFER', 'ACCOUNT STATEMENT'],
        }
    ]) // prompt end bracket
        .then(async function (value) {
            if (value.menu === 'FAST CASH') {
                await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'fastCash',
                        message: 'SELECT AMOUNT:',
                        choices: [1000, 5000, 10000, 15000, 20000],

                    } //inquirer
                ])
                    .then(async function (value) {
                        if (value.fastCash <= balance) {
                            balance = balance - value.fastCash;
                            console.log(chalk.italic(`\nYour Transaction is in process...`));
                            await delay();
                            console.log(chalk.bgGreen(`\nTransaction Successful`));
                            console.log(chalk.italic(`\nYour Remaining balance is Rs. ${chalk.green.underline(balance)}.\n`));
                        } else {
                            console.log(chalk.italic(`\nYour Transaction is in process...`));
                            await delay();
                            console.log(chalk.bgRed(`\nPlease Provide a Valid Amount Not Exceeding Balance.\n`));
                            console.log(chalk.italic(`Your balance is Rs. ${chalk.green.underline(balance)}.\n`));

                        };

                    }); // then bracket
            };

            if (value.menu === 'CASH WITHDRAW') {
                await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'cashWithdraw',
                        message: 'ENTER AMOUNT:',
                        validate(input) {
                            if (!(isNaN(input)) && input <= balance) {
                                return true;
                            }
                            throw Error(chalk.bgRed('Please Provide a Valid Amount Not Exceeding Balance.'));
                        },

                    }
                ])
                    .then(async function (value) {
                        balance = balance - value.cashWithdraw;
                        console.log(chalk.italic(`\nYour Transaction is in process...`));
                        await delay();
                        console.log(chalk.bgGreen(`\nTransaction Successful`));
                        console.log(chalk.italic(`\nYour Remaining balance is Rs. ${chalk.green.underline(balance)}.\n`));
                    }) // then bracket
            }
            else if (value.menu === 'BALANCE ENQUIRY') {
                console.log(chalk.italic(`\nYour Balance is Rs. ${chalk.green.underline(balance)}.\n\nGenerating Receipt...`));
                await delay();
                console.log(chalk.bgGreen(`\nTransaction Successful\n`));
            }
            else if (value.menu === 'FUNDS TRANSFER') {
                await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'iban',
                        message: 'ENTER IBAN:',
                        default: 'PK11AAAA1111111111111111'

                    },
                    {
                        type: 'input',
                        name: 'cashTransfer',
                        message: 'ENTER AMOUNT:',
                        validate(input) {
                            if (!(isNaN(input)) && input <= balance) {
                                return true;
                            }
                            throw Error(chalk.bgRed('Please Provide a Valid Number Not Exceeding Balance.'));
                        },

                    }
                ])
                    .then(async function (value) {
                        balance = balance - value.cashTransfer;
                        console.log(chalk.italic(`\nYour Transaction is in process...`))
                        await delay()
                        console.log(chalk.bgGreen(`\nTransaction Successful`));
                        console.log(chalk.italic(`\nYour Remaining balance is Rs. ${balance}.\n`))
                    })
            }
            else if (value.menu === 'ACCOUNT STATEMENT') {
                console.log(chalk.italic(`\nYour Balance is Rs. ${balance}\n\nGenerating Account Statement Receipt For The Current Month...`));
                await delay();
                console.log(chalk.bgGreen(`\nTransaction Successful\n`));
            }
        }) // then end bracket
}; // function main() end

async function toContinue() {
    await login();
    do {
        await menu();
        var again = await inquirer
            .prompt({
                type: 'input',
                name: 'restart',
                message: 'Do You Want To Perfom Another Transaction (y/n):'
            });
    }
    while (again.restart === 'y' || again.restart === 'Y' || again.restart === 'yes' || again.restart === 'YES');
};

toContinue();