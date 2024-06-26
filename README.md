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

4. In command prompt, execute the following command:

   ```sh
   docker-compose up
   ```
5. It takes some time to initialize the database, on success it should shows the following in command prompt:

  ![Start Docker Success][success-screenshot]

6. Navigate to localhost:5173/home, on success it should shows:

  ![Landing Page][home-screenshot]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

There is an admin account by default in the database and can be used for login:
<details>
  <summary>Account</summary>
  
* Username: admin

* Password: P@ssw0rd01
  
</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## System functionality

<details>
  <summary>User Authentication & Registration</summary>
  
* Registration

![Registration][registration-screenshot]

* Login

![Login][home-screenshot]
  
</details>

<details>
  <summary>CRUD</summary>
  
* User Role

![User Role][role-screenshot]

* User

![User][user-screenshot]

* Todo

![Todo][application-screenshot]
  
</details>

<details>
  <summary>Todo</summary>
  
* Popover - unread, complete

The bell icon (Alert) can be clicked and open popover for quick viewing todo.

Red dot represents the present of unread todo item.

The icon next to it stands for unread and incompleted todo count, respectively.

![Todo Popover][todo_popover-screenshot]

On entering edit page of the unread todo, it will be marked as read.

![Todo Popover Read][todo_popover_read-screenshot]

User can navigate to specif todo edit page for viewing details; and
click 'Read More' to navigate to search table page.

![Todo notified][todo_notified-screenshot]

* Add Comment

![Add comment][todo_add_comment-screenshot]

On edit page, a comment table will be displayed

![Show comment][todo_comment_table-screenshot]

* Mark as Completed

![Confirm complete][todo_confirm_complete-screenshot]

![Display completed][todo_mark_as_completed-screenshot]
  
</details>

<details>
  <summary>General Function</summary>
  
* Table Filtering

![Filter][filter-screenshot]

* Table Sorting

![Sort][sort-screenshot]

* Create record

![Create Role][create_role-screenshot]

* Edit record

![Edit Role][edit_role-screenshot]

* Localization (English & Traditional Chinese)
  
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
[registration-screenshot]: screenshot%20preview/registration.jpg

[role-screenshot]: screenshot%20preview/role.jpg
[user-screenshot]: screenshot%20preview/user.jpg

[todo_add_comment-screenshot]: screenshot%20preview/todo_add_comment.jpg
[todo_comment_table-screenshot]: screenshot%20preview/todo_comment_table.jpg
[todo_confirm_complete-screenshot]: screenshot%20preview/todo_confirm_complete.jpg
[todo_mark_as_completed-screenshot]: screenshot%20preview/todo_mark_as_completed.jpg
[todo_popover_read-screenshot]: screenshot%20preview/todo_popover_read.jpg
[todo_notified-screenshot]: screenshot%20preview/todo_notified.jpg
[todo_popover-screenshot]: screenshot%20preview/todo_popover.jpg

[filter-screenshot]: screenshot%20preview/user_filter.jpg
[sort-screenshot]: screenshot%20preview/user_sort.jpg
[create_role-screenshot]: screenshot%20preview/role_create.jpg
[edit_role-screenshot]: screenshot%20preview/role_edit.jpg

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[PostgreSQL]: https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/
[Spring-boot]: https://img.shields.io/badge/SpringBoot-6DB33F?style=flat-square&logo=Spring&logoColor=white
[Spring-boot-url]: https://spring.io/
