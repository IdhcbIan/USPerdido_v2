

# Importing Modules!!

import json

# Creating the classes!!

class Com():
    def __init__(self, Posts=[]):
        self.Posts = Posts

class Post():
    def __init__(self, ID, Type, Caption, Username,  Description, Ptype, Comments=[], Clicks=[], Likes=[]):
        self.ID = ID
        self.Type = Type
        self.Caption = Caption
        self.Username = Username
        self.Description = Description
        self.Ptype = Ptype
        self.Comments = Comments
        self.Clicks = Clicks
        self.Likes = Likes
        

# Importing the File!!

with open("../db/Posts/posts.json", "r") as UserData:
    data = json.load(UserData)

    ComNames = []
    for Community in data:
        ComNames.append(Community)
     
    PostsLib = [] 
    for Community in data.values():
        PostsT = []
        for P in Community:
            try:
                Temp =  Post(P["id"], P["type"], P["caption"], P["Username"],  P["description"], P["Ptype"], P["comments"], P["clicks"], P["likes"])
            except:
                Temp =  Post(P["id"], P["type"], P["caption"], P["Username"],  P["description"], P["Ptype"], P["comments"])
            
            
            PostsT.append(Temp)
   


        PostsLib.append(PostsT)
    
    D = {name: coms for name, coms in zip(ComNames, PostsLib)}
    print(D)







