
## Инструкция для установки и запуска API. 

1) **Клонируем репозиторий
2) **Открываем проект в редакторе**
3) **Устанавливаем модули:** 
```
npm install
```
4) **У вас должен быть установлен PostgreSQL Server, (я в использовал 16 версию), Node.JS версия 22**

5) **Открываем терминал, вводим:**
```
psql -U postgres 
```
6) **Вводим пароль если он есть, если нет Enter**

**Создаем таблицу: taskbackend**
```
CREATE TABLE taskbackend;
```
**и закидываем файл дампа в терминал или прописываем путь вручную.**
```
psql -U postgres -d taskbackend -f "C:\Users\User\Desktop/taskbackend.sql"
```
7) **В проекте, в папке services/database.service.js меняем путь "postgres://postgres:Rafael@localhost/taskbackend"** 
 
**Вместо Rafael ваш пароль**

8) **Тестируем, смотрим проходит ли по тестам без ошибок, коректно ли работает база данных:**
```
npm run test
```
9) **Запускаем проект**
```
npm run start
```

* страница с репозиторием - https://github.com/RafaelNassybullin/backend-example-legacy/edit
* страница с этим описанием - http://localhost:2114/v1
* страница с документацией - http://localhost:2114/v1/docs

