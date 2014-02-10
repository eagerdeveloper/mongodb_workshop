//import (to be run in mongo shell) mongoimport -d tennis -c ParksNYC --type json --drop < ParksNYC.json
//Mongo 
//show dbs
//use tennis
//show collections


//first command    
db.ParksNYC.insert(
{
    Prop_ID : "Q900",
    Name : "Ridge Park",
    Location : "1843 Norman St.",
    EstablishedOn: "1/1/1970"
})
// as in sql if you run this command twice it will create 2 documents with same details 
// read specific dacument
db.ParksNYC.find(
{Name : "Ridge Park"
})

// read all documents
db.ParksNYC.find()
// read first document 
db.ParksNYC.findOne()
// find specific document
// find specific fields in all documents
db.ParksNYC.find({ },{  Name: 1 })
db.ParksNYC.find({ },{ _id: 0, Name: 1 })
//Find documents meeting specific conditions 
db.ParksNYC.find(
   { Courts: { $gt: 5, $lte: 8} }
)
   
// regular expression
db.ParksNYC.find({ Name: /^F/ })

   
// update (insert) field conditional on other field criteria
db.ParksNYC.update({Prop_ID : /^X/ }, {$set: { "Boro":"Bronx"}},{ multi: true })
db.ParksNYC.findOne({Prop_ID : /^X/ })
// update conditional on field criteria $push
db.ParksNYC.update(
                    { Name : "Van Cortlandt Park"},
                    { $push: { Tennis_Type: "Clay" } }
                  )
                    
db.courts_b2.find({"Prop_ID" : "B129" })
  db.ParksNYC.update(
                    { Prop_ID: "B129" },
                    { $push: { Tennis_Type: "Grass" } })
                    
db.ParksNYC.find()
db.ParksNYC.find({"Name" : "Van Cortlandt Park" })                    
                    
db.ParksNYC.find({Tennis_Type: "Clay"}) 
db.ParksNYC.find({Tennis_Type: "Grass"}) 
// update
db.ParksNYC.update(
    { },
    { $set: {VisitDate: "1/1/2014" } },
    { multi: true }
)
db.ParksNYC.findOne()
    
// delete field
db.ParksNYC.update(
    { },
    { $unset: {VisitDate: "" } },
    { multi: true }
) 
   
//delete document
db.ParksNYC.remove(
{ Name:"Ridge Park"
})
// to check if doc has been removed
db.ParksNYC.find({ Name:"Ridge Park"})

// aggregation framework
// sort
db.ParksNYC.aggregate(
    { $sort : { Courts : -1, Accessible: 1 } }
)
 
// limit
db.ParksNYC.aggregate(
    { $limit : 5 }
) 
 
//skip   
    
db.ParksNYC.aggregate(
    { $skip : 70 }
)
// $group by
db.ParksNYC.aggregate(
    { $group : {
        _id : "$Accessible",
        Parks_Number : { $sum : 1 },
        Courts_Number : { $sum : "$Courts" }
    }}
)
db.ParksNYC.aggregate([ { 
    $group: { 
        _id: "$Accessible", 
        total: { 
            $sum: "$Courts" 
        } 
    } 
} ] )
//sum
db.ParksNYC.aggregate([ { 
    $group: { 
        _id: null, 
        total: { 
            $sum: "$Courts" 
        } 
    } 
} ] )
    

// unwind single document
  db.ParksNYC.find({ Name: "Mill Pond Park"}) 
  db.ParksNYC.aggregate ([
   {
      "$match":
      {
         "Name": "Mill Pond Park"
      }
   },
   {
      "$unwind": "$Tennis_Type"
   }
])
// unwind entire Tennis_Type for collection and group by park
db.ParksNYC.aggregate ([
   
   {
      "$unwind":"$Tennis_Type"
   },
   {
      "$group":
      {
         "_id":
         {
            "Name" : "$Name" 
         },
         "Surface_Type_Count":
         {
            "$sum": 1
         }
      }
   }
])
  
//unwind on tennis_type, group by parks and sort by Surface_Type_Count
db.ParksNYC.aggregate ([
   {
      "$unwind":"$Tennis_Type"
   },
   {
      "$group":
      {
         "_id":
         {
            "Name" : "$Name" 
         },
         "Surface_Type_Count":
         {
            "$sum": 1
         }
      }
   },
{
      "$sort":
      {
         "Surface_Type_Count":-1,
         "Name":1
      }
   }
])     
//$unwind on tennis_type, $group by parks , $limit to only top 6 parks, save results in new 'summary' collection  
db.ParksNYC.aggregate ([
   
   {
      "$unwind":"$Tennis_Type"
   },
   {
      "$group":
      {
         "_id":
         {
            "Name" : "$Name" 
         },
         "Surface_Type_Count":
         {
            "$sum": 1
         }
      }
   },
{
      "$sort":
      {
         "Surface_Type_Count":-1,
         "Name":1
      }
   }, 
   {
      "$limit":6,
   },
     { $out : "summary" }
])
//check
     db.summary.find()
//exportsummary to csv file
//mongoexport -d tennis -c summary --out summary.csv