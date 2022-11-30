<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/tahaluindo/WAZone-Server">
    <img src="https://firebasestorage.googleapis.com/v0/b/whatsapp-93fe7.appspot.com/o/wa-zone-putih.png?alt=media&token=f163eae6-60f7-43d7-ae53-fb2f0bf983bb" alt="Logo" width="300" height="200">
  </a>

<h3 align="center">WAZONE - Server Multi Device</h3>

  <p align="center">
    This project was created to fulfill the job acceptance at KreatifIndo
    <br />
    <a href="https://github.com/tahaluindo/WAZone-Server"><strong>Explore the Docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/tahaluindo/WAZone-Server">View Demo</a>
    ·
    <a href="https://github.com/tahaluindo/WAZone-Server">Report Bug</a>
    ·
    <a href="https://github.com/tahaluindo/WAZone-Server/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#challenges">Challenges</a></li>
        <li><a href="#feature-to-implement-in-the-future">Feature To Implement In The Future</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#api-reference">API Reference</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

### Goal

Build WhatsApp API Service with `Baileys` that can:

- Send WhatsApp message
- Receive WhatsApp message
- Get WhatsApp contacts
- table to login Multi Device

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![Node][node.js]][node-url]
- [![Express][express.js]][express-url]
- [![Prisma][prisma.js]][prisma-url]
- [![Baileys][baileys.js]][baileys-url]
- [![Typescript][typescript.js]][typescript-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Challenges

- I've built a WhatsApp API Service before, but thats only for sending message through API
- Getting the contacts info is quiet a hassle, theres 3 way that i found to get the contacts:
  - Via `inMemoryStore` that save all the event to JSON file, usually you will only get Group contacts instead Personal contacts. Its because `contacts.set` socket.event read Personal contacts then read Group contact and Personal contacts will be overwriten by Group contacts in the JSON file;
  - Via `contacts.upsert` socket.event, this event only return Personal contacts and i'am using this in the early development, but later i found that the event sometimes didnt trigger, so i need to find another way;
  - Via `contacts.set` socket.event, this event used to store the contacts in `inMemoryStore`, the issues is its trigger 2 times, sometimes it return Personal contacts first then Group contacts and vice versa. I solve it by filtering it which Group and Personal contacts because they return different object;

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Feature To Implement In The Future

- [ ] Implement socket for realtime update.
- [ ] Implement API Key using JWT to identify `botId` (currently using `x-bot-id` on headers.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Step or instructions on setting up the project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

- Node 16^

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/tahaluindo/WAZone-Server.git
   ```
2. Open the project folder
   ```sh
   cd WAZone-Server
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. For the `.env` file you can create or copy it from`.env.example`

   ```env
   PORT=5000
   DATABASE_URL="file:./wazone.db?connection_limit=1" // SQLite
   # DATABASE_URL="mysql://johndoe:randompassword@localhost:3306/mydb" // Use this if want to use MySQL/PostgreSQL
   ```

   If you want to change db provider (MySQL/PostgreSQL) edit `prisma/schema.prisma`

   ```sh
   generator client {
    provider = "prisma-client-js"
   }

   datasource db {
    provider = "sqlite" // (mysql/postgresql) <== change this
    url      = env("DATABASE_URL")
   }
   ```

5. Initialize the database
   ```sh
   npx prisma db push
   ```
6. Run project
   ```sh
   npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## API Reference

#### Get one bot

```http
  GET /bots
```

| Parameter  | Type     | On        | Description               |
| :--------- | :------- | :-------- | :------------------------ |
| `x-bot-id` | `string` | `headers` | **Required**. Your Bot Id |

#### Create bot

```http
  POST /bots
```

| Parameter | Type     | On     | Description                 |
| :-------- | :------- | :----- | :-------------------------- |
| `name`    | `string` | `body` | **Required**. Your Bot Name |

#### Start bot

```http
  POST /bots/up
```

| Parameter  | Type     | On        | Description               |
| :--------- | :------- | :-------- | :------------------------ |
| `x-bot-id` | `string` | `headers` | **Required**. Your Bot Id |

#### Stop bot

```http
  POST /bots/down
```

| Parameter  | Type     | On        | Description               |
| :--------- | :------- | :-------- | :------------------------ |
| `x-bot-id` | `string` | `headers` | **Required**. Your Bot Id |

#### Get all bot contacts

```http
  GET /contacts
```

| Parameter  | Type     | On        | Description               |
| :--------- | :------- | :-------- | :------------------------ |
| `x-bot-id` | `string` | `headers` | **Required**. Your Bot Id |

#### Get all bot chats

```http
  GET /chats
```

| Parameter  | Type     | On        | Description               |
| :--------- | :------- | :-------- | :------------------------ |
| `x-bot-id` | `string` | `headers` | **Required**. Your Bot Id |

#### Get all bot chat with the `phoneNumber`: `+628765xxx/08765xxx` filter or might be `whatsAppId`: `628765xxx@s.whatsapp.net`

```http
  GET /chats/:phoneNumber
```

| Parameter  | Type     | On        | Description               |
| :--------- | :------- | :-------- | :------------------------ |
| `x-bot-id` | `string` | `headers` | **Required**. Your Bot Id |

#### Get all bot messages

```http
  GET /messages
```

| Parameter  | Type     | On        | Description               |
| :--------- | :------- | :-------- | :------------------------ |
| `x-bot-id` | `string` | `headers` | **Required**. Your Bot Id |

#### Get all bot messages with `chatId` filter

```http
  GET /messages/:chatId
```

| Parameter  | Type     | On        | Description               |
| :--------- | :------- | :-------- | :------------------------ |
| `x-bot-id` | `string` | `headers` | **Required**. Your Bot Id |

#### Send message to a `phoneNumber`

```http
  POST /messages
```

| Parameter     | Type     | On        | Description                                                                                                                                    |
| :------------ | :------- | :-------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| `x-bot-id`    | `string` | `headers` | **Required**. Your Bot Id                                                                                                                      |
| `phoneNumber` | `string` | `body`    | **Required**. Your message destination                                                                                                         |
| `content`     | `object` | `body`    | **Required**. Your message content, usualy containt `{ text: string }`. For more details [click here](https://github.com/adiwajshing/Baileys). |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

- anonsecteaminc@gmail.com

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/tahaluindo/WAZone-Server.svg?style=for-the-badge
[contributors-url]: https://github.com/tahaluindo/WAZone-Server/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/tahaluindo/WAZone-Server.svg?style=for-the-badge
[forks-url]: https://github.com/tahaluindo/WAZone-Server/network/members
[stars-shield]: https://img.shields.io/github/stars/tahaluindo/WAZone-Server.svg?style=for-the-badge
[stars-url]: https://github.com/tahaluindo/WAZone-Server/stargazers
[issues-shield]: https://img.shields.io/github/issues/tahaluindo/WAZone-Server.svg?style=for-the-badge
[issues-url]: https://github.com/tahaluindo/WAZone-Server/issues
[license-shield]: https://img.shields.io/github/license/tahaluindo/WAZone-Server.svg?style=for-the-badge
[license-url]: https://github.com/tahaluindo/WAZone-Server/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[express.js]: https://img.shields.io/badge/Express-35495E?style=for-the-badge&logo=express&logoColor=4FC08D
[express-url]: https://express.org/
[typeorm.js]: https://img.shields.io/badge/Type_ORM-35495E?style=for-the-badge&logo=typeorm&logoColor=4FC08D
[typeorm-url]: https://typeorm.io/
[baileys.js]: https://img.shields.io/badge/Baileys-35495E?style=for-the-badge&logo=baileys&logoColor=4FC08D
[baileys-url]: https://github.com/adiwajshing/Baileys
[node.js]: https://img.shields.io/badge/Node-35495E?style=for-the-badge&logo=nodedotjs&logoColor=4FC08D
[node-url]: https://nodejs.org/
[vue.js]: https://img.shields.io/badge/Vue_3-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[vue-url]: https://vuejs.org/
[vite.js]: https://img.shields.io/badge/Vite-35495E?style=for-the-badge&logo=vite&logoColor=4FC08D
[vite-url]: https://vite.org/
[prisma.js]: https://img.shields.io/badge/Prisma-35495E?style=for-the-badge&logo=prisma&logoColor=4FC08D
[prisma-url]: https://prisma.io/
[typescript.js]: https://img.shields.io/badge/Typescript-35495E?style=for-the-badge&logo=typescript&logoColor=4FC08D
[typescript-url]: https://typescript.org/
