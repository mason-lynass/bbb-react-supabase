# Better Bathroom Bureau - React

This repo is for the web version of Better Bathroom Bureau.

## Setup

After cloning this app, you should be able to run 

`
npm install ->
npm run dev
`

to launch the app on your local device.

There are environment variables used to connect to the database. Ask Mason, Alex, or Evan for these.

## To Do:

- learn about ReactRouter loaders, use loaders to request data from Supabase and use that data in components, instead of doing all of that inside the components (reduce component re-renders)
- Add a check in Submit.jsx to see if there's a logged in user - if there's no logged in user / session, they shouldn't see the BathroomForm component because they shouldn't be able to load the page
- Google Maps things (we're waiting to configure a Google Dev Console account to get API Keys)
- Build out the homepage
- CSS, in general