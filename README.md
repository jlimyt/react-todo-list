<a name="readme-top"></a>




<!-- PROJECT INFO -->
<br />
<div align="center">

<h3 align="center">Simple Todo List Application</h3>

  <p align="center">
    A Simple Todo application based on Spring boot, PostgreSQL and React Typescript
  </p>
</div>


<!-- PROJECT PREVIEW -->
## Project Preview

![Application Screen Shot][application-screenshot]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![React][React.js]][React-url]
* [![PostgreSQL Database][PostgreSQL]][PostgreSQL-url]
* [![Spring boot][Spring-boot]][Spring-boot-url]


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Setup locally

This project can be opened using docker-compose up under docker folder.

### Prerequisites

* Docker

The following ports will be used:

* database: 5432
* backend: 8080
* frontend: 5173

### Installation

1. Install Docker/Docker Desktop (https://docs.docker.com/engine/install/)
  
2. Clone the repo
   ```sh
   git clone https://github.com/jlimyt/react-todo-list.git
   ```

3. Navigate to the docker folder (/docker),
   ![Docker File Directory][docker-screenshot]

In command prompt, execute the following command:

   ```sh
   docker-compose up
   ```
4. It takes some time to initialize the database, on success it should shows the following in command prompt:

  ![Start Docker Success][success-screenshot]

5. Navigate to localhost:5173/home, on success it should shows:

  ![Landing Page][home-screenshot]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

There is an admin account by default in the database and able to login:
<details>
  <summary>Account</summary>
  
* Username: admin

* Password: P@ssw0rd01
  
</details>


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Jack Lim - ytljack0261@gmail.com

[![Linked-in][linkedin-shield]][linkedin-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/jack-lim-7a60a620b/
[application-screenshot]: screenshot%20preview/todo_table.jpg
[docker-screenshot]: screenshot%20preview/docker_dir.jpg
[success-screenshot]: screenshot%20preview/success.jpg
[home-screenshot]: screenshot%20preview/home.jpg
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[PostgreSQL]: https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/
[Spring-boot]: https://img.shields.io/badge/SpringBoot-6DB33F?style=flat-square&logo=Spring&logoColor=white
[Spring-boot-url]: https://spring.io/
