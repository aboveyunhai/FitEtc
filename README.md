# FitEtc

A standalone React Native Pedometer App based on Google Android API, currently support Android platform only.

run `npm install https://github.com/aboveyunhai/FitEtc.git`, <br>
then execute `react-native run android`

**require your own api key to enable google-fit api to work**

Helpful link: https://github.com/StasDoskalenko/react-native-google-fit/blob/master/docs/INSTALLATION.md

### Disclaimer

If you happened to find this because of the `react-native-google-fit`, 
<br/>maybe this file (https://github.com/aboveyunhai/FitEtc/blob/f38ce6cfe518a7d32117c7aed2dcbff6e5b5af81/src/redux/actions/ActionCreator.tsx#L20) is the only useful place you want to take at look.
<br/>Other than that, while the app is still functionaily OK (at least I'm still using it by my own, and enough for dev testing), the entire codebase is a mess and requires a `full rewrite`, you will see tons of `Typescript/React abuses`. But I found many of two-years-old codes are `stupid, entertaining but creative`, so I just left what it is now until I want to rewrite it someday.

### Motivation:
There are already tons of well-built fitness apps around, but I'm the particular oddity who has no interest in those fitness communities, notifications, etc. <br>
Those also created many unnecessary bundles and huge battery comsumption<br>
So I just want to create a **pure** pedometer app for myself and my family. Silently run in the background with minimal battery usage.<br>

Do some **NON-SENSE** react-native UI/UX experiments for data presentation, battery consumption check and possible RN optimization

<div>
<img src="https://github.com/aboveyunhai/FitEtc/blob/master/readMe/Screenshot_3_Pedoer.gif" height="600" />
<img src="https://github.com/aboveyunhai/FitEtc/blob/master/readMe/Screenshot_2_Pedoer.gif" height="600" />
<div>

#
I currently use it to debug and help improve https://github.com/StasDoskalenko/react-native-google-fit. The core functionality of this app.

### Todos:

* Possibly fully expand the app to for all fitness data,
* Code structure optimization

#

All credit to [@aboveyunhai](https://github.com/aboveyunhai).

If you found anything interesting and want to take part of it for personal or commercial usage, just let me know.
