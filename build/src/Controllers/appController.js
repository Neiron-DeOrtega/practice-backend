"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config = require('../../../config');
const fs = require('fs');
class AppController {
    getCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        SELECT 
            mdl_course.id AS course_id,
            mdl_course_categories.id AS category_id,
            mdl_course.fullname,
            mdl_course.shortname,
            mdl_course_categories.category
        FROM 
            mdl_course
        JOIN 
            mdl_course_categories 
        ON 
            mdl_course.categories_id = mdl_course_categories.id;
    `;
            try {
                const result = yield new Promise((resolve, reject) => {
                    config.query(query, (error, results) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
                // Преобразуем результат в нужный формат
                const categoriesMap = result.reduce((acc, row) => {
                    const { category_id, category, course_id, fullname, shortname } = row;
                    if (!acc[category_id]) {
                        acc[category_id] = {
                            category_id,
                            category,
                            courses: []
                        };
                    }
                    acc[category_id].courses.push({ course_id, fullname, shortname });
                    return acc;
                }, {});
                const formattedResult = Object.values(categoriesMap);
                res.json(formattedResult);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    addUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            let errors = [];
            const addError = (errorType, errors, string) => {
                if (errorType === 100) {
                    // Пустое поле ввода
                    errors.push({
                        id: Math.floor(Math.random() * 10000),
                        errorType: errorType,
                        errorMessage: `Заполните поле ввода`
                    });
                }
                else if (errorType === 101) {
                    // Выберите курс
                    errors.push({
                        id: Math.floor(Math.random() * 10000),
                        errorType: errorType,
                        errorMessage: `Выберите курс`
                    });
                }
                else if (errorType === 102) {
                    // Неправильный формат данных
                    errors.push({
                        id: Math.floor(Math.random() * 10000),
                        errorType: errorType,
                        errorMessage: `Неправильный формат данных: \n${string}`
                    });
                }
                else if (errorType === 103) {
                    // Неправильный формат почты
                    errors.push({
                        id: Math.floor(Math.random() * 10000),
                        errorType: errorType,
                        errorMessage: `Неправильный формат почты: \n${string}`
                    });
                }
                else if (errorType === 104) {
                    // Неправильный формат номера
                    errors.push({
                        id: Math.floor(Math.random() * 10000),
                        errorType: errorType,
                        errorMessage: `Неправильный формат номера: \n${string}`
                    });
                }
                else if (errorType === 200) {
                    // Возможно неправильно
                    errors.push({
                        id: Math.floor(Math.random() * 10000),
                        errorType: errorType,
                        errorMessage: `Возможно неправильный ввод данных: \n${string} \nЖелаете продолжить?`
                    });
                }
                else if (errorType === 201) {
                    errors.push({
                        id: Math.floor(Math.random() * 10000),
                        errorType: errorType,
                        errorMessage: `Все пользователи были успешно добавлены, кроме уже существующих: \n${string}`
                    });
                }
                else if (errorType === 300) {
                    errors.push({
                        id: Math.floor(Math.random() * 10000),
                        errorType: errorType,
                        errorMessage: `Пользователи были добавлены успешно!`
                    });
                }
            };
            const peopleArray = req.body.inputString.split('\n').map((line) => line.trim().replace(/ +/g, ' '))
                .filter((str) => str !== '');
            if (peopleArray.length === 0) {
                addError(100, errors);
            }
            console.log(peopleArray);
            const superNewString = yield Promise.all(peopleArray.map((line, i) => __awaiter(this, void 0, void 0, function* () {
                const parts = line.split(' ');
                let lastName;
                try {
                    if (parts.length > 5 && !req.body.isChecked) {
                        addError(200, errors, line);
                    }
                    if (parts.length < 5) {
                        addError(102, errors, line);
                        throw "Ошибка формата данных";
                    }
                    parts[0] = parts[0][0].toUpperCase() + parts[0].slice(1);
                    const email = parts.find(part => part.includes('@') && part.includes('.'));
                    if (!email) {
                        addError(103, errors, line);
                        throw 'Ошибка ввода почты';
                    }
                    const phoneIndex = parts.indexOf(email) + 1;
                    if (!parts[phoneIndex] || parts[phoneIndex].length !== 11) {
                        addError(104, errors, line);
                        throw 'Ошибка ввода номера';
                    }
                    let query = "SELECT * FROM mdl_user WHERE email = ?";
                    const isUserExist = yield new Promise((resolve, reject) => {
                        config.query(query, email, (error, results) => {
                            if (error) {
                                console.error("Query error:", error);
                                reject(error);
                            }
                            else {
                                console.log("Query results:", results);
                                resolve(results);
                            }
                        });
                    });
                    if (isUserExist.length > 0) {
                        addError(201, errors, line);
                        parts.length = 0;
                        throw 'Пользователь уже существует';
                    }
                    parts[phoneIndex] = parts[phoneIndex].replace(/^\+?7/, '8');
                    lastName = parts.shift();
                    const middleNameParts = parts.slice(0, -2);
                    const middleName = middleNameParts.join(' ');
                    parts.splice(0, parts.length - 2);
                    parts.unshift(middleName);
                    parts.splice(1, 0, 'P@s*w0rd');
                    parts.splice(7, 0, `${req.body.selectValue}`);
                    // if (errors.length === 0) {
                    if (req.body.teacher === false) {
                        parts.push('Слушатель');
                        parts.push('Слушатель');
                    }
                    else {
                        parts.push('Преподаватель');
                        parts.push('Преподаватель');
                        parts.push('editingteacher');
                    }
                    let strResult = [lastName, ...parts];
                    return strResult.join(';');
                    // }
                }
                catch (error) {
                    // console.log(error)
                }
                return [lastName, ...parts].join(';');
            })));
            superNewString.unshift('lastname;firstname;password;email;username;course1;cohort1;department');
            if (req.body.teacher === true) {
                superNewString[0] += ';role';
            }
            let result = superNewString.filter((line => line.trim() !== '')).join('\n');
            console.log(result);
            if (errors.length === 0) {
                fs.writeFile('output.csv', result, (err) => {
                    if (err)
                        throw err;
                    console.log('The file has been saved!');
                });
                addError(300, errors);
            }
            res.send(errors);
        });
    }
}
module.exports = new AppController();
