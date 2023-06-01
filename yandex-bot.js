// ==UserScript==
// @name         Yandex Bot
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       Sevastianova Nadezhda
// @match        https://ya.ru/*
// @match        https://yandex.ru/*
// @match        https://napli.ru/*
// @match        https://kiteuniverse.ru/*
// @match        https://www.motoreforma.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

let sites = {
  "napli.ru": ["как использовать devtools браузера", "10 популярных шрифтов от Google", "редакции и ревизии в вордпресс", "Вывод произвольных типов записей"],
  "kiteuniverse.ru": ["Шоу воздушных змеев", "Kite Universe", " наземные ветровые арт инсталляции"],
  "motoreforma.com": ["прошивки для CAN-AM", "тюнинг для BRP", "тюнинг Maverick X3"]
}
let site = Object.keys(sites)[getRandom(0, Object.keys(sites).length)];
let keywords = sites[site];
let keyword = keywords[getRandom(0, keywords.length)];
const text = document.getElementsByClassName("search3__input")[0];
const links = document.links;
let nextYandexPage = true;

if (text !== undefined) {
  document.cookie = `site=${site}`;
} else if (location.hostname == "ya.ru" ) {
  site = getCookie("site");
} else {
  site = location.hostname;
}

if (text !== undefined) {
	//Работаем на главной странице
    let i = 0;
    сщтые timerId = setInterval(() => {
        text.setAttribute('value', '');
        text.dispatchEvent(new Event('input', { bubbles: true, cancelable: true}));
        let button = document.getElementsByClassName("search3__button")[0];
        text.value += keyword[i];
        i ++;
        if (i === keyword.length) {
            clearInterval(timerId);
            button.click();
        }
    }, 500);

} else if (location.hostname === site) {
	//Работаем на целевом сайте
    console.log("мы на целевом сайте");
    setInterval(() => {
        const index = getrandom(0, links.length);
        if (getrandom(0, 101) >= 70) {
            location.href = "https://ya.ru/";
        }
	//Перебираем ссылки и проверяем, что по ним можно кликнуть
        if (links[index].href.indexOf(site) !== -1) links[index].click();
    }, getrandom(2000, 5000));
} else {
	//Работаем в поисковой выдаче
    for (let i = 0; i < links.length; i++) {
        if (links[i].href.indexOf(site) !== -1) {
            const link = links[i];
            nextYandexPage = false;
            console.log("нашел строку" + link);
            setTimeout(() => {
                link.click();
            }, getrandom(2500, 5000))
            break;
        }
    }
}
//Если не нашли на первой странице выдачи
const elementExist = setInterval(() => {
    const element = document.getElementsByClassName(".Pager-Item");
    if (element !== undefined) {
        if (element.innerText === "5") {
            nextYandexPage = false;
            location.href = "https://ya.ru/";
        }
        clearInterval(elementExist);
    }
}, 100)
if (nextYandexPage) {
    setTimeout(() => {
        const nextPage = document.getElementsByClassName("Pager-Item_type_next")[0];
        nextPage.click();
    }, getrandom(3000, 8000))
}

function getrandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}
