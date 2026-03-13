# Dependencies:

Hello everybody !

to start making files and debugging and running the frontend you guys need to install node js, which can be found here:

https://nodejs.org/en/download

then we will need to create a personal ven folder within the server directory, with nodejs installed.

The virtual directory created within the flaskSever should be utilised within the terminal, on Windows once in the 
flaskDirectory do:

 `.\venv\Scripts\activate`
 , on mac you activate the virtual env by typing: 
 `source venv/bin/activate`


To run it, guys, make sure you have installed the requirements via:
`pip install -r requirements.txt`

# Running the actual project:


then to run the backend go to the "Doctor-patient-app" directory and run: 
`python -m flaskServer.run`;

for the front end run npm start, once the nodeJS framework is instantiated as a enviornmental variable.



# React Tutorial 

My personal advice: jump in and start googling things.  If you want to make a `text` element, a `div`, a `button`, just search something like `React create div or React button example`

The real utility of React, though, comes from `hooks`. This is where you should focus most of your attention.

## Key Hooks

### `useState`

This lets you create a `persistent variable that can change based on user actions`.

Think:
- Button clicks  
- Form inputs  
- Toggling UI elements on/off  

Basically, if something in the UI needs to change dynamically, `useState` is usually involved.

### `useEffect`

This hook lets React `automatically run logic when something changes`.

For example:
- Fetching or updating information  
- Rendering extra information without reloading the page  
- Checking values when something updates  

So if `useState` is about `holding data`, `useEffect` is usually about reacting to changes in that data.

## Official Documentation

If you want the official documentation:

https://react.dev/reference/react/hooks

## CSS Organisation

We’ll also keep styling a bit cleaner by using `separate CSS files`.  
This keeps everything more organised and is generally considered a `more professional approach` compared to stuffing styles everywhere.

## Tailwind

Since `Tailwind` gives a lot of styling utilities out of the box, we’ll be using that as well.


in the requirements file you will see the command to run it

