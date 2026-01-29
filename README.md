# Full Stack Open: Exercises for Part-7

## Introduction:

FullStackOpen-Part-7 contains my submission of the exercises required for Modul 7. Specifically, exercises 7.1 to 7.21 (inc.). These exercises cover multiple disciplines and projects.

---

## The Projects:

The repository (FullStackOpen-Part-7) consists of four distinct project files. One of the projects (bloglist-app) has two alternate solution (a Redux solution and a Context alternative). Development snapshots, in the form of milestone tags, have been taken at key points in the development these solutions. Here is the list of exercises, their respective solution projects, and any associated milestone tags:

| Exercise         | Solution Project                             | Tag                                        |
| :--------------- | :------------------------------------------- | :----------------------------------------- |
| 7.1-7.6          | routed-anecdotes                             | milestone/part7-exercises-7.1-7.3          |
| 7.7              | country-hook                                 | milestone/part7-exercises-7.4-7.8          |
| 7.8              | ultimate-hooks                               | milestone/part7-exercises-7.4-7.8          |
| 7.9-7.13 Redux   | bloglist-app/bloglist-frontend-part7-redux   | milestone/part7-exercises-7.9-7.13-Redux   |
| 7.9-7.13 Context | bloglist-app/bloglist-frontend-part7-context | milestone/part7-exercises-7.9-7.13-Context |
| 7.14-7.21        | bloglist-app/bloglist-frontend-part7-context | N/A - final submission                     |

In all projects, the scripts have been judiciously commented with inline documentation. So, we will not indulge in further explanation.

---

## bloglist-app

The bloglist-app contains four project files:

- bloglist-backend-part7
- bloglist-e2e-tests-part7
- bloglist-frontend-part7-redux
- bloglist-frontend-part7-context

### To Milestone 7.13

The backend (bloglist-backend-part7), is used for both frontends (bloglist-frontend-part7-redux and bloglist-frontend-part7-context). To start the backend, simply run 'npm run dev' from the backends root directory. Then run the same command from the desired frontend's root directory. The backend can only service one frontend at a time. Terminate both front and backend service, before restarting the backend and start the alternative frontend service.

bloglist-frontend-part7-redux will only work correctly with bloglist-backend-part7 upto milestone 7.13. In developing bloglist-frontend-part7-context beyond exercise 7.13, minor changes were made to the backend models.

The test suite (bloglist-e2e-tests-part7), can be used in end-to-end testing of both Redux and Contex solutions.

### End-to-End Testing

My starting baseline for bloglist-app included automated end-to-end testing. So, test conformity was maintained through the development of bloglist-frontend-part7-redux and -context. The automated test suite can still be applied, up to their 7.13 milestones. Testing can still be applied to the final submission for bloglist-frontend-part7-redux, as development ceased at milestone 7.

At the point of creating milestone 7.13 (Redux and Context), test-8 (When logged in › blogs are ordered by likes, descending), fails. I believe that the new allocation of state is causing the problem, due to execution latency. The only way I can find to PASS test-8, is to modify the test.

To run the automated end to end testing:

- Start the backend service (npm run start:test).
- Start the frontend (npm run dev).
- Start the end-to-end tests (npm test).
- Note: Commands are run from within the respective project’s root directory.

### Beyond Milestone 7.13

The final submission of bloglist-backend-part7 and bloglist-frontend-part7-context address exercises 7.14 to 7.21. No automated testing has been applied to this stage of development. Start both backend and frontend, from within their root directories, with: npm run dev'.

---

## Version Control

All four project files have been pushed to my GitHub repository at https://github.com/paulmayer-fullstacker/FullStackOpen-Part-7.
Tags have been used to identify key points in development (see preceeding table for details).

---

<br/>

<hr style="height: 5px; background-color: black; border: none;">
