## Welcome to MongoDB workshop

###  ParksNYC.json is located in parksnyc-tennis folder


mongoimport to import the dataset

At the terminal, use:
mongoimport -d tennis -c ParksNYC --type json --drop < ParksNYC.json
