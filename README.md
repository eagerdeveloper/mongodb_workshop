## Welcome to MongoDB workshop

###  ParksNYC.json is located in parksnyc-tennis folder

Use mongoimport to import the dataset

mongoimport -d tennis -c ParksNYC --type=json --drop < ParksNYC.json
