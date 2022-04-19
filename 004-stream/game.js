#!/usr/bin/env node

const { hideBin } = require('yargs/helpers');

const argv = require('yargs/yargs')(hideBin(process.argv))
    .usage('Usage: $0 "logname" [--showlog|-s]')
    .version('1.0.1')
    .help('help')
    .alias('help', 'h')
    .alias('showlog', 's')
    .example('$0 log.txt')
    .example('$0 log.txt --showlog')
    .epilog('(c) 2022 Stanislav')
    .argv;

const fs = require('fs');
const path = require('path');
const { exit } = require('process');

const dir = path.join(__dirname, './logs/');

if(!fs.existsSync(dir))
    fs.mkdirSync(dir);

if (argv._.length == 0) {
    console.error('Необходимо указать имя для log-файла');
    exit(0);
} else
    var log_path = path.join(dir, argv._[0]);

const is_file = fs.existsSync(log_path);

for (key in argv) {
    if (key == 'showlog' || key == 's') {
        try {
            if (is_file) {
                var content = fs.readFileSync(log_path, 'utf-8');
                var content = JSON.parse('[' + content + ']');

                var count_total = 0,
                    count_yes = 0,
                    count_no = 0;

                for (var i = 0; i <= content.length - 1; i++) {
                    count_total++;
                    if (content[i].num == content[i].ans)
                        count_yes++;
                    else
                        count_no++;
                }

                console.log('Текущий результат:\nСыграно игр всего:' + count_total + '\nУгадано ' + count_yes + ', не угадано ' + count_no + '\nПроцент угаданных чисел: ' + (100 * count_yes / count_total).toFixed(2));
                exit(0);
            } else {
                console.error('Log-файл с указанным именем не найден');
                exit(0);
            }
        } catch (err) {
            console.error(err);
            exit(0);
        }
    }
}

const readline = require('readline');
const input = readline.createInterface(process.stdin, process.stdout);
const num = Math.round(Math.random()) + 1;

input.on('close', (close) => console.log('Приходи ещё!'))

const quest = function (q) {
    return new Promise((resolve, reject) => {
        input.question(q, (ans) => {
            resolve(ans)
        });
    });
};

(async () => {
    var q = "Давай сыграем в игру (@'_'@) : 1 или 2?";

    const ans = await quest(q);

    if (ans == num) {
        console.log('Ты угадал!');
    } else {
        console.log('Увы, ошибочка вышла');
    }

    var content = '{"num": ' + num + ', "ans": ' + ans + '}'

    if (is_file) {
        fs.appendFile(log_path, ',\n' + content, err => {
            if (err)
                throw new Error(err);
        });
    } else {
        fs.writeFile(log_path, content, err => {
            if (err)
                throw new Error(err);
        });
    }

    input.close();
})();
