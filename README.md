# Better Bathroom Bureau

[Better Bathroom Bureau](betterbathroombureau.org) is an website dedicated to helping residents and visitors of Seattle access bathroom facilities around the city.

Our web app catalogues bathrooms that users of the site submit, along with user reviews and ratings for each facility.

## About

BBB started as a Tumblr blog of bathroom reviews, written by Mason shortly after moving to Seattle in 2015. 

In 2022, Mason and [Alex Naughton](https://lexdotcom.com) worked together during their time in a Flatiron School software development bootcamp to develop an alpha version of a BBB website, with a few main pages of the current website and simple features. 

Starting in the summer of 2023, Mason began to expand on the previous work from bootcamp and build a performant, user-friendly, fast web application, with help from Alex, Evan House, and Matt Phan.

## Technologies used:

This repo contains a React-Vite web application, which connects to an external Supabase Postgres database & API.

-----

The React-Vite front end uses the following technologies:

React-Query - for simplified data fetching, caching, and mutation

Zustand - small, fast state management

React Router 6 - for client-side routing with BrowserRouter

Supabase JS - to communicate with the Supabase Postgres database 

Framer Motion

React DatePicker

Google Maps React map components

-----

This website is deployed with Vercel.

## Setup

After cloning this app, you should be able to run 

`
npm install ->
npm run dev
`

to launch the app on your local device.

There are environment variables used to connect to the database, as well as Supabase login credentials to access the database from Supabase. Ask Mason or Alex for these.
