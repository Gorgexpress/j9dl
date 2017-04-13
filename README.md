# j9dl

Web app that aims to provide a way to create balanced teams for private matches in team-based games such as Dota 2. Uses [TrueSkill](http://trueskill.org/) to assign numerical ratings to players. No longer being worked on (Since everyone I know quit playing Dota.) Base functioniality is there but there's stil tons of room for improvement, especially in terms of styling(css) and administrative features. 

Has some python dependencies, which can be installed with pip using pip install -r requirements.txt.
Start using gulp via the default gulp task ("gulp" in command line).

While it's still very limited in what you can do without other real users, there is a demo with a small amount of fake users already logged in, and no need to login. It's far behind the master branch. https://infinite-mesa-54622.herokuapp.com

The main project requires a Steam account for authorization. 

Express is used as a framework for the back-end. Angular is used for the front-end. Mongo+Mongoose for persistant data, and passport for OpenID authentification using Steam.
